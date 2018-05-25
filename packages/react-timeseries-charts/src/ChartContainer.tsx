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
import * as moment from "moment-timezone";
import * as React from "react";

import { ReactElement, ReactNode } from "react";
import { scaleTime, scaleUtc } from "d3-scale";
import { TimeAxis } from "react-axis"; // ts-ignore-line
import { TimeRange } from "pondjs";
import { areComponentsEqual } from "react-hot-loader";

import { Brush } from "./Brush";
import { ChartRow, ChartRowProps } from "./ChartRow";
import { Charts, ChartsProps } from "./Charts";
import { EventHandler } from "./EventHandler";
import { MultiBrush } from "./MultiBrush";
import { LabelValueList } from "./types";
import { TimeMarker } from "./TimeMarker";
import { Label } from "./Info";

import { ScaleTime, ScaleLinear, ScaleLogarithmic } from "d3-scale";
import { ScalerFunction } from "./interpolators";

const defaultTimeAxisStyle = {
    axis: {
        fill: "none",
        stroke: "#C0C0C0",
        pointerEvents: "none"
    }
};

const defaultTitleStyle: React.CSSProperties = {
    fontWeight: 100,
    fontSize: 14,
    font: '"Goudy Bookletter 1911", sans-serif"',
    fill: "#C0C0C0"
};

export type StyleTargets = {
    labels: any;
    axis: any;
};

export type StyleTargetKeys = keyof StyleTargets;
export type TimeAxisStyleType = { [K in StyleTargetKeys]: object };

export enum ShowGridPosition {
    Over = "OVER",
    Under = "UNDER"
}

export type ChartContainerProps = {
    children: any;
    timeRange: TimeRange;
    timezone?: string;
    width?: number;
    minTime?: Date;
    maxTime?: Date;
    timeFormat?: string; // TODO - add function
    timeAxisStyle?: any; // TODO
    timeAxisAngledLabels?: boolean;
    enablePanZoom?: boolean;
    enableDragZoom?: boolean;
    minDuration?: number;
    transition?: number;
    padding?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    showGrid?: boolean;
    showGridPosition?: ShowGridPosition;
    trackerTime?: Date;
    trackerInfo?: LabelValueList | string;
    trackerInfoWidth?: number;
    trackerInfoHeight?: number;
    onTrackerChanged?: (time: Date, number: (t: any) => number) => any;
    onTimeRangeChanged?: (timerange: TimeRange) => any;
    onBackgroundClick?: () => any;
    onChartResize?: () => any;
    onMouseMove?: (x: number, y: number) => any;
    timeScale?: ScaleTime<number, number>;
    yScale?: ScalerFunction;
    titleHeight?: number;
    title?: string;
    timeAxisHeight?: number;
    titleStyle?: any;
};

/**
 * The `<ChartContainer>` is the outer most element of a chart and is
 * responsible for generating and arranging its sub-elements. Specifically,
 * it is a container for one or more `<ChartRows>` (each of which contains
 * charts, axes etc) and in addition it manages the overall time range of
 * the chart and so also is responsible for the time axis, which is always
 * shared by all the rows.
 *
 * Here is an example:
 *
 * ```xml
 * <ChartContainer timeRange={audSeries.timerange()} width="800">
 *     <ChartRow>
 *         ...
 *     </ChartRow>
 *     <ChartRow>
 *         ...
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
export class ChartContainer extends React.Component<ChartContainerProps> {
    static defaultProps: Partial<ChartContainerProps> = {
        width: 800,
        padding: 0,
        enablePanZoom: false,
        enableDragZoom: false,
        timezone: "Etc/UTC",
        showGrid: false,
        showGridPosition: ShowGridPosition.Over,
        timeAxisStyle: defaultTimeAxisStyle
    };

    leftWidth: number;
    rightWidth: number;
    timeScale: ScaleTime<number, number>;
    svg: SVGElement;

    constructor(props) {
        super(props);
        this.handleBackgroundClick = this.handleBackgroundClick.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleTimeRangeChanged = this.handleTimeRangeChanged.bind(this);
        this.handleTrackerChanged = this.handleTrackerChanged.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
    }
    //
    // Event handlers
    //
    handleTrackerChanged(t: Date) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(
                t,
                // Adjust the scaled time so that the result
                // is the true x position relative to the whole chart
                t => this.timeScale(t) + this.leftWidth
            );
        }
    }

    /**
     * Within the charts library the time range of the x axis is kept as a begin
     * and end time (Javascript Date objects). But the interface is Pond based,
     * so this callback returns a Pond TimeRange.
     */
    handleTimeRangeChanged(timerange: TimeRange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    }

    /**
     * Called from the EventHandler.onMouseMove with the cursor
     * position as a Date.
     */
    handleMouseMove(x, y) {
        this.handleTrackerChanged(this.timeScale.invert(x));
        if (this.props.onMouseMove) {
            this.props.onMouseMove(x, y);
        }
    }

    /**
     * Called from the EventHandler.onMouseOut when the cursor leaves
     * the chart area.
     */
    handleMouseOut() {
        this.handleTrackerChanged(null);
    }

    /**
     * Called from the EventHandler (onMouseClick callback) when the user clicks on
     * an area without a chart.
     */
    handleBackgroundClick() {
        if (this.props.onBackgroundClick) {
            this.props.onBackgroundClick();
        }
    }

    handleZoom(timerange: TimeRange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    }

    render() {
        const { padding = 0 } = this.props;
        const { paddingLeft = padding, paddingRight = padding } = this.props;
        const { paddingTop = padding, paddingBottom = padding } = this.props;

        let { titleHeight = 28 } = this.props;
        if (_.isUndefined(this.props.title)) {
            titleHeight = 0;
        }

        const chartRows: JSX.Element[] = [];
        const leftAxisWidths: number[] = [];
        const rightAxisWidths: number[] = [];

        //
        // How much room does the axes of all the charts take up on the right
        // and left. The result is an array for left and right axis which
        // contain the min column width needed to hold the axes widths at the
        // pos for all rows.
        //
        // pos   1      0        <charts>     0        1        2
        //     | Axis | Axis |   CHARTS    |  Axis  |                      Row 1
        //            | Axis |   CHARTS    |  Axis  |  Axis  |  Axis |     Row 2
        //     ...............              ..........................
        //          left cols              right cols
        //

        React.Children.forEach(this.props.children, (childRow: ReactElement<ChartRowProps>) => {
            if (areComponentsEqual(childRow.type as React.ComponentType<any>, ChartRow)) {
                //
                // Within this row, count the number of columns that will be
                // left and right of the Charts tag, as well as the total number
                // of Charts tags for error handling
                //
                let countLeft = 0;
                let countCharts = 0;
                let align = "left";

                React.Children.forEach(childRow.props.children, (child: ReactElement<any>) => {
                    if (child === null) return;
                    if (areComponentsEqual(child.type as React.ComponentType<any>, Charts)) {
                        countCharts += 1;
                        align = "right";
                    } else if (
                        !areComponentsEqual(child.type as React.ComponentType<any>, Brush) &&
                        !areComponentsEqual(child.type as React.ComponentType<any>, MultiBrush)
                    ) {
                        if (align === "left") {
                            countLeft += 1;
                        }
                    }
                });

                if (countCharts !== 1) {
                    const msg = "ChartRow should have one and only one <Charts> tag within it";
                    console.error(msg);
                }

                align = "left";
                let pos = countLeft - 1;

                React.Children.forEach(childRow.props.children, (child: ReactElement<any>) => {
                    if (child === null) return;
                    if (
                        areComponentsEqual(child.type as React.ComponentType<any>, Charts) ||
                        areComponentsEqual(child.type as React.ComponentType<any>, Brush) ||
                        areComponentsEqual(child.type as React.ComponentType<any>, MultiBrush)
                    ) {
                        if (areComponentsEqual(child.type as React.ComponentType<any>, Charts)) {
                            align = "right";
                            pos = 0;
                        }
                    } else {
                        let width = Number(child.props.width) || 40;
                        const visible = !_.has(child.props, "visible") || child.props.visible;
                        if (!visible) width = 0;

                        if (align === "left") {
                            leftAxisWidths[pos] = leftAxisWidths[pos]
                                ? Math.max(width, leftAxisWidths[pos])
                                : width;
                            pos -= 1;
                        } else if (align === "right") {
                            rightAxisWidths[pos] = rightAxisWidths[pos]
                                ? Math.max(width, rightAxisWidths[pos])
                                : width;
                            pos += 1;
                        }
                    }
                });
            }
        });

        // Space used by columns on left and right of charts
        const leftWidth = (this.leftWidth = _.reduce(leftAxisWidths, (a, b) => a + b, 0));
        const rightWidth = (this.rightWidth = _.reduce(rightAxisWidths, (a, b) => a + b, 0));

        //
        // Time scale
        //

        const { timeAxisHeight = 35 } = this.props;

        const timeAxisWidth = 
            this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;

        if (!this.props.timeRange) {
            throw Error("Invalid timerange passed to ChartContainer");
        }

        // TODO: We need a time scalar that is timezone aware
        // This might help: https://github.com/metocean/d3-chronological/blob/master/scale.js

        this.timeScale =
            this.props.timezone === "Etc/UTC"
                ? scaleUtc()
                      .domain([this.props.timeRange.begin(), this.props.timeRange.end()])
                      .range([0, timeAxisWidth])
                : scaleTime()
                      .domain([this.props.timeRange.begin(), this.props.timeRange.end()])
                      .range([0, timeAxisWidth]);
        
        const chartsWidth = this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;

        let i = 0;
        let yPosition = 0;

        // Chart title
        const transform = `translate(${leftWidth + paddingLeft},${yPosition})`;
        const titleStyle = _.merge(
            true,
            defaultTitleStyle,
            this.props.titleStyle ? this.props.titleStyle : {}
        );
        const title = this.props.title ? (
            <g transform={transform}>
                <Label
                    align="center"
                    label={this.props.title}
                    style={{ text: titleStyle, box: { fill: "none", stroke: "none" } }}
                    width={chartsWidth}
                    height={titleHeight}
                />
            </g>
        ) : (
            <g />
        );

        let chartsHeight = 0;
        React.Children.forEach(this.props.children, (child: ReactElement<any>) => {
            if (areComponentsEqual(child.type as React.ComponentType<any>, ChartRow)) {
                const chartRow = child;
                const rowKey = `chart-row-row-${i}`;
                const firstRow = i === 0;
                const isVisible = child.props.visible;
                const props: ChartRowProps = {
                    timeScale: this.timeScale,
                    paddingLeft,
                    paddingRight,
                    leftAxisWidths,
                    rightAxisWidths,
                    width: this.props.width,
                    minTime: this.props.minTime,
                    maxTime: this.props.maxTime,
                    transition: this.props.transition,
                    enablePanZoom: this.props.enablePanZoom,
                    minDuration: this.props.minDuration,
                    showGrid: this.props.showGrid,
                    timeFormat: this.props.timeFormat,
                    trackerShowTime: firstRow,
                    trackerTime: this.props.trackerTime,
                    trackerTimeFormat: this.props.timeFormat,
                    onTimeRangeChanged: tr => this.handleTimeRangeChanged(tr),
                    onTrackerChanged: t => this.handleTrackerChanged(t)
                };
                const transform = `translate(${-leftWidth - paddingLeft},${yPosition})`;
                if (isVisible) {
                    chartRows.push(
                        <g transform={transform} key={rowKey}>
                            {React.cloneElement(chartRow, props)}
                        </g>
                    );

                    const height = parseInt(child.props.height, 10);
                    yPosition += height;
                    chartsHeight += height;
                }
            }
            i += 1;
        });

        //
        // Hover tracker line
        //
        let tracker;
        if (this.props.trackerTime && this.props.timeRange.contains(this.props.trackerTime)) {
            tracker = (
                <g
                    key="tracker-group"
                    style={{ pointerEvents: "none" }}
                    transform={`translate(${leftWidth + paddingLeft},${paddingTop + titleHeight})`}
                >
                    <TimeMarker
                        key="marker"
                        width={chartsWidth}
                        height={chartsHeight}
                        showInfoBox={false}
                        time={this.props.trackerTime}
                        timeScale={this.timeScale}
                        timeFormat={this.props.timeFormat}
                        info={this.props.trackerInfo}
                        infoWidth={this.props.trackerInfoWidth}
                        infoHeight={this.props.trackerInfoHeight}
                    />
                </g>
            );
        }

        //
        // TimeAxis
        //

        const timeAxisStyle = _.merge(
            true,
            defaultTimeAxisStyle.axis,
            this.props.timeAxisStyle.axis ? this.props.timeAxisStyle.axis : {}
        );

        const xStyle: React.CSSProperties = {
            stroke: this.props.timeAxisStyle.axis.axisColor,
            strokeWidth: this.props.timeAxisStyle.axis.axisWidth,
            fill: "none",
            pointerEvents: "none"
        };

        // const textStyle: React.CSSProperties = {
        //     fill: this.props.timeAxisStyle.labels.labelColor,
        //     fontSize: this.props.timeAxisStyle.labels.labelSize,
        //     stroke: "none",
        //     pointerEvents: "none"
        // };

        const gridHeight = this.props.showGrid ? chartsHeight : 0;
        const timezone = this.props.timezone === "local" ? moment.tz.guess() : this.props.timezone;

        const timeAxis = (
            <g transform={`translate(${leftWidth + paddingLeft},${paddingTop + titleHeight + chartsHeight})`}>
                <line 
                    x1={-leftWidth} 
                    y1={0.5} 
                    x2={chartsWidth + rightWidth} 
                    y2={0.5} 
                    style={xStyle} 
                />
                {/* <TimeAxis
                    scale={timeScale}
                    utc={this.props.utc}
                    angled={this.props.timeAxisAngledLabels}
                    style={this.props.timeAxisStyle}
                    format={this.props.format}
                    showGrid={this.props.showGrid}
                    gridHeight={chartsHeight}
                    tickCount={this.props.timeAxisTickCount}
                /> */}
                <TimeAxis
                    timezone={timezone}
                    position="bottom"
                    beginTime={new Date(this.props.timeRange.begin().getTime())}
                    endTime={new Date(this.props.timeRange.end().getTime())}
                    width={timeAxisWidth}
                    margin={0}
                    height={50}
                    tickExtend={gridHeight}
                    textStyle={xStyle}
                />
            </g>
        );

        //
        // Event handler
        //
        const rows = (
            <g transform={`translate(${leftWidth + paddingLeft},${paddingTop + titleHeight})`}>
                <EventHandler
                    key="event-handler"
                    width={chartsWidth}
                    height={chartsHeight + timeAxisHeight}
                    scale={this.timeScale}
                    enablePanZoom={this.props.enablePanZoom}
                    enableDragZoom={this.props.enableDragZoom}
                    minDuration={this.props.minDuration}
                    minTime={this.props.minTime}
                    maxTime={this.props.maxTime}
                    onMouseOut={this.handleMouseOut}
                    onMouseMove={(x, y) => this.handleMouseMove(x, y)}
                    onMouseClick={this.handleBackgroundClick}
                    onZoom={tr => this.handleZoom(tr)}
                >
                    {chartRows}
                </EventHandler>
            </g>
        );

        //
        // Final render of the ChartContainer is composed of a number of
        // chartRows, a timeAxis and the tracker indicator
        //
        const svgWidth = this.props.width;
        const svgHeight = yPosition + timeAxisHeight + paddingTop + paddingBottom + titleHeight;

        const svgStyle = _.merge(
            true,
            { display: "block" },
            this.props.timeAxisStyle ? this.props.timeAxisStyle : {}
        );

        return this.props.showGridPosition.toUpperCase() === ShowGridPosition.Over ? (
            <svg 
                width={svgWidth} 
                height={svgHeight} 
                style={svgStyle}
                ref={c => {
                    this.svg = c;
                }}
            >
                {title}
                {rows}
                {tracker}
                {timeAxis}
            </svg>
        ) : (
            <svg 
                width={svgWidth} 
                height={svgHeight} 
                style={{ display: "block" }}
                ref={c => {
                    this.svg = c;
                }}
            >
                {title}
                {timeAxis}
                {rows}
                {tracker}
            </svg>
        );
    }
}
