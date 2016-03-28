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
This example uses inline styles:

    const connectionsStyle = {
        "color": "#2ca02c",
        "width": 1
    }

    const requestsStyle = {
        "color": #9467bd,
        "width": 2
    }

Which are then specified for each LineChart:

    <ChartContainer timeRange={requestsSeries.range()}>
        <ChartRow height="300" debug={false}>
            <YAxis id="axis1" label="Requests" style={{labelColor: scheme.requests}}
                   labelOffset={-10}  min={0} max={1000} format=",.0f" width="60" type="linear" />
            <Charts>
                <LineChart axis="axis2" series={connectionsSeries} style={connectionsStyle}/>
                <LineChart axis="axis1" series={requestsSeries} style={requestsStyle}/>
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
    columns: ["time", "value"],
    points: connections
});

const requestsSeries = new TimeSeries({
    name: "requests",
    columns: ["time", "value"],
    points: requests
});


const scheme = {
    connections: "#2ca02c",
    requests: "#9467bd"
};

const connectionsStyle = {
    color: scheme.connections,
    width: 1
};

const requestsStyle = {
    color: scheme.requests,
    width: 2
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
        if (this.state.active.requests) {
            charts.push(
                <LineChart key="requests" axis="axis1" series={requestsSeries} style={requestsStyle}/>
            );
        }
        if (this.state.active.connections) {
            charts.push(
                <LineChart key="connections" axis="axis2" series={connectionsSeries} style={connectionsStyle}/>
            );
        }
        return (
            <ChartContainer timeRange={requestsSeries.range()}>
                <ChartRow height="300" debug={false}>
                    <YAxis id="axis1" label="Requests" style={{labelColor: scheme.requests}}
                           labelOffset={-10} min={0} max={1000} format=",.0f" width="60" type="linear" />
                    <Charts>
                        {charts}
                    </Charts>
                    <YAxis id="axis2" label="Connections" style={{labelColor: scheme.connections}}
                           labelOffset={12} min={0} format=",.0f" max={10000} width="80" type="linear"/>
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
                style: {backgroundColor: "#9467bd"}
            },{
                key: "connections",
                label: "Connections",
                disabled: !this.state.active.connections,
                style: {backgroundColor: "#2ca02c"}
            }
        ];
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>April 2015 DDoS Attack</h3>
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
