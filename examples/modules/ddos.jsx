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
import Markdown from "react-markdown";
import Highlighter from "./highlighter";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import LineChart from "../../src/linechart";
import Resizable from "../../src/resizable";
import Legend from "../../src/legend";

// Docs
const text = `

### Styling

This example uses inline styles to control the appearance of the line charts. The styles themselves
are defined like this:

    const styles = {
        connections: {
            stroke: "#2ca02c",
            width: 1
        },
        requests: {
            stroke: "#9467bd",
            width: 2
        }
    };

And then applied to each LineChart with the style prop:

    <LineChart axis="axis2" series={connectionsSeries} style={styles.connections} />

### Legend

This example allows you to use the legend to control the display of the charts themselves.
Click the legend items to hide and show each of the two channels of data.

The legend component lets you provide a callback to be called when an item is changed.
You can use that to control your component state and then re-render with or without a
particular chart.

The legend uses categories to define the items. A category is an object with a unique key,
the label, if the item is enabled or disabled, and the style of the item.

    const legend = [
        {
            key: "requests",
            label: "Requests",
            disabled: !this.state.active.requests,
            style: styles.requests
        },{
            key: "connections",
            label: "Connections",
            disabled: !this.state.active.connections,
            style: styles.connections
        }
    ];

    ...

    <Legend type="line" categories={legend} onChange={this.handleActiveChange}/>

When the legend changes handleActiveChange() will be called with the key (from the legend categories)
and the new enabled/disabled state:

    handleActiveChange(key, disabled) {
        const active = this.state.active;
        active[key] = !disabled;
        this.setState({active});
    }

Here we setState with the new active state of the item. Later we use this state to control which
LineCharts to display.

### Render

Eventually we implement the render() method of our component like this:

    <ChartContainer timeRange={requestsSeries.range()}>
        <ChartRow height="300">
            <YAxis id="axis1" label="Requests" style={{labelColor: scheme.requests}}
                   labelOffset={-10}  min={0} max={1000} format=",.0f" width="60" type="linear" />
            <Charts>
                {linecharts}
            </Charts>
            <YAxis id="axis2" label="Connections" style={{labelColor: scheme.connections}}
                   labelOffset={12} min={0} format=",.0f" max={10000} width="80" type="linear"/>
        </ChartRow>
    </ChartContainer>
`;

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

const styles = {
    connections: {
        stroke: "#2ca02c",
        width: 1
    },
    requests: {
        stroke: "#9467bd",
        width: 2
    }
};

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            markdown: text,
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
                    style={styles}
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
                    style={styles}
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
                        style={{labelColor: styles.requests.stroke}}
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
                        style={{labelColor: styles.connections.stroke}}
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

    handleActiveChange(key, disabled) {
        const active = this.state.active;
        active[key] = !disabled;
        this.setState({active});
    },

    render() {
        const legend = [
            {
                key: "requests",
                label: "Requests",
                disabled: !this.state.active.requests,
                style: styles.requests
            },{
                key: "connections",
                label: "Connections",
                disabled: !this.state.active.connections,
                style: styles.connections
            }
        ];

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>DDoS attack example</h3>
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <Legend type="line" categories={legend} onChange={this.handleActiveChange}/>
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

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={this.state.markdown}/>
                    </div>
                </div>
            </div>
        );
    }
});
