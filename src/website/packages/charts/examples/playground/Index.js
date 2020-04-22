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
import LineChart from "../../../../../components/LineChart";
import YAxis from "../../../../../components/YAxis";
import Resizable from "../../../../../components/Resizable";
import styler from "../../../../../js/styler";

// Weather data
import weatherJSON from "./weather.json";

//
// Read in the weather data and add some randomness and intensity for fun
//

const points = [];
_.each(weatherJSON, readings => {
    const time = new Moment(readings.Time).toDate().getTime();
    const reading = readings["WindSpeedGustMPH"];
    if (reading !== "-" && reading !== 0) {
        points.push([
            time,
            reading * 5 + Math.random() * 2.5 - 2.5,
            reading * 3 + Math.random() * 4 - 2
        ]);
    }
});

//
// Timeseries
//

const series = new TimeSeries({
    name: "Gust",
    columns: ["time", "station1", "station2"],
    points
});

//
// Render scatter chart
//

class playground extends React.Component {
    state = {
        hover: null,
        highlight: null,
        selection: null,
        tracker: null,
        timerange: series.range()
    };

    handleSelectionChanged = point => {
        this.setState({
            selection: point
        });
    };

    handleMouseNear = point => {
        this.setState({
            highlight: point
        });
    };

    /**
     * This is the click handler of the parent DOM container.  This should fire regardless of a chart being clicked
     * or the container (meaning that all charts should be allowing event propagation).
     * @param event
     */
    handleDomContainerClick = event => {
        console.log("PARENT DOM CONTAINER MOUSE CLICK - BUBBLED UP TO HERE", event);
    };

    /**
     * Works as designed, though the logic in the ChartContainer has changed to detect placement of the DOM element
     * that was the event target to determine if the function bound to the onBackgroundClick property should be fired.
     *
     * @param event
     */
    handleChartContainerMouseClick = event => {
        console.log("CHART CONTAINER MOUSE CLICK", event);
        this.setState({ selection: null });
    };

    render() {
        let infoValues = [];
        const lineBaseStyle = styler(series.columns(), "RdBu").lineChartStyle();
        const lineStyle = {};
        for (const column in lineBaseStyle) {
            lineStyle[column] = {
                normal: {
                    // stroke: "steelblue",
                    strokeWidth: 10,
                    opacity: 0.6
                },
                highlighted: {
                    // stroke: "steelblue",
                    strokeWidth: 10,
                    opacity: 1.0
                },
                selected: {
                    // stroke: "steelblue",
                    strokeWidth: 10,
                    opacity: 1.0
                },
                muted: {
                    // stroke: "steelblue",
                    strokeWidth: 10,
                    opacity: 0.3
                }
            };
        }
        let lineChartSelection = null;
        let lineChartHighlight = null;
        if (_.isString(this.state.selection)) {
            lineChartSelection = this.state.selection;
        }
        if (_.isString(this.state.highlight)) {
            lineChartHighlight = this.state.highlight;
        }

        const timeAxisStyle = {
            values: { valueColor: "Green", valueWeight: 200, valueSize: 12 }
        };

        const YAxisStyle = {
            axis: { axisColor: "#C0C0C0" },
            label: { labelColor: "Blue", labelWeight: 100, labelSize: 12 },
            values: { valueSize: 12 }
        };

        return (
            <div onClick={this.handleDomContainerClick}>
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={this.state.timerange}
                                timeAxisStyle={timeAxisStyle}
                                trackerPosition={this.state.tracker}
                                trackerStyle={{
                                    box: {
                                        fill: "black",
                                        color: "#DDD"
                                    },
                                    line: {
                                        stroke: "red",
                                        strokeDasharray: 10
                                    }
                                }}
                                maxTime={series.range().end()}
                                minTime={series.range().begin()}
                                enablePanZoom={true}
                                onBackgroundClick={this.handleChartContainerMouseClick}
                                onTimeRangeChanged={timerange => this.setState({ timerange })}
                                onTrackerChanged={tracker => this.setState({ tracker })}
                            >
                                <ChartRow
                                    height="150"
                                    debug={false}
                                    trackerInfoWidth={125}
                                    trackerInfoHeight={30}
                                    trackerInfoValues={infoValues}
                                >
                                    <YAxis
                                        id="wind-gust"
                                        label="Wind gust (mph)"
                                        labelOffset={-5}
                                        min={0}
                                        max={series.max("station1")}
                                        style={YAxisStyle}
                                        width="70"
                                        type="linear"
                                        format=",.1f"
                                    />
                                    <Charts>
                                        <LineChart
                                            axis={"wind-gust"}
                                            series={series}
                                            columns={series.columns()}
                                            selection={lineChartSelection}
                                            highlight={lineChartHighlight}
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })
                                            }
                                            onSelectionChange={selection =>
                                                this.setState({ selection })
                                            }
                                            style={lineStyle}
                                            interpolation={"curveBasis"}
                                            breakLine={true}
                                        />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
export default { playground };
