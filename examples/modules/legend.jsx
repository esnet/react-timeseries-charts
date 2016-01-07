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

    const categories = [
        {key: "aust", label: "AUD", disabled={true} style: {backgroundColor: "#1f77b4"}},
        {key: "usa", label: "USD", disabled={false} style: {backgroundColor: "#aec7e8"}}
    ];

    <Legend type="line" categories={categories} onChange={this.handleLegendChange}/>

The 'type' maybe: line, switch or dot.

For each category to display you must provide a key, a label and if it should be displayed
disabled or not. You may also provide a style which will be merged in with the base style
for that type.

The legend can also be supplied with a callback function which will tell you if the user
has clicked on one of the legend items to enable/disable that item. The callback will be
called with the key and the new enabled/disabled state. You can use this to hide or show
the series on the chart, for example. Note that you'll want to pass the state back into
the legend as that category's disabled value.

`;

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            markdown: text,
            disabled: {
                aust: false,
                usa: false,
                oscars: false,
                total: false
            }
        };
    },

    handleLegendChange(key, v) {
        const disabled = this.state.disabled;
        disabled[key] = v;
        this.setState({disabled});
    },

    render() {
        console.log(this.state.disabled);
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
                            {key: "aust", label: "AUD", disabled: this.state.disabled["aust"], style: {backgroundColor: "#1f77b4"}},
                            {key: "usa", label: "USD", disabled: this.state.disabled["usa"], style: {backgroundColor: "#aec7e8"}}]}
                            onChange={this.handleLegendChange} />
                    </div>
                    <div className="col-md-3">
                        <Legend type="swatch" categories={[
                            {key: "oscars", label: "Oscars", disabled: this.state.disabled["oscars"], style: {backgroundColor: "#ff7f0e"}},
                            {key: "total", label: "Total", disabled: this.state.disabled["total"], style: {backgroundColor: "#ffbb78"}}]}
                            onChange={this.handleLegendChange} />
                    </div>
                    <div className="col-md-3">
                        <Legend type="dot" categories={[
                            {key: "site", label: "Site", disabled: this.state.disabled["site"], style: {backgroundColor: "#98df8a"}},
                            {key: "router", label: "Router", disabled: this.state.disabled["router"], style: {backgroundColor: "#d62728"}}]}
                            onChange={this.handleLegendChange} />
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
