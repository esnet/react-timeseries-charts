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
import { timeSeries } from "pondjs";
import { ChartContainer, ChartRow, Charts, YAxis, LineChart, Baseline, Resizable } from "react-timeseries-charts";

import baselines_docs from "./baselines_docs.md";
import baselines_thumbnail from "./baselines_thumbnail.png";

// Data
const data = require("./usd_vs_euro.json");
const points = data.widget[0].data.reverse();
const series = timeSeries({
    name: "USD_vs_EURO",
    columns: ["time", "value"],
    points
});

const style = {
    value: {
        stroke: "#a02c2c",
        opacity: 0.2
    }
};

const baselineStyle = {
    line: {
        stroke: "steelblue",
        strokeWidth: 1
    }
};

const baselineStyleLite = {
    line: {
        stroke: "steelblue",
        strokeWidth: 1,
        opacity: 0.5
    }
};

class baselines extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tracker: null,
            timerange: series.range()
        };
    }

    handleTrackerChanged(tracker) {
        this.setState({ tracker });
    }

    handleTimeRangeChange(timerange) {
        this.setState({ timerange });
    }

    render() {
        return (
            <Resizable>
                <ChartContainer timeRange={series.range()} format="%b '%y">
                    <ChartRow height="150">
                        <YAxis
                            id="price"
                            label="Price ($)"
                            min={series.min()}
                            max={series.max()}
                            width="60"
                            format="$,.2f"
                        />
                        <Charts>
                            <LineChart axis="price" series={series} style={style} />
                            <Baseline
                                axis="price"
                                style={baselineStyleLite}
                                value={series.max()}
                                label="Max"
                                position="right"
                            />
                            <Baseline
                                axis="price"
                                style={baselineStyleLite}
                                value={series.min()}
                                label="Min"
                                position="right"
                            />
                            <Baseline
                                axis="price"
                                style={baselineStyleLite}
                                value={series.avg() - series.stdev()}
                            />
                            <Baseline
                                axis="price"
                                style={baselineStyleLite}
                                value={series.avg() + series.stdev()}
                            />
                            <Baseline
                                axis="price"
                                style={baselineStyle}
                                value={series.avg()}
                                label="Avg"
                                position="right"
                            />
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </Resizable>
        );
    }
};

// Export example
export default { baselines, baselines_docs, baselines_thumbnail };
