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
    const timestamp = moment(new Date(`2015-04-03T${val["time PST"]}`));
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

const style = styler([
    { key: "connections", color: "#2ca02c", width: 1 },
    { key: "requests", color: "#9467bd", width: 1 }
]);

class ddos extends React.Component {
    state = {
        max: 6000,
        active: {
            requests: true,
            connections: true
        },
        timerange: requestsSeries.range()
    };

    constructor(props) {
        super(props);
        this.handleRescale = _.debounce(this.rescale, 300);
    }

    rescale(timerange, active = this.state.active) {
        let max = 100;
        const maxRequests = requestsSeries.crop(this.state.timerange).max("requests");
        if (maxRequests > max && active.requests) max = maxRequests;
        const maxConnections = connectionsSeries.crop(this.state.timerange).max("connections");
        if (maxConnections > max && active.connections) max = maxConnections;
        this.setState({ max });
    }

    handleTimeRangeChange = timerange => {
        this.setState({ timerange });
        this.handleRescale(timerange);
    };

    handleActiveChange = key => {
        const active = this.state.active;
        active[key] = !active[key];
        this.setState({ active });
        this.handleRescale(this.state.timerange, active);
    };

    renderChart = () => {
        let charts = [];
        let max = 1000;
        if (this.state.active.requests) {
            const maxRequests = requestsSeries.crop(this.state.timerange).max("requests");
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
            const maxConnections = connectionsSeries.crop(this.state.timerange).max("connections");
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

        /* const axisStyle = {
            values: {
                labelColor: "grey",
                labelWeight: 100,
                labelSize: 11
            },
            axis: {
                axisColor: "grey",
                axisWidth: 1
            }
        }; */

        const darkAxis = {
            label: {
                stroke: "none",
                fill: "#AAA", // Default label color
                fontWeight: 200,
                fontSize: 14,
                font: '"Goudy Bookletter 1911", sans-serif"'
            },
            values: {
                stroke: "none",
                fill: "#888",
                fontWeight: 100,
                fontSize: 11,
                font: '"Goudy Bookletter 1911", sans-serif"'
            },
            ticks: {
                fill: "none",
                stroke: "#AAA",
                opacity: 0.2
            },
            axis: {
                fill: "none",
                stroke: "#AAA",
                opacity: 1
            }
        };

        return (
            <ChartContainer
                title="DDoS attack - connections vs requests"
                style={{
                    background: "#201d1e",
                    borderRadius: 8,
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#232122"
                }}
                timeAxisStyle={darkAxis}
                titleStyle={{
                    color: "#EEE",
                    fontWeight: 500
                }}
                padding={20}
                paddingTop={5}
                paddingBottom={0}
                enableDragZoom
                onTimeRangeChanged={this.handleTimeRangeChange}
                timeRange={this.state.timerange}
                maxTime={requestsSeries.range().end()}
                minTime={requestsSeries.range().begin()}
            >
                <ChartRow height="300">
                    <YAxis
                        id="axis1"
                        label="Requests"
                        showGrid
                        hideAxisLine
                        transition={300}
                        style={darkAxis}
                        labelOffset={-10}
                        min={0}
                        max={this.state.max}
                        format=",.0f"
                        width="60"
                        type="linear"
                    />
                    <Charts>{charts}</Charts>
                    <YAxis
                        id="axis2"
                        label="Connections"
                        hideAxisLine
                        transition={300}
                        style={darkAxis}
                        labelOffset={12}
                        min={0}
                        format=",.0f"
                        max={this.state.max}
                        width="80"
                        type="linear"
                    />
                </ChartRow>
            </ChartContainer>
        );
    };

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
                        <Resizable>{this.renderChart()}</Resizable>
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
export default { ddos, ddos_docs, ddos_thumbnail };
