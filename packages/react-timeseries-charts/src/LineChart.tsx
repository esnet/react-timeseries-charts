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
import { line } from "d3-shape";
import * as React from "react";
import { TimeSeries } from "pondjs";

import { Styler } from "./styler";
import { scaleAsString } from "./util";
import { ChartProps } from "./Charts";
import curves from "./curve";
import { CurveInterpolation, LineData } from "./types";
import {
    LineChartChannelStyle,
    LineChartStyle,
    defaultLineChartChannelStyle as defaultStyle
} from "./style";

// import "@types/d3-shape";

export type LineChartProps = ChartProps & {
    series: any;
    axis: string;
    columns?: string[];
    style?: LineChartStyle | ((column: string) => LineChartChannelStyle) | Styler;
    interpolation?: CurveInterpolation;
    breakLine?: boolean;
    selection?: string;
    onSelectionChange?: (...args: any[]) => any;
    highlight?: string;
    onHighlightChange?: (...args: any[]) => any;
};

/**
 * @private
 */
export type Point = {
    x: Date;
    y: number;
};

/**
 * @private
 */
export type PointData = Point[];

/**
 * The `<LineChart>` component is able to display multiple columns of a TimeSeries
 * as separate line charts.
 *
 * The `<LineChart>` should be used within `<ChartContainer>` etc., as this will
 * construct the horizontal and vertical axis, and manage other elements.
 *
 * Here is an example of two columns of a TimeSeries being plotted with the `<LineChart>`:
 *
 * ```
  <ChartContainer timeRange={this.state.timerange} >
    <ChartRow height="200">
      <YAxis id="y" label="Price ($)" min={0.5} max={1.5} format="$,.2f" />
      <Charts>
        <LineChart
          axis="y"
          breakLine={false}
          series={currencySeries}
          columns={["aud", "euro"]}
          style={style}
          interpolation="curveBasis" />
      </Charts>
    </ChartRow>
  </ChartContainer>
 * ```
 */
export class LineChart extends React.Component<LineChartProps, {}> {
    static defaultProps: Partial<LineChartProps> = {
        columns: ["value"],
        interpolation: CurveInterpolation.curveLinear,
        breakLine: true
    };

    shouldComponentUpdate(nextProps: LineChartProps) {
        const newSeries = nextProps.series;
        const oldSeries = this.props.series;
        const width = nextProps.width;
        const timeScale = nextProps.timeScale;
        const yScale = nextProps.yScale;
        const interpolation = nextProps.interpolation;
        const highlight = nextProps.highlight;
        const selection = nextProps.selection;
        const columns = nextProps.columns;

        // What changed?
        const widthChanged = this.props.width !== width;
        const timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
        const yAxisScaleChanged = this.props.yScale !== yScale;
        const interpolationChanged = this.props.interpolation !== interpolation;
        const highlightChanged = this.props.highlight !== highlight;
        const selectionChanged = this.props.selection !== selection;
        const columnsChanged = this.props.columns !== columns;
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
            yAxisScaleChanged ||
            interpolationChanged ||
            highlightChanged ||
            selectionChanged ||
            columnsChanged
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

    /**
     * Fetch the supplied style as a LineChartStyle, given a provided
     * LineChartStyle, Styler, or function, for the `column` provided.
     */
    providedPathStyleMap(column: string): LineChartChannelStyle {
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
                return this.props.style.lineChartStyle()[column];
            } else if (_.isObject(this.props.style)) {
                const s = this.props.style as LineChartStyle;
                return s[column];
            } else {
                const fn = this.props.style as (c: string) => LineChartChannelStyle;
                return fn(column);
            }
        }
    }

    /**
     * Returns the style used for drawing the path
     */
    pathStyle(column: string) {
        let style;

        const isHighlighted = this.props.highlight && column === this.props.highlight;
        const isSelected = this.props.selection && column === this.props.selection;
        const s = this.providedPathStyleMap(column);
        const d = defaultStyle.line;

        if (this.props.selection) {
            if (isSelected) {
                style = _.merge(d.selected, s.selected ? s.selected : {});
            } else if (isHighlighted) {
                style = _.merge(d.highlighted, s.highlighted ? s.highlighted : {});
            } else {
                style = _.merge(d.muted, s.muted ? s.muted : {});
            }
        } else if (isHighlighted) {
            style = _.merge(true, d.highlighted, s.highlighted ? s.highlighted : {});
        } else {
            style = _.merge(true, d.normal, s ? s.normal : {});
        }
        style.pointerEvents = "none";
        return style;
    }

    renderPath(data: PointData, column: string, key: number) {
        const hitStyle: React.CSSProperties = {
            stroke: "white",
            fill: "none",
            opacity: 0.0,
            strokeWidth: 7,
            cursor: "crosshair",
            pointerEvents: "stroke"
        };

        // D3 generates each path
        const path = line<LineData>()
            .x(d => this.props.timeScale(d.x))
            .curve(curves[this.props.interpolation])
            .y(d => this.props.yScale(d.y))(data);

        return (
            <g key={key}>
                <path d={path} style={this.pathStyle(column)} />
                <path
                    d={path}
                    style={hitStyle}
                    onClick={e => this.handleClick(e, column)}
                    onMouseLeave={() => this.handleHoverLeave()}
                    onMouseMove={e => this.handleHover(e, column)}
                />
            </g>
        );
    }

    renderLines() {
        return _.map(this.props.columns, column => this.renderLine(column));
    }

    renderLine(column: string) {
        const pathLines = [];
        let count = 1;
        if (this.props.breakLine) {
            // Remove nulls and NaNs from the line by generating a break in the line
            const eventList = this.props.series._collection.eventList();
            let currentPoints: PointData = null;
            eventList.forEach(d => {
                const timestamp = new Date(
                    d.begin().getTime() + (d.end().getTime() - d.begin().getTime()) / 2
                );
                const value = d.get(column);
                const badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                if (!badPoint) {
                    if (!currentPoints) currentPoints = [];
                    currentPoints.push({ x: timestamp, y: value });
                } else if (currentPoints) {
                    if (currentPoints.length > 1) {
                        pathLines.push(this.renderPath(currentPoints, column, count));
                        count += 1;
                    }
                    currentPoints = null;
                }
            });
            if (currentPoints && currentPoints.length > 1) {
                pathLines.push(this.renderPath(currentPoints, column, count));
                count += 1;
            }
        } else {
            // Ignore nulls and NaNs in the line
            const cleanedPoints = [];
            const eventList = this.props.series._collection.eventList();
            eventList.forEach(d => {
                const timestamp = new Date(
                    d.begin().getTime() + (d.end().getTime() - d.begin().getTime()) / 2
                );
                const value = d.get(column);
                const badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                if (!badPoint) {
                    cleanedPoints.push({ x: timestamp, y: value });
                }
            });
            pathLines.push(this.renderPath(cleanedPoints, column, count));
            count += 1;
        }
        return <g key={column}>{pathLines}</g>;
    }

    render() {
        return <g>{this.renderLines()}</g>;
    }
}
