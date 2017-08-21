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
import Markdown from "react-markdown";
import createReactClass from "create-react-class";
import Highlighter from "./highlighter";

import Examples from "../examples/examples.js";
import Meta from "../examples/examples.json";

export default createReactClass({
    mixins: [Highlighter],
    getInitialState() {
        return {
            markdown: null
        };
    },
    componentWillReceiveProps() {
        window.scrollTo(0, 0);
        const exampleName = this.props.params.example;
        const markdownFile = Examples[`${exampleName}_docs`];
        fetch(markdownFile)
            .then(response => {
                return response.text();
            })
            .then(markdown => {
                this.setState({ markdown });
            });
    },
    renderMarkdown() {
        if (this.state.markdown) {
            return (
                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={this.state.markdown} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="col-md-12">
                        Loading...
                    </div>
                </div>
            );
        }
    },

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
        const sourceCode = `https://github.com/esnet/react-timeseries-charts/tree/master/src/website/packages/charts/examples/${exampleName}/Index.js`;

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-12">
                                <h3>{ExampleMetaData.title}</h3>
                                <p>
                                    <a
                                        style={{ fontSize: "small" }}
                                        href={sourceCode}
                                        target="_blank"
                                    >
                                        Source Code »
                                    </a>
                                </p>
                                <p>
                                    {ExampleMetaData.description}
                                </p>
                            </div>
                        </div>
                        <hr />
                        <Component />
                        <hr />
                        {this.renderMarkdown()}
                    </div>
                </div>
            </div>
        );
    }
});
