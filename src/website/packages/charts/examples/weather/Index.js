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
import Moment from "moment";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../../../../components/ChartContainer";
import ChartRow from "../../../../../components/ChartRow";
import Charts from "../../../../../components/Charts";
import YAxis from "../../../../../components/YAxis";
import AreaChart from "../../../../../components/AreaChart";
import LineChart from "../../../../../components/LineChart";
import ScatterChart from "../../../../../components/ScatterChart";
import Resizable from "../../../../../components/Resizable";
import Legend from "../../../../../components/Legend";
import styler from "../../../../../js/styler";

// Weather data
import weatherJSON from "./weather.json";

import weather_docs from "./weather_docs.md";
import weather_thumbnail from "./weather_thumbnail.png";

//
// Read in the weather data
//

const temperaturePoints = [];
const pressurePoints = [];
const windPoints = [];
const gustPoints = [];
const rainPoints = [];
const rainAccumPoints = [];
_.each(weatherJSON, readings => {
    const time = new Moment(readings.Time).toDate().getTime();
    const tempReading = readings.TemperatureF;
    const pressureReading = readings["PressureIn"];
    const windReading = readings["WindSpeedMPH"] === "Calm" ? 0 : readings["WindSpeedMPH"];
    const gustReading = readings["WindSpeedGustMPH"];
    const rainReading = readings["HourlyPrecipIn"] === "N/A" ? 0 : readings["HourlyPrecipIn"];
    const rainAccumReading = readings["dailyrainin"];

    temperaturePoints.push([time, tempReading]);
    pressurePoints.push([time, pressureReading]);

    // Somewhat fake the wind speed...
    windPoints.push([time, windReading * 5]);
    if (gustReading !== "-" && gustReading !== 0) {
        gustPoints.push([time, gustReading * 5 + Math.random() * 2.5 - 2.5, gustReading / 3]);
    }
    rainPoints.push([time, rainReading]);
    rainAccumPoints.push([time, rainAccumReading]);
});

//
// Timeseries
//

const tempSeries = new TimeSeries({
    name: "Temperature",
    columns: ["time", "temp"],
    points: temperaturePoints
});
const pressureSeries = new TimeSeries({
    name: "Pressure",
    columns: ["time", "pressure"],
    points: pressurePoints
});
const windSeries = new TimeSeries({
    name: "Wind",
    columns: ["time", "wind"],
    points: windPoints
});
const gustSeries = new TimeSeries({
    name: "Gust",
    columns: ["time", "gust", "radius"],
    points: gustPoints
});
const rainSeries = new TimeSeries({
    name: "Rain",
    columns: ["time", "rain"],
    points: rainPoints
});
const rainAccumSeries = new TimeSeries({
    name: "Rain Accum",
    columns: ["time", "rainAccum"],
    points: rainAccumPoints
});

//
// Color scheme
//

const scheme = {
    temp: "#CA4040",
    pressure: "#9467bd",
    wind: "#987951",
    gust: "#CC862A",
    rain: "#C3CBD4",
    rainAccum: "#000"
};

const style = styler([
    { key: "temp", color: "#CA4040" },
    { key: "pressure", color: "#9467bd" },
    { key: "wind", color: "#987951" },
    { key: "gust", color: "#CC862A" },
    { key: "rain", color: "#C3CBD4" },
    { key: "rainAccum", color: "#333" }
]);

const linkStyle = {
    fontWeight: 600,
    color: "grey",
    cursor: "default"
};

const linkStyleActive = {
    color: "steelblue",
    cursor: "pointer"
};

//
// Render weather charts
//

class weather extends React.Component {
    state = {
        tracker: null,
        mode: "local"
    };

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12" style={{ fontSize: 14, color: "#777" }}>
                        <span
                            style={this.state.mode === "local" ? linkStyleActive : linkStyle}
                            onClick={() => this.setState({ mode: "utc" })}
                        >
                            UTC
                        </span>
                        <span> | </span>
                        <span
                            style={this.state.mode === "utc" ? linkStyleActive : linkStyle}
                            onClick={() => this.setState({ mode: "local" })}
                        >
                            Local
                        </span>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-10">
                        <Resizable>
                            <ChartContainer
                                utc={this.state.mode === "utc"}
                                timeRange={tempSeries.timerange()}
                                showGridPosition="under"
                                trackerPosition={this.state.tracker}
                                trackerTimeFormat="%X"
                                onTrackerChanged={tracker => this.setState({ tracker })}
                            >
                                <ChartRow height="150">
                                    <YAxis
                                        id="pressure"
                                        label="Pressure (in)"
                                        labelOffset={5}
                                        style={style.axisStyle("pressure")}
                                        min={29.5}
                                        max={30.0}
                                        width="80"
                                        type="linear"
                                        format=",.1f"
                                    />
                                    <Charts>
                                        <LineChart
                                            axis="temp"
                                            series={tempSeries}
                                            columns={["temp"]}
                                            style={style}
                                        />
                                        <LineChart
                                            axis="pressure"
                                            series={pressureSeries}
                                            columns={["pressure"]}
                                            style={style}
                                        />
                                    </Charts>
                                    <YAxis
                                        id="temp"
                                        label="Temperature (°F)"
                                        labelOffset={5}
                                        style={style.axisStyle("temp")}
                                        min={50}
                                        max={70}
                                        width="80"
                                        type="linear"
                                        format=",.1f"
                                    />
                                </ChartRow>

                                <ChartRow height="150">
                                    <YAxis
                                        id="wind"
                                        label="Wind (mph)"
                                        labelOffset={5}
                                        style={{ labelColor: scheme.wind }}
                                        min={0}
                                        max={50}
                                        width="80"
                                        type="linear"
                                        format=",.1f"
                                    />
                                    <Charts>
                                        <LineChart
                                            axis="wind"
                                            series={windSeries}
                                            columns={["wind"]}
                                            interpolation="curveStepBefore"
                                            style={style}
                                        />
                                        <ScatterChart
                                            axis="wind-gust"
                                            series={gustSeries}
                                            columns={["gust"]}
                                            style={style}
                                            radius={event => {
                                                return event.get("radius");
                                            }}
                                        />
                                    </Charts>
                                    <YAxis
                                        id="wind-gust"
                                        label="Wind gust (mph)"
                                        labelOffset={-5}
                                        style={style.axisStyle("gust")}
                                        min={0}
                                        max={50}
                                        width="80"
                                        type="linear"
                                        format=",.1f"
                                    />
                                </ChartRow>

                                <ChartRow height="150">
                                    <YAxis
                                        id="total-rain"
                                        label="Total Precipitation (in)"
                                        style={style.axisStyle("rainAccum")}
                                        labelOffset={5}
                                        min={0}
                                        max={rainAccumSeries.max("rainAccum")}
                                        width="80"
                                        type="linear"
                                        format=",.2f"
                                    />
                                    <Charts>
                                        <AreaChart
                                            axis="rain"
                                            series={rainSeries}
                                            columns={{ up: ["rain"] }}
                                            style={style}
                                            interpolation="curveBasis"
                                            fillOpacity={0.4}
                                        />
                                        <LineChart
                                            axis="total-rain"
                                            series={rainAccumSeries}
                                            columns={["rainAccum"]}
                                            style={style}
                                        />
                                    </Charts>
                                    <YAxis
                                        id="rain"
                                        label="Precipitation (in)"
                                        labelOffset={-5}
                                        style={style.axisStyle("rain")}
                                        min={0}
                                        max={rainSeries.max("rain")}
                                        width="80"
                                        type="linear"
                                        format=",.2f"
                                    />
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                    <div className="col-md-2">
                        <Legend
                            type="line"
                            align="right"
                            stack={true}
                            style={style}
                            categories={[
                                { key: "temp", label: "Temperature" },
                                { key: "pressure", label: "Pressure" },
                                { key: "wind", label: "Wind speed" },
                                { key: "gust", label: "Gust speed", symbolType: "dot" },
                                { key: "rain", label: "Rainfall", symbolType: "swatch" },
                                { key: "rainAccum", label: "Accumulated rainfall" }
                            ]}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
export default { weather, weather_docs, weather_thumbnail };
