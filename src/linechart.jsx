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
import _ from "underscore";
import d3Shape from "d3-shape";
import merge from "merge";

import { TimeSeries } from "pondjs";

function scaleAsString(scale) {
    return `${scale.domain()}-${scale.range()}`;
}

/**
 * The LineChart widget is able to display a single line chart.
 *
 * The LineChart should be used within `<ChartContainer>` etc., as this will
 * construct the horizontal and vertical axis, and manage other elements.
 * Here is an example of two LineCharts overlaid on top of each other, along
 * with a BaseLine:
 *
 * ```
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
 *         <Charts>
 *             <LineChart axis="axis1" series={audSeries} style={audStyle}/>
 *             <LineChart axis="axis2" series={euroSeries} style={euroStyle}/>
 *             <Baseline  axis="axis1" value={1.0} label="USD Baseline" position="right"/>
 *         </Charts>
 *         <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 *
 * Note: Currently the line chart will take the first column for rendering.
 */
export default React.createClass({

    displayName: "LineChart",

    getDefaultProps() {
        return {
            smooth: true,
            interpolation: "curveLinear",
            style: {
                stroke: "steelblue",
                strokeWidth: 1
            },
            breakLine: true
        };
    },

    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: React.PropTypes.instanceOf(TimeSeries).isRequired,

        /**
         * Reference to the axis which provides the vertical scale for drawing.
         * e.g. specifying `axis="trafficRate"` would refer the y-scale of the YAxis
         * with id="trafficRate".
         */
        axis: React.PropTypes.string.isRequired,

        /**
         * The style of the line chart, with format:
         * ```
         *  const dashedBlueStyle = {
         *      stroke: "steelblue",
         *      strokeWidth: 1,
         *      strokeDasharray: "4,2"
         *  };
         *
         *  <LineChart style={dashedBlueStyle} ... />
         *  ```
         */
        style: React.PropTypes.object,

        /**
         * Any of D3's interpolation modes.
         */
        interpolation: React.PropTypes.oneOf([
            "curveBasis",
            "curveBasisOpen",
            "curveBundle",
            "curveCardinal",
            "curveCardinalOpen",
            "curveCatmullRom",
            "curveCatmullRomOpen",
            "curveLinear",
            "curveMonotone",
            "curveNatural",
            "curveRadial",
            "curveStep",
            "curveStepAfter",
            "curveStepBefore"
        ]),

        /**
         * The determines how to handle bad/missing values in the supplied
         * TimeSeries. A missing value can be null or NaN. If breakLine
         * is set to true then the line will be broken on either side of
         * the bad value(s). If breakLine is false (the default) bad values
         * are simply removed and the adjoining points are connected.
         */
        breakLine: React.PropTypes.bool
    },

    /**
     * Returns the style used for drawing the path
     */
    pathStyle() {
        const baseStyle = {
            fill: "none",
            pointerEvents: "none",
            stroke: this.props.style.color || "#9DA3FF",
            strokeWidth: `${this.props.style.width}px` || "1px"
        };
        return merge(true, baseStyle, this.props.style);
    },
   
    renderPath(data, key) {
        const lineFunction = d3Shape.line()
            .curve(d3Shape[this.props.interpolation])
            .x((data) => this.props.timeScale(data.x))
            .y((data) => this.props.yScale(data.y));
        const path = lineFunction(data);
        return (
            <path
                key={key}
                clipPath={this.props.clipPathURL}
                style={this.pathStyle()}
                d={path} />
        );
    },

    renderLines() {
        const pathLines = [];
        let count = 1;
        if (this.props.breakLine) {
            // Remove nulls and NaNs from the line
            let currentPoints = null;
            _.each(this.props.series.toJSON().points, d => {
                const value = d[1];
                const badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                if (!badPoint) {
                    if (!currentPoints) currentPoints = [];
                    currentPoints.push([d[0], d[1]]);
                } else {
                    if (currentPoints) {
                        const points = _.map(currentPoints, d => ({x: d[0], y: d[1]}));
                        if (points.length > 1) pathLines.push(this.renderPath(points, count++));
                        currentPoints = null;
                    }
                }
            });
            if (currentPoints) {
                const points = _.map(currentPoints, d => ({x: d[0], y: d[1]}));
                if (points.length > 1) {
                    pathLines.push(this.renderPath(points, count));
                }
            }
        } else {
            // Remove nulls and NaNs from the line
            const cleanedPoints = [];
            _.each(this.props.series.toJSON().points, d => {
                const value = d[1];
                const badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                if (!badPoint) {
                    cleanedPoints.push([d[0], d[1]]);
                }
            });

            // Map series data to scaled points
            const points = _.map(cleanedPoints, d => ({x: d[0], y: d[1]}));

            pathLines.push(this.renderPath(points, count));
        }

        return (
            <g>
                {pathLines}
            </g>
        );
    },

    shouldComponentUpdate(nextProps) {
        const newSeries = nextProps.series;
        const oldSeries = this.props.series;

        const width = nextProps.width;
        const timeScale = nextProps.timeScale;
        const yScale = nextProps.yScale;
        const isPanning = nextProps.isPanning;
        const interpolation = nextProps.interpolation;

        // What changed?
        const widthChanged =
            (this.props.width !== width);
        const timeScaleChanged =
            (scaleAsString(this.props.timeScale) !== scaleAsString(timeScale));
        const yAxisScaleChanged =
            (scaleAsString(this.props.yScale) !== scaleAsString(yScale));
        const isPanningChanged =
            (this.props.isPanning !== isPanning);
        const interpolationChanged =
            (this.props.interpolation !== interpolation);

        let seriesChanged = false;
        if (oldSeries.length !== newSeries.length) {
            seriesChanged = true;
        } else {
            seriesChanged = !TimeSeries.is(oldSeries, newSeries);
        }

        return (
            widthChanged ||
            seriesChanged ||
            timeScaleChanged ||
            isPanningChanged ||
            yAxisScaleChanged ||
            interpolationChanged
        );
    },

    render() {
        return (
            <g >
                {this.renderLines()}
            </g>
        );
    }
});
