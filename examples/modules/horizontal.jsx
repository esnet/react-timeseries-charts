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
import Highlighter from "./highlighter";
import APIDocs from "./docs";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import HorizontalBarChart from "../../src/hbarchart";
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
    // const p = precisionPrefix(1e5, 1.3e6);
    // const f = formatPrefix("." + p, 1.3e6);
    const f = format(".2s");
    return `${f(value)}bps`;
}


const SeriesSummary = ({series}) => (
    <div style={{fontSize: 12, color: "#999"}}>
    <table><tbody>
        <tr>
        <td><b>Avg:</b></td>
        <td style={{paddingLeft: 5}}>{formatter(series.avg("in"))} to site</td>
        <td style={{paddingLeft: 15}}>{formatter(series.avg("out"))} from site</td>
        </tr>
    </tbody></table>
    </div>
);

/*
const SVGTest = ({series, width}) => (
    <svg width="100%" height={10}>
        <rect x={5} y={2} width={width-10} height={8} style={{fill: "#6ACACA"}} />
    </svg>
);
*/

export default React.createClass({

    mixins: [Highlighter],

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

        const bgStyle = {
            up: ["#AECFE4"],
            down: ["#FFD0A3"]
        };

        const fgStyle = {
            up: ["#448FDD"],
            down: ["#FD8D0D"]
        };

        if (this.state.selected) {
            _.each(interfaces, (interfaceSeries) => {
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
                        <h3>Horizontal Barchart</h3>

                        <p>
                        A horizontal barchart takes a list of TimeSeries objects and visualizes them.
                        You specify the columns you want to display and other visual properties such as
                        colors, and this component will build a bar chart showing max, avg and current
                        value.
                        </p>

                        <p>
                        In addition the bar charts support selection and will expand to display extra
                        data if needed.
                        </p>
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
                            seriesList={interfaces}
                            columns={["out", "in"]}
                            top={5} sortBy="max"
                            timestamp={this.state.tracker}
                            format={formatter}
                            selected={this.state.selected}
                            onSelectionChanged={this.handleSelectionChange}
                            selectionColor="#37B6D3"
                            style={[{fill: "#1F78B4"}, {fill: "#FF7F00"}]} >

                            <SeriesSummary />

                        </HorizontalBarChart>
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <APIDocs file="src/hbarchart.jsx"/>
                    </div>
                </div>
            </div>
        );
    }
});
