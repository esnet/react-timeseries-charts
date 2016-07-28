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

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "src/chartcontainer";
import ChartRow from "src/chartrow";
import Charts from "src/charts";
import YAxis from "src/yaxis";
import LineChart from "src/linechart";
import Resizable from "src/resizable";
import Legend from "src/legend";
import Styler from "src/styler";

// Data
const ddosData = require("../data/ddos.json");

const requests = [];
const connections = [];

_.each(ddosData, val => {
    const timestamp = new moment(new Date(`2015-04-03 ${val["time PST"]}`));
    const numConnection = val["connections"];
    const httpRequests = val["http requests"];
    requests.push([timestamp.toDate().getTime(), httpRequests]);
    connections.push([timestamp.toDate().getTime(), numConnection]);
});

const connectionsSeries = new TimeSeries({
    name: "connections",
    columns: ["time", "connections"],
    points: connections
});

const requestsSeries = new TimeSeries({
    name: "requests",
    columns: ["time", "requests"],
    points: requests
});

//
// Styles
//

const styler = Styler([
    {key: "connections", color: "#2ca02c", width: 1},
    {key: "requests", color: "#9467bd", width: 2}
]);

export default React.createClass({

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
                    style={styler}
                    interpolation="curveBasis" />
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
                    style={styler}
                    interpolation="curveBasis" />
            );
        }
        return (
            <ChartContainer timeRange={requestsSeries.range()}>
                <ChartRow height="300">
                    <YAxis
                        id="axis1"
                        label="Requests"
                        transition={300}
                        style={styler.axisStyle("requests")}
                        labelOffset={-10}
                        min={0} max={max}
                        format=",.0f"
                        width="60"
                        type="linear" />
                    <Charts>
                        {charts}
                    </Charts>
                    <YAxis
                        id="axis2"
                        label="Connections"
                        transition={300}
                        style={styler.axisStyle("connections")}
                        labelOffset={12}
                        min={0}
                        format=",.0f"
                        max={max}
                        width="80"
                        type="linear" />
                </ChartRow>
            </ChartContainer>
        );
    },

    handleActiveChange(key) {
        const active = this.state.active;
        active[key] = !active[key];
        this.setState({active});
    },

    render() {
        const legend = [
            {
                key: "requests",
                label: "Requests",
                disabled: !this.state.active.requests
            },{
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
                            style={styler}
                            categories={legend}
                            onSelectionChange={this.handleActiveChange} />
                    </div>
                </div>

                <hr/>

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
