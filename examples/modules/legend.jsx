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

// Imports from the charts library
import Legend from "../../src/legend";

const text = `

Legends are simple to define:

    const categories={[{key: "aust", label: "AUD", style: {backgroundColor: "#1f77b4"}},
                       {key: "usa", label: "USD", style: {backgroundColor: "#aec7e8"}}]}

    <Legend type="line" categories={categories} />

The 'type' maybe: line, switch or dot.

For each category to display you must provide a key and a label. You may also provide a style
which will be merged in with the base style for that type.

`;

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
                        <h3>Horizontal Legend</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3">
                        Legend with lines
                    </div>
                    <div className="col-md-3">
                        Legend with swatches
                    </div>
                    <div className="col-md-3">
                        Legend with dots
                    </div>
                 </div>

                <div className="row">
                    <div className="col-md-3">
                        <Legend type="line" categories={[
                            {key: "aust", label: "AUD", style: {backgroundColor: "#1f77b4"}},
                            {key: "usa", label: "USD", style: {backgroundColor: "#aec7e8"}}]} />
                    </div>
                    <div className="col-md-3">
                        <Legend type="swatch" categories={[
                            {key: "oscars", label: "Oscars", style: {backgroundColor: "#ff7f0e"}},
                            {key: "total", label: "Total", style: {backgroundColor: "#ffbb78"}}]} />
                    </div>
                    <div className="col-md-3">
                        <Legend type="dot" categories={[
                            {key: "site", label: "Site", style: {backgroundColor: "#98df8a"}},
                            {key: "router", label: "Router", style: {backgroundColor: "#d62728"}}]} />
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={this.state.markdown}/>
                    </div>
                </div>
            </div>
        );
    }
});
