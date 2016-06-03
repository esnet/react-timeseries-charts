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
import Highlighter from "./highlighter";
import APIDocs from "./docs";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import LineChart from "../../src/linechart";
import Baseline from "../../src/baseline";
import Resizable from "../../src/resizable";

// Data
const data = require("../data/usd_vs_euro.json");

const series = new TimeSeries({
    name: "AUD",
    columns: ["time", "value"],
    points: data.widget[0].data
});

const style = {
    value: {
        stroke: "#a02c2c"
    }
};

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            tracker: null,
            timerange: series.range()
        };
    },

    handleTrackerChanged(tracker) {
        this.setState({tracker});
    },

    handleTimeRangeChange(timerange) {
        this.setState({timerange});
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Baseline Example</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer timeRange={series.range()} >
                                <ChartRow height="150">
                                    <YAxis id="price" label="Price ($)" min={series.min()} max={series.max()} width="60" format="$,.2f"/>
                                    <Charts>
                                        <LineChart axis="price" series={series} style={style}/>
                                        <Baseline axis="price" value={series.avg()} label="Avg" position="right"/>
                                        <Baseline axis="price" value={series.avg() - series.stdev()}/>
                                        <Baseline axis="price" value={series.avg() + series.stdev()}/>
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <APIDocs file="src/baseline.jsx"/>
                    </div>
                </div>
            </div>
        );
    }
});
