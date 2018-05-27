/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as React from "react";

import { ScaleTime, ScaleLinear, ScaleLogarithmic } from "d3-scale";
import { ScalerFunction } from "./interpolators";

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

export type AxisProps = {
    type: ScaleType;
    id: string;
    max: number;
    min: number;
    transition?: number;
    height: number;
    width: number;
};

//
// Props shared by all charts
//

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
    yScale?: ScalerFunction;

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
 * ```xml
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
 * ## Making your own chart
 *
 * Anything within this grouping is considered a chart, meaning it will have
 * certain props injected into it. As a result you can easily implement your own chart
 * by simply expecting to have these props available and rendering as such.
 *
 * For your own chart, the render() method should return a SVG group `<g>` at the
 * top level, and then your chart rendering within that.
 *
 * In addition to any props you add to your chart, the following props are passed into
 * each chart automatically:
 *
 * #### timeScale
 *
 * A d3 scale for the time axis which you can use to transform your data in the x direction
 *
 * #### yScale
 *
 * A d3 scale for the y-axis which you can use to transform your data in the y direction
 *
 * #### width
 *
 * A the width your chart will render into
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
