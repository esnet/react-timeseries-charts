/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import "array.prototype.fill";

import * as _ from "lodash";
import * as React from "react";
import curves from "./curve";
import { area, line } from "d3-shape";

import { TimeSeries, Time, Key } from "pondjs";

import { ChartProps } from "./Charts";
import { Styler } from "./styler";
import { 
    AreaChartStyle, 
    AreaChartChannelStyle, 
    defaultAreaChartStyle as defaultStyle 
} from "./style";
import { CurveInterpolation, AreaChartColumns } from "./types";
import { scaleAsString } from "./util";

export type AreaData = {
    x0: number;
    y0: number;
    y1: number;
};

export enum StyleType {
    Line = "line",
    Area = "area"
}

export type AreaChartProps = ChartProps & {
    /**
     * Reference to the axis which provides the vertical scale for ## drawing. e.g.
     * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
     */
    axis: string;

    /**
     * The determines how to handle bad/missing values in the supplied
     * TimeSeries. A missing value can be null or NaN. If breakArea
     * is set to true then the area chart will be broken on either side of
     * the bad value(s). If breakArea is false (the default) bad values
     * are simply removed and the adjoining points are connected.
     */
    breakArea?: boolean;

    /**
     * The series columns mapped to stacking up and down.
     * Has the format:
     * ```
     *  columns: {
     *      up: ["in", ...],
     *      down: ["out", ...]
     *  }
     *  ```
     */
    columns: AreaChartColumns;

    /**
     * The currenly highlighted column
     */
    highlight?: string;

    /**
     * Any of D3's interpolation modes.
     * For reference - [d3-curves](https://github.com/d3/d3-shape#curves)
     */
    interpolation: CurveInterpolation;

    /**
     * The currenly selected column
     */
    selection?: string;

    /**
     * What [Pond TimeSeries](http://software.es.net/pond/#/class/timeseries) data to visualize
     */
    series: TimeSeries<Key>;

    /**
     * Stack areas on top of each other
     */
    stack?: boolean;

    /**
     * The styles to apply to the underlying SVG lines. This is a mapping
     * of column names to objects with style attributes, in the following
     * format:
     *
     * ```
     * const style = {
     *     in: {
     *         line: {
     *             normal: {stroke: "steelblue", fill: "none", strokeWidth: 1},
     *             highlighted: {stroke: "#5a98cb", fill: "none", strokeWidth: 1},
     *             selected: {stroke: "steelblue", fill: "none", strokeWidth: 1},
     *             muted: {stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1}
     *         },
     *         area: {
     *             normal: {fill: "steelblue", stroke: "none", opacity: 0.75},
     *             highlighted: {fill: "#5a98cb", stroke: "none", opacity: 0.75},
     *             selected: {fill: "steelblue", stroke: "none", opacity: 0.75},
     *             muted: {fill: "steelblue", stroke: "none", opacity: 0.25}
     *         }
     *     },
     *     out: {
     *         ...
     *     }
     * };
     *
     * <AreaChart style={style} ... />
     * ```
     *
     * Alternatively, you can pass in a Styler. For example:
     *
     * ```
     * const upDownStyler = styler([
     *     {key: "in", color: "#C8D5B8"},
     *     {key: "out", color: "#9BB8D7"}
     * ]);
     *
     * <AreaChart columns={["in", "out"]} style={upDownStyler} ... />
     *
     * ```
     */
    style: AreaChartStyle | ((column: string) => AreaChartChannelStyle) | Styler;

    /**
     * Show or hide this chart
     */
    visible?: boolean;

    /**
     * Callback called when the highlight changes, i.e. hover event
     */
    onHighlightChange?: (column: string) => any;

    /**
     * Callback called when the selection changes, i.e. area is clicked
     */
    onSelectionChange?: (column: string) => any;
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
 *                          columns={{up: ["in"], down: ["out"]}}
 *                       />
 *                  </Charts>
 *                  <YAxis
 *                      id="traffic"
 *                      label="Traffic (bps)"
 *                      min={-max} max={max}
 *                      absolute={true}
 *                      width="60"
 *                      type="linear"
 *                  />
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
export class AreaChart extends React.Component<AreaChartProps> {
    static defaultProps: Partial<AreaChartProps> = {
        breakArea: true,
        columns: {
            up: ["value"],
            down: []
        },
        interpolation: CurveInterpolation.curveLinear,
        stack: true,
        visible: true
    };
    
    shouldComponentUpdate(nextProps: AreaChartProps) {
        const newSeries = nextProps.series;
        const oldSeries = this.props.series;
        const width = nextProps.width;
        const timeScale = nextProps.timeScale;
        const yScale = nextProps.yScale;
        const interpolation = nextProps.interpolation;
        const columns = nextProps.columns;
        const style = nextProps.style;
        const highlight = nextProps.highlight;
        const selection = nextProps.selection;

        const widthChanged = this.props.width !== width;
        const timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
        const yAxisScaleChanged = this.props.yScale !== yScale;
        const interpolationChanged = this.props.interpolation !== interpolation;
        const columnsChanged = JSON.stringify(this.props.columns) !== JSON.stringify(columns);
        const styleChanged = JSON.stringify(this.props.style) !== JSON.stringify(style);
        const highlightChanged = this.props.highlight !== highlight;
        const selectionChanged = this.props.selection !== selection;
        
        let seriesChanged = false;
        if (oldSeries.size() !== newSeries.size()) {
            seriesChanged = true;
        } else {
            seriesChanged = !TimeSeries.is(oldSeries, newSeries);
        }

        return (
            seriesChanged ||
            timeScaleChanged ||
            widthChanged ||
            interpolationChanged ||
            columnsChanged ||
            styleChanged ||
            yAxisScaleChanged ||
            highlightChanged ||
            selectionChanged
        );
    }

    handleHover(e: React.MouseEvent<SVGPathElement>, column: string) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(column);
        }
    }

    handleHoverLeave() {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    }

    handleClick(e: React.MouseEvent<SVGPathElement>, column: string) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(column);
        }
    }

    providedAreaStyleMap(column: string): AreaChartChannelStyle {
        let style: AreaChartChannelStyle = defaultStyle;
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
    }

    /**
     * Returns the style used for drawing the path
     */
    style(column: string, type: StyleType) {
        let style: React.CSSProperties;
        
        const styleMap = this.providedAreaStyleMap(column);
        const isHighlighted = this.props.highlight && column === this.props.highlight;
        const isSelected = this.props.selection && column === this.props.selection;

        if (!_.has(styleMap, StyleType.Line)) {
            console.error(
                "Provided style for AreaChart does not define a style for the outline:",
                styleMap,
                column
            );
        }
        if (!_.has(styleMap, StyleType.Area)) {
            console.error(
                "Provided style for AreaChart does not define a style for the area:",
                styleMap
            );
        }
        if (this.props.selection) {
            if (isSelected) {
                style = _.merge(
                    true,
                    defaultStyle[type].selected,
                    styleMap[type].selected ? styleMap[type].selected : {}
                );
            } else if (isHighlighted) {
                style = _.merge(
                    true,
                    defaultStyle[type].highlighted,
                    styleMap[type].highlighted ? styleMap[type].highlighted : {}
                );
            } else {
                style = _.merge(
                    true,
                    defaultStyle[type].muted,
                    styleMap[type].muted ? styleMap[type].muted : {}
                );
            }
        } else if (isHighlighted) {
            style = _.merge(
                true,
                defaultStyle[type].highlighted,
                styleMap[type].highlighted ? styleMap[type].highlighted : {}
            );
        } else {
            style = _.merge(
                true,
                defaultStyle[type].normal,
                styleMap[type].normal ? styleMap[type].normal : {}
            );
        }
        return style;
    }

    pathStyle(column: string) {
        return this.style(column, StyleType.Line);
    }

    areaStyle(column: string) {
        return this.style(column, StyleType.Area);
    }

    renderArea(data: AreaData[], column: string, key: number) {
        // Use D3 to build an area generation function
        const style = this.areaStyle(column);
        const pathStyle = this.pathStyle(column);

        const areaGenerator = area<AreaData>()
            .curve(curves[this.props.interpolation])
            .x(d => d.x0)
            .y0(d => d.y0)
            .y1(d => d.y1);

        // Use the area generation function with our stacked data
        // to get an SVG path
        const areaPath = areaGenerator(data);

        // Outline the top of the curve
        const lineGenerator = line<AreaData>()
            .curve(curves[this.props.interpolation])
            .x(d => d.x0)
            .y(d => d.y1);

        const outlinePath = lineGenerator(data);

        return (
            <g key={`area-${key}`}>
                <path d={areaPath} style={style} />
                <path
                    d={areaPath}
                    style={style}
                    onClick={e => this.handleClick(e, column)}
                    onMouseLeave={() => this.handleHoverLeave()}
                    onMouseMove={e => this.handleHover(e, column)}
                />
                <path
                    d={outlinePath}
                    style={pathStyle}
                    onClick={e => this.handleClick(e, column)}
                    onMouseLeave={() => this.handleHoverLeave()}
                    onMouseMove={e => this.handleHover(e, column)}
                />
            </g>
        );
    }

    renderPaths(columnList: string[], direction: string) {
        const dir = direction === "up" ? 1 : -1;
        const size = this.props.series.size();
        const offsets: number[] = new Array(size).fill(0);
        const len = columnList.length;

        return columnList.map((column, i) => {
            // Stack the series columns to get our data in x0, y0, y1 format
            // const data: AreaData[] = [];
            const pathAreas = [];
            let count = 1;
            if (this.props.breakArea) {
                let currentPoints: AreaData[] = null;
                for (let j = 0; j < this.props.series.size(); j += 1) {
                    const seriesPoint = this.props.series.at(j);
                    const value = seriesPoint.get(column);
                    const badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);

                    // Case 1:
                    // When stacking is present with multiple area charts, then mark bad points as 0
                    if (len > 1) {
                        if (!currentPoints) currentPoints = [];
                        if (!badPoint) {
                            currentPoints.push({
                                x0: this.props.timeScale(seriesPoint.timestamp()),
                                y0: this.props.yScale(offsets[j]),
                                y1: this.props.yScale(offsets[j] + dir * seriesPoint.get(column))
                            });
                        } else {
                            currentPoints.push({
                                x0: this.props.timeScale(seriesPoint.timestamp()),
                                y0: this.props.yScale(offsets[j]),
                                y1: this.props.yScale(offsets[j])
                            });
                        }
                        if (this.props.stack) {
                            offsets[j] += dir * seriesPoint.get(column);
                        }
                    }
                    // Case Two
                    // When only one area chart is to be drawn, then create different areas for each area and ignore nulls and NaNs
                    else {
                        if (!badPoint) {
                            if (!currentPoints) currentPoints = [];
                            currentPoints.push({
                                x0: this.props.timeScale(seriesPoint.timestamp()),
                                y0: this.props.yScale(offsets[j]),
                                y1: this.props.yScale(offsets[j] + dir * seriesPoint.get(column))
                            });
                            if (this.props.stack) {
                                offsets[j] += dir * seriesPoint.get(column);
                            }
                        } else if (currentPoints) {
                            if (currentPoints.length > 1) {
                                pathAreas.push(this.renderArea(currentPoints, column, count));
                                count += 1;
                            }
                            currentPoints = null;
                        }
                    }
                }
                if (currentPoints && currentPoints.length > 1) {
                    pathAreas.push(this.renderArea(currentPoints, column, count));
                    count += 1;
                }
            } else {
                // Ignore nulls and NaNs in the area chart
                const cleanedPoints: AreaData[] = [];
                for (let j = 0; j < this.props.series.size(); j += 1) {
                    const seriesPoint = this.props.series.at(j);
                    const value = seriesPoint.get(column);
                    const badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                    if (!badPoint) {
                        cleanedPoints.push({
                            x0: this.props.timeScale(seriesPoint.timestamp()),
                            y0: this.props.yScale(offsets[j]),
                            y1: this.props.yScale(offsets[j] + dir * seriesPoint.get(column))
                        });
                        if (this.props.stack) {
                            offsets[j] += dir * seriesPoint.get(column);
                        }
                    }
                }

                pathAreas.push(this.renderArea(cleanedPoints, column, count));
                count += 1;
            }

            return <g key={column}>{pathAreas}</g>;
        });
    }

    renderAreas() {
        const up = this.props.columns.up || [];
        const down = this.props.columns.down || [];
        return (
            <g>
                {this.renderPaths(up, "up")}
                {this.renderPaths(down, "down")}
            </g>
        );
    }

    render() {
        return <g>{this.renderAreas()}</g>;
    }
}
