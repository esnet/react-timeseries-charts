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
import d3 from "d3";
import Highlighter from "./highlighter";
import moment from "moment";
import "moment-duration-format";

// Pond
import { TimeSeries, TimeRange } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import LineChart from "../../src/linechart";
import AreaChart from "../../src/areachart";
import Resizable from "../../src/resizable";
import Brush from "../../src/brush";
import LabelAxis from "../../src/labelaxis";
import ValueAxis from "../../src/valueaxis";
import Baseline from "../../src/baseline";

import "./channels.css";

// Data
const data = require("../data/bike.json");

const pacePoints = [];
const speedPoints = [];
const hrPoints = [];
const altitudePoints = [];

for (let i = 0; i < data.time.length; i++) {
    if (i > 0) {
        const deltaTime = data.time[i] - data.time[i - 1];
        const time = data.time[i] * 1000;
        if (deltaTime > 10) {
            speedPoints.push([time - 1000, null]);
            hrPoints.push([time - 1000, null]);
        }
        const speed = (data.distance[i] - data.distance[i - 1]) /
                      (data.time[i] - data.time[i - 1]);  // meters/sec
        const speedMph = 2.236941 * speed;  // convert m/s to miles/hr
        // const pace = speedMph > 0.1 ? 60 / speedMph : null; // convert miles/hr to mins/mile
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

const paceStyle = {
    color: "steelblue",
    width: 1
};

const paceBaselineStyle = {
    stroke: "steelblue",
    opacity: 0.5,
    width: 0.25
};

const hrStyle = {
    color: "red",
    width: 1
};

const hrBaselineStyle = {
    stroke: "red",
    opacity: 0.5,
    width: 0.25
};

const speedFormat = d3.format(".1f");

// Max and Avg HR values to show in the LabelAxis
const hrSummaryValues = [
    {label: "Max", value: parseInt(hr.max("hr"), 10)},
    {label: "Avg", value: parseInt(hr.avg("hr"), 10)}
];

// Max and Avg Speed values to show in the LabelAxis
const speedSummaryValues = [
    {label: "Max", value: speedFormat(speed.max("speed"))},
    {label: "Avg", value: speedFormat(speed.avg("speed"))}
];

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            mode: "channels",
            tracker: null,
            timerange: new TimeRange([75 * 60 * 1000, 125 * 60 * 1000])
        };
    },

    handleTrackerChanged(t) {
        this.setState({tracker: t});
    },

    handleTimeRangeChange(timerange) {
        this.setState({timerange});
    },

    renderDescription() {
        return (
            <div>
                <h3>Brushing example</h3>
                This example shows a 112 mile bike ride as two channels of data: speed and heart rate.
                We can display this as two overlaid lines, with multiple axes. Or as a channel display.

                It demonstrates:
                <ul>
                    <li>Broken lines for missing data</li>
                    <li>Pan and zoom: Drag to pan, scrollwheel to zoom</li>
                    <li>Brushing over an elevation chart: drag and resize the blue rectangle to pan and zoom</li>
                    <li>Multiple axis</li>
                    <li>Channel LabelAxis and ValueAxis</li>
                </ul>
            </div>
        );
    },

    renderChart() {
        if (this.state.mode === "multiaxis") {
            return this.renderMultiAxisChart();
        } else if (this.state.mode === "channels") {
            return this.renderChannelsChart();
        }

        return (
            <div>No chart</div>
        );
    },

    renderChannelsChart() {
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

        return (
            <ChartContainer
                timeRange={this.state.timerange}
                format="relative"
                trackerPosition={this.state.tracker}
                onTrackerChanged={this.handleTrackerChanged}
                enablePanZoom={true}
                maxTime={pace.range().end()}
                minTime={pace.range().begin()}
                minDuration={10 * 60 * 1000}
                onTimeRangeChanged={this.handleTimeRangeChange}
                showGrid={true} >
                <ChartRow height="100" debug={false}>
                    <LabelAxis
                        id="speedaxis"
                        label="Speed"
                        values={speedSummaryValues}
                        min={0} max={35}
                        width={140}
                        type="linear" format=",.1f"/>
                    <Charts>
                        <LineChart
                            axis="speedaxis"
                            series={speedCropped}
                            style={paceStyle}
                            breakLine={true}
                            tension={0.1} />
                        <Baseline
                            style={paceBaselineStyle}
                            axis="speedaxis"
                            value={speed.avg("speed")}/>
                    </Charts>
                    <ValueAxis
                        id="speedvalueaxis"
                        value={speedValue}
                        detail="Mph"
                        width={80}
                        min={0} max={35} />
                </ChartRow>
                <ChartRow height="100" debug={false}>
                    <LabelAxis
                        id="hraxis"
                        label="Heart Rate"
                        values={hrSummaryValues}
                        min={60} max={200}
                        width={140}
                        type="linear" format="d"/>
                    <Charts>
                        <LineChart
                            axis="hraxis"
                            series={hrCropped}
                            style={hrStyle}
                            breakLine={true}
                            tension={0.1} />
                        <Baseline
                            axis="hraxis"
                            style={hrBaselineStyle}
                            value={hr.avg("hr")}/>
                    </Charts>
                    <ValueAxis
                        id="hrvalueaxis"
                        value={hrValue}
                        detail="BPM"
                        min={60} max={200}
                        width={80} />
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

        // Max and Avg Speed values to show in the LabelAxis


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
        const trackerValues = [
            {label: "Speed", value: speedValue},
            {label: "HR", value: hrValue}
        ];

        return (
            <ChartContainer
                timeRange={this.state.timerange}
                format="relative"
                trackerPosition={this.state.tracker}
                onTrackerChanged={this.handleTrackerChanged}
                trackerValues={trackerValues}
                trackerHintHeight={50}
                enablePanZoom={true}
                maxTime={pace.range().end()}
                minTime={pace.range().begin()}
                minDuration={10 * 60 * 1000}
                onTimeRangeChanged={this.handleTimeRangeChange}
                showGrid={true} >
                <ChartRow height="200" debug={false}>
                    <YAxis
                        id="axis1"
                        label="Speed (mph)"
                        min={0} max={35}
                        width={70}
                        type="linear" format=",.1f"/>
                    <YAxis
                        id="axis2"
                        label="Heart Rate (bpm)"
                        min={60} max={200}
                        width={70}
                        type="linear" format="d"/>
                    <Charts>
                        <LineChart
                            axis="axis1"
                            series={speedCropped}
                            style={paceStyle}
                            breakLine={true}/>
                        <LineChart
                            axis="axis2"
                            series={hrCropped}
                            style={hrStyle}
                            breakLine={true}/>
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
    },

    renderBrush() {
        return (
            <ChartContainer
                timeRange={altitude.range()}
                format="relative"
                trackerPosition={this.state.tracker}>
                <ChartRow height="100" debug={false}>
                    <Brush
                        timeRange={this.state.timerange}
                        onTimeRangeChanged={this.handleTimeRangeChange} />
                    <YAxis
                        id="axis1"
                        label="Altitude (ft)"
                        min={0} max={altitude.max("altitude")}
                        width={70} type="linear" format="d"/>
                    <Charts>
                        <AreaChart
                            axis="axis1"
                            style={{up: ["#DDD"]}}
                            columns={{up: ["altitude"], down: []}}
                            series={altitude} />
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
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
            boxShadow: "inset 0px 2px 5px -2px rgba(189, 189, 189, 0.75);",
            background: "#FEFEFE",
            paddingTop: 10
        };

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
                        {this.renderDescription()}
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12" style={{fontSize: 14, color: "#777"}}>
                        <span
                            style={this.state.mode === "channels" ? linkStyleActive : linkStyle}
                            onClick={() => this.setState({mode: "multiaxis"})}>
                                Multi-axis
                        </span>
                        <span> | </span>
                        <span
                            style={this.state.mode === "multiaxis" ? linkStyleActive : linkStyle}
                            onClick={() => this.setState({mode: "channels"})}>
                                Channels
                        </span>
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12" style={{fontSize: 12, color: "#777", textAlign: "right", marginRight: 50}}>
                        {this.state.tracker ? `${moment.duration(+this.state.tracker).format()}` : "-:--:--"}
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
