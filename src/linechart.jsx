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
 * The `<LineChart>` component is able to display multiple columns of a TimeSeries
 * as separate line charts.
 *
 * The `<LineChart>` should be used within `<ChartContainer>` etc., as this will
 * construct the horizontal and vertical axis, and manage other elements.
 *
 * Here is an example of two `<LineChart>`s overlaid on top of each other, along
 * with a `<BaseLine>`:
 *
 * ```
    <ChartContainer timeRange={timerange} >
        <ChartRow height="200">
            <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f" />
            <Charts>
                <LineChart axis="axis1" series={currencySeries} columns={["aud"]} style={lineStyles} interpolation="curveBasis" />
                <LineChart axis="axis2" series={currencySeries} columns={["euro"]} style={lineStyles} interpolation="curveBasis" />
                <Baseline axis="axis1" value={1.0} label="USD Baseline" position="right" />
            </Charts>
            <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f" />
        </ChartRow>
    </ChartContainer>
 * ```
 */
export default React.createClass({

    displayName: "LineChart",

    getDefaultProps() {
        return {
            columns: ["value"],
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
         * Which columns from the series to draw.
         */
        columns: React.PropTypes.array,

        /**
         * The styles to apply to the underlying SVG lines. This is a mapping
         * of column names to objects with style attributes, in the following
         * format:
         *
         * ```
         *  const lineStyles = {
         *      value: {
         *          stroke: "steelblue",
         *          strokeWidth: 1,
         *          strokeDasharray: "4,2"
         *      }
         *  };
         *
         *  <LineChart style={lineStyles} ... />
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
    pathStyle(column) {
        const baseStyle = {
            fill: "none",
            pointerEvents: "none",
            stroke: "#9DA3FF",
            strokeWidth: "1px"
        };
        return merge(true, baseStyle, this.props.style[column] || {});
    },

    renderPath(data, column, key) {
        const lineFunction = d3Shape.line()
            .curve(d3Shape[this.props.interpolation])
            .x((data) => this.props.timeScale(data.x))
            .y((data) => this.props.yScale(data.y));
        const path = lineFunction(data);
        return (
            <path
                key={key}
                clipPath={this.props.clipPathURL}
                style={this.pathStyle(column)}
                d={path} />
        );
    },

    renderLines() {
        return _.map(this.props.columns, column => this.renderLine(column));
    },

    renderLine(column) {
        const pathLines = [];
        let count = 1;
        if (this.props.breakLine) {
            // Remove nulls and NaNs from the line by generating a break in the line
            let currentPoints = null;
            for (let d of this.props.series.events()) {
                const timestamp = d.timestamp();
                const value = d.get(column);
                const badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                if (!badPoint) {
                    if (!currentPoints) currentPoints = [];
                    currentPoints.push({x: timestamp, y: value});
                } else {
                    if (currentPoints) {
                        if (currentPoints.length > 1) pathLines.push(this.renderPath(currentPoints, column, count++));
                        currentPoints = null;
                    }
                }
            }
            if (currentPoints && currentPoints.length > 1) {
                pathLines.push(this.renderPath(currentPoints, column, count));
            }
        } else {
            // Ignore nulls and NaNs in the line
            const cleanedPoints = [];
            for (let d of this.props.series.events()) {
                const timestamp = d.timestamp();
                const value = d.get(column);
                const badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                if (!badPoint) {
                    cleanedPoints.push({x: timestamp, y: value});
                }
            }

            pathLines.push(this.renderPath(cleanedPoints, column, count));
        }

        return (
            <g key={column}>
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
        const columns = nextProps.columns;

        // What changed?
        const widthChanged =
            (this.props.width !== width);
        const timeScaleChanged =
            (scaleAsString(this.props.timeScale) !== scaleAsString(timeScale));
        const yAxisScaleChanged =
            (this.props.yScale != yScale);
        const isPanningChanged =
            (this.props.isPanning !== isPanning);
        const interpolationChanged =
            (this.props.interpolation !== interpolation);
        const columnsChanged =
            (this.props.columns !== columns);

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
            interpolationChanged ||
            columnsChanged
        );
    },

    render() {
        return (
            <g>
                {this.renderLines()}
            </g>
        );
    }
});
