/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import "./baseline.css";

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
 *         <YAxis id="price" label="Price ($)" min={series.min()} max={series.max()} width="60" format="$,.2f"/>
 *         <Charts>
 *             <LineChart axis="price" series={series} style={style}/>
 *             <Baseline axis="price" value={series.avg()} label="Avg" position="right"/>
 *             <Baseline axis="price" value={series.avg()-series.stdev()}/>
 *             <Baseline axis="price" value={series.avg()+series.stdev()}/>
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
export default React.createClass({

    displayName: "Baseline",

    getDefaultProps() {
        return {
            value: 0,
            label: "",
            position: "left"
        };
    },

    propTypes: {

        /**
         * Reference to the axis which provides the vertical scale for drawing. e.g.
         * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
         */
        axis: React.PropTypes.string.isRequired,

        /**
         * The y-value to display the line at.
         */
        value: React.PropTypes.number,

        /**
         * The label to display with the axis.
         */
        label: React.PropTypes.string,

        /**
         * Whether to display the label on the "left" or "right".
         */
        position: React.PropTypes.oneOf(["left", "right"])
    },

    render() {
        if (!this.props.yScale || !this.props.value) {
            return null;
        }

        const ymin = Math.min(this.props.yScale.range()[0],
                            this.props.yScale.range()[1]);
        const y = this.props.yScale(this.props.value);
        const transform = `translate(0 ${y})`;
        let points;
        let textAnchor;
        let textPositionX;
        const pts = [];

        let textPositionY = -3;
        if (y < ymin + 10) {
            textPositionY = 12;
        }

        if (this.props.position === "left") {
            textAnchor = "start";
            textPositionX = 5;
        }
        if (this.props.position === "right") {
            textAnchor = "end";
            textPositionX = this.props.width - 5;
        }

        pts.push(`0 0`);
        pts.push(`${this.props.width} 0`);
        points = pts.join(" ");

        return (
            <g className="baseline" transform={transform}>
                <polyline points={points} style={{pointerEvents: "none"}}/>
                <text className="baseline-label"
                      x={textPositionX}
                      y={textPositionY} textAnchor={textAnchor}>
                    {this.props.label}
                </text>
            </g>
        );
    }
});
