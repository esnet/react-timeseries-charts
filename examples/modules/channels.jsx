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
import Markdown from "react-markdown";
import Highlighter from "./highlighter";
import _ from "underscore";

// Pond
import { TimeSeries, TimeRange } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import LineChart from "../../src/linechart";
import AreaChart from "../../src/areachart";
import ScatterChart from "../../src/scatterchart";
import Baseline from "../../src/baseline";
import Legend from "../../src/legend";
import Resizable from "../../src/resizable";

// Data
const data = require("../data/bike.json");
const start = 1343488020000;

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
        const pace = speedMph > 0.1 ? 60 / speedMph : null; // convert miles/hr to mins/mile
        const hr = data.heartrate[i];
        const altitude = data.altitude[i] * 3.28084; // convert m to ft

        speedPoints.push([time, speedMph]);
        pacePoints.push([time, speedMph]);
        hrPoints.push([time, hr]);
        altitudePoints.push([time, altitude]);
    }
}

const pace = new TimeSeries({
    name: "Activity",
    columns: ["time", "pace"],
    points: pacePoints
});

const hr = new TimeSeries({
    name: "Activity",
    columns: ["time", "hr"],
    points: hrPoints
});

const altitude = new TimeSeries({
    name: "Activity",
    columns: ["time", "altitude"],
    points: altitudePoints
});

const speed = new TimeSeries({
    name: "Activity",
    columns: ["time", "altitude"],
    points: speedPoints
});

const paceStyle = {
    color: "steelblue"
};

const hrStyle = {
    color: "red"
};

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            tracker: null,
            timerange: new TimeRange([0, 120 * 60 * 1000])
        };
    },

    handleTrackerChanged(t) {
        this.setState({tracker: t});
    },

    handleTimeRangeChange(timerange) {
        this.setState({timerange: timerange});
    },

    render() {
        const tr = this.state.timerange;
        const speedBegin = speed.bisect(tr.begin());
        const speedEnd = speed.bisect(tr.end());
        const speedCropped = speed.slice(speedBegin, speedEnd);

        const hrBegin = speed.bisect(tr.begin());
        const hrEnd = speed.bisect(tr.end());
        const hrCropped = hr.slice(hrBegin, hrEnd);

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Cycling example</h3>
                        This example shows an activity (a 112 mile bike ride) as multiple channels of data.
                        It demonstrates broken line capability with the line charts. Drag to pan, scrollwheel
                        to zoom.
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
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
                                margin={0} padding={0} >
                                <ChartRow height="200" debug={false}>
                                    <YAxis
                                        id="axis1"
                                        label="Speed (mph)"
                                        min={0} max={35}
                                        width="60"
                                        type="linear" format=",.1f"/>
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
                                    <YAxis
                                        id="axis2"
                                        label="Heart Rate (bpm)"
                                        min={60} max={200}
                                        width="80"
                                        type="linear" format="d"/>
                                </ChartRow>
                                <ChartRow height="100" debug={false}>
                                    <YAxis
                                        id="axis1"
                                        label="Altitude (ft)"
                                        min={0} max={altitude.max("altitude")}
                                        width="60" type="linear" format="d"/>
                                    <Charts>
                                        <AreaChart axis="axis1" columns={{up: ["altitude"], down: []}} series={altitude} />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>

            </div>
        );
    }
});
