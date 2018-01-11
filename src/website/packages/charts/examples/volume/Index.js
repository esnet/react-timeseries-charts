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
import moment from "moment";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../../../../components/ChartContainer";
import ChartRow from "../../../../../components/ChartRow";
import Charts from "../../../../../components/Charts";
import YAxis from "../../../../../components/YAxis";
import BarChart from "../../../../../components/BarChart";
import Resizable from "../../../../../components/Resizable";
import styler from "../../../../../js/styler";

// Test data
import monthlyJSON from "./total_traffic_6mo.json";

import volume_docs from "./volume_docs.md";
import volume_thumbnail from "./volume_thumbnail.png";

//
// October 2014 daily traffic
//

const trafficPoints = [];
const interfacesJSON = require("./interface-traffic.json");
const interfaceKey = "ornl-cr5::to_ornl_ip-a::standard";
const days = interfacesJSON[interfaceKey].days;

let max = 0;
_.each(days, (value, day) => {
    const dayOfMonth = Number(day);
    const volIn = value.in;
    const volOut = value.out;

    // Max
    max = Math.max(max, value.in);
    max = Math.max(max, value.out);

    trafficPoints.push([`2014-10-${dayOfMonth}`, volIn, volOut]);
});

const octoberTrafficSeries = new TimeSeries({
    name: "October Traffic",
    utc: false,
    columns: ["index", "in", "out"],
    points: trafficPoints
});

max /= 100;

//
// October 2014 net daily traffic for multiple interfaces
//

const netTrafficPoints = [];
const interfaceKeys = [
    "lbl-mr2::xe-8_3_0.911::standard",
    "pnwg-cr5::111-10_1_4-814::sap",
    "denv-cr5::to_denv-frgp(as14041)::standard"
];
const octoberDays = interfacesJSON[interfaceKeys[0]].days;

let maxTotalTraffic = 0;
let minTotalTraffic = 0;
_.each(octoberDays, (ignoreValue, day) => {
    const dayOfMonth = Number(day);
    const netTrafficForDay = [`2014-10-${dayOfMonth}`];
    let maxDay = 0;
    let minDay = 0;
    _.each(interfaceKeys, interfaceKey => {
        let value = interfacesJSON[interfaceKey].days[dayOfMonth];
        let netTraffic = value.out - value.in;
        netTrafficForDay.push(netTraffic);
        if (netTraffic > 0) {
            maxDay += netTraffic;
        } else {
            minDay += netTraffic;
        }
    });
    maxTotalTraffic = Math.max(maxTotalTraffic, maxDay);
    minTotalTraffic = Math.min(minTotalTraffic, minDay);
    netTrafficPoints.push(netTrafficForDay);
});

const netTrafficColumnNames = ["index"];
_.each(interfaceKeys, interfaceKey => {
    netTrafficColumnNames.push(interfaceKey.split(":")[0]);
});

const octoberNetTrafficSeries = new TimeSeries({
    name: "October Net Traffic",
    utc: false,
    columns: netTrafficColumnNames,
    points: netTrafficPoints
});

// Correct for measurement error on October 10th
maxTotalTraffic /= 150;
minTotalTraffic /= 10;

//
// ESnet wide monthy traffic summary (part of 2014)
//

const routerData = {};
_.each(monthlyJSON, router => {
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

class volume extends React.Component {
    static displayName = "VolumeExample";

    state = {
        timerange: octoberTrafficSeries.range(),
        selection: null
    };

    handleTimeRangeChange = timerange => {
        this.setState({ timerange });
    };

    render() {
        /*
        
        Styling the hard way

        const style = {
            in: {
                normal: {fill: "#A5C8E1"},
                highlighted: {fill: "#BFDFF6"},
                selected: {fill: "#2DB3D1"},
                muted: {fill: "#A5C8E1", opacity: 0.4}
            }
        };

        const altStyle = {
            out: {
                normal: {fill: "#FFCC9E"},
                highlighted: {fill: "#fcc593"},
                selected: {fill: "#2DB3D1"},
                muted: {fill: "#FFCC9E", opacity: 0.4}
            }
        };
       
        const combinedStyle = {
            in: {
                normal: {fill: "#A5C8E1"},
                highlighted: {fill: "#BFDFF6"},
                selected: {fill: "#2DB3D1"},
                muted: {fill: "#A5C8E1", opacity: 0.4}
            },
            out: {
                normal: {fill: "#FFCC9E"},
                highlighted: {fill: "#fcc593"},
                selected: {fill: "#2DB3D1"},
                muted: {fill: "#FFCC9E", opacity: 0.4}
            }
        };
        */

        const style = styler([
            { key: "in", color: "#A5C8E1", selected: "#2CB1CF" },
            { key: "out", color: "#FFCC9E", selected: "#2CB1CF" },
            {
                key: netTrafficColumnNames[1],
                color: "#A5C8E1",
                selected: "#2CB1CF"
            },
            {
                key: netTrafficColumnNames[2],
                color: "#FFCC9E",
                selected: "#2CB1CF"
            },
            {
                key: netTrafficColumnNames[3],
                color: "#DEB887",
                selected: "#2CB1CF"
            }
        ]);

        const formatter = format(".2s");
        const selectedDate = this.state.selection
            ? this.state.selection.event.index().toNiceString()
            : "--";
        const selectedValue = this.state.selection
            ? `${formatter(+this.state.selection.event.value(this.state.selection.column))}b`
            : "--";

        const highlight = this.state.highlight;
        let infoValues = [];
        let infoNetValues = [];
        if (highlight) {
            const trafficText = `${formatter(highlight.event.get(highlight.column))}`;
            infoValues = [{ label: "Traffic", value: trafficText }];
            infoNetValues = [{ label: "Traffic " + highlight.column, value: trafficText }];
        }

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <b>October 2014 Total Traffic</b>
                        <p style={{ color: "#808080" }}>
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
                                onBackgroundClick={() => this.setState({ selection: null })}
                                maxTime={new Date(1414827330868)}
                                minTime={new Date(1412143472795)}
                                minDuration={1000 * 60 * 60 * 24 * 5}
                            >
                                <ChartRow height="150">
                                    <YAxis
                                        id="traffic"
                                        label="Traffic In (B)"
                                        min={0}
                                        max={max}
                                        width="70"
                                    />
                                    <Charts>
                                        <BarChart
                                            axis="traffic"
                                            style={style}
                                            columns={["in"]}
                                            series={octoberTrafficSeries}
                                            info={infoValues}
                                            infoTimeFormat={index =>
                                                moment(index.begin()).format("Do MMM 'YY")
                                            }
                                            highlighted={this.state.highlight}
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })
                                            }
                                            selected={this.state.selection}
                                            onSelectionChange={selection =>
                                                this.setState({ selection })
                                            }
                                        />
                                    </Charts>
                                    <YAxis
                                        id="traffic-rate"
                                        label="Avg Traffic Rate In (bps)"
                                        min={0}
                                        max={max / (24 * 60 * 60) * 8}
                                        width="70"
                                    />
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <hr />
                        Alternatively we can display bars side by side using the 'spacing' and
                        'offset' props:
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={octoberTrafficSeries.range()}
                                format="day"
                                onBackgroundClick={() => this.setState({ selection: null })}
                            >
                                <ChartRow height="150">
                                    <YAxis
                                        id="traffic-volume"
                                        label="Traffic (B)"
                                        classed="traffic-in"
                                        min={0}
                                        max={max}
                                        width="70"
                                        type="linear"
                                    />
                                    <Charts>
                                        <BarChart
                                            axis="traffic-volume"
                                            style={style}
                                            size={10}
                                            offset={5.5}
                                            columns={["in"]}
                                            series={octoberTrafficSeries}
                                            highlighted={this.state.highlight}
                                            info={infoValues}
                                            infoTimeFormat="%m/%d/%y"
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })
                                            }
                                            selected={this.state.selection}
                                            onSelectionChange={selection =>
                                                this.setState({ selection })
                                            }
                                        />
                                        <BarChart
                                            axis="traffic-volume"
                                            style={style}
                                            size={10}
                                            offset={-5.5}
                                            columns={["out"]}
                                            series={octoberTrafficSeries}
                                            info={infoValues}
                                            highlighted={this.state.highlight}
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })
                                            }
                                            selected={this.state.selection}
                                            onSelectionChange={selection =>
                                                this.setState({ selection })
                                            }
                                        />
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
                                onBackgroundClick={() => this.setState({ selection: null })}
                            >
                                <ChartRow height="150">
                                    <YAxis
                                        id="traffic-volume"
                                        label="Traffic (B)"
                                        classed="traffic-in"
                                        min={0}
                                        max={max}
                                        width="70"
                                        type="linear"
                                    />
                                    <Charts>
                                        <BarChart
                                            axis="traffic-volume"
                                            style={style}
                                            spacing={3}
                                            columns={["in", "out"]}
                                            series={octoberTrafficSeries}
                                            info={infoValues}
                                            highlighted={this.state.highlight}
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })
                                            }
                                            selected={this.state.selection}
                                            onSelectionChange={selection =>
                                                this.setState({ selection })
                                            }
                                        />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <hr />
                        BarChart can display negative values as well, as shown below for a stacked
                        format. Note that all bars representing positive values are stacked together
                        above the x-axis and the bars for negative values are stacked below the
                        x-axis.
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={octoberNetTrafficSeries.range()}
                                format="day"
                                onBackgroundClick={() => this.setState({ selection: null })}
                            >
                                <ChartRow height="150">
                                    <YAxis
                                        id="net-traffic-volume"
                                        label="Net Traffic (B)"
                                        classed="traffic-in"
                                        min={minTotalTraffic}
                                        max={maxTotalTraffic}
                                        width="70"
                                        type="linear"
                                    />
                                    <Charts>
                                        <BarChart
                                            axis="net-traffic-volume"
                                            style={style}
                                            spacing={3}
                                            columns={netTrafficColumnNames.slice(
                                                1,
                                                netTrafficColumnNames.length
                                            )}
                                            series={octoberNetTrafficSeries}
                                            info={infoNetValues}
                                            infoWidth={140}
                                            highlighted={this.state.highlight}
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })
                                            }
                                            selected={this.state.selection}
                                            onSelectionChange={selection =>
                                                this.setState({ selection })
                                            }
                                        />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
export default { volume, volume_docs, volume_thumbnail };
