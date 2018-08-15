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
import { TimeSeries, TimeRange } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../../../../components/ChartContainer";
import ChartRow from "../../../../../components/ChartRow";
import Charts from "../../../../../components/Charts";
import YAxis from "../../../../../components/YAxis";
import AreaChart from "../../../../../components/AreaChart";
import Legend from "../../../../../components/Legend";
import MultiBrush from "../../../../../components/MultiBrush";
import Resizable from "../../../../../components/Resizable";
import styler from "../../../../../js/styler";

import traffic_docs from "./traffic_docs.md";
import traffic_thumbnail from "./traffic_thumbnail.png";

// Data
const rawTrafficData = require("./link-traffic.json");

const trafficBNLtoNEWYSeries = new TimeSeries({
    name: `BNL to NEWY`,
    columns: ["time", "in"],
    points: _.map(rawTrafficData.traffic["BNL--NEWY"], p => [p[0] * 1000, p[1]])
});

const trafficNEWYtoBNLSeries = new TimeSeries({
    name: `NEWY to BNL`,
    columns: ["time", "out"],
    points: _.map(rawTrafficData.traffic["NEWY--BNL"], p => [p[0] * 1000, p[1]])
});

const trafficSeries = TimeSeries.timeSeriesListMerge({
    name: "traffic",
    seriesList: [trafficBNLtoNEWYSeries, trafficNEWYtoBNLSeries]
});

const upDownStyle = styler([{ key: "in", color: "#C8D5B8" }, { key: "out", color: "#9BB8D7" }]);

const trackerStyle = {
    line: {
        stroke: "#a62011",
        cursor: "crosshair",
        pointerEvents: "none"
    }
};

class traffic extends React.Component {
    state = {
        tracker: null,
        timerange: trafficSeries.range(),
        selected: 1,
        selections: [
            new TimeRange(1441059420000, 1441062390000),
            new TimeRange(1441070850000, 1441088580000),
            new TimeRange(1441127730000, 1441137540000)
        ]
    };

    handleTrackerChanged = (t, scale) => {
        this.setState({
            tracker: t,
            trackerEventIn: t && trafficBNLtoNEWYSeries.at(trafficBNLtoNEWYSeries.bisect(t)),
            trackerEventOut: t && trafficNEWYtoBNLSeries.at(trafficNEWYtoBNLSeries.bisect(t)),
            trackerX: t && scale(t)
        });
    };

    handleTimeRangeChange = timerange => {
        this.setState({ timerange });
    };

    handleSelectionChange = (timerange, i) => {
        const selections = this.state.selections;
        selections[i] = timerange;
        this.setState({ selections });
    };

    render() {
        const dateStyle = {
            fontSize: 12,
            color: "#AAA",
            borderWidth: 1,
            borderColor: "#F4F4F4"
        };

        const markerStyle = {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "#AAA",
            marginLeft: "5px"
        };

        const max = _.max([trafficBNLtoNEWYSeries.max("in"), trafficNEWYtoBNLSeries.max("out")]);
        const axistype = "linear";
        const tracker = this.state.tracker ? `${this.state.tracker}` : "";
        const formatter = format(".4s");

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
                        {this.state.tracker ? (
                            <div style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: this.state.trackerX }}>
                                    <div style={markerStyle}>
                                        Data In: {formatter(this.state.trackerEventIn.get("in"))}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        position: "absolute",
                                        left: this.state.trackerX,
                                        top: "220px"
                                    }}
                                >
                                    <div style={markerStyle}>
                                        Data Out: {formatter(this.state.trackerEventOut.get("out"))}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        <Resizable>
                            <ChartContainer
                                timeRange={this.state.timerange}
                                trackerPosition={this.state.tracker}
                                trackerStyle={trackerStyle}
                                onTrackerChanged={this.handleTrackerChanged}
                                enablePanZoom={false}
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
                                        <MultiBrush
                                            timeRanges={this.state.selections}
                                            style={i => {
                                                if (i === this.state.selected) {
                                                    return { fill: "#46abff" };
                                                } else {
                                                    return { fill: "#cccccc" };
                                                }
                                            }}
                                            allowSelectionClear
                                            onTimeRangeChanged={this.handleSelectionChange}
                                            onTimeRangeClicked={i => this.setState({ selected: i })}
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
                    <div className="col-md-12">
                        <hr />
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Date range</th>
                                    <th scope="col">In Avg</th>
                                    <th scope="col">Out Avg</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.selections.map((tr, i) => {
                                    return (
                                        <tr
                                            key={i}
                                            style={
                                                i === this.state.selected
                                                    ? { background: "#46abff60" }
                                                    : {}
                                            }
                                        >
                                            <td
                                                onClick={() => this.setState({ selected: i })}
                                            >{`${tr.humanize()}`}</td>
                                            <td style={{ padding: 10 }}>{`${formatter(
                                                trafficSeries.crop(tr).avg("in")
                                            )}b`}</td>
                                            <td style={{ padding: 10 }}>{`${formatter(
                                                trafficSeries.crop(tr).avg("out")
                                            )}b`}</td>
                                            <td>
                                                <i
                                                    className="glyphicon glyphicon-remove"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        const selection = this.state.selections;
                                                        this.setState({
                                                            selections: selection.filter(
                                                                (item, j) => j !== i
                                                            ),
                                                            selected: null
                                                        });
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
export default { traffic, traffic_docs, traffic_thumbnail };
