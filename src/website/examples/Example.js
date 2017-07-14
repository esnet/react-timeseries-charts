/**
 *  Copyright (c) 2016-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Highlighter from "../components/highlighter";
import Markdown from "react-markdown";
import Examples from "./index.js";
import Meta from "./examples.json";

export default React.createClass({
    mixins: [Highlighter],
    render() {
        const tagStyle = {
            background: "#EEE",
            padding: 5,
            borderRadius: 2,
            margin: 2,
            fontSize: "smaller"
        };

        const exampleName = this.props.params.example;
        const ExampleMetaData = Meta[exampleName];
        const Component = Examples[exampleName];
        const docs = Examples[`${exampleName}_docs`];
        const sourceCode = "https://github.com/esnet/react-timeseries-charts/tree/master/src/website/examples/" +
            exampleName;
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-12">
                                <h3>{ExampleMetaData.title}</h3>
                                <a href={sourceCode} target="_blank">Source Code</a>
                                <p>
                                    {ExampleMetaData.description}
                                </p>
                                <div>
                                    {ExampleMetaData.tags.map(tag => (
                                        <span style={tagStyle} key={tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <hr />
                        <Component />
                        <hr />
                        <div className="row">
                            <div className="col-md-12">
                                <Markdown source={docs} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
