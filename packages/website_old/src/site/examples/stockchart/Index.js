/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint-disable */

import * as Immutable from "immutable";
import * as React from "react";

import {
    Collection,
    index,
    indexedEvent,
    time, 
    timeEvent,
    TimeSeries,
    TimeRange } from "pondjs";

import {
    ChartContainer,
    ChartRow,
    Charts,
    YAxis,
    LineChart,
    BarChart,
    Resizable
} from "react-timeseries-charts";

import aapl from "./aapl_historical.json";
import stockchart_docs from "./stockchart_docs.md";
import stockchart_thumbnail from "./stockchart_thumbnail.png";

//
// Price: High, low, open, close
//

const columns = ["time", "open", "close", "low", "high"];
const w = Immutable.List(aapl);
const events = w.map(item => {
    const { open, close, low, high } = item;
    return timeEvent(
        time(new Date(item.date)),
        Immutable.Map({
            open: +open,
            close: +close,
            low: +low,
            high: +high
        })
    );
});
const priceCollection = new Collection(events);
const sortedCollection = priceCollection.sortByKey();
const series = new TimeSeries({ 
    name: "AAPL-price", 
    columns, 
    collection: sortedCollection 
});

//
// Volume
//

const volumeEvents = w.map(item => {
    const date = item.date.replace(/\//g, "-");
    const { volume } = item;
    return indexedEvent(
        index(date), 
        Immutable.Map({ volume: +volume })
    );
});

const volumeCollection = new Collection(volumeEvents);
const sortedVolumeCollection = volumeCollection.sortByKey();
const seriesVolume = new TimeSeries({
    name: "AAPL-volume",
    collection: sortedVolumeCollection
});

class stockchart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "log",
            timerange: new TimeRange([1236985288649, 1326654398343])
        };
    }

    handleTimeRangeChange = timerange => {
        this.setState({ timerange });
    };

    setModeLinear = () => {
        this.setState({ mode: "linear" });
    };

    setModeLog = () => {
        this.setState({ mode: "log" });
    };

    renderChart = () => {
        const { timerange } = this.state;
        const croppedSeries = series.crop(timerange);
        const croppedVolumeSeries = seriesVolume.crop(timerange);
        return (
            <ChartContainer
                timeRange={timerange}
                enablePanZoom={true}
                onTimeRangeChanged={this.handleTimeRangeChange}
            >
                <ChartRow height="300">
                    <Charts>
                        <LineChart
                            axis="y"
                            style={{ close: { normal: { stroke: "steelblue" } } }}
                            columns={["close"]}
                            series={croppedSeries}
                            interpolation="curveBasis"
                        />
                    </Charts>
                    <YAxis
                        id="y"
                        label="Price ($)"
                        min={croppedSeries.min("close")}
                        max={croppedSeries.max("close")}
                        format=",.0f"
                        width="60"
                        type={this.state.mode}
                    />
                </ChartRow>
                <ChartRow height="200">
                    <Charts>
                        <BarChart
                            axis="y"
                            style={{ volume: { normal: { stroke: "steelblue" } } }}
                            columns={["volume"]}
                            series={croppedVolumeSeries}
                        />
                    </Charts>
                    <YAxis
                        id="y"
                        label="Volume"
                        min={croppedVolumeSeries.min("volume")}
                        max={croppedVolumeSeries.max("volume")}
                        width="60"
                    />
                </ChartRow>
            </ChartContainer>
        );
    };

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

                <hr />

                <div className="row">
                    <div className="col-md-12" style={{ fontSize: 14, color: "#777" }}>
                        <span
                            style={this.state.mode === "log" ? linkStyleActive : linkStyle}
                            onClick={this.setModeLinear}
                        >
                            Linear
                        </span>
                        <span> | </span>
                        <span
                            style={this.state.mode === "linear" ? linkStyleActive : linkStyle}
                            onClick={this.setModeLog}
                        >
                            Log
                        </span>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>{this.renderChart()}</Resizable>
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
export default { stockchart, stockchart_docs, stockchart_thumbnail };
