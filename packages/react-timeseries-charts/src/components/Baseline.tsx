/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import merge from "merge";
import React from "react";
import _ from "underscore";
const defaultStyle = {
    label: {
        fill: "#8B7E7E",
        fontWeight: 100,
        fontSize: 11,
        pointerEvents: "none"
    },
    line: {
        stroke: "#626262",
        strokeWidth: 1,
        strokeDasharray: "5,3",
        pointerEvents: "none"
    }
};
type BaselineProps = {
    axis: string,
    style?: {
        label?: object,
        line?: object
    },
    value?: number,
    label?: string,
    position?: "left" | "right",
    yScale?: (...args: any[]) => any,
    width?: number
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
export default class Baseline extends React.Component<BaselineProps, {}> {
    render() {
        if (!this.props.yScale || _.isUndefined(this.props.value)) {
            return null;
        }
        const y = this.props.yScale(this.props.value);
        const transform = `translate(0 ${y})`;
        let textAnchor;
        let textPositionX;
        const pts = [];
        const textPositionY = -3;
        if (this.props.position === "left") {
            textAnchor = "start";
            textPositionX = 5;
        }
        if (this.props.position === "right") {
            textAnchor = "end";
            textPositionX = this.props.width - 5;
        }
        pts.push("0 0");
        pts.push(`${this.props.width} 0`);
        const points = pts.join(" ");
        //
        // Style
        //
        const labelStyle = merge(
            true,
            defaultStyle.label,
            this.props.style.label ? this.props.style.label : {}
        );
        const lineStyle = merge(
            true,
            defaultStyle.line,
            this.props.style.line ? this.props.style.line : {}
        );
        return (
            <g className="baseline" transform={transform}>
                <polyline points={points} style={lineStyle} />
                <text
                    style={labelStyle}
                    x={textPositionX}
                    y={textPositionY}
                    textAnchor={textAnchor}
                >
                    {this.props.label}
                </text>
            </g>
        );
    }
}
Baseline.defaultProps = {
    value: 0,
    label: "",
    position: "left",
    style: defaultStyle
};
