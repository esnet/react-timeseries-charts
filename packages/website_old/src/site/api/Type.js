/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, { Component } from "react";
import Markdown from "react-markdown";

import { codeRenderer, codeBlockRenderer } from "./renderers";
import { headingStyle, textStyle, sigStyle } from "./styles";

export default class TsType extends Component {
    buildParamList(parameters) {
        return parameters ? 
            parameters.map((param, i) => {
                const paramType = param.type;
                const paramName = param.name;
                const paramTypeName = paramType.name || paramType.elementType.name;
                const isArray = paramType.isArray || paramType.type === "array";
                const isOptional = param.flags.isOptional;
                const typeArgs = this.buildTypeArguments(paramType.typeArguments);
                return (
                   `${paramName}${isOptional ? "?" : ""}: ${paramTypeName ? paramTypeName : ""}${typeArgs}${isArray ? "[]" : ""}`
                );
            }) : [];
    }

    buildReturnType(signature) {
        if (signature.type) {
            const typeName = this.buildType(signature.type);
            const isArray = signature.type.isArray;
            return `${typeName}${isArray ? "[]" : ""}`;
        } else {
            return "";
        }
    }

    buildType(type) {
        if (type) {
            const typeArgs = this.buildTypeArguments(type.typeArguments);
            return `${type.name}${typeArgs}`;
        }
    }

    buildTypeArguments(typeArguments) {
        if (typeArguments) {
            const typeArgs = typeArguments.map(t => {
                return this.buildType(t);
            });
            return `<${typeArgs.join(", ")}>`;
        }
        return "";
    }

    buildUnion(type) {
        const { types } = type;
        const values = types.map(type => {
            if (type.typeArguments) {
                const typeArgs = this.buildTypeArguments(type.typeArguments);
                return `${type.name}${typeArgs}`;
            } else if (type.declaration) {
                return this.buildDeclarations(type);
            } else if (type.name) {
                return `${type.name}`;
            } else {
                return `"${type.value}"`;
            }
        });
        return values.join(" | ");
    }

    buildDeclarations(type) {
        const { signatures, children } = type.declaration;
        if (signatures) {
            const methodSignatures = signatures.map(signature => {
                const parameters = signature.parameters;
                const paramList = this.buildParamList(parameters);
                const returnType = this.buildReturnType(signature);
                const output = `(${paramList.join(", ")}) => ${returnType}`;
                return output;
            });
            return methodSignatures;
        } else if (children) {
            const map = children.map(child => {
                const name = child.name;
                const isOptional = child.flags.isOptional ? child.flags.isOptional : false;
                const returnType = this.returnType(child.type);
 
                return `${name}${isOptional ? '?' : ''}: ${returnType};`;
            });
            return `{${map}}`
        } else {
            return;
        }
    }

    buildTuple(type) {
        const { elements } = type;
        const values = elements.map(type => {
            return type.name;
        });
        return `[${values.join(" , ")}]`;
    }

    buildReference(type) {
        if (type.typeArguments) {
            const { typeArguments, name } = type;
            const values = typeArguments.map(type => {
                if (type.typeArguments) {
                    const typeArgs = this.buildTypeArguments(type.typeArguments);
                    return `${type.name}${typeArgs}`;
                } else {
                    return type.name;
                }
            });
            return `${name}<${values.join(", ")}>`;
        } else {
            return `${type.name}`;
        }
    }

    buildProps(type) {
        const { types } = type;
        if (types) {
            const values = types.map((type,i) => {
                if (type.declaration) {
                    const { children } = type.declaration;
                    const props = children.map(child => {
                        const shortComment = child.comment ? child.comment.shortText : null;
                        const comment = child.comment ? child.comment.text : null;
                        const isOptional = child.flags.isOptional ? child.flags.isOptional : false;
                        const returnType = this.returnType(child.type);

                        return (
                            <div style={textStyle} key={child.name}>
                                <h3>{child.name}</h3>
                                {this.renderComment(shortComment)}
                                {this.renderComment(comment)}
                                <pre style={sigStyle}>
                                    <code className="language-typescript">{`${child.name}${isOptional ? '?' : ''}: ${returnType}`}</code>
                                </pre>
                            </div>
                        );
                    });
                    return (
                        <div key={i}>
                            {props}
                        </div>
                    );
                } else {
                    return <div key={i} />;
                }
            });
            return (
                <div>
                    {values}
                </div>
            )
        } else {
            if (type.declaration) {
                const { children } = type.declaration;
                const props = children.map(child => {
                    const shortComment = child.comment ? child.comment.shortText : null;
                    const comment = child.comment ? child.comment.text : null;
                    const isOptional = child.flags.isOptional ? child.flags.isOptional : false;
                    const returnType = this.returnType(child.type);
    
                    return (
                        <div style={textStyle} key={child.name}>
                            <h3>{child.name}</h3>
                            {this.renderComment(shortComment)}
                            {this.renderComment(comment)}
                            <pre style={sigStyle}>
                                <code className="language-typescript">{`${child.name}${isOptional ? '?' : ''}: ${returnType}`}</code>
                            </pre>
                        </div>
                    );
                });
                return (
                    <div key={children.name}>
                        {props}
                    </div>
                );
            } else {
                return <div />;
            }
        }
    }

    returnType(t) {
        const { type } = t;
        switch (type) {
            case "union":
                return this.buildUnion(t);
            case "reflection":
                return this.buildDeclarations(t);
            case "tuple":
                return this.buildTuple(t);
            case "reference":
                return this.buildReference(t);
            case "intersection":
                return this.buildProps(t);
            case "intrinsic":
                return t.name;
            case "array":
                if (t.elementType.declaration) {
                    return this.buildDeclarations(t.elementType);
                } else {
                    return `${t.elementType.name}[]`;
                }
            default:
                return <div />;
        }
    }

    renderComment(comment) {
        return comment ? (
            <div style={textStyle}>
                <Markdown 
                    source={comment} 
                    renderers={{ Code: codeRenderer, CodeBlock: codeBlockRenderer }} 
                />
            </div>
        ) : (
            <div style={textStyle} />
        );
    }

    render() {
        const { name, type } = this.props.type;
        return (
            <div style={{ marginBottom: 20 }}>
                <h2 style={headingStyle}>
                    {name}
                </h2>
                {this.buildProps(type)}
            </div>
        );
    }
}
