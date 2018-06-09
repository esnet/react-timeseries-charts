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

import { ReactElement } from "react";
import { scaleTime, scaleUtc } from "d3-scale";
import { TimeAxis } from "react-axis"; // ts-ignore-line
import { TimeRange } from "pondjs";
import { areComponentsEqual } from "react-hot-loader";

import { Brush } from "./Brush";
import { ChartRow, ChartRowProps } from "./ChartRow";
import { Charts, ChartProps, ChartsProps } from "./Charts";
import { EventHandler } from "./EventHandler";
import { MultiBrush } from "./MultiBrush";
import { LabelValueList } from "./types";
import { TimeMarker } from "./TimeMarker";
import { Label } from "./Info";
import {
    TimeAxisStyle,
    defaultTimeAxisStyle as defaultStyle
} from "./style";

import { ScaleTime } from "d3-scale";

const defaultChartAxisStyle: React.CSSProperties = {
    fill: "none",
    stroke: "#C0C0C0",
    pointerEvents: "none"
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

export type ChartContainerProps = ChartProps & {
    /**
     * Children of the ChartContainer should be ChartRows.
     */
    children: any;

    /**
     * A [Pond TimeRange](http://software.es.net/pond/#/class/timerange) representing the
     * begin and end time of the chart.
     */
    timeRange: TimeRange;

    /**
     * Should the time axis use a UTC scale, local or any other
     */
    timezone?: string;

    /**
     * The width of the chart. This library also includes a <Resizable> component
     * that can be wrapped around a `<ChartContainer>`. The purpose of this is to
     * inject a width prop into the ChartContainer so that it will fit the
     * surrounding element. This is very handy when you need the chart to resize
     * based on a responsive layout.
     */
    width?: number;
    
    /**
     * Constrain the timerange to not move back in time further than this Date.
     */
    minTime?: Date;

    /**
     * Constrain the timerange to not move forward in time than this Date. A
     * common example is setting this to the current time or the end time
     * of a fixed set of data.
     */
    maxTime?: Date;

    /**
     * The format for the tick labels.
     *
     * The default it to compute this automatically. You can also specify this
     * as a string or function.
     *
     * Six special options exist, specified as a string: setting format to:
     *  * "second",
     *  * "hour"
     *  * "day"
     *  * "month"
     *  * "year"
     *
     * will show only ticks on those, and every one of those intervals.
     *
     * For example maybe you are showing a bar chart for October 2014 then setting
     * the format to "day" will insure that a label is placed for each and every day,
     * all 31 of them. Be careful though, it's easy to add too many labels this way.
     *
     * The last string option is:
     *  * "duration".
     *
     * This interprets the time as a duration. This is good for data that is
     * specified relative to its start time, rather than as an actual date/time.
     *
     * Finally, format can also be a function. The function will be passed the date
     * it is rendering. It expects the return result to be a an object describing
     * the resulting tick. For example:
     *
     * ```js
     * format = (d) => ({
     *      label: moment(d).format(h:mm a),
     *      size: 15,
     *      labelAlign: "adjacent"
     * });
     * ```
     */
    timeFormat?: string | ((d: Date) => string);
    
    /**
     * Object specifying the CSS by which the `TimeAxis` can be styled. The object can contain:
     * `values` (the time values), `axis` (the main horizontal line), `label` and `ticks` 
     * (which may optionally extend the height of all chart rows using the `showGrid` prop). 
     * Each of these is an inline CSS style applied to the axis label, axis values, axis line and ticks
     * respectively.
     *
     * For example:
     * ```
     * const timeAxisStyle = {
     *  ticks: {
     *      stroke: "#AAA",
     *      opacity: 0.25,
     *      strokeDasharray: "1,1"
     *   },
     *   values: {
     *      fill: "#AAA",
     *      fontSize: 12
     *   }
     * }
     * ```
     */
    timeAxisStyle?: TimeAxisStyle;
    
    /**
     * Angle the time axis labels
     */
    timeAxisAngledLabels?: boolean;

    /**
     * Refers to the styling of the axis generated by the Chart Container
     */
    chartAxisStyle?: any;

    /**
     * Boolean to turn on interactive pan and zoom behavior for the chart.
     */
    enablePanZoom?: boolean;

    /**
     * Boolean to turn on interactive drag to zoom behavior for the chart.
     */
    enableDragZoom?: boolean;

    /**
     * If this is set the timerange of the chart cannot be zoomed in further
     * than this duration, in milliseconds. This might be determined by the
     * resolution of your data.
     */
    minDuration?: number;

    /**
     * Time in milliseconds to transition from one Y-scale to the next
     */
    transition?: number;

    /**
     * Padding to add
     */
    padding?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    timeAxisHeight?: number;
    leftWidth?: number;
    rightWidth?: number;

    /**
     * Show grid lines for each time marker
     */
    showGrid?: boolean;

    /**
     * Defines whether grid is overlayed (`over`) or underlayed (`under`)
     * with respect to the charts
     */
    showGridPosition?: ShowGridPosition;

    /**
     * A Date specifying the position of the tracker line on the chart. It is
     * common to take this from the onTrackerChanged callback so that the tracker
     * followers the user's cursor, but it could be modified to snap to a point or
     * to the nearest minute, for example.
     */
    trackerTime?: Date;

    /**
     * Info box value or values to place next to the tracker line.
     * This is either an array of objects, with each object
     * specifying the label and value to be shown in the info box,
     * or a simple string.
     */
    trackerInfo?: LabelValueList | string;

    /**
     * The width of the tracker info box
     */
    trackerInfoWidth?: number;

    /**
     * The height of the tracker info box
     */
    trackerInfoHeight?: number;

    /**
     * Will be called when the user hovers over a chart. The callback will
     * be called with the timestamp (a Date object) of the position hovered
     * over as well as the current time axis' time scale. The timestamp may
     * be used as the trackerPosition (see above), or to provide information
     * about the time hovered over within the greater page. The time scale
     * may be used to translate the timestamp into an x coordinate, which
     * can then be used to position arbitrary components in sync with the
     * current tracker position.
     * Commonly we might do something like this:
     * ```
     *   <ChartContainer
     *     onTrackerChanged={(tracker) => this.setState({tracker})}
     *     trackerPosition={this.state.tracker}
     *     ... />
     * ```
     */
    onTrackerChanged?: (time: Date, number: (t: any) => number) => any;

    /**
     * This will be called if the user pans and/or zooms the chart. The callback
     * will be called with the new TimeRange. This can be fed into the timeRange
     * prop as well as used elsewhere on the greater page. Typical use might look
     * like this:
     * ```
     *   <ChartContainer
     *     onTimeRangeChanged={(timerange) => this.setState({timerange})}
     *     timeRange={this.state.timerange}
     *     ... />
     * ```
     */
    onTimeRangeChanged?: (timerange: TimeRange) => any;

    /**
     * Called when the user clicks the background plane of the chart. This is
     * useful when deselecting elements.
     */
    onBackgroundClick?: () => any;
    
    onMouseMove?: (x: number, y: number) => any;

    /**
     * Specify the title of the chart
     */
    title?: string;

    /**
     * Define the height of the title label
     */
    titleHeight?: number;

    /**
     * Define the styling of the chart's title
     */
    titleStyle?: React.CSSProperties;

    /**
     * Style the chart container
     */
    style?: React.CSSProperties;
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
        timezone: "local",
        showGrid: false,
        showGridPosition: ShowGridPosition.Over,
        chartAxisStyle: defaultChartAxisStyle
    };

    leftWidth: number;
    rightWidth: number;
    timeScale: ScaleTime<number, number>;
    svg: SVGElement;

    constructor(props: ChartContainerProps) {
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

        const timeScale = (this.timeScale =
            this.props.timezone === "Etc/UTC"
                ? scaleUtc()
                      .domain([this.props.timeRange.begin(), this.props.timeRange.end()])
                      .range([0, timeAxisWidth])
                : scaleTime()
                      .domain([this.props.timeRange.begin(), this.props.timeRange.end()])
                      .range([0, timeAxisWidth]));
        
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
                    timeScale,
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
        if (this.props.trackerTime) {
            if(this.props.timeRange.contains(this.props.trackerTime)) {
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
                            timeScale={timeScale}
                            timeFormat={this.props.timeFormat}
                            info={this.props.trackerInfo}
                            infoWidth={this.props.trackerInfoWidth}
                            infoHeight={this.props.trackerInfoHeight}
                        />
                    </g>
                );
            }
        }

        //
        // TimeAxis
        //

        const timeAxisStyle = _.merge(
            true,
            defaultStyle,
            this.props.timeAxisStyle ? this.props.timeAxisStyle : {}
        );

        const chartAxisStyle = _.merge(
            true,
            defaultChartAxisStyle,
            this.props.chartAxisStyle ? this.props.chartAxisStyle : {}
        );

        const tickSize = this.props.showGrid ? chartsHeight : 0;
        const timezone = this.props.timezone === "local" ? moment.tz.guess() : this.props.timezone;

        const timeAxis = (
            <g transform={`translate(${leftWidth + paddingLeft},${paddingTop + titleHeight + chartsHeight})`}>
                 <line 
                    x1={-leftWidth} 
                    y1={0.5} 
                    x2={chartsWidth + rightWidth} 
                    y2={0.5} 
                    style={chartAxisStyle} 
                />
                <TimeAxis
                    timezone={timezone}
                    position="bottom"
                    beginTime={new Date(this.props.timeRange.begin().getTime())}
                    endTime={new Date(this.props.timeRange.end().getTime())}
                    width={timeAxisWidth}
                    margin={0}
                    height={50}
                    tickExtend={tickSize}
                    style={timeAxisStyle}
                    format={this.props.timeFormat}
                    angled={this.props.timeAxisAngledLabels}
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
                    scale={timeScale}
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
            this.props.style ? this.props.style : {}
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
                style={svgStyle}
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
