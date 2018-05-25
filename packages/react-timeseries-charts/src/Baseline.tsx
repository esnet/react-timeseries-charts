/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import * as React from "react";

import { ChartProps } from "./Charts";
import { BaselineStyle, baselineDefaultStyle as defaultStyle } from "./style";

export type BaselineProps = ChartProps & {
    axis: string;
    style?: BaselineStyle;
    value?: number;
    visible?: boolean;
    vposition?: "above" | "below" | "auto";
    label?: string;
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
export class Baseline extends React.Component<BaselineProps> {
    static defaultProps: Partial<BaselineProps> = {
        visible: true,
        value: 0,
        label: "",
        position: "left",
        vposition: "auto",
        style: defaultStyle
    };

    render() {
        const { vposition, yScale, value, position, style, width } = this.props;
        
        if (!yScale || _.isUndefined(value)) {
            return null;
        }
        const y = yScale(value);
        const transform = `translate(0 ${y})`;
        let textAnchor;
        let textPositionX;
        const pts = [];

        const labelBelow = (vposition === "auto" && y < 15) || vposition === "below";
        const textPositionY = labelBelow ? 2 : -2;
        const alignmentBaseline = labelBelow ? "hanging" : "auto";

        if (position === "left") {
            textAnchor = "start";
            textPositionX = 5;
        }
        if (position === "right") {
            textAnchor = "end";
            textPositionX = width - 5;
        }

        pts.push("0 0");
        pts.push(`${this.props.width} 0`);
        const points = pts.join(" ");

        //
        // Style
        //

        const baseLabelStyle = { ...defaultStyle.label, alignmentBaseline };

        const labelStyle = _.merge(
            true,
            baseLabelStyle,
            style.label ? style.label : {}
        );
        const lineStyle = _.merge(
            true,
            defaultStyle.line,
            style.line ? style.line : {}
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
