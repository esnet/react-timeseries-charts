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
import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../../../../components/ChartContainer";
import ChartRow from "../../../../../components/ChartRow";
import Charts from "../../../../../components/Charts";
import YAxis from "../../../../../components/YAxis";
import LineChart from "../../../../../components/LineChart";
import Baseline from "../../../../../components/Baseline";
import Legend from "../../../../../components/Legend";
import Resizable from "../../../../../components/Resizable";
import styler from "../../../../../js/styler";

import currency_docs from "./currency_docs.md";
import currency_thumbnail from "./currency_thumbnail.png";

// Data
const aud = require("./usd_vs_aud.json");
const euro = require("./usd_vs_euro.json");

function buildPoints() {
    const audPoints = aud.widget[0].data.reverse();
    const euroPoints = euro.widget[0].data.reverse();
    let points = [];
    for (let i = 0; i < audPoints.length; i++) {
        points.push([audPoints[i][0], audPoints[i][1], euroPoints[i][1]]);
    }
    return points;
}

const currencySeries = new TimeSeries({
    name: "Currency",
    columns: ["time", "aud", "euro"],
    points: buildPoints()
});

const style = styler([
    { key: "aud", color: "steelblue", width: 2 },
    { key: "euro", color: "#F68B24", width: 2 }
]);

class CrossHairs extends React.Component {
    render() {
        const { x, y } = this.props;
        const style = { pointerEvents: "none", stroke: "#ccc" };
        if (!_.isNull(x) && !_.isNull(y)) {
            return (
                <g>
                    <line style={style} x1={0} y1={y} x2={this.props.width} y2={y} />
                    <line style={style} x1={x} y1={0} x2={x} y2={this.props.height} />
                </g>
            );
        } else {
            return <g />;
        }
    }
}

class currency extends React.Component {
    state = {
        tracker: null,
        timerange: currencySeries.range(),
        x: null,
        y: null
    };

    handleTrackerChanged = tracker => {
        if (!tracker) {
            this.setState({ tracker, x: null, y: null });
        } else {
            this.setState({ tracker });
        }
    };

    handleTimeRangeChange = timerange => {
        this.setState({ timerange });
    };

    handleMouseMove = (x, y) => {
        this.setState({ x, y });
    };

    render() {
        const f = format("$,.2f");
        const range = this.state.timerange;

        let euroValue, audValue;
        if (this.state.tracker) {
            const index = currencySeries.bisect(this.state.tracker);
            const trackerEvent = currencySeries.at(index);
            audValue = `${f(trackerEvent.get("aud"))}`;
            euroValue = `${f(trackerEvent.get("euro"))}`;
        }

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={range}
                                timeAxisStyle={{
                                    ticks: {
                                        stroke: "#AAA",
                                        opacity: 0.25,
                                        "stroke-dasharray": "1,1"
                                        // Note: this isn't in camel case because this is
                                        // passed into d3's style
                                    },
                                    values: {
                                        fill: "#AAA",
                                        "font-size": 12
                                    }
                                }}
                                showGrid={true}
                                paddingRight={100}
                                maxTime={currencySeries.range().end()}
                                minTime={currencySeries.range().begin()}
                                timeAxisAngledLabels={true}
                                timeAxisHeight={65}
                                onTrackerChanged={this.handleTrackerChanged}
                                onBackgroundClick={() => this.setState({ selection: null })}
                                enablePanZoom={true}
                                onTimeRangeChanged={this.handleTimeRangeChange}
                                onMouseMove={(x, y) => this.handleMouseMove(x, y)}
                                minDuration={1000 * 60 * 60 * 24 * 30}
                            >
                                <ChartRow height="400">
                                    <YAxis
                                        id="y"
                                        label="Price ($)"
                                        min={0.5}
                                        max={1.5}
                                        style={{
                                            ticks: {
                                                stroke: "#AAA",
                                                opacity: 0.25,
                                                "stroke-dasharray": "1,1"
                                                // Note: this isn't in camel case because this is
                                                // passed into d3's style
                                            }
                                        }}
                                        showGrid
                                        hideAxisLine
                                        width="60"
                                        type="linear"
                                        format="$,.2f"
                                    />
                                    <Charts>
                                        <LineChart
                                            axis="y"
                                            breakLine={false}
                                            series={currencySeries}
                                            columns={["aud", "euro"]}
                                            style={style}
                                            interpolation="curveBasis"
                                            highlight={this.state.highlight}
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })
                                            }
                                            selection={this.state.selection}
                                            onSelectionChange={selection =>
                                                this.setState({ selection })
                                            }
                                        />
                                        <CrossHairs x={this.state.x} y={this.state.y} />
                                        <Baseline
                                            axis="y"
                                            value={1.0}
                                            label="USD Baseline"
                                            position="right"
                                        />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <span>
                            <Legend
                                type="line"
                                align="right"
                                style={style}
                                highlight={this.state.highlight}
                                onHighlightChange={highlight => this.setState({ highlight })}
                                selection={this.state.selection}
                                onSelectionChange={selection => this.setState({ selection })}
                                categories={[
                                    { key: "aud", label: "AUD", value: audValue },
                                    { key: "euro", label: "Euro", value: euroValue }
                                ]}
                            />
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
export default { currency, currency_docs, currency_thumbnail };
