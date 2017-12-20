/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";

// Pond
import { TimeSeries, Index } from "pondjs";

// Imports from the charts library
import { ChartContainer, ChartRow, Charts, YAxis, BarChart, Resizable, styler } from "react-timeseries-charts";

/// Ignore these next two lines
import barchart_docs from "./barchart_docs.md";
import barchart_thumbnail from "./barchart_thumbnail.png";
///

const data = [
    ["2017-01-24 00:00", 0.01],
    ["2017-01-24 01:00", 0.13],
    ["2017-01-24 02:00", 0.07],
    ["2017-01-24 03:00", 0.04],
    ["2017-01-24 04:00", 0.33],
    ["2017-01-24 05:00", 0.2],
    ["2017-01-24 06:00", 0.08],
    ["2017-01-24 07:00", 0.54],
    ["2017-01-24 08:00", 0.95],
    ["2017-01-24 09:00", 1.12],
    ["2017-01-24 10:00", 0.66],
    ["2017-01-24 11:00", 0.06],
    ["2017-01-24 12:00", 0.3],
    ["2017-01-24 13:00", 0.05],
    ["2017-01-24 14:00", 0.5],
    ["2017-01-24 15:00", 0.24],
    ["2017-01-24 16:00", 0.02],
    ["2017-01-24 17:00", 0.98],
    ["2017-01-24 18:00", 0.46],
    ["2017-01-24 19:00", 0.8],
    ["2017-01-24 20:00", 0.39],
    ["2017-01-24 21:00", 0.4],
    ["2017-01-24 22:00", 0.39],
    ["2017-01-24 23:00", 0.28]
];

const series = new TimeSeries({
    name: "hilo_rainfall",
    columns: ["index", "precip"],
    points: data.map(([d, value]) => [Index.getIndexString("1h", new Date(d)), value])
});

const barchart = React.createClass({
    displayName: "BarChartExample",
    render() {
        const style = styler([{ key: "precip", color: "#A5C8E1", selected: "#2CB1CF" }]);

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <b>BarChart</b>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer timeRange={series.range()}>
                                <ChartRow height="150">
                                    <YAxis
                                        id="rain"
                                        label="Rainfall (inches/hr)"
                                        min={0}
                                        max={1.5}
                                        format=".2f"
                                        width="70"
                                        type="linear"
                                    />
                                    <Charts>
                                        <BarChart
                                            axis="rain"
                                            style={style}
                                            spacing={1}
                                            columns={["precip"]}
                                            series={series}
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
});

// Export example
export default { barchart, barchart_docs, barchart_thumbnail };
