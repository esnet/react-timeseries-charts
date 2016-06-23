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
import Markdown from "react-markdown";
import { format } from "d3-format";
import Highlighter from "./highlighter";
import APIDocs from "./docs";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import BarChart from "../../src/barchart";
import Baseline from "../../src/baseline";
import Legend from "../../src/legend";
import Resizable from "../../src/resizable";

// Test data
import monthlyJSON from "../data/total_traffic_6mo.json";

// Docs
const text = `

This simple example of a bar chart displays a pan and zoom chart that shows traffic levels
for each day of October 2014. The original data used here was captured to debug a messurement
error (seen clearly in Oct 10th).

To begin with we converted the original data into Pond's TimeSeries data structure as \`octoberTraffic\`:

    import { TimeSeries } from "pondjs";

    const octoberTraffic = new TimeSeries({
        name: "Traffic",
        utc: false,
        columns: ["time", "in", "out"],
        points: trafficPoints
    });

Points are simply an array of tuples, each of which is \`[index, value1, value2, ...]\`. In this case this
looks like \`['2014-10-DD', volIn, volOut]\`. An index can be of several forms, but is a string that
represents a time range (e.g. 2014-10-08 represents the time range spanning October 8th 2014).

We also set utc to false here so that the index time ranges are defined in local time. Currently all
visualizations of time series data are in local time, while the default is for indexes to be in UTC.

Now we can render a the chart. The \`<BarChart>\` element does the rendering of the chart itself. As with
other chart types, the vertical scale is provided by referencing the \`<YAxis>\` (\`axis='traffic'\`).

    <ChartContainer
        timeRange={this.state.timerange} format="day"
        enablePanZoom={true} onTimeRangeChanged={this.handleTimeRangeChange}
        maxTime={new Date(1414827330868)}
        minTime={new Date(1412143472795)}
        minDuration={1000*60*60*24*5}>
        <ChartRow height="150">
            <YAxis id="traffic" label="Traffic In (B)" min={0} max={max} width="70" type="linear" />
            <Charts>
                <BarChart
                    axis="traffic"
                    style={style}
                    columns={["in"]}
                    series={octoberTrafficSeries}
                    info={infoValues}
                    highlight={this.state.highlight}
                    onHighlightChange={highlight => this.setState({highlight})}
                    selection={this.state.selection}
                    onSelectionChange={selection => this.setState({selection})} />
                <Baseline
                    axis="traffic"
                    value={avgIn}
                    label="Avg"
                    position="right" />
            </Charts>
            <YAxis id="traffic-rate" label="Avg Traffic Rate In (bps)" classed="traffic-in"
                    min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
        </ChartRow>
    </ChartContainer>

The style provides the coloring, relating each channel to styles for normal, highlight (hover) and
selected:

    const style = {
        in: {
            normal: {fill: "#A5C8E1"},
            highlighted: {fill: "#bfdff6"},
            selected: {fill: "#5aa2d5"},
            muted: {fill: "#A5C8E1", opacity: 0.4}
        }
    };

As a side note, this chart can also be zoomed in and then panned with constraints. This is controlled
using the \`<ChartContainer>\` props.

`;

//
// October 2014 daily traffic
//

const trafficPoints = [];
const interfacesJSON = require("../data/interface-traffic.json");
const interfaceKey = "ornl-cr5::to_ornl_ip-a::standard";
const days = interfacesJSON[interfaceKey].days;

let max = 0;
let count = 0;
let totalIn = 0;
let totalOut = 0;
_.each(days, (value, day) => {
    const dayOfMonth = Number(day);
    const volIn = value.in;
    const volOut = value.out;

    // Max
    max = Math.max(max, value.in);
    max = Math.max(max, value.out);

    // Skip the bad value in oct for a reasonable avg example
    if (dayOfMonth !== 10) {
        totalIn += value.in;
        totalOut += value.out;
        count++;
    }

    trafficPoints.push([`2014-10-${dayOfMonth}`, volIn, volOut]);
});

const octoberTrafficSeries = new TimeSeries({
    name: "October Traffic",
    utc: false,
    columns: ["index", "in", "out"],
    points: trafficPoints
});

max /= 100;

const avgIn = totalIn / count;

//
// ESnet wide monthy traffic summary (part of 2014)
//

const routerData = {};
_.each(monthlyJSON, (router) => {
    const routerName = router["Router"];
    if (routerName) {
        routerData[routerName] = {
            accepted: [],
            delivered: []
        };
        _.each(router, (traffic, key) => {
            if (key !== "Router") {
                const month = key.split(" ")[0];
                const type = key.split(" ")[1];
                if (type === "Accepted") {
                    routerData[routerName].accepted.push([month, traffic]);
                } else if (type === "Delivered") {
                    routerData[routerName].delivered.push([month, traffic]);
                }
            }
        });
    }
});

export default React.createClass({

    displayName: "BarChartExample",

    mixins: [Highlighter],

    getInitialState() {
        return {
            markdown: text,
            timerange: octoberTrafficSeries.range(),
            selection: null
        };
    },

    handleTimeRangeChange(timerange) {
        this.setState({timerange});
    },

    handleSelectionChanged(bar) {
        this.setState({
            selection: bar
        });
    },

    handleHighlightChanged(bar) {
        this.setState({
            highlight: bar
        });
    },

    render() {
        const style = {
            in: {
                normal: {fill: "#A5C8E1"},
                highlighted: {fill: "#BFDFF6"},
                selected: {fill: "#5AA2D5"},
                muted: {fill: "#A5C8E1", opacity: 0.4}
            }
        };

        const altStyle = {
            out: {
                normal: {fill: "#FFCC9E"},
                highlighted: {fill: "#DDDAB9"},
                selected: {fill: "#FFCC9E"},
                muted: {fill: "#FFCC9E", opacity: 0.4}
            }
        };
       
        const combinedStyle = {
            in: {
                normal: {fill: "#A5C8E1"},
                highlighted: {fill: "#BFDFF6"},
                selected: {fill: "#5AA2D5"},
                muted: {fill: "#A5C8E1", opacity: 0.4}
            },
            out: {
                normal: {fill: "#FFCC9E"},
                highlighted: {fill: "#DDDAB9"},
                selected: {fill: "#FFCC9E"},
                muted: {fill: "#FFCC9E", opacity: 0.4}
            }
        };

        const formatter = format(".2s");
        const selectedDate = this.state.selection ?
            this.state.selection.event.index().toNiceString() : "--";
        const selectedValue = this.state.selection ?
            `${formatter(+this.state.selection.event.value(this.state.selection.column))}b` : "--";


        const highlight = this.state.highlight;
        let infoValues = [];
        if (highlight) {
            const trafficText = `${formatter(highlight.event.get(highlight.column))}`;
            infoValues = [{label: "Traffic", value: trafficText}];
        }

        return (
            <div>

               <div className="row">
                    <div className="col-md-12">
                        <h3>BarCharts</h3>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <b>October 2014 Total Traffic</b>
                        <p style={{color: "#808080"}}>
                            Selected: {selectedDate} - {selectedValue}
                        </p>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={this.state.timerange}
                                format="day"
                                enablePanZoom={true}
                                onTimeRangeChanged={this.handleTimeRangeChange}
                                onBackgroundClick={() => this.setState({selection: null})}
                                maxTime={new Date(1414827330868)}
                                minTime={new Date(1412143472795)}
                                minDuration={1000 * 60 * 60 * 24 * 5} >
                                <ChartRow height="150">
                                    <YAxis
                                        id="traffic"
                                        label="Traffic In (B)"
                                        min={0} max={max}
                                        width="70" />
                                    <Charts>
                                        <BarChart
                                            axis="traffic"
                                            style={style}
                                            columns={["in"]}
                                            series={octoberTrafficSeries}
                                            info={infoValues}
                                            highlight={this.state.highlight}
                                            onHighlightChange={highlight => this.setState({highlight})}
                                            selection={this.state.selection}
                                            onSelectionChange={selection => this.setState({selection})} />
                                        <Baseline
                                            axis="traffic"
                                            value={avgIn}
                                            label="Avg"
                                            position="right" />
                                    </Charts>
                                    <YAxis
                                        id="traffic-rate"
                                        label="Avg Traffic Rate In (bps)"
                                        min={0} max={max / (24 * 60 * 60) * 8}
                                        width="70" />
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={this.state.markdown}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <hr />
                        Alternatively we can display bars side by side using the 'spacing' and 'offset' props:
                        <hr />
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-11">
                        <Legend type="swatch" categories={[
                            {key: "in", label: "Traffic In", style: {fill: "#A5C8E1"}},
                            {key: "out", label: "Traffic Out", style: {fill: "#FFCC9E"}}]} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={octoberTrafficSeries.range()}
                                format="day"
                                onBackgroundClick={() => this.setState({selection: null})}>
                                <ChartRow height="150">
                                    <YAxis id="traffic-volume" label="Traffic (B)" classed="traffic-in"
                                           min={0} max={max} width="70" type="linear"/>
                                    <Charts>
                                        <BarChart
                                            axis="traffic-volume"
                                            style={style}
                                            size={10}
                                            offset={5.5}
                                            columns={["in"]}
                                            series={octoberTrafficSeries}
                                            highlight={this.state.highlight}
                                            onHighlightChange={highlight => this.setState({highlight})}
                                            selection={this.state.selection}
                                            onSelectionChange={selection => this.setState({selection})} />
                                        <BarChart
                                            axis="traffic-volume"
                                            style={altStyle}
                                            size={10}
                                            offset={-5.5}
                                            columns={["out"]}
                                            series={octoberTrafficSeries}
                                            highlight={this.state.highlight}
                                            onHighlightChange={highlight => this.setState({highlight})}
                                            selection={this.state.selection}
                                            onSelectionChange={selection => this.setState({selection})} />

                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <hr />
                        Or of course you can stack them:
                        <hr />
                    </div>
                </div>

                
                <div className="row">
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-11">
                        <Legend type="swatch" categories={[
                            {key: "in", label: "Traffic In", style: {fill: "#A5C8E1"}},
                            {key: "out", label: "Traffic Out", style: {fill: "#FFCC9E"}}]} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={octoberTrafficSeries.range()}
                                format="day"
                                onBackgroundClick={() => this.setState({selection: null})}>
                                <ChartRow height="150">
                                    <YAxis id="traffic-volume" label="Traffic (B)" classed="traffic-in"
                                           min={0} max={max} width="70" type="linear"/>
                                    <Charts>
                                        <BarChart
                                            axis="traffic-volume"
                                            style={combinedStyle}
                                            spacing={3}
                                            columns={["in", "out"]}
                                            series={octoberTrafficSeries}
                                            info={infoValues}
                                            highlight={this.state.highlight}
                                            onHighlightChange={highlight => this.setState({highlight})}
                                            selection={this.state.selection}
                                            onSelectionChange={selection => this.setState({selection})} />
                                    </Charts>
                                    <YAxis id="traffic-rate" label="Avg Traffic Rate (bps)" classed="traffic-in"
                                            min={0} max={ max / (24 * 60 * 60) * 8} width="70" type="linear"/>
                                </ChartRow>

                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <APIDocs file="src/barchart.jsx"/>
                    </div>
                </div>
            </div>
        );
    }
});
