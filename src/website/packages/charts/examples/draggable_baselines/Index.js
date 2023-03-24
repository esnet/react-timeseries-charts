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
import { TimeSeries } from "pondjs";

import ChartContainer from "../../../../../components/ChartContainer";
import ChartRow from "../../../../../components/ChartRow";
import Charts from "../../../../../components/Charts";
import YAxis from "../../../../../components/YAxis";
import LineChart from "../../../../../components/LineChart";
// import Baseline from "../../../../../components/Baseline";
import DraggableBaseline from "../../../../../components/DraggableBaseline";
import Resizable from "../../../../../components/Resizable";

import draggablebaselines_docs from "./draggable_baselines_docs.md";
import baselines_thumbnail from "./baselines_thumbnail.png";
// import { scaleLinear } from 'd3-scale';

// Data
const data = require("./usd_vs_euro.json");
const points = data.widget[0].data.reverse();
const series = new TimeSeries({
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

// const baselineStyle = {
//     line: {
//         stroke: "steelblue",
//         strokeWidth: 1,
//         opacity: 0.4,
//         strokeDasharray: "none"
//     },
//     label: {
//         fill: "steelblue"
//     }
// };

const baselineStyleLite = {
    line: {
        stroke: "steelblue",
        strokeWidth: 1,
        opacity: 0.5
    },
    highlightedLine: {
        stroke: "steelblue",
        strokeWidth: 2,
        opacity: 0.5
    },
    label: {
        fill: "steelblue"
    }
};

// const baselineStyleExtraLite = {
//     line: {
//         stroke: "steelblue",
//         strokeWidth: 1,
//         opacity: 0.2,
//         strokeDasharray: "1,1"
//     },
//     label: {
//         fill: "steelblue"
//     }
// };

class draggablebaselines extends React.Component {
    state = {
        tracker: null,
        timerange: series.range(),
        value: 0.75,
        value1: 0.80
    };

    handleTrackerChanged = tracker => {
        this.setState({ tracker });
    };

    handleTimeRangeChange = timerange => {
        this.setState({ timerange });
    };

    render() {

        return (
            <Resizable>
                <ChartContainer
                    title="Euro price (USD)"
                    titleStyle={{ fill: "#555", fontWeight: 500 }}
                    timeRange={series.range()}
                    format="%b '%y"
                    timeAxisTickCount={5}
                    
                >
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
                            <DraggableBaseline
                                axis="price"
                                id="foo"
                                style={baselineStyleLite}
                                value={this.state.value}
                                label={this.state.value}
                                position="right"
                                onValueChanged={(id, oldValue, newValue) => this.setState({value: parseFloat(newValue.toFixed(3))})}
                            />
                            <DraggableBaseline
                                axis="price"
                                id="bar"
                                style={baselineStyleLite}
                                value={this.state.value1}
                                label={this.state.value1}
                                position="right"
                                onValueChanged={(id, oldValue, newValue) => this.setState({value1: parseFloat(newValue.toFixed(3))})}
                            />
                            
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </Resizable>
        );
    }
}

// Export example
export default { draggablebaselines, draggablebaselines_docs, baselines_thumbnail };
