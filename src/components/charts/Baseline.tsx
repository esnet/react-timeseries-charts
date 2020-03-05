/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "lodash";
import React from "react";
import { ChartProps } from "./Charts";

// XXX Styles
// import {
//     BaselineStyle,
//     defaultBaselineStyle as defaultStyle
// } from "./style";

export type BaselineProps = ChartProps & {
    /**
     * Reference to the axis which provides the vertical scale for drawing. e.g.
     * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
     */
    axis: string;

    /**
     * An object describing the style of the baseline of the form
     * { label, line }. "label" and "line" are both objects containing
     * the inline CSS for that part of the baseline.
     */
    // style?: BaselineStyle; XXX

    /**
     * The y-value to display the line at.
     */
    value?: number;

    /**
     * Show or hide this chart
     */
    visible?: boolean;

    /**
     * Whether to display the label above or below the line. The default is "auto",
     * which will show it above the line unless the position is near to the top
     * of the chart.
     */
    vposition?: "above" | "below" | "auto";

    /**
     * The label to display with the axis.
     */
    label?: string;

    /**
     * Whether to display the label on the "left" or "right".
     */
    position?: "left" | "right";
};

/**
 *
 * The BaseLine component displays a simple horizontal line at a value.
 *
 * For example the following code overlays Baselines for the mean and stdev
 * of a series on top of another chart.
 *
 * ```
 * <ChartContainer timeRange={series.timerange()} >
 *     <ChartRow height="150">
 *         <YAxis
 *           id="price"
 *           label="Price ($)"
 *           min={series.min()} max={series.max()}
 *           width="60" format="$,.2f"
 *         />
 *         <Charts>
 *             <LineChart axis="price" series={series} style={style} />
 *             <Baseline axis="price" value={series.avg()} label="Avg" position="right" />
 *             <Baseline axis="price" value={series.avg()-series.stdev()} />
 *             <Baseline axis="price" value={series.avg()+series.stdev()} />
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
export const Baseline: React.FunctionComponent<BaselineProps> = (props: BaselineProps) => {
    const {
        value = 0,
        label = "",
        position = "left",
        vposition = "auto",
        width = 0,
        yScale
        //style: defaultStyle XXX
    } = props;

    console.log("Rendering Baseline", props);

    if (!yScale || _.isUndefined(value)) {
        return null;
    }

    const y = yScale(value);
    const transform = `translate(0 ${y})`;

    let textAnchor: string = "start";
    let textPositionX: number = 5;
    const pts: string[] = [];

    const labelBelow = (vposition === "auto" && y < 15) || vposition === "below";
    const textPositionY = labelBelow ? 2 : -2;

    if (position === "left") {
        textPositionX = 5;
    } else if (position === "right") {
        textAnchor = "end";
        textPositionX = width - 5;
    }

    pts.push("0 0");
    pts.push(`${width} 0`);
    const points = pts.join(" ");

    //
    // Style
    //

    // const alignmentBaseline = labelBelow ? "hanging" : "auto";
    // const baseLabelStyle = { ...defaultStyle.label, alignmentBaseline };

    // const labelStyle = _.merge(
    //     true,
    //     baseLabelStyle,
    //     style.label ? style.label : {}
    // );
    // const lineStyle = _.merge(
    //     true,
    //     defaultStyle.line,
    //     style.line ? style.line : {}
    // );

    // XXX temp style
    const style = {
        strokeWidth: 1,
        stroke: "steelblue",
        strokeDashArray: 5
    };

    const labelStyle = {
        fill: "steelblue",
        fontSize: 10
    };

    return (
        <g className="baseline" transform={transform}>
            <polyline points={points} style={style} />
            <text style={labelStyle} x={textPositionX} y={textPositionY} textAnchor={textAnchor}>
                {label}
            </text>
        </g>
    );
};
