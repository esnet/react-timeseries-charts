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
import _ from "underscore";
import merge from "merge";
import { TimeSeries } from "pondjs";
import { Styler } from "../js/styler";

function scaleAsString(scale) {
    return `${scale.domain()}-${scale.range()}`;
}

const defaultStyle = {
    line: {
        normal: {stroke: "steelblue", fill: "none", strokeWidth: 1},
        highlighted: {stroke: "#5a98cb", fill: "none", strokeWidth: 1},
        selected: {stroke: "steelblue", fill: "none", strokeWidth: 2},
        muted: {stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1}
    },
    area: {
        normal: {fill: "steelblue", stroke: "none", opacity: 0.75},
        highlighted: {fill: "#5a98cb", stroke: "none", opacity: 0.75},
        selected: {fill: "steelblue", stroke: "none", opacity: 0.75},
        muted: {fill: "steelblue", stroke: "none", opacity: 0.25}
    }
};

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
         * The styles to apply to the underlying SVG lines. This is a mapping
         * of column names to objects with style attributes, in the following
         * format:
         *
         * ```
         *  const areaStyles = {
         *      value: {
         *          area: {
         *              fill: "#DDD"
         *          },
         *          outline: {
         *              stroke: "black"
         *          }
         *      }
         *  };
         *
         *  <LineChart style={areaStyles} ... />
         *
         *  Alternatively, you can pass in a Styler. For example:
         *
         * ```
         * const currencyStyle = Styler([
         *     {key: "aud", color: "steelblue", width: 1, dashed: true},
         *     {key: "euro", color: "#F68B24", width: 2}
         * ]);
         *
         * <LineChart columns={["aud", "euro"]} style={currencyStyle} ... />
         *
         * ```
         */
        style: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.func,
            React.PropTypes.instanceOf(Styler)
        ]),

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
            columns: {
                up: ["value"],
                down: []
            },
            stack: true
        };
    },

    handleHover(e, column) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(column);
        }
    },

    handleHoverLeave() {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    },

    handleClick(e, column) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(column);
        }
    },

    providedAreaStyleMap(column) {
        let style = {};
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
                style = this.props.style.areaChartStyle()[column];
            } else if (_.isObject(this.props.style)) {
                style = this.props.style[column];
            } else if (_.isFunction(this.props.style)) {
                style = this.props.style(column);
            }
        }
        return style;
    },

    /**
     * Returns the style used for drawing the path
     */
    style(column, type) {
        let style;

        const styleMap = this.providedAreaStyleMap(column);
        const isHighlighted = this.props.highlight && column === this.props.highlight;
        const isSelected = this.props.selection && column === this.props.selection;

        if (!_.has(styleMap, "line")) {
            console.error("Provided style for AreaChart does not default a style for the outline:", styleMap, column);
        }

        if (!_.has(styleMap, "area")) {
            console.error("Provided style for AreaChart does not default a style for the area:", styleMap);
        }

        if (this.props.selection) {
            if (isSelected) {
                style = merge(true,
                              defaultStyle[type].selected,
                              styleMap[type].selected ? styleMap[type].selected : {});
            } else if (isHighlighted) {
                style = merge(true,
                              defaultStyle[type].highlighted,
                              styleMap[type].highlighted ? styleMap[type].highlighted : {});
            } else {
                style = merge(true,
                              defaultStyle[type].muted,
                              styleMap[type].muted ? styleMap[type].muted : {});
            }
        } else if (isHighlighted) {
            style = merge(true,
                          defaultStyle[type].highlighted,
                          styleMap[type].highlighted ? styleMap[type].highlighted : {});
        } else {
            style = merge(true,
                          defaultStyle[type].normal,
                          styleMap[type].normal ? styleMap[type].normal : {});
        }

        return style;
    },

    pathStyle(column) {
        return this.style(column, "line");
    },

    areaStyle(column) {
        //const cursor = this.props.isPanning ? "-webkit-grabbing" : "default";
        return this.style(column, "area");
    },

    renderPaths(columnList, direction) {
        const dir = direction === "up" ? 1 : -1;
        const size = this.props.series.size();
        const offsets = new Array(size).fill(0);

        return columnList.map((column, i) => {
            const style = this.areaStyle(column);
            const pathStyle = this.pathStyle(column);

            // Stack the series columns to get our data in x0, y0, y1 format
            const data = [];
            for (let i = 0; i < this.props.series.size(); i++) {
                const seriesPoint = this.props.series.at(i);
                data.push({
                    x0: this.props.timeScale(seriesPoint.timestamp()),
                    y0: this.props.yScale(offsets[i]),
                    y1: this.props.yScale(offsets[i] + dir * seriesPoint.get(column))
                });
                if (this.props.stack) {
                    offsets[i] += dir * seriesPoint.get(column);
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
                        d={areaPath}
                        style={style}
                        onClick={e => this.handleClick(e, column)}
                        onMouseLeave={this.handleHoverLeave}
                        onMouseMove={e => this.handleHover(e, column)} />
                     <path
                        d={outlinePath}
                        style={pathStyle}
                        onClick={e => this.handleClick(e, column)}
                        onMouseLeave={this.handleHoverLeave}
                        onMouseMove={e => this.handleHover(e, column)} />
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
        const highlight = nextProps.highlight;
        const selection = nextProps.selection;

        const widthChanged =
            (this.props.width !== width);
        const timeScaleChanged =
            (scaleAsString(this.props.timeScale) !== scaleAsString(timeScale));
        const yAxisScaleChanged =
            (this.props.yScale !== yScale);
        const interpolateChanged =
            (this.props.interpolate !== interpolate);
        const isPanningChanged =
            (this.props.isPanning !== isPanning);
        const columnsChanged =
            (JSON.stringify(this.props.columns) !== JSON.stringify(columns));
        const styleChanged =
            (JSON.stringify(this.props.style) !== JSON.stringify(style));
        const highlightChanged =
            (this.props.highlight !== highlight);
        const selectionChanged =
            (this.props.selection !== selection);

        let seriesChanged = false;
        if (oldSeries.length !== newSeries.length) {
            seriesChanged = true;
        } else {
            seriesChanged = !TimeSeries.is(oldSeries, newSeries);
        }

        return (
            seriesChanged ||
            timeScaleChanged ||
            widthChanged ||
            interpolateChanged ||
            isPanningChanged ||
            columnsChanged ||
            styleChanged ||
            yAxisScaleChanged ||
            highlightChanged ||
            selectionChanged);
    },

    render() {
        return (
            <g >
                {this.renderAreas()}
            </g>
        );
    }
});
