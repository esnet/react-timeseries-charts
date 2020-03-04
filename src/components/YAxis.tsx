/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { ScaleType } from "../types";
import { ChartRowProps } from "./ChartRow";

// type CSSProperties = { [key: string]: any };

export type YAxisStyle = {
    label: React.CSSProperties;
    axis: React.CSSProperties;
    values: React.CSSProperties;
    ticks: React.CSSProperties;
};

export type YAxisProps = ChartRowProps & {
    /**
     * A name for the axis which can be used by a chart to reference the axis.
     * This is used by the ChartRow to match charts to this axis.
     */
    id: string;

    /**
     * Width of the chart
     */
    chartExtent?: number;

    /**
     * The label to be displayed alongside the axis.
     */
    label?: string;

    /**
     * Minium value, which combined with "max", define the scale of the axis.
     */
    min: number;

    /**
     * Maxium value, which combined with "min,"" define the scale of the axis.
     */
    max: number;

    /**
     * The width of the axis
     */
    width?: number;

    /**
     * The scale type: linear, power, or log.
     */
    type?: ScaleType;

    /**
     * Object specifying the CSS by which the axis can be styled. The object can contain:
     * "labels" and "axis". Each of these is an inline CSS style applied
     * to the axis label, axis values, axis line and ticks respectively.
     *
     * Note that these are passed into d3's styling, so are regular CSS property names
     * and not React's camel case names (e.g. "stroke-dasharray" not strokeDasharray).
     */
    style?: YAxisStyle;

    /**
     * Render all ticks on the axis as positive values.
     */
    absolute?: boolean;

    /**
     * Offset the axis label from its default position. This allows you to
     * fine tune the label location, which may be necessary depending on the
     * scale and how much room the tick labels take up. Maybe positive or
     * negative.
     */
    labelOffset?: number;

    /**
     * If a string, the d3.format for the axis labels (e.g. `format=\"$,.2f\"`).
     * If a function, that function will be called with each tick value and
     * should generate a formatted string for that value to be used as the label
     * for that tick (e.g. `function (n) { return Number(n).toFixed(2) }`).
     */
    format?: string;

    /**
     * If the chart should be rendered to with the axis on the left or right.
     * If you are using the axis in a ChartRow, you do not need to provide this.
     */
    align?: string;

    /**
     * [Internal] The scale supplied by the ChartRow
     */
    scale?: (...args: any[]) => any;

    /**
     * The number of ticks
     */
    tickCount?: number;

    /**
     * Show / Hide axis line
     */
    hideAxisLine?: boolean;

    /**
     * Render a horizontal grid by extending the axis ticks across the chart area. Note that this
     * can only be applied to an inner axis (one next to a chart). If you have multiple axes then
     * this can't be used on the outer axes. Also, if you have an axis on either side of the chart
     * then you can use this, but the UX not be ideal.
     */
    showGrid?: boolean;
};

/**
 * The YAxis widget displays a vertical axis to the left or right
 * of the charts. A YAxis always appears within a `ChartRow`, from
 * which it gets its height and positioning. You can have more than
 * one axis per row.
 *
 * Here's a simple YAxis example:
 *
 * ```js
 * <YAxis
 *   id="price-axis"
 *   label="Price (USD)"
 *   min={0} max={100}
 *   width="60"
 *   type="linear"
 *   format="$,.2f"
 * />
 * ```
 *
 * Visually you can control the axis `label`, its size via the `width`
 * prop, its `format`, and `type` of scale (linear).
 *
 * Each axis also defines a scale through a `min` and `max` prop. Charts
 * may then refer to the axis by by citing the axis `id` in their `axis`
 * prop. Those charts will then use the axis scale for their y-scale.
 *
 * Here is an example of two line charts that each have their own axis:
 *
 * ```js
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis id="aud" label="AUD" min={0.5} max={1.5} width="60" format="$,.2f"/>
 *         <Charts>
 *             <LineChart axis="aud" series={audSeries} style={audStyle}/>
 *             <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
 *         </Charts>
 *         <YAxis id="euro" label="Euro" min={0.5} max={1.5} width="80" format="$,.2f"/>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 *
 *  Note that there are two `<YAxis>` components defined here, one before
 *  the `<Charts>` block and one after. This defines that the first axis will
 *  appear to the left of the charts and the second will appear after the charts.
 *  Each of the line charts uses its `axis` prop to identify the axis ("aud" or "euro")
 *  it will use for its vertical scale.
 */
export const YAxis: React.FunctionComponent<YAxisProps> = (props: YAxisProps) => {
    const {
        id = "yaxis",
        align = "left",
        min = 0,
        max = 1,
        type = ScaleType.Linear,
        absolute = false,
        format = ".2s",
        labelOffset = 0,
        width = 80,
        height = 80,
        hideAxisLine = false,
        showGrid = false
    } = props;

    console.log(
        "Rendering axis",
        id,
        align,
        min,
        max,
        type,
        absolute,
        format,
        labelOffset,
        hideAxisLine,
        showGrid
    );
    return (
        <g>
            <rect
                width={width}
                height={height}
                style={{ fill: "#c2fdc7", strokeWidth: 1, stroke: "rgb(255,0,0)" }}
            />
        </g>
    );
};
