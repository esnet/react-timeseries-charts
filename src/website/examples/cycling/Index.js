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
/* eslint-disable react/prefer-es6-class */

import "moment-duration-format";
import moment from "moment";
import React from "react";
import { format } from "d3-format";

// Pond
import { TimeSeries, TimeRange, avg, filter, percentile, median } from "pondjs";

// Imports from the charts library
import AreaChart from "../../../components/AreaChart";
import Baseline from "../../../components/Baseline";
import BoxChart from "../../../components/BoxChart";
import Brush from "../../../components/Brush";
import ChartContainer from "../../../components/ChartContainer";
import ChartRow from "../../../components/ChartRow";
import Charts from "../../../components/Charts";
import LabelAxis from "../../../components/LabelAxis";
import LineChart from "../../../components/LineChart";
import Resizable from "../../../components/Resizable";
import TimeMarker from "../../../components/TimeMarker";
import ValueAxis from "../../../components/ValueAxis";
import YAxis from "../../../components/YAxis";
import styler from "../../../js/styler";

//
// Build TimeSeries from our data file
//

const data = require("./bike.json");

const pacePoints = [];
const speedPoints = [];
const hrPoints = [];
const altitudePoints = [];
for (let i = 0; i < data.time.length; i += 1) {
    if (i > 0) {
        const deltaTime = data.time[i] - data.time[i - 1];
        const time = data.time[i] * 1000;
        if (deltaTime > 10) {
            speedPoints.push([time - 1000, null]);
            hrPoints.push([time - 1000, null]);
        }
        const speed = (data.distance[i] - data.distance[i - 1]) / (data.time[i] - data.time[i - 1]); // meters/sec
        const speedMph = 2.236941 * speed; // convert m/s to miles/hr
        const hr = data.heartrate[i];
        const altitude = data.altitude[i] * 3.28084; // convert m to ft
        speedPoints.push([time, speedMph]);
        pacePoints.push([time, speedMph]);
        hrPoints.push([time, hr]);
        altitudePoints.push([time, altitude]);
    }
}

const pace = new TimeSeries({
    name: "Pace",
    columns: ["time", "pace"],
    points: pacePoints
});

const hr = new TimeSeries({
    name: "Heartrate",
    columns: ["time", "hr"],
    points: hrPoints
});

const altitude = new TimeSeries({
    name: "Altitude",
    columns: ["time", "altitude"],
    points: altitudePoints
});

const speed = new TimeSeries({
    name: "Speed",
    columns: ["time", "speed"],
    points: speedPoints
});

const speedSmoothed = speed.fixedWindowRollup({
    windowSize: "1m",
    aggregation: {
        speed5mAvg: { speed: avg(filter.ignoreMissing) }
    },
    toEvents: true
});

//
// Styling
//

const style = styler([
    { key: "speed", color: "steelblue", width: 1, opacity: 0.5 },
    { key: "speed5mAvg", color: "#34ACE4", width: 1 },
    { key: "hr", color: "#DD0447", width: 1 },
    { key: "altitude", color: "#e2e2e2" }
]);

const baselineStyles = {
    speed: {
        stroke: "steelblue",
        opacity: 0.5,
        width: 0.25
    },
    hr: {
        stroke: "red",
        opacity: 0.5,
        width: 0.25
    }
};

const speedFormat = format(".1f");

// Max and Avg HR values to show in the LabelAxis
const hrSummaryValues = [
    { label: "Max", value: parseInt(hr.max("hr"), 10) },
    { label: "Avg", value: parseInt(hr.avg("hr"), 10) }
];

// Max and Avg Speed values to show in the LabelAxis
const speedSummaryValues = [
    { label: "Max", value: speedFormat(speed.max("speed")) },
    { label: "Avg", value: speedFormat(speed.avg("speed")) }
];

const cycling = React.createClass({
    getInitialState() {
        const initialRange = new TimeRange([75 * 60 * 1000, 125 * 60 * 1000]);
        return {
            mode: "channels",
            rollup: "1m",
            tracker: null,
            timerange: initialRange,
            brushrange: initialRange
        };
    },
    handleTrackerChanged(t) {
        this.setState({ tracker: t });
    },
    // Handles when the brush changes the timerange
    handleTimeRangeChange(timerange) {
        if (timerange) {
            this.setState({ timerange, brushrange: timerange });
        } else {
            this.setState({ timerange: altitude.range(), brushrange: null });
        }
    },
    handleChartResize(width) {
        this.state({ width });
    },
    renderChart() {
        if (this.state.mode === "multiaxis") {
            return this.renderMultiAxisChart();
        } else if (this.state.mode === "channels") {
            return this.renderChannelsChart();
        } else if (this.state.mode === "rollup") {
            return this.renderBoxChart();
        }

        return <div>No chart</div>;
    },
    renderChannelsChart() {
        const tr = this.state.timerange;
        const speedCropped = speed.crop(tr);
        const hrCropped = hr.crop(tr);

        // Get the speed at the current tracker position
        let speedValue = "--";
        if (this.state.tracker) {
            const speedIndexAtTracker = speedCropped.bisect(new Date(this.state.tracker));
            const speedAtTracker = speedCropped.at(speedIndexAtTracker).get("speed");
            if (speedAtTracker) {
                speedValue = speedFormat(speedAtTracker);
            }
        }

        // Get the heartrate value at the current tracker position
        let hrValue = "--";
        if (this.state.tracker) {
            const hrIndexAtTracker = hrCropped.bisect(new Date(this.state.tracker));
            const hrAtTracker = hrCropped.at(hrIndexAtTracker).get("hr");
            if (hrAtTracker) {
                hrValue = parseInt(hrAtTracker, 10);
            }
        }

        return (
            <ChartContainer
                timeRange={this.state.timerange}
                format="duration"
                trackerPosition={this.state.tracker}
                onTrackerChanged={this.handleTrackerChanged}
                enablePanZoom
                maxTime={pace.range().end()}
                minTime={pace.range().begin()}
                minDuration={10 * 60 * 1000}
                onTimeRangeChanged={this.handleTimeRangeChange}
                onChartResize={this.handleChartResize}
                showGrid={false}
            >
                <ChartRow height="100" debug={false}>
                    <LabelAxis
                        id="speedaxis"
                        label="Speed"
                        values={speedSummaryValues}
                        min={0}
                        max={35}
                        width={140}
                        type="linear"
                        format=",.1f"
                    />
                    <Charts>
                        <LineChart
                            axis="speedaxis"
                            series={speedSmoothed}
                            columns={["speed5mAvg"]}
                            interpolation="curveBasis"
                            style={style}
                            breakLine={false}
                        />
                        <LineChart
                            axis="speedaxis"
                            series={speedCropped}
                            columns={["speed"]}
                            style={style}
                            breakLine
                        />
                        <Baseline
                            style={baselineStyles.speed}
                            axis="speedaxis"
                            value={speed.avg("speed")}
                        />
                    </Charts>
                    <ValueAxis
                        id="speedvalueaxis"
                        value={speedValue}
                        detail="Mph"
                        width={80}
                        min={0}
                        max={35}
                    />
                </ChartRow>
                <ChartRow height="100" debug={false}>
                    <LabelAxis
                        id="hraxis"
                        label="Heart Rate"
                        values={hrSummaryValues}
                        min={60}
                        max={200}
                        width={140}
                        type="linear"
                        format="d"
                    />
                    <Charts>
                        <LineChart
                            axis="hraxis"
                            series={hrCropped}
                            columns={["hr"]}
                            style={style}
                            breakLine
                        />
                        <Baseline axis="hraxis" style={baselineStyles.hr} value={hr.avg("hr")} />
                    </Charts>
                    <ValueAxis
                        id="hrvalueaxis"
                        value={hrValue}
                        detail="BPM"
                        min={60}
                        max={200}
                        width={80}
                    />
                </ChartRow>
            </ChartContainer>
        );
    },
    renderBoxChart() {
        const tr = this.state.timerange;
        const speedCropped = speed.crop(tr);
        const hrCropped = hr.crop(tr);

        // Get the speed at the current tracker position
        let speedValue = "--";
        if (this.state.tracker) {
            const speedIndexAtTracker = speedCropped.bisect(new Date(this.state.tracker));
            const speedAtTracker = speedCropped.at(speedIndexAtTracker).get("speed");
            if (speedAtTracker) {
                speedValue = speedFormat(speedAtTracker);
            }
        }

        // Get the heartrate value at the current tracker position
        let hrValue = "--";
        if (this.state.tracker) {
            const hrIndexAtTracker = hrCropped.bisect(new Date(this.state.tracker));
            const hrAtTracker = hrCropped.at(hrIndexAtTracker).get("hr");
            if (hrAtTracker) {
                hrValue = parseInt(hrAtTracker, 10);
            }
        }

        return (
            <ChartContainer
                timeRange={this.state.timerange}
                format="duration"
                trackerPosition={this.state.tracker}
                onTrackerChanged={this.handleTrackerChanged}
                enablePanZoom
                maxTime={pace.range().end()}
                minTime={pace.range().begin()}
                minDuration={10 * 60 * 1000}
                onTimeRangeChanged={this.handleTimeRangeChange}
                onChartResize={this.handleChartResize}
                showGrid={false}
            >
                <ChartRow height="100" debug={false}>
                    <LabelAxis
                        id="speedaxis"
                        label="Speed"
                        values={speedSummaryValues}
                        min={0}
                        max={35}
                        width={140}
                        type="linear"
                        format=",.1f"
                    />
                    <Charts>
                        <BoxChart
                            axis="speedaxis"
                            series={speed}
                            column="speed"
                            style={style}
                            aggregation={{
                                size: this.state.rollup,
                                reducers: {
                                    outer: [percentile(5), percentile(95)],
                                    inner: [percentile(25), percentile(75)],
                                    center: median()
                                }
                            }}
                        />
                    </Charts>
                    <ValueAxis
                        id="speedvalueaxis"
                        value={speedValue}
                        detail="Mph"
                        width={80}
                        min={0}
                        max={35}
                    />
                </ChartRow>
                <ChartRow height="100" debug={false}>
                    <LabelAxis
                        id="hraxis"
                        label="Heart Rate"
                        values={hrSummaryValues}
                        min={60}
                        max={200}
                        width={140}
                        type="linear"
                        format="d"
                    />
                    <Charts>
                        <BoxChart
                            axis="hraxis"
                            series={hr}
                            column="hr"
                            style={style}
                            aggregation={{
                                size: this.state.rollup,
                                reducers: {
                                    outer: [percentile(5), percentile(95)],
                                    inner: [percentile(25), percentile(75)],
                                    center: median()
                                }
                            }}
                        />
                    </Charts>
                    <ValueAxis
                        id="hrvalueaxis"
                        value={hrValue}
                        detail="BPM"
                        min={60}
                        max={200}
                        width={80}
                    />
                </ChartRow>
            </ChartContainer>
        );
    },
    renderMultiAxisChart() {
        const tr = this.state.timerange;
        const speedBegin = speed.bisect(tr.begin());
        const speedEnd = speed.bisect(tr.end());
        const speedCropped = speed.slice(speedBegin, speedEnd);

        const hrBegin = speed.bisect(tr.begin());
        const hrEnd = speed.bisect(tr.end());
        const hrCropped = hr.slice(hrBegin, hrEnd);

        // Get the speed at the current tracker position
        let speedValue = "--";
        if (this.state.tracker) {
            const speedIndexAtTracker = speedCropped.bisect(new Date(this.state.tracker));
            const speedAtTracker = speedCropped.at(speedIndexAtTracker).get("speed");
            if (speedAtTracker) {
                speedValue = speedFormat(speedAtTracker);
            }
        }

        // Get the heartrate value at the current tracker position
        let hrValue = "--";
        if (this.state.tracker) {
            const hrIndexAtTracker = hrCropped.bisect(new Date(this.state.tracker));
            const hrAtTracker = hrCropped.at(hrIndexAtTracker).get("hr");
            if (hrAtTracker) {
                hrValue = parseInt(hrAtTracker, 10);
            }
        }
        const trackerInfoValues = [
            { label: "Speed", value: speedValue },
            { label: "HR", value: hrValue }
        ];

        return (
            <ChartContainer
                timeRange={this.state.timerange}
                format="duration"
                trackerPosition={this.state.tracker}
                onTrackerChanged={this.handleTrackerChanged}
                enablePanZoom
                maxTime={pace.range().end()}
                minTime={pace.range().begin()}
                minDuration={10 * 60 * 1000}
                onTimeRangeChanged={this.handleTimeRangeChange}
            >
                <ChartRow height="200" trackerInfoValues={trackerInfoValues} trackerInfoHeight={50}>
                    <YAxis
                        id="axis1"
                        label="Speed (mph)"
                        min={0}
                        max={35}
                        width={70}
                        type="linear"
                        format=",.1f"
                    />
                    <YAxis
                        id="axis2"
                        label="Heart Rate (bpm)"
                        min={60}
                        max={200}
                        width={70}
                        type="linear"
                        format="d"
                    />
                    <Charts>
                        <LineChart
                            axis="axis1"
                            series={speedCropped}
                            columns={["speed"]}
                            style={style}
                            breakLine
                        />
                        <LineChart
                            axis="axis2"
                            series={hrCropped}
                            columns={["hr"]}
                            style={style}
                            breakLine
                        />
                        <TimeMarker
                            axis="axis1"
                            time={new Date(1000 * 60 * 94 + 51 * 1000)}
                            infoStyle={{ line: { strokeWidth: "2px", stroke: "#83C2FC" } }}
                            infoValues="Chalk Hill"
                        />
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
    },
    renderBrush() {
        return (
            <ChartContainer
                timeRange={altitude.range()}
                format="duration"
                trackerPosition={this.state.tracker}
            >
                <ChartRow height="100" debug={false}>
                    <Brush
                        timeRange={this.state.brushrange}
                        allowSelectionClear
                        onTimeRangeChanged={this.handleTimeRangeChange}
                    />
                    <YAxis
                        id="axis1"
                        label="Altitude (ft)"
                        min={0}
                        max={altitude.max("altitude")}
                        width={70}
                        type="linear"
                        format="d"
                    />
                    <Charts>
                        <AreaChart
                            axis="axis1"
                            style={style.areaChartStyle()}
                            columns={{ up: ["altitude"], down: [] }}
                            series={altitude}
                        />
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
    },
    renderMode() {
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
            <div className="col-md-6" style={{ fontSize: 14, color: "#777" }}>
                <span
                    style={this.state.mode !== "multiaxis" ? linkStyleActive : linkStyle}
                    onClick={() => this.setState({ mode: "multiaxis" })}
                >
                    Multi-axis
                </span>
                <span> | </span>
                <span
                    style={this.state.mode !== "channels" ? linkStyleActive : linkStyle}
                    onClick={() => this.setState({ mode: "channels" })}
                >
                    Channels
                </span>
                <span> | </span>
                <span
                    style={this.state.mode !== "rollup" ? linkStyleActive : linkStyle}
                    onClick={() => this.setState({ mode: "rollup" })}
                >
                    Rollups
                </span>
                <hr />
            </div>
        );
    },
    renderModeOptions() {
        const linkStyle = {
            fontWeight: 600,
            color: "grey",
            cursor: "default"
        };

        const linkStyleActive = {
            color: "steelblue",
            cursor: "pointer"
        };

        if (this.state.mode === "multiaxis") {
            return <div />;
        } else if (this.state.mode === "channels") {
            return <div />;
        } else if (this.state.mode === "rollup") {
            return (
                <div className="col-md-6" style={{ fontSize: 14, color: "#777" }}>
                    <span
                        style={this.state.rollup !== "1m" ? linkStyleActive : linkStyle}
                        onClick={() => this.setState({ rollup: "1m" })}
                    >
                        1m
                    </span>
                    <span> | </span>
                    <span
                        style={this.state.rollup !== "5m" ? linkStyleActive : linkStyle}
                        onClick={() => this.setState({ rollup: "5m" })}
                    >
                        5m
                    </span>
                    <span> | </span>
                    <span
                        style={this.state.rollup !== "15m" ? linkStyleActive : linkStyle}
                        onClick={() => this.setState({ rollup: "15m" })}
                    >
                        15m
                    </span>
                    <hr />
                </div>
            );
        }
        return <div />;
    },
    render() {
        const chartStyle = {
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#DDD",
            paddingTop: 10,
            marginBottom: 10
        };

        const brushStyle = {
            boxShadow: "inset 0px 2px 5px -2px rgba(189, 189, 189, 0.75)",
            background: "#FEFEFE",
            paddingTop: 10
        };

        return (
            <div>
                <div className="row">
                    {this.renderMode()}
                    {this.renderModeOptions()}
                </div>
                <div className="row">
                    <div
                        className="col-md-12"
                        style={{
                            fontSize: 12,
                            color: "#777",
                            textAlign: "right",
                            marginRight: 50
                        }}
                    >
                        {this.state.tracker
                            ? `${moment.duration(+this.state.tracker).format()}`
                            : "-:--:--"}
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12" style={chartStyle}>
                        <Resizable>
                            {this.renderChart()}
                        </Resizable>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12" style={brushStyle}>
                        <Resizable>
                            {this.renderBrush()}
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
});

// Export example
import cycling_docs from "raw!./cycling_docs.md";
import cycling_thumbnail from "./cycling_thumbnail.png";
export default { cycling, cycling_docs, cycling_thumbnail };
