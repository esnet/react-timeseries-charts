/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

// CHECK
// Fix YAxis and React Axis styling to include style as label, axis, values, ticks
import * as React from "react";

import { format } from "d3-format";
import { Axis } from "react-axis";

import { AxisProps, ScaleType } from "./Charts";
import { scaleAsString } from "./util";

type CSSProperties = { [key: string]: any };

export interface YAxisStyle {
    labels: React.CSSProperties;
    axis: React.CSSProperties;
}

// const defaultStyle: YAxisStyle = {
//     label: {
//         stroke: "none",
//         fill: "#8B7E7E", // Default label color
//         fontWeight: 100,
//         fontSize: 12,
//         font: '"Goudy Bookletter 1911", sans-serif"'
//     },
//     values: {
//         stroke: "none",
//         fill: "#8B7E7E", // Default value color
//         fontWeight: 100,
//         fontSize: 11,
//         font: '"Goudy Bookletter 1911", sans-serif"'
//     },
//     ticks: {
//         fill: "none",
//         stroke: "#C0C0C0"
//     },
//     axis: {
//         fill: "none",
//         stroke: "#C0C0C0"
//     }
// };

const defaultStyle: any = {
    labels: {
        fill: "#8B7E7E",
        fontWeight: 100,
        fontSize: 12,
        fontFamily: '"Goudy Bookletter 1911", sans-serif"',
        stroke: "none",
        pointerEvents: "none"
    },
    axis: {
        axisColor: "#C0C0C0"
    }
};

export type YAxisProps = AxisProps & {
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
    width: number;

    /**
     * Object specifying the CSS by which the axis can be styled. The object can contain:
     * "labels" and "axis". Each of these is an inline CSS style applied
     * to the axis label, axis values, axis line and ticks respectively.
     *
     * Note that these are passed into d3's styling, so are regular CSS property names
     * and not React's camel case names (e.g. "stroke-dasharray" not strokeDasharray).
     */

    // CHECK
    // style: PropTypes.shape({
    //      label: PropTypes.object,
    //      axis: PropTypes.object,
    //      values: PropTypes.object,
    //      ticks: PropTypes.object
    // })
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
export class YAxis extends React.Component<YAxisProps> {
    static defaultProps: Partial<YAxisProps> = {
        id: "yaxis",
        align: "left",
        min: 0,
        max: 1,
        type: ScaleType.Linear,
        absolute: false,
        format: ".2s",
        labelOffset: 0,
        transition: 100,
        width: 80,
        style: defaultStyle
    };

    render() {
        return (
            <Axis
                label={this.props.label ? this.props.label : this.props.id}
                labelStyle={this.props.style}
                width={this.props.width}
                position={this.props.align}
                margin={5}
                height={this.props.height}
                max={this.props.max}
                min={this.props.min}
                type={this.props.type}
                format={this.props.format}
                tickCount={this.props.tickCount}
                absolute={this.props.absolute}
            />
        );
    }
}
