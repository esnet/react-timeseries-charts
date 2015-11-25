/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import Markdown from "react-markdown";
import Highlighter from "./highlighter";

import text from "raw!../../README.md";

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            markdown: text
        };
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h2>Introduction</h2>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={this.state.markdown}/>
                    </div>
                </div>
            </div>
        );
    }
});
