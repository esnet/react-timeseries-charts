/**
 *  Copyright (c) 2016-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import Markdown from "react-markdown";

import Examples from "../examples/examples.js";

import Prism from "prismjs";
import { codeRenderer, codeBlockRenderer } from "../api/renderers";

const Meta = require("../examples/examples.json");

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markdown: null
        };
    }

    fetchMarkdownForProps(props) {
        window.scrollTo(0, 0);
        const exampleName = props.match.params.example;
        const markdownFile = Examples[`${exampleName}_docs`];
        fetch(markdownFile)
            .then(response => {
                return response.text();
            })
            .then(markdown => {
                this.setState({ markdown });
            });
    }

    componentDidMount() {
        Prism.highlightAll();
        this.fetchMarkdownForProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchMarkdownForProps(nextProps);
    }

    componentDidUpdate() {
        Prism.highlightAll();
    }

    renderMarkdown() {
        if (this.state.markdown) {
            return (
                <div className="row">
                    <div className="col-md-12">
                        <Markdown 
                            source={this.state.markdown}
                            renderers={{ Code: codeRenderer, CodeBlock: codeBlockRenderer }}
                        />
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
    }

    render() {
        const exampleName = this.props.match.params.example;
        const ExampleMetaData = Meta[exampleName];
        const Component = Examples[exampleName];
        const sourceCode = `https://github.com/esnet/react-timeseries-charts/tree/updates-typescript/packages/website_old/src/site/examples/${exampleName}/Index.js`;

        return (
            <div>
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
                        <hr />
                        <Component />
                        <hr />
                        {this.renderMarkdown()}
                    </div>
                </div>
            </div>
        );
    }
}
