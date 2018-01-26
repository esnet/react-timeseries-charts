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
import Highlighter from "./highlighter";
import Markdown from "react-markdown";

import Guides from "../packages/charts/guides/guides";
import logo from "../packages/charts/logo.png";

export default createReactClass({
    displayName: "Guide",
    mixins: [Highlighter],

    getInitialState() {
        return {
            markdown: null
        };
    },

    componentDidMount() {
        window.scrollTo(0, 0);
        const guideName = this.props.params.doc || "intro";
        console.log(guideName);
        const markdownFile = Guides[guideName];
        fetch(markdownFile)
            .then(response => {
                return response.text();
            })
            .then(markdown => {
                this.setState({ markdown });
            });
        this.setState({ markdown: null });
    },

    componentWillReceiveProps(nextProps) {
        window.scrollTo(0, 0);
        const guideName = nextProps.params.doc || "intro";
        const markdownFile = Guides[guideName];
        fetch(markdownFile)
            .then(response => {
                return response.text();
            })
            .then(markdown => {
                this.setState({ markdown });
            });
        this.setState({ markdown: null });
    },

    render() {
        if (this.state.markdown !== null) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-2">
                            <img src={logo} alt="ESnet" width={120} height={120} />
                        </div>
                        <div className="col-md-9">
                            <Markdown source={this.state.markdown} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="col-md-2">
                        <img src={logo} alt="ESnet" width={120} height={120} />
                    </div>
                    <div className="col-md-9" />
                </div>
            );
        }
    }
});
