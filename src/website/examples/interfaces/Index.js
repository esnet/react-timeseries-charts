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
import { format } from "d3-format";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../../components/ChartContainer";
import ChartRow from "../../../components/ChartRow";
import Charts from "../../../components/Charts";
import YAxis from "../../../components/YAxis";
import AreaChart from "../../../components/AreaChart";
import HorizontalBarChart from "../../../components/HorizontalBarChart";
import Resizable from "../../../components/Resizable";
import styler from "../../../js/styler";

// Process raw data into Pond TimeSeries objects
const data = require("./anl-interfaces.json");
let interfaceList = _.map(data.objects, (iface) => {
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
    const f = format(".2s");
    return `${f(value)}bps`;
}

const interfaces = React.createClass({

    getInitialState() {
        return {
            tracker: null,
            selected: null
        };
    },

    handleTrackerChanged(tracker) {
        this.setState({tracker});
    },

    handleTimeRangeChange(timerange) {
        this.setState({timerange});
    },

    handleSelectionChange(selected) {
        if (this.state.selected === selected) {
            this.setState({selected: null});
        } else {
            this.setState({selected});
        }
    },

    render() {
        let charts;

        const bgStyle = styler([
            {key: "in", color: "#AECFE4"},
            {key: "out", color: "#FFD0A3"}
        ]);

        const fgStyle = styler([
            {key: "in", color: "#448FDD"},
            {key: "out", color: "#FD8D0D"}
        ]);

        //
        // If something is selected, show a background and foreground chart
        // otherwise show just a single area chart
        //

        if (this.state.selected) {
            _.each(interfaceList, (interfaceSeries) => {
                if (interfaceSeries.name() === this.state.selected) {
                    charts = (
                        <Charts>
                            <AreaChart
                                key="bg"
                                axis="traffic"
                                series={trafficSeries}
                                columns={{up: ["in"], down: ["out"]}}
                                style={bgStyle} />
                            <AreaChart
                                key="fg"
                                axis="traffic"
                                series={interfaceSeries}
                                columns={{up: ["out"], down: ["in"]}}
                                style={fgStyle} />
                        </Charts>
                    );
                }
            });
        } else {
            charts = (
                <Charts>
                    <AreaChart
                        axis="traffic"
                        series={trafficSeries}
                        columns={{up: ["in"], down: ["out"]}}
                        style={fgStyle} />
                </Charts>
            );
        }

        return (
            <div>
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
                                <ChartRow height="250" debug={false}>
                                    <YAxis
                                        id="traffic"
                                        label="Traffic  (bps)"
                                        labelOffset={0}
                                        min={-max}
                                        max={max}
                                        absolute={true}
                                        width={220} />
                                    {charts}
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <HorizontalBarChart
                            display="range"
                            seriesList={interfaceList}
                            columns={["out", "in"]}
                            top={5} sortBy="max"
                            timestamp={this.state.tracker}
                            format={formatter}
                            selected={this.state.selected}
                            onSelectionChanged={this.handleSelectionChange}
                            selectionColor="#37B6D3"
                            style={[{fill: "#1F78B4"}, {fill: "#FF7F00"}]} />
                    </div>
                </div>

            </div>
        );
    }
});

// Export example
import interfaces_docs from "raw!./interfaces_docs.md";
import interfaces_thumbnail from "./interfaces_thumbnail.png";
export default {interfaces, interfaces_docs, interfaces_thumbnail};
