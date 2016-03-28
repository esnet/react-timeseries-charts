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
import d3 from "d3";
import Highlighter from "./highlighter";
import APIDocs from "./docs";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import LineChart from "../../src/linechart";
import Baseline from "../../src/baseline";
import Legend from "../../src/legend";
import Resizable from "../../src/resizable";

// Data
const aud = require("../data/usd_vs_aud.json");
const euro = require("../data/usd_vs_euro.json");

const audSeries = new TimeSeries({
    name: "AUD",
    columns: ["time", "value"],
    points: aud.widget[0].data.reverse()
});

const euroSeries = new TimeSeries({
    name: "EURO",
    columns: ["time", "value"],
    points: euro.widget[0].data.reverse()
});

const audStyle = {
    color: "#2ca02c"
};

const euroStyle = {
    color: "#a02c2c"
};

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            tracker: null,
            timerange: audSeries.range()
        };
    },

    handleTrackerChanged(tracker) {
        this.setState({tracker});
    },

    handleTimeRangeChange(timerange) {
        this.setState({timerange});
    },

    render() {

        const f = d3.format("$,.2f");
        const df = d3.time.format("%b %d %Y %X");

        const timeStyle = {
            fontSize: "1.2rem",
            color: "#999"
        };

        let euroValue, audValue;
        if (this.state.tracker) {
            const audIndex = audSeries.bisect(this.state.tracker);
            audValue = `${f(audSeries.at(audIndex).get())}`;
            const euroIndex = euroSeries.bisect(this.state.tracker);
            euroValue = `${f(euroSeries.at(euroIndex).get())}`;
        }

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>LineChart</h3>
                    </div>
                </div>
                <hr />
                <div className="row" style={{height: 28}}>
                    <div className="col-md-6" style={timeStyle}>
                        {this.state.tracker ? `${df(this.state.tracker)}` : ``}
                    </div>
                    <div className="col-md-6">
                        <Legend type="line" align="right" categories={[
                            {key: "aust", label: "AUD", value: audValue, style: {backgroundColor: "#2ca02c"}},
                            {key: "euro", label: "Euro", value: euroValue, style: {backgroundColor: "#a02c2c"}}
                        ]} />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={this.state.timerange}
                                trackerPosition={this.state.tracker}
                                onTrackerChanged={this.handleTrackerChanged}
                                enablePanZoom={true}
                                onTimeRangeChanged={this.handleTimeRangeChange}
                                minDuration={1000 * 60 * 60 * 24 * 30} >
                                <ChartRow height="200" debug={false}>
                                    <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f" />
                                    <Charts>
                                        <LineChart axis="axis1" series={audSeries} style={audStyle} interpolation="curveBasis" />
                                        <LineChart axis="axis2" series={euroSeries} style={euroStyle} interpolation="curveBasis" />
                                        <Baseline axis="axis1" value={1.0} label="USD Baseline" position="right" />
                                    </Charts>
                                    <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f" />
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <APIDocs file="src/linechart.jsx"/>
                    </div>
                </div>
            </div>
        );
    }
});
