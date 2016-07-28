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
import ChartContainer from "src/chartcontainer";
import ChartRow from "src/chartrow";
import Charts from "src/charts";
import YAxis from "src/yaxis";
import BarChart from "src/barchart";
import Baseline from "src/baseline";
import Resizable from "src/resizable";

// Test data
import monthlyJSON from "./total_traffic_6mo.json";

//
// October 2014 daily traffic
//

const trafficPoints = [];
const interfacesJSON = require("./interface-traffic.json");
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

    getInitialState() {
        return {
            timerange: octoberTrafficSeries.range(),
            selection: null
        };
    },

    handleTimeRangeChange(timerange) {
        this.setState({timerange});
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
                highlighted: {fill: "#fcc593"},
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
                highlighted: {fill: "#fcc593"},
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
                                utc={false}
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
                        <hr />
                        Alternatively we can display bars side by side using the 'spacing' and 'offset' props:
                        <hr />
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
                                            info={infoValues}
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
                                            info={infoValues}
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
                                 </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>

            </div>
        );
    }
});
