/**
 *  Copyright (c) 2016-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, {Component} from "react";
import Markdown from "react-markdown";

import Guides from "../guides/guides";

import Prism from "prismjs";
import { codeRenderer, codeBlockRenderer } from "../api/renderers";

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markdown: null
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        Prism.highlightAll();
        const guideName = this.props.match.params.doc || "intro";
        const markdownFile = Guides[guideName];
        fetch(markdownFile)
            .then(response => {
                return response.text();
            })
            .then(markdown => {
                this.setState({ markdown });
            });
        this.setState({ markdown: null });
    }

    componentWillReceiveProps(nextProps) {
        window.scrollTo(0, 0);
        const guideName = nextProps.match.params.doc || "intro";
        const markdownFile = Guides[guideName];
        fetch(markdownFile)
            .then(response => {
                return response.text();
            })
            .then(markdown => {
                this.setState({ markdown });
            });
        this.setState({ markdown: null });
    }

    componentDidUpdate() {
        Prism.highlightAll();
    }

    render() {
        if (this.state.markdown !== null) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <Markdown 
                                source={this.state.markdown}
                                renderers={{ Code: codeRenderer, CodeBlock: codeBlockRenderer }} 
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="col-md-12" />
                </div>
            );
        }
    }
}
