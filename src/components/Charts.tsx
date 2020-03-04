/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import { ScaleLinear, ScaleLogarithmic, ScaleTime } from "d3-scale";
import * as React from "react";
import { ScaleFunction } from "../types";

//
// Axis types
//

export type Scale =
    | ScaleLogarithmic<number, number>
    | ScaleLinear<number, number>
    | ScaleLogarithmic<number, number>;

export enum ScaleType {
    Linear = "LINEAR",
    Power = "POWER",
    Log = "LOG"
}

/**
 * Props shared by all axes
 */
export type AxisProps = {
    type: ScaleType;
    id: string;
    max: number;
    min: number;
    align: "left" | "right";
    height: number;
    width: number;
    transition?: number;
    scale?: Scale;
};

/**
 * Props shared by all charts as these are injected into the Chart before it renders
 */
export type ChartProps = {
    key?: string | number;

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width?: number;

    /**
     * [Internal] The height supplied by the surrounding ChartContainer
     */
    height?: number;

    /**
     * [Internal] The timeScale supplied by the surrounding ChartContainer
     */
    timeScale?: ScaleTime<number, number>;

    /**
     * [Internal] The yScale supplied by the associated YAxis
     */
    yScale?: ScaleFunction;

    timeFormat?: string | ((...args: any[]) => any);
    transition?: number;
};

//
// The <Charts> container
//

export type ChartsProps = {
    children?: any;
};

/**
 *
 * The `<Charts>` element is a grouping for charts within a row.
 * It takes no props. Each chart within the group will be overlaid
 * on top of each other.
 *
 * Here is an example of two line charts within a `<Charts>` group:
 *
 * ```
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis/>
 *         <Charts>
 *             <LineChart axis="aud" series={audSeries} style={audStyle}/>
 *             <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
 *         </Charts>
 *         <YAxis/>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 *
 */
export class Charts extends React.Component<ChartsProps> {
    render() {
        return (
            <g>
                `${this.constructor.name} elements are for configuration only and should not be
                rendered`
            </g>
        );
    }
}
