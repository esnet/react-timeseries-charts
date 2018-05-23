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
import { TimeSeries, timeSeries } from "pondjs";
import styler, { ChartContainer, ChartRow, Charts, YAxis, AreaChart, Legend, Resizable } from "react-timeseries-charts";

import traffic_docs from "./traffic_docs.md";
import traffic_thumbnail from "./traffic_thumbnail.png";

// Data
const rawTrafficData = require("./link-traffic.json");

const trafficBNLtoNEWYSeries = timeSeries({
    name: `BNL to NEWY`,
    columns: ["time", "in"],
    points: _.map(rawTrafficData.traffic["BNL--NEWY"], p => [p[0] * 1000, p[1]])
});

const trafficNEWYtoBNLSeries = timeSeries({
    name: `NEWY to BNL`,
    columns: ["time", "out"],
    points: _.map(rawTrafficData.traffic["NEWY--BNL"], p => [p[0] * 1000, p[1]])
});

const trafficSeries = TimeSeries.timeSeriesListMerge({
    name: "traffic",
    seriesList: [trafficBNLtoNEWYSeries, trafficNEWYtoBNLSeries]
});

const upDownStyle = styler([{ key: "in", color: "#C8D5B8" }, { key: "out", color: "#9BB8D7" }]);

class traffic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tracker: null,
            timerange: trafficSeries.range()
        };
        this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this);
        this.handleTrackerChanged = this.handleTrackerChanged.bind(this);
    }

    handleTrackerChanged(t) {
        this.setState({ tracker: t });
    }

    handleTimeRangeChange(timerange) {
        this.setState({ timerange });
    }

    render() {
        const dateStyle = {
            fontSize: 12,
            color: "#AAA",
            borderWidth: 1,
            borderColor: "#F4F4F4"
        };

        const max = _.max([trafficBNLtoNEWYSeries.max("in"), trafficNEWYtoBNLSeries.max("out")]);

        const axistype = "linear";
        const tracker = this.state.tracker ? `${this.state.tracker}` : "";

        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <Legend
                            type="swatch"
                            style={upDownStyle}
                            categories={[
                                { key: "in", label: "Into Site" },
                                { key: "out", label: "Out of site" }
                            ]}
                        />
                    </div>
                    <div className="col-md-8">
                        <span style={dateStyle}>{tracker}</span>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={this.state.timerange}
                                trackerPosition={this.state.tracker}
                                onTrackerChanged={this.handleTrackerChanged}
                                enablePanZoom={true}
                                maxTime={trafficSeries.range().end()}
                                minTime={trafficSeries.range().begin()}
                                minDuration={1000 * 60 * 60}
                                onBackgroundClick={() => this.setState({ selection: null })}
                                onTimeRangeChanged={this.handleTimeRangeChange}
                            >
                                <ChartRow height="250" debug={false}>
                                    <Charts>
                                        <AreaChart
                                            axis="traffic"
                                            series={trafficSeries}
                                            columns={{
                                                up: ["in"],
                                                down: ["out"]
                                            }}
                                            style={upDownStyle}
                                        />
                                    </Charts>
                                    <YAxis
                                        id="traffic"
                                        label="Traffic (bps)"
                                        labelOffset={0}
                                        min={-max}
                                        max={max}
                                        absolute={true}
                                        width="60"
                                        type={axistype}
                                    />
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
};

// Export example
export default { traffic, traffic_docs, traffic_thumbnail };
