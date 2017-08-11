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
import moment from "moment";
import merge from "merge";
import createReactClass from "create-react-class";

// Pond
import { timeSeries, TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../../../../components/ChartContainer";
import ChartRow from "../../../../../components/ChartRow";
import Charts from "../../../../../components/Charts";
import YAxis from "../../../../../components/YAxis";
import LineChart from "../../../../../components/LineChart";
import Resizable from "../../../../../components/Resizable";
import Legend from "../../../../../components/Legend";
import styler from "../../../../../js/styler";

import ddos_docs from "./ddos_docs.md";
import ddos_thumbnail from "./ddos_thumbnail.png";

// Data
const ddosData = require("./data.json");

const requests = [];
const connections = [];

_.each(ddosData, val => {
    const timestamp = moment(new Date(`2015-04-03 ${val["time PST"]}`));
    const numConnection = val["connections"];
    const httpRequests = val["http requests"];
    requests.push([timestamp.toDate().getTime(), httpRequests]);
    connections.push([timestamp.toDate().getTime(), numConnection]);
});

const connectionsSeries = timeSeries({
    name: "connections",
    columns: ["time", "connections"],
    points: connections
});

const requestsSeries = timeSeries({
    name: "requests",
    columns: ["time", "requests"],
    points: requests
});

//
// Styles
//

const style = styler([
    { key: "connections", color: "#2ca02c", width: 1 },
    { key: "requests", color: "#9467bd", width: 2 }
]);

const ddos = createReactClass({
    getInitialState() {
        return {
            active: {
                requests: true,
                connections: true
            }
        };
    },
    renderChart() {
        let charts = [];
        let max = 100;
        if (this.state.active.requests) {
            const maxRequests = requestsSeries.max("requests");
            if (maxRequests > max) max = maxRequests;
            charts.push(
                <LineChart
                    key="requests"
                    axis="axis1"
                    series={requestsSeries}
                    columns={["requests"]}
                    style={style}
                    interpolation="curveBasis"
                />
            );
        }
        if (this.state.active.connections) {
            const maxConnections = connectionsSeries.max("connections");
            if (maxConnections > max) max = maxConnections;
            charts.push(
                <LineChart
                    key="connections"
                    axis="axis2"
                    series={connectionsSeries}
                    columns={["connections"]}
                    style={style}
                    interpolation="curveBasis"
                />
            );
        }

        const axisStyle = {
            labels: {
                labelColor: "grey", // Default label color
                labelWeight: 100,
                labelSize: 11
            },
            axis: {
                axisColor: "grey",
                axisWidth: 1
            }
        };

        const requestsAxisStyle = merge(true, axisStyle, style.axisStyle("requests"));
        const connectionsAxisStyle = merge(true, axisStyle, style.axisStyle("connections"));

        return (
            <ChartContainer timeRange={requestsSeries.range()} timeAxisStyle={axisStyle}>
                <ChartRow height="300">
                    <YAxis
                        id="axis1"
                        label="Requests"
                        transition={300}
                        style={requestsAxisStyle}
                        labelOffset={-10}
                        min={0}
                        max={max}
                        format=",.0f"
                        width="60"
                        type="linear"
                    />
                    <Charts>
                        {charts}
                    </Charts>
                    <YAxis
                        id="axis2"
                        label="Connections"
                        transition={300}
                        style={connectionsAxisStyle}
                        labelOffset={12}
                        min={0}
                        format=",.0f"
                        max={max}
                        width="80"
                        type="linear"
                    />
                </ChartRow>
            </ChartContainer>
        );
    },
    handleActiveChange(key) {
        const active = this.state.active;
        active[key] = !active[key];
        this.setState({ active });
    },
    render() {
        const legend = [
            {
                key: "requests",
                label: "Requests",
                disabled: !this.state.active.requests
            },
            {
                key: "connections",
                label: "Connections",
                disabled: !this.state.active.connections
            }
        ];

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <Legend
                            type="line"
                            style={style}
                            categories={legend}
                            onSelectionChange={this.handleActiveChange}
                        />
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            {this.renderChart()}
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
});

// Export example
export default { ddos, ddos_docs, ddos_thumbnail };
