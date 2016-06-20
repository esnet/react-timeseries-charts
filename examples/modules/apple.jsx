/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import moment from "moment";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import LineChart from "../../src/linechart";
import Resizable from "../../src/resizable";

const data = require("dsv?delimiter=\t!../data/apple_share_price.tsv");

const name = "AAPL";
const columns = ["time", "close"];
const points = data.map(item => {
    const timestamp = new moment(new Date(item.date));
    const close = item.close;
    return [timestamp.toDate().getTime(), +close];
});

const series = new TimeSeries({name, columns, points});

export default React.createClass({

    getInitialState() {
        return {
            mode: "log"
        };
    },

    renderChart() {
        return (
            <ChartContainer timeRange={series.range()}>
                <ChartRow height="300">
                    <YAxis
                        id="y"
                        transition={200}
                        label="Price ($)"
                        labelOffset={-10}
                        min={series.min("close")}
                        max={series.max("close")}
                        format=",.0f"
                        width="60"
                        type={this.state.mode} />
                    <Charts>
                        <LineChart
                            axis="y"
                            style={{close: {stroke: "steelblue"}}}
                            columns={["close"]}
                            series={series}
                            interpolation="curveBasis" />
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
    },

    render() {

        const linkStyle = {
            fontWeight: 600,
            color: "grey",
            cursor: "default"
        };

        const linkStyleActive = {
            color: "steelblue",
            cursor: "pointer"
        };

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Apple stock price</h3>
                    </div>
                </div>

                <hr/>
                
                <div className="row">
                    <div className="col-md-12" style={{fontSize: 14, color: "#777"}}>
                        <span
                            style={this.state.mode === "log" ? linkStyleActive : linkStyle}
                            onClick={() => this.setState({mode: "linear"})}>
                                Linear
                        </span>
                        <span> | </span>
                        <span
                            style={this.state.mode === "linear" ? linkStyleActive : linkStyle}
                            onClick={() => this.setState({mode: "log"})}>
                                Log
                        </span>
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
