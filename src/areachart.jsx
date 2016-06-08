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
import d3Shape from "d3-shape";

import { TimeSeries } from "pondjs";

function scaleAsString(scale) {
    return `${scale.domain()}-${scale.range()}`;
}

/**
 * The `<AreaChart>` component is able to display single or multiple stacked
 * areas above or below the axis. It used throughout the
 * [My ESnet Portal](http://my.es.net).

 * The `<AreaChart>` should be used within a `<ChartContainer>` structure,
 * as this will construct the horizontal and vertical axis, and manage
 * other elements. Here is an example of an `<AreaChart>` with an up and down
 * network traffic visualization:
 *
 *  ```
 *   render() {
 *      return (
 *          ...
 *          <ChartContainer timeRange={trafficSeries.timerange()} width="1080">
 *              <ChartRow height="150">
 *                  <Charts>
 *                      <AreaChart
 *                          axis="traffic"
 *                          series={trafficSeries}
 *                          columns={{up: ["in"], down: ["out"]}}/>
 *                  </Charts>
 *                  <YAxis
 *                      id="traffic"
 *                      label="Traffic (bps)"
 *                      min={-max} max={max}
 *                      absolute={true}
 *                      width="60"
 *                      type="linear"/>
 *              </ChartRow>
 *          </ChartContainer>
 *          ...
 *      );
 *  }
 *  ```
 * The `<AreaChart>` takes a single `TimeSeries` object into its `series` prop. This
 * series can contain multiple columns and those columns can be referenced using the `columns`
 * prop. The `columns` props allows you to map columns in the series to the chart,
 * letting you specify the stacking and orientation of the data. In the above example
 * we map the "in" column in `trafficSeries` to the up direction and the "out" column to
 * the down direction. Each direction is specified as an array, so adding multiple
 * columns into a direction will stack the areas in that direction.
 *
 * Note: It is recommended that `<ChartContainer>`s be placed within a <Resizable> tag,
 * rather than hard coding the width as in the above example.
 */
export default React.createClass({

    displayName: "AreaChart",

    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: React.PropTypes.instanceOf(TimeSeries).isRequired,

        /**
         * Reference to the axis which provides the vertical scale for ## drawing. e.g.
         * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
         */
        axis: React.PropTypes.string.isRequired,

        /**
         * The series series columns mapped to stacking up and down.
         * Has the format:
         * ```
         *  "columns": {
         *      up: ["in", ...],
         *      down: ["out", ...]
         *  }
         *  ```
         */
        columns: React.PropTypes.shape({
            up: React.PropTypes.arrayOf(React.PropTypes.string),
            down: React.PropTypes.arrayOf(React.PropTypes.string)
        }),

        stack: React.PropTypes.bool,

        /**
         * The style of the area chart, with format:
         * ```
         * "style": {
         *     up: ["#448FDD", "#75ACE6", "#A9CBEF", ...],
         *     down: ["#FD8D0D", "#FDA949", "#FEC686", ...]
         * }
         * ```
         *
         * Currenly it is only possible to set the color for each area.
         * This may change in the future. You can, however, set the fill
         * opacity (see `fillOpacity`), but this will apply to all areas.
         */
        style: React.PropTypes.shape({
            up: React.PropTypes.arrayOf(React.PropTypes.string),
            down: React.PropTypes.arrayOf(React.PropTypes.string)
        }),

        fillOpacity: React.PropTypes.number,

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
        ])
    },

    getDefaultProps() {
        return {
            transition: 0,
            interpolation: "curveLinear",
            style: {
                up: ["#448FDD", "#75ACE6", "#A9CBEF"],
                down: ["#FD8D0D", "#FDA949", "#FEC686"]
            },
            fillOpacity: 0.75,
            columns: {
                up: ["value"],
                down: []
            },
            stack: true
        };
    },

    renderPaths(columnList, direction) {
        const dir = direction === "up" ? 1 : -1;
        const cursor = this.props.isPanning ? "-webkit-grabbing" : "default";
        const size = this.props.series.size();
        const offsets = new Array(size).fill(0);

        return columnList.map((columnName, i) => {
            const style = {
                fill: this.props.style[direction][i],
                opacity: this.props.fillOpacity,
                pointerEvents: "none",
                cursor
            };

            const outlineStyle = {
                stroke: this.props.style[direction][i],
                strokeWidth: 1,
                fill: "none",
                opacity: 1,
                pointerEvents: "none",
                cursor
            };

            // Stack the series columns to get our data in x0, y0, y1 format
            const data = [];
            for (let i = 0; i < this.props.series.size(); i++) {
                const seriesPoint = this.props.series.at(i);
                data.push({
                    x0: this.props.timeScale(seriesPoint.timestamp()),
                    y0: this.props.yScale(offsets[i]),
                    y1: this.props.yScale(offsets[i] + dir * seriesPoint.get(columnName))
                });
                if (this.props.stack) {
                    offsets[i] += dir * seriesPoint.get(columnName);
                }
            }

            // Use D3 to build an area generation function
            const area = d3Shape.area()
                .curve(d3Shape[this.props.interpolation])
                .x(d => d.x0)
                .y0(d => d.y0)
                .y1(d => d.y1);

            // Use the area generation function with our stacked data
            // to get an SVG path
            const areaPath = area(data);

            // Outline the top of the curve
            const lineFunction = d3Shape.line()
                .curve(d3Shape[this.props.interpolation])
                .x(d => d.x0)
                .y(d => d.y1);
            const outlinePath = lineFunction(data);

            return (
                <g key={`area-${i}`}>
                    <path
                        key={`area-${direction}-${i}`}
                        clipPath={this.props.clipPathURL}
                        style={style}
                        d={areaPath} />
                     <path
                        style={outlineStyle}
                        key={`outline-${direction}-${i}`}
                        clipPath={this.props.clipPathURL}
                        d={outlinePath} />
                </g>
            );
        });
    },

    renderAreas() {
        const up = this.props.columns.up || [];
        const down = this.props.columns.down || [];

        return (
            <g>
                {this.renderPaths(up, "up")}
                {this.renderPaths(down, "down")}
            </g>
        );

    },

    shouldComponentUpdate(nextProps) {
        const newSeries = nextProps.series;
        const oldSeries = this.props.series;

        const width = nextProps.width;
        const timeScale = nextProps.timeScale;
        const yScale = nextProps.yScale;
        const interpolate = nextProps.interpolate;
        const isPanning = nextProps.isPanning;
        const columns = nextProps.columns;
        const style = nextProps.style;

        const widthChanged =
            (this.props.width !== width);
        const timeScaleChanged =
            (scaleAsString(this.props.timeScale) !== scaleAsString(timeScale));
        const yAxisScaleChanged =
            (this.props.yScale != yScale);
        const interpolateChanged =
            (this.props.interpolate !== interpolate);
        const isPanningChanged =
            (this.props.isPanning !== isPanning);
        const columnsChanged =
            (JSON.stringify(this.props.columns) !== JSON.stringify(columns));
        const styleChanged =
            (JSON.stringify(this.props.style) !== JSON.stringify(style));

        let seriesChanged = false;
        if (oldSeries.length !== newSeries.length) {
            seriesChanged = true;
        } else {
            seriesChanged = !TimeSeries.is(oldSeries, newSeries);
        }

        return (seriesChanged || timeScaleChanged || widthChanged ||
            interpolateChanged || isPanningChanged || columnsChanged ||
            styleChanged || yAxisScaleChanged);
    },

    render() {
        return (
            <g >
                {this.renderAreas()}
            </g>
        );
    }
});
