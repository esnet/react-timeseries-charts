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
import _ from "underscore";

import Highlighter from "./highlighter";
import APIDocs from "./docs";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import HorizontalBarChart from "../../src/horizontalbarchart";
import Resizable from "../../src/resizable";
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import AreaChart from "../../src/areachart";

// Process raw data into Pond TimeSeries objects
const data = require("../data/anl-interfaces.json");
let interfaces = _.map(data.objects, (iface) => {
    const interfacePoints = [];
    const {channels, ...meta} = iface;
    const numSamples = channels.in.samples.length;
    for (let i = 0; i < numSamples; i++) {
        const t = channels.in.samples[i][0];
        const inValue = channels.in.samples[i][1];
        const outValue = channels.out.samples[i][1];
        interfacePoints.push([t, inValue, outValue]);
    }
    let data = _.extend({
        name: `${iface.device} ${iface.interface}`,
        labels: ["Time", "In", "Out"],
        columns: ["time", "in", "out"],
        points: interfacePoints
    }, meta);
    return new TimeSeries(data);
});

// Total traffic
let points = [];
if (data.objects.length > 0) {
    const numSamples = data.objects[0].channels.in.samples.length;
    for (let i = 0; i < numSamples; i++) {
        _.each(data.objects, object => {
            const sampleIn = object.channels.in.samples[i];
            const sampleOut = object.channels.out.samples[i];
            if (!points[i]) {
                points[i] = [sampleIn[0], 0, 0];
            }
            points[i][1] += sampleOut[1];  //reverse
            points[i][2] += sampleIn[1];
        });
    }
}

const trafficSeries = new TimeSeries({
    name: "traffic",
    labels: ["Time", "From site", "To site"],
    columns: ["time", "in", "out"],
    points
});

const range = trafficSeries.range();
const max = _.max([
    trafficSeries.max("in"),
    trafficSeries.max("out")
]);

function formatter(value) {
    const prefix = d3.formatPrefix(value);
    return `${prefix.scale(value).toFixed()} ${prefix.symbol}bps`;
}

const style = {
    color: "#a02c2c"
};

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            tracker: null
        };
    },

    handleTrackerChanged(tracker) {
        this.setState({tracker});
    },

    handleTimeRangeChange(timerange) {
        this.setState({timerange});
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Horizontal Barchart</h3>

                        A horizontal barchart takes a list of TimeSeries objects and visualizes them.
                        You specify the columns you want to display and other visual properties such as
                        colors, and this component will build a bar chart showing max, avg and current
                        value.
                    </div>
                    <hr />
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={range}
                                trackerPosition={this.state.tracker}
                                onTrackerChanged={this.handleTrackerChanged}
                                enablePanZoom={true}
                                maxTime={range.end()}
                                minTime={range.begin()}
                                minDuration={1000 * 60 * 60}
                                onTimeRangeChanged={this.handleTimeRangeChange} >
                                <ChartRow height="150" debug={false}>
                                    <YAxis
                                        id="traffic"
                                        label="Traffic  (bps)"
                                        labelOffset={0}
                                        min={-max}
                                        max={max}
                                        absolute={true}
                                        width={220} />
                                    <Charts>
                                        <AreaChart
                                            axis="traffic"
                                            series={trafficSeries}
                                            columns={{up: ["in"], down: ["out"]}} />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <HorizontalBarChart
                            display="range"
                            seriesList={interfaces}
                            columns={["in", "out"]}
                            sortBy="max"
                            timestamp={this.state.tracker}
                            format={formatter}
                            style={[{fill: "#FF7F00"}, {fill: "#1F78B4"}]}/>
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <APIDocs file="src/horizontalbarchart.jsx"/>
                    </div>
                </div>
            </div>
        );
    }
});
