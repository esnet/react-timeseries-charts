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
import createReactClass from "create-react-class";
import Markdown from "react-markdown";
import Highlighter from "./highlighter";
import Examples from "../packages/charts/examples/examples.js";
import Meta from "../packages/charts/examples/examples.json";

export default createReactClass({
    displayName: "Example",
    mixins: [Highlighter],

    getInitialState() {
        return {
            markdown: null
        };
    },

    fetchMarkdownForProps(props) {
        window.scrollTo(0, 0);
        const exampleName = props.params.example;
        const markdownFile = Examples[`${exampleName}_docs`];
        fetch(markdownFile)
            .then(response => {
                return response.text();
            })
            .then(markdown => {
                this.setState({ markdown });
            });
    },

    componentDidMount() {
        this.fetchMarkdownForProps(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this.fetchMarkdownForProps(nextProps);
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
                    <div className="col-md-12">Loading...</div>
                </div>
            );
        }
    },

    render() {
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
                                        rel="noopener noreferrer"
                                    >
                                        Source Code »
                                    </a>
                                </p>
                                <p>{ExampleMetaData.description}</p>
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
