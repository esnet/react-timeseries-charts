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
import _ from "underscore";

// Pond
import { TimeSeries, TimeRange, avg, percentile, median } from "pondjs";

// Imports from the charts library
import AreaChart from "../../../../../components/AreaChart";
import Baseline from "../../../../../components/Baseline";
import BoxChart from "../../../../../components/BoxChart";
import Brush from "../../../../../components/Brush";
import ChartContainer from "../../../../../components/ChartContainer";
import ChartRow from "../../../../../components/ChartRow";
import Charts from "../../../../../components/Charts";
import LabelAxis from "../../../../../components/LabelAxis";
import LineChart from "../../../../../components/LineChart";
import Resizable from "../../../../../components/Resizable";
import ValueAxis from "../../../../../components/ValueAxis";
import YAxis from "../../../../../components/YAxis";
import styler from "../../../../../js/styler";
import Legend from "../../../../../components/Legend";

import cycling_docs from "./cycling_docs.md";
import cycling_thumbnail from "./cycling_thumbnail.png";

//
// Load our data file
//

const data = require("./bike.json");

// Styling relates a channel to its rendering properties. In this way you
// can achieve consistent styles across different charts and labels by supplying
// the components with this styler object

const style = styler([
    { key: "distance", color: "#e2e2e2" },
    { key: "altitude", color: "#e2e2e2" },
    { key: "cadence", color: "#ff47ff" },
    { key: "power", color: "green", width: 1, opacity: 0.5 },
    { key: "temperature", color: "#cfc793" },
    { key: "speed", color: "steelblue", width: 1, opacity: 0.5 }
]);

// Baselines are the dotted average lines displayed on the chart
// In this case these are separately styled

const baselineStyles = {
    speed: {
        stroke: "steelblue",
        opacity: 0.5,
        width: 0.25
    },
    power: {
        stroke: "green",
        opacity: 0.5,
        width: 0.25
    }
};

// d3 formatter to display the speed with one decimal place
const speedFormat = format(".1f");

class cycling extends React.Component {
    constructor(props) {
        super(props);
        const initialRange = new TimeRange([75 * 60 * 1000, 125 * 60 * 1000]);

        // Storage for all the data channels
        const channels = {
            distance: {
                units: "miles",
                label: "Distance",
                format: ",.1f",
                series: null,
                show: false
            },
            altitude: { units: "feet", label: "Altitude", format: "d", series: null, show: false },
            cadence: { units: "rpm", label: "Cadence", format: "d", series: null, show: true },
            power: { units: "watts", label: "Power", format: ",.1f", series: null, show: true },
            temperature: { units: "deg F", label: "Temp", format: "d", series: null, show: false },
            speed: { units: "mph", label: "Speed", format: ",.1f", series: null, show: true }
        };

        // Channel names list, in order we want them shown
        const channelNames = ["speed", "power", "cadence", "temperature", "distance", "altitude"];

        // Channels we'll actually display on our charts
        const displayChannels = ["speed", "power", "cadence"];

        // Rollups we'll generate to reduce data for the screen
        const rollupLevels = ["1s", "5s", "15s", "25s"];

        this.state = {
            ready: false,
            mode: "channels",
            channels,
            channelNames,
            displayChannels,
            rollupLevels,
            rollup: "1m",
            tracker: null,
            timerange: initialRange,
            brushrange: initialRange
        };
    }

    componentDidMount() {
        setTimeout(() => {
            const { channelNames, channels, displayChannels, rollupLevels } = this.state;

            //
            // Process the data file into channels
            //

            const points = {};
            channelNames.forEach(channel => {
                points[channel] = [];
            });

            for (let i = 0; i < data.time.length; i += 1) {
                if (i > 0) {
                    const deltaTime = data.time[i] - data.time[i - 1];
                    const time = data.time[i] * 1000;

                    points["distance"].push([time, data.distance[i]]);
                    points["altitude"].push([time, data.altitude[i] * 3.28084]); // convert m to ft
                    points["cadence"].push([time, data.cadence[i]]);
                    points["power"].push([time, data.watts[i]]);
                    points["temperature"].push([time, data.temp[i]]);

                    // insert a null into the speed data to put breaks in the data where
                    // the rider was stationary
                    if (deltaTime > 10) {
                        points["speed"].push([time - 1000, null]);
                    }

                    const speed =
                        (data.distance[i] - data.distance[i - 1]) /
                        (data.time[i] - data.time[i - 1]); // meters/sec
                    points["speed"].push([time, 2.236941 * speed]); // convert m/s to miles/hr
                }
            }

            // Make the TimeSeries here from the points collected above
            for (let channelName of channelNames) {
                // The TimeSeries itself, for this channel
                const series = new TimeSeries({
                    name: channels[channelName].name,
                    columns: ["time", channelName],
                    points: points[channelName]
                });

                if (_.contains(displayChannels, channelName)) {
                    const rollups = _.map(rollupLevels, rollupLevel => {
                        return {
                            duration: parseInt(rollupLevel.split("s")[0], 10),
                            series: series.fixedWindowRollup({
                                windowSize: rollupLevel,
                                aggregation: { [channelName]: { [channelName]: avg() } }
                            })
                        };
                    });

                    // Rollup series levels
                    channels[channelName].rollups = rollups;
                }

                // Raw series
                channels[channelName].series = series;

                // Some simple statistics for each channel
                channels[channelName].avg = parseInt(series.avg(channelName), 10);
                channels[channelName].max = parseInt(series.max(channelName), 10);
            }

            // Min and max time constraints for pan/zoom, along with the smallest timerange
            // the user can zoom into. These are passed into the ChartContainers when we come to
            // rendering.

            const minTime = channels.altitude.series.range().begin();
            const maxTime = channels.altitude.series.range().end();
            const minDuration = 10 * 60 * 1000;

            this.setState({ ready: true, channels, minTime, maxTime, minDuration });
        }, 0);
    }

    handleTrackerChanged = t => {
        this.setState({ tracker: t });
    };

    // Handles when the brush changes the timerange
    handleTimeRangeChange = timerange => {
        const { channels } = this.state;

        if (timerange) {
            this.setState({ timerange, brushrange: timerange });
        } else {
            this.setState({ timerange: channels["altitude"].range(), brushrange: null });
        }
    };

    handleChartResize = width => {
        this.setState({ width });
    };

    handleActiveChange = channelName => {
        const channels = this.state.channels;
        channels[channelName].show = !channels[channelName].show;
        this.setState({ channels });
    };

    renderChart = () => {
        if (this.state.mode === "multiaxis") {
            return this.renderMultiAxisChart();
        } else if (this.state.mode === "channels") {
            return this.renderChannelsChart();
        } else if (this.state.mode === "rollup") {
            return this.renderBoxChart();
        }
        return <div>No chart</div>;
    };

    renderChannelsChart = () => {
        const { timerange, displayChannels, channels, maxTime, minTime, minDuration } = this.state;

        const durationPerPixel = timerange.duration() / 800 / 1000;
        const rows = [];

        for (let channelName of displayChannels) {
            const charts = [];
            let series = channels[channelName].series;
            _.forEach(channels[channelName].rollups, rollup => {
                if (rollup.duration < durationPerPixel * 2) {
                    series = rollup.series.crop(timerange);
                }
            });

            charts.push(
                <LineChart
                    key={`line-${channelName}`}
                    axis={`${channelName}_axis`}
                    series={series}
                    columns={[channelName]}
                    style={style}
                    breakLine
                />
            );
            charts.push(
                <Baseline
                    key={`baseline-${channelName}`}
                    axis={`${channelName}_axis`}
                    style={baselineStyles.speed}
                    value={channels[channelName].avg}
                />
            );

            // Get the value at the current tracker position for the ValueAxis
            let value = "--";
            if (this.state.tracker) {
                const approx =
                    (+this.state.tracker - +timerange.begin()) /
                    (+timerange.end() - +timerange.begin());
                const ii = Math.floor(approx * series.size());
                const i = series.bisect(new Date(this.state.tracker), ii);
                const v = i < series.size() ? series.at(i).get(channelName) : null;
                if (v) {
                    value = parseInt(v, 10);
                }
            }

            // Get the summary values for the LabelAxis
            const summary = [
                { label: "Max", value: speedFormat(channels[channelName].max) },
                { label: "Avg", value: speedFormat(channels[channelName].avg) }
            ];

            rows.push(
                <ChartRow
                    height="100"
                    visible={channels[channelName].show}
                    key={`row-${channelName}`}
                >
                    <LabelAxis
                        id={`${channelName}_axis`}
                        label={channels[channelName].label}
                        values={summary}
                        min={0}
                        max={channels[channelName].max}
                        width={140}
                        type="linear"
                        format=",.1f"
                    />
                    <Charts>{charts}</Charts>
                    <ValueAxis
                        id={`${channelName}_valueaxis`}
                        value={value}
                        detail={channels[channelName].units}
                        width={80}
                        min={0}
                        max={35}
                    />
                </ChartRow>
            );
        }

        return (
            <ChartContainer
                timeRange={this.state.timerange}
                format="relative"
                showGrid={false}
                enablePanZoom
                maxTime={maxTime}
                minTime={minTime}
                minDuration={minDuration}
                trackerPosition={this.state.tracker}
                onTimeRangeChanged={this.handleTimeRangeChange}
                onChartResize={width => this.handleChartResize(width)}
                onTrackerChanged={this.handleTrackerChanged}
            >
                {rows}
            </ChartContainer>
        );
    };

    renderBoxChart = () => {
        const { timerange, displayChannels, channels, maxTime, minTime, minDuration } = this.state;

        const rows = [];

        for (let channelName of displayChannels) {
            const charts = [];
            const series = channels[channelName].series;

            charts.push(
                <BoxChart
                    key={`box-${channelName}`}
                    axis={`${channelName}_axis`}
                    series={series}
                    column={channelName}
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
            );
            charts.push(
                <Baseline
                    key={`baseline-${channelName}`}
                    axis={`${channelName}_axis`}
                    style={baselineStyles.speed}
                    value={channels[channelName].avg}
                />
            );

            // Get the value at the current tracker position for the ValueAxis
            let value = "--";
            if (this.state.tracker) {
                const approx =
                    (+this.state.tracker - +timerange.begin()) /
                    (+timerange.end() - +timerange.begin());
                const ii = Math.floor(approx * series.size());
                const i = series.bisect(new Date(this.state.tracker), ii);
                const v = i < series.size() ? series.at(i).get(channelName) : null;
                if (v) {
                    value = parseInt(v, 10);
                }
            }

            // Get the summary values for the LabelAxis
            const summary = [
                { label: "Max", value: speedFormat(channels[channelName].max) },
                { label: "Avg", value: speedFormat(channels[channelName].avg) }
            ];

            rows.push(
                <ChartRow
                    height="100"
                    visible={channels[channelName].show}
                    key={`row-${channelName}`}
                >
                    <LabelAxis
                        id={`${channelName}_axis`}
                        label={channels[channelName].label}
                        values={summary}
                        min={0}
                        max={channels[channelName].max}
                        width={140}
                        type="linear"
                        format=",.1f"
                    />
                    <Charts>{charts}</Charts>
                    <ValueAxis
                        id={`${channelName}_valueaxis`}
                        value={value}
                        detail={channels[channelName].units}
                        width={80}
                        min={0}
                        max={35}
                    />
                </ChartRow>
            );
        }

        return (
            <ChartContainer
                timeRange={this.state.timerange}
                format="relative"
                showGrid={false}
                enablePanZoom
                maxTime={maxTime}
                minTime={minTime}
                minDuration={minDuration}
                trackerPosition={this.state.tracker}
                onTimeRangeChanged={this.handleTimeRangeChange}
                onChartResize={width => this.handleChartResize(width)}
                onTrackerChanged={this.handleTrackerChanged}
            >
                {rows}
            </ChartContainer>
        );
    };

    renderMultiAxisChart() {
        const { timerange, displayChannels, channels, maxTime, minTime, minDuration } = this.state;

        const durationPerPixel = timerange.duration() / 800 / 1000;

        // Line charts
        const charts = [];
        for (let channelName of displayChannels) {
            let series = channels[channelName].series;
            _.forEach(channels[channelName].rollups, rollup => {
                if (rollup.duration < durationPerPixel * 2) {
                    series = rollup.series.crop(timerange);
                }
            });

            charts.push(
                <LineChart
                    key={`line-${channelName}`}
                    axis={`${channelName}_axis`}
                    visible={channels[channelName].show}
                    series={series}
                    columns={[channelName]}
                    style={style}
                    breakLine
                />
            );
        }

        // Tracker info box
        const trackerInfoValues = displayChannels
            .filter(channelName => channels[channelName].show)
            .map(channelName => {
                const fmt = format(channels[channelName].format);

                let series = channels[channelName].series.crop(timerange);

                let v = "--";
                if (this.state.tracker) {
                    const i = series.bisect(new Date(this.state.tracker));
                    const vv = series.at(i).get(channelName);
                    if (vv) {
                        v = fmt(vv);
                    }
                }

                const label = channels[channelName].label;
                const value = `${v} ${channels[channelName].units}`;

                return { label, value };
            });

        // Axis list
        const axisList = [];
        for (let channelName of displayChannels) {
            const label = channels[channelName].label;
            const max = channels[channelName].max;
            const format = channels[channelName].format;
            const id = `${channelName}_axis`;
            const visible = channels[channelName].show;
            axisList.push(
                <YAxis
                    id={id}
                    key={id}
                    visible={visible}
                    label={label}
                    min={0}
                    max={max}
                    width={70}
                    type="linear"
                    format={format}
                />
            );
        }

        return (
            <ChartContainer
                timeRange={this.state.timerange}
                format="relative"
                trackerPosition={this.state.tracker}
                onTrackerChanged={this.handleTrackerChanged}
                trackerShowTime
                enablePanZoom
                maxTime={maxTime}
                minTime={minTime}
                minDuration={minDuration}
                onTimeRangeChanged={this.handleTimeRangeChange}
            >
                <ChartRow
                    height="200"
                    trackerInfoValues={trackerInfoValues}
                    trackerInfoHeight={10 + trackerInfoValues.length * 16}
                    trackerInfoWidth={140}
                >
                    {axisList}
                    <Charts>{charts}</Charts>
                </ChartRow>
            </ChartContainer>
        );
    }

    renderBrush = () => {
        const { channels } = this.state;
        return (
            <ChartContainer
                timeRange={channels.altitude.series.range()}
                format="relative"
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
                        max={channels.altitude.max}
                        width={70}
                        type="linear"
                        format="d"
                    />
                    <Charts>
                        <AreaChart
                            axis="axis1"
                            style={style.areaChartStyle()}
                            columns={{ up: ["altitude"], down: [] }}
                            series={channels.altitude.series}
                        />
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
    };

    renderMode = () => {
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
            </div>
        );
    };

    renderModeOptions = () => {
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
                </div>
            );
        }
        return <div />;
    };

    render() {
        const { ready, channels, displayChannels } = this.state;

        if (!ready) {
            return <div>{`Building rollups...`}</div>;
        }
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

        // Generate the legend
        const legend = displayChannels.map(channelName => ({
            key: channelName,
            label: channels[channelName].label,
            disabled: !channels[channelName].show
        }));

        return (
            <div>
                <div className="row">
                    {this.renderMode()}
                    {this.renderModeOptions()}
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <Legend
                            type={this.state.mode === "rollup" ? "swatch" : "line"}
                            style={style}
                            categories={legend}
                            onSelectionChange={this.handleActiveChange}
                        />
                    </div>

                    <div className="col-md-6">
                        {this.state.tracker
                            ? `${moment.duration(+this.state.tracker).format()}`
                            : "-:--:--"}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12" style={chartStyle}>
                        <Resizable>
                            {ready ? this.renderChart() : <div>Loading.....</div>}
                        </Resizable>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12" style={brushStyle}>
                        <Resizable>{ready ? this.renderBrush() : <div />}</Resizable>
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
export default { cycling, cycling_docs, cycling_thumbnail };
