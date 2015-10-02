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

import React from "react/addons";
import _ from "underscore";
import Moment from "moment";
import Markdown from "react-markdown";
import Highlighter from "./highlighter";

// Pond
import {TimeSeries} from "@esnet/pond";

// Imports from the charts library
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import AreaChart from "../../src/areachart";
import LineChart from "../../src/linechart";
import ScatterChart from "../../src/scatterchart";
import Resizable from "../../src/resizable";

// Weather data
import weatherJSON from "../data/weather.json";

// Docs text
import text from "raw!../../docs/scatterchart.md";

//
// Read in the weather data and add some randomness and intensity for fun
//

const points = [];
_.each(weatherJSON, readings => {
    const time = new Moment(readings.Time).toDate().getTime();
    const reading = readings["WindSpeedGustMPH"];
    if (reading !== "-" && reading !== 0) {
        points.push([time, reading * 5 + Math.random() * 2.5 - 2.5, reading / 2]);
    }
});

//
// Timeseries
//

const series = new TimeSeries({
    name: "Gust",
    columns: ["time", "value", "radius"],
    points: points
});


//
// Render scatter chart
//

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            markdown: text,
        };
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>ScatterChart</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer timeRange={series.range()} padding="10">
                                <ChartRow height="150" debug={false}>
                                    <YAxis id="wind-gust" label="Wind gust (mph)" labelOffset={-5}
                                           min={0} max={series.max()} width="100" type="linear" format=",.1f"/>
                                    <Charts>
                                        <ScatterChart axis="wind-gust" series={series} style={{color: "steelblue", opacity: 0.5}} />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={this.state.markdown}/>
                    </div>
                </div>
            </div>
        );
    }
});
