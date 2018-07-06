/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import * as React from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";

import Flexbox from "flexbox-react";
import Prism from "prismjs";

import Examples from "../examples/examples.js";

import { codeRenderer, codeBlockRenderer } from "./renderers";
import { codeStyle, headingStyle, textStyle, sigStyle } from "./styles";

const Meta = require("../examples/examples.json");

class Example extends React.Component {
    render() {
        const style = {
            display: "inline-block",
            margin: 5,
            padding: 20,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#DDD",
            width: 160,
            height: 160
        };

        const { example } = this.props;
        const name = example.key;
        const imgName = `${name}_thumbnail`;
        const img = Examples[imgName];
        const link = <Link to={`/example/${name}`}>{example.value.title}</Link>;

        return (
            <Flexbox flexDirection="column" minWidth="220px">
                <div style={style}>
                    <img src={img} alt={`${name}`} />
                </div>
                <div style={{ paddingLeft: 5, fontSize: "smaller" }}>{link}</div>
            </Flexbox>
        );
    }
}

class TaggedExamples extends React.Component {
    render() {
        const exampleList = [];
        _.forEach(Meta, (value, key) => {
            const tags = value.tags;
            if (_.contains(tags, this.props.tag)) {
                exampleList.push({ key, value });
            }
        });
        const examples = exampleList.map((example, i) => {
            return <Example key={i} example={example} />;
        });

        if (examples.length > 0) {
            return (
                <div>
                    <h3>Examples</h3>
                    <Flexbox flexDirection="row" flexWrap="wrap">
                        {examples}
                    </Flexbox>
                </div>
            );
        } else {
            return <div />;
        }
    }
}

export default class TsClass extends React.Component {
    static defaultProps = {
        showExtends: false
    };

    componentDidMount() {
        Prism.highlightAll();
    }

    componentDidUpdate() {
        Prism.highlightAll();
    }

    renderClassSignature() {
        const { name, typeParameter, extendedTypes } = this.props.class;
        let extendedName;
        let typeArgument;
        if (typeParameter && typeParameter.length) {
            typeParameter.map(t => {
                if (t.type) {
                    const type = t.type.name;
                    return `${t.name} extends ${type}`;
                } else {
                    return `${t.name}`;
                }
            });

            if (extendedTypes) {
                const { typeArguments } = extendedTypes[0];
                extendedName = extendedTypes[0].name;
                if (typeArguments && typeArguments.length) {
                    typeArgument = typeArguments.map(t => {
                        return `${t.name}`;
                    });
                }
            }
            
            return typeArgument ? (
                <code style={codeStyle}>
                    {`class ${name} extends React.${extendedName}<${typeArgument.join(", ")}>`}
                </code>
            ) : (
                <code style={codeStyle}>{`class ${name}`}</code>
            );
        } else {
            return <code style={codeStyle}>{`class ${name}`}</code>;
        }
    }

    renderShortComment() {
        const { comment } = this.props.class;
        return comment ? (
            <div style={textStyle}>
                <Markdown
                    source={comment.shortText}
                    renderers={{ Code: codeRenderer, CodeBlock: codeBlockRenderer }}
                />
            </div>
        ) : (
            <div style={textStyle} />
        );
    }

    renderDiscussion() {
        const { comment } = this.props.class;
        if (comment && comment.text) {
            const { text } = comment;
            return (
                <div style={textStyle}>
                    <h4 style={textStyle}>DISCUSSION</h4>
                    <Markdown
                        source={text}
                        renderers={{ Code: codeRenderer, CodeBlock: codeBlockRenderer }}
                    />
                </div>
            );
        } else {
            return <div />;
        }
    }

    renderGroups() {
        const entityMap = {};
        if (this.props.class.children) {
            this.props.class.children.forEach(child => {
                entityMap[child.id] = child;
            });
            const groups = this.props.class.groups.map((group, i) => {
                const groupEntities = group.children.map((entity, j) => {
                    const ee = entityMap[entity];
                    if (!ee.flags.isPrivate) {
                        return <div key={j}>{this.renderEntity(entityMap[entity])}</div>;
                    } else {
                        return <div key={j} />;
                    }
                });
                if (group.title === "Object literals") {
                    return (
                        <div key={i}>
                            <hr />
                            <h2 style={headingStyle}>Default Props</h2>
                            <pre style={sigStyle}>
                                <code className="language-typescript">{groupEntities}</code>
                            </pre>
                        </div>
                    );
                } else {
                    return <div key={i} />;
                }
            });
            return <div style={textStyle}>{groups}<hr /></div>;
        } else {
            return <div />;
        }
    }

    renderEntity(entity) {
        if (entity.kindString === "Object literal") {
            const props = entity.children.map(prop => {
                if (prop.children) {
                    const obj = prop.children.map(child => {
                        return `${child.name}:${child.defaultValue} `;
                    });
                    return `${prop.name}: {${obj}}`;
                } else {
                    return `${prop.name} = ${prop.defaultValue}\n`;
                }
            });
            return (
                <div>
                    {props}
                </div>
            )
        }
    }

    render() {
        const { name } = this.props.class;
        return (
            <div style={{ marginBottom: 20 }}>
                <h2 style={headingStyle}>{name}</h2>
                <TaggedExamples tag={name} />
                <hr />
                <pre
                    style={{
                        marginTop: 15,
                        padding: 5,
                        borderColor: "#4ec1e0",
                        borderWidth: 3,
                        borderRadius: 0,
                        borderTopStyle: "none",
                        borderBottomStyle: "none",
                        borderRightStyle: "none",
                        background: "#fafafa"
                    }}
                >
                    {this.renderClassSignature()}
                </pre>
                {this.renderShortComment()}
                {this.renderDiscussion()}
                {this.renderGroups()}
            </div>
        );
    }
}
