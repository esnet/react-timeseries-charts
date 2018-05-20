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

import { format } from "d3-format";
import { Axis } from "react-axis";

import { scaleAsString } from "./util";
import { AxisProps, ScaleType } from "./Charts";

type CSSProperties = { [key: string]: any };

export interface YAxisStyle {
    labels: React.CSSProperties;
    axis: React.CSSProperties;
}

const defaultStyle: any = {
    labels: {
        labelColor: "#8B7E7E",
        labelWeight: 100,
        labelSize: 11
    },
    axis: {
        axisColor: "#C0C0C0"
    }
};

export type YAxisProps = AxisProps & {
    label?: string;
    min: number;
    max: number;
    width: number;
    style?: YAxisStyle;
    absolute?: boolean;
    labelOffset?: number;
    format?: string;
    align?: string;
    scale?: (...args: any[]) => any;
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
