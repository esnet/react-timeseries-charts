/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { timeSeries } from "pondjs";
import { 
    ChartContainer, 
    ChartRow, 
    Charts, 
    YAxis, 
    LineChart, 
    // Baseline, 
    Resizable, 
    LineChartStyle, 
    // BaselineStyle
} from "react-timeseries-charts";

// Data
const data = require("./usd_vs_euro.json");
const points = data.widget[0].data.reverse();
const series = timeSeries({
    name: "USD_vs_EURO",
    columns: ["time", "value"],
    points
});

const style: LineChartStyle = {
    value: {
        line: {
            normal: { stroke: "steelblue", opacity: 1 },
            highlighted: {stroke: "#5a98cb", fill: "none", strokeWidth: 1},
            selected: {stroke: "steelblue", fill: "none", strokeWidth: 1},
            muted: {stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1}
        }
    }
};

// const baselineStyle: BaselineStyle = {
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

// const baselineStyleLite: BaselineStyle = {
//     line: {
//         stroke: "steelblue",
//         strokeWidth: 1,
//         opacity: 0.5
//     },
//     label: {
//         fill: "steelblue"
//     }
// };

// const baselineStyleExtraLite: BaselineStyle = {
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

type ChartProps = {};

export default class Chart extends React.Component<ChartProps> {
    render() {
        return (
            <Resizable>
                <ChartContainer
                    title="Euro price (USD)"
                    titleStyle={{ fill: "#555", fontWeight: 500 }}
                    timeRange={series.range()}
                    timeFormat="%b '%y"
                >
                    <ChartRow height={150}>
                        <YAxis
                            id="price"
                            label="Price ($)"
                            min={series.min()}
                            max={series.max()}
                            width={60}
                            format="$,.2f"
                        />
                        <Charts>
                            <LineChart axis="price" series={series} style={style} />
                            {/* <Baseline
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
                                style={baselineStyleExtraLite}
                                value={series.avg() - series.stdev()}
                            />
                            <Baseline
                                axis="price"
                                style={baselineStyleExtraLite}
                                value={series.avg() + series.stdev()}
                            />
                            <Baseline
                                axis="price"
                                style={baselineStyle}
                                value={series.avg()}
                                label="Avg"
                                position="right"
                            /> */}
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </Resizable>
        );
    }
}