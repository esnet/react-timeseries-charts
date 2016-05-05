/**
 *  Copyright (c) 2015-2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import Highlighter from "./highlighter";
import APIDocs from "./docs";

// Imports from the charts library
import Legend from "../../src/legend";

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
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
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Legend Examples</h3>
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
                            {key: "aust", label: "AUD", disabled: this.state.disabled["aust"], style: {stroke: "#1f77b4"}},
                            {key: "usa", label: "USD", disabled: this.state.disabled["usa"], style: {stroke: "#aec7e8"}}]}
                            onChange={this.handleLegendChange} />
                    </div>
                    <div className="col-md-3">
                        <Legend type="swatch" categories={[
                            {key: "oscars", label: "Oscars", disabled: this.state.disabled["oscars"], style: {fill: "#ff7f0e"}},
                            {key: "total", label: "Total", disabled: this.state.disabled["total"], style: {fill: "#ffbb78"}}]}
                            onChange={this.handleLegendChange} />
                    </div>
                    <div className="col-md-3">
                        <Legend type="dot" categories={[
                            {key: "site", label: "Site", disabled: this.state.disabled["site"], style: {fill: "#98df8a"}},
                            {key: "router", label: "Router", disabled: this.state.disabled["router"], style: {fill: "#d62728"}}]}
                            onChange={this.handleLegendChange} />
                    </div>
                </div>

                <hr />

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
                            {key: "aust", label: "AUD", value: "$1.52", disabled: this.state.disabled["aust"], style: {stroke: "#1f77b4"}},
                            {key: "usa", label: "USD", value: "$1.43", disabled: this.state.disabled["usa"], style: {stroke: "#aec7e8"}}]}
                            onChange={this.handleLegendChange} />
                    </div>
                    <div className="col-md-3">
                        <Legend type="swatch" categories={[
                            {key: "oscars", value: "22 Gbps", label: "Oscars", disabled: this.state.disabled["oscars"], style: {fill: "#ff7f0e"}},
                            {key: "total", value: "91 Gbps", label: "Total", disabled: this.state.disabled["total"], style: {fill: "#ffbb78"}}]}
                            onChange={this.handleLegendChange} />
                    </div>
                    <div className="col-md-3">
                        <Legend type="dot" categories={[
                            {key: "site", value: "Active", label: "Site", disabled: this.state.disabled["site"], style: {fill: "#98df8a"}},
                            {key: "router", value: "Disabled", label: "Router", disabled: this.state.disabled["router"], style: {fill: "#d62728"}}]}
                            onChange={this.handleLegendChange} />
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <APIDocs file="src/legend.jsx"/>
                    </div>
                </div>
            </div>
        );
    }
});
