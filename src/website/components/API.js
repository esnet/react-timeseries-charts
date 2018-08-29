/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import createReactClass from "create-react-class";
import { Link } from "react-router";
import _ from "underscore";

import Highlighter from "./highlighter";
import APIDoc from "./APIDoc";

import Meta from "../packages/charts/examples/examples.json";
import Examples from "../packages/charts/examples/examples.js";
import docsFile from "../packages/charts/api/docs.json";

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
        const link = <Link to={`example/${name}`}>{example.value.title}</Link>;
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "220px"
                }}
            >
                <div style={style}>
                    <img src={img} alt={`${name}`} />
                </div>
                <div style={{ paddingLeft: 5, fontSize: "smaller" }}>{link}</div>
            </div>
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
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}
                    >
                        {examples}
                    </div>
                </div>
            );
        } else {
            return <div />;
        }
    }
}

export default createReactClass({
    displayName: "API",
    mixins: [Highlighter],

    render() {
        const component = this.props.params.component;
        const path = `src/components/${component}.js`;

        if (!_.has(docsFile, path)) {
            return <div>API could not be found</div>;
        }
        const title = component;
        return (
            <div>
                <h2>{title}</h2>
                <div className="row">
                    <div className="col-md-12">
                        <TaggedExamples tag={component} />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <APIDoc file={path} />
                    </div>
                </div>
            </div>
        );
    }
});
