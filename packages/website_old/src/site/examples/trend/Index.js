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
import { indexedSeries } from "pondjs";
import styler, {
    ChartContainer,
    ChartRow,
    Charts,
    YAxis,
    BandChart,
    LineChart,
    Resizable
} from "react-timeseries-charts";

import data from "./data.json";
import trend_docs from "./trend_docs.md";
import trend_thumbnail from "./trend_thumbnail.png";

const series = indexedSeries({
    name: "series",
    columns: ["index", "t", "median"],
    points: data.map(({ date, pct05, pct25, pct50, pct75, pct95 }) => [
        date,
        [pct05 / 1000, pct25 / 1000, pct75 / 1000, pct95 / 1000],
        pct50 / 1000
    ])
});

const style = styler([
    { key: "t", color: "steelblue", width: 1, opacity: 1 },
    { key: "median", color: "#333", width: 1 }
]);

class trend extends React.Component {
    render() {
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
                                <ChartRow height="500">
                                    <YAxis
                                        id="t-axis"
                                        label="time (s)"
                                        min={0}
                                        max={18}
                                        format="d"
                                        width="70"
                                        type="linear"
                                    />
                                    <Charts>
                                        <BandChart
                                            axis="t-axis"
                                            series={series}
                                            column="t"
                                            style={style}
                                            spacing={1}
                                            interpolation="curveBasis"
                                        />
                                        <LineChart
                                            axis="t-axis"
                                            style={style}
                                            spacing={1}
                                            columns={["median"]}
                                            interpolation="curveBasis"
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
}

// Export example
export default { trend, trend_docs, trend_thumbnail };
