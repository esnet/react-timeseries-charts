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

import React from "react/addons";
import _ from "underscore";
import moment from "moment";
import Markdown from "react-markdown";
import Highlighter from "./highlighter";

// Pond
import {TimeSeries} from "@esnet/pond";

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

    <ChartContainer timeRange={requestsSeries.range()} padding="5">
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
    requests: "#9467bd",
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
            markdown: text
        };
    },

    renderChart() {
        return (
            <ChartContainer timeRange={requestsSeries.range()} padding="5">
                <ChartRow height="300" debug={false}>
                    <YAxis id="axis1" label="Requests" style={{labelColor: scheme.requests}}
                           labelOffset={-10} min={0} max={1000} format=",.0f" width="60" type="linear" />
                    <Charts>
                        <LineChart axis="axis2" series={connectionsSeries} style={connectionsStyle}/>
                        <LineChart axis="axis1" series={requestsSeries} style={requestsStyle}/>
                    </Charts>
                    <YAxis id="axis2" label="Connections" style={{labelColor: scheme.connections}}
                           labelOffset={12} min={0} format=",.0f" max={10000} width="80" type="linear"/>
                </ChartRow>
            </ChartContainer>
        );
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>April 2015 DDoS Attack</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Legend type="line" categories={[
                            {key: "requests", label: "Requests", style: {backgroundColor: "#9467bd"}},
                            {key: "connections", label: "Connections", style: {backgroundColor: "#2ca02c"}}
                        ]} />
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
