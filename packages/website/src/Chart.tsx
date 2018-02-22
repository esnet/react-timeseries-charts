/**
 *  Copyright (c) 2018, The Regents of the University of California,
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
    ShowGridPosition,
    ScaleType,
    TimeAxisStyleType
} from "react-timeseries-charts";

const series = timeSeries({
    name: "chart",
    columns: ["time", "value"],
    points: [
        [1412553600000, 1.1432],
        [1413158400000, 1.1438],
        [1413763200000, 1.1388],
        [1414368000000, 1.1341],
        [1414972800000, 1.1525],
        [1415577600000, 1.1506],
        [1416182400000, 1.1507],
        [1416787200000, 1.1663]
    ]
});

// console.log(series.toJSON());

export default class Chart extends React.Component {
    render() {
        const timeAxisStyle: TimeAxisStyleType = {
            labels: {
                labelColor: "red",
                labelWeight: 100,
                labelSize: 11
            },
            axis: {
                axisColor: "grey",
                axisWidth: 1
            }
        };
        return (
            <ChartContainer
                timeRange={series.range()}
                width={500}
                timeAxisStyle={timeAxisStyle}
                showGridPosition={ShowGridPosition.Under}
            >
                <ChartRow height={150} transition={300}>
                    <YAxis
                        type={ScaleType.Linear}
                        id="price"
                        label="value"
                        min={series.min()}
                        max={series.max()}
                        width={80}
                        format="$,.2f"
                        height={1}
                    />
                    <Charts>
                        <LineChart
                            key="linechart"
                            width={0}
                            height={0}
                            axis="price"
                            series={series}
                        />
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
    }
}
