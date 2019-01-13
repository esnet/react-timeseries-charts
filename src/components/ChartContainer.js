/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import invariant from "invariant";
import merge from "merge";
import React from "react";
import PropTypes from "prop-types";
import { scaleTime, scaleUtc } from "d3-scale";
import { TimeRange } from "pondjs";
import { areComponentsEqual } from "react-hot-loader";

import Brush from "./Brush";
import MultiBrush from "./MultiBrush";
import ChartRow from "./ChartRow";
import Charts from "./Charts";
import EventHandler from "./EventHandler";
import TimeAxis from "./TimeAxis";
import TimeMarker from "./TimeMarker";
import Label from "./Label";

const defaultTimeAxisStyle = {
    axis: {
        fill: "none",
        stroke: "#C0C0C0",
        pointerEvents: "none"
    }
};

const defaultTitleStyle = {
    fontWeight: 100,
    fontSize: 14,
    font: '"Goudy Bookletter 1911", sans-serif"',
    fill: "#C0C0C0"
};

const defaultChartRowTitleLabelStyle = {
    fontWeight: 100,
    fontSize: 13,
    font: '"Goudy Bookletter 1911", sans-serif"',
    fill: "#000"
};

const defaultChartRowTitleBoxStyle = {
    fill: "white",
    stroke: "none"
};

const defaultTrackerStyle = {
    line: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    },
    box: {
        fill: "white",
        opacity: 0.9,
        stroke: "#999",
        pointerEvents: "none"
    },
    dot: {
        fill: "#999"
    }
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
export default class ChartContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handleTrackerChanged = this.handleTrackerChanged.bind(this);
        this.handleTimeRangeChanged = this.handleTimeRangeChanged.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleBackgroundClick = this.handleBackgroundClick.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
        this.saveSvgRef = this.saveSvgRef.bind(this);
    }

    //
    // Event handlers
    //

    handleTrackerChanged(t) {
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
    handleTimeRangeChanged(timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    }

    handleMouseMove(x, y) {
        this.handleTrackerChanged(this.timeScale.invert(x));
        if (this.props.onMouseMove) {
            this.props.onMouseMove(x, y);
        }
    }

    handleMouseOut(e) {
        this.handleTrackerChanged(null);
    }

    handleBackgroundClick(x, y) {
        if (this.props.onBackgroundClick) {
            const t = this.props.scale ? this.props.scale.invert(x) : this.timeScale.invert(x);
            this.props.onBackgroundClick(x, y, t);
        }
    }

    handleZoom(timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    }

    saveSvgRef(c) {
        this.svg = c;
    }

    //
    // Render
    //

    render() {
        const { padding = 0 } = this.props;
        const { paddingLeft = padding, paddingRight = padding } = this.props;
        const { paddingTop = padding, paddingBottom = padding } = this.props;

        let { titleHeight = 28 } = this.props;
        if (_.isUndefined(this.props.title)) {
            titleHeight = 0;
        }

        const chartRows = [];
        const chartRowTitles = [];
        const leftAxisWidths = [];
        const rightAxisWidths = [];

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

        React.Children.forEach(this.props.children, childRow => {
            if (areComponentsEqual(childRow.type, ChartRow)) {
                //
                // Within this row, count the number of columns that will be
                // left and right of the Charts tag, as well as the total number
                // of Charts tags for error handling
                //
                let countLeft = 0;
                let countCharts = 0;

                let align = "left";

                React.Children.forEach(childRow.props.children, child => {
                    if (child === null) return;
                    if (areComponentsEqual(child.type, Charts)) {
                        countCharts += 1;
                        align = "right";
                    } else if (
                        !areComponentsEqual(child.type, Brush) &&
                        !areComponentsEqual(child.type, MultiBrush)
                    ) {
                        if (align === "left") {
                            countLeft += 1;
                        }
                    }
                });

                if (countCharts !== 1) {
                    const msg = "ChartRow should have one and only one <Charts> tag within it";
                    invariant(false, msg, childRow.constructor.name);
                }

                align = "left";
                let pos = countLeft - 1;

                React.Children.forEach(childRow.props.children, child => {
                    if (child === null) return;
                    if (
                        areComponentsEqual(child.type, Charts) ||
                        areComponentsEqual(child.type, Brush) ||
                        areComponentsEqual(child.type, MultiBrush)
                    ) {
                        if (areComponentsEqual(child.type, Charts)) {
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

        let { timeAxisHeight = 35 } = this.props;
        if (this.props.hideTimeAxis) {
            timeAxisHeight = 0;
        }

        const timeAxisWidth =
            this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;

        if (!this.props.timeRange) {
            throw Error("Invalid timerange passed to ChartContainer");
        }

        const timeScale = (this.timeScale = this.props.utc
            ? scaleUtc()
                  .domain(this.props.timeRange.toJSON())
                  .range([0, timeAxisWidth])
            : scaleTime()
                  .domain(this.props.timeRange.toJSON())
                  .range([0, timeAxisWidth]));

        const chartsWidth = this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;

        let i = 0;
        let yPosition = paddingTop;

        // Chart title
        const transform = `translate(${leftWidth + paddingLeft},${yPosition})`;
        const titleStyle = merge(
            true,
            defaultTitleStyle,
            this.props.titleStyle ? this.props.titleStyle : {}
        );
        const title = this.props.title ? (
            <g transform={transform}>
                <Label
                    align="center"
                    label={this.props.title}
                    style={{ label: titleStyle, box: { fill: "none", stroke: "none" } }}
                    width={chartsWidth}
                    height={titleHeight}
                />
            </g>
        ) : (
            <g />
        );

        const trackerStyle = merge(
            true,
            defaultTrackerStyle,
            this.props.trackerStyle ? this.props.trackerStyle : {}
        );

        //yPosition += titleHeight;
        let chartsHeight = 0;
        React.Children.forEach(this.props.children, child => {
            if (areComponentsEqual(child.type, ChartRow)) {
                const chartRow = child;
                const rowKey = `chart-row-row-${i}`;
                const firstRow = i === 0;
                const isVisible = child.props.visible;
                const props = {
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
                    timeFormat: this.props.format,
                    trackerShowTime: firstRow,
                    trackerTime: this.props.trackerPosition,
                    trackerTimeFormat: this.props.format,
                    trackerStyle: trackerStyle,
                    onTimeRangeChanged: this.handleTimeRangeChanged,
                    onTrackerChanged: this.handleTrackerChanged
                };

                let { titleHeight = 28 } = child.props;
                if (_.isUndefined(child.props.title)) {
                    titleHeight = 0;
                }

                const transform = `translate(${-leftWidth - paddingLeft},${yPosition +
                    titleHeight})`;
                if (isVisible) {
                    chartRows.push(
                        <g transform={transform} key={rowKey}>
                            {React.cloneElement(chartRow, props)}
                        </g>
                    );

                    if (!_.isUndefined(child.props.title)) {
                        const rowTitleKey = `chart-row-row-title-${i}`;

                        const titleLabelStyle = merge(
                            true,
                            defaultChartRowTitleLabelStyle,
                            child.props.titleStyle ? child.props.titleStyle : {}
                        );
                        const titleBoxStyle = merge(
                            true,
                            defaultChartRowTitleBoxStyle,
                            child.props.titleBoxStyle ? child.props.titleBoxStyle : {}
                        );
                        const titleTransform = `translate(${-leftWidth -
                            paddingLeft},${yPosition})`;
                        const title = (
                            <g transform={titleTransform} key={rowTitleKey}>
                                <Label
                                    align="left"
                                    label={child.props.title}
                                    style={{
                                        label: titleLabelStyle,
                                        box: titleBoxStyle
                                    }}
                                    width={props.width}
                                    height={titleHeight}
                                />
                            </g>
                        );

                        chartRowTitles.push(title);
                    }

                    const height = parseInt(child.props.height, 10) + titleHeight;
                    yPosition += height;
                    chartsHeight += height;
                }
            }
            i += 1;
        });

        // Hover tracker line
        let tracker;
        if (
            this.props.trackerPosition &&
            this.props.timeRange.contains(this.props.trackerPosition)
        ) {
            tracker = (
                <g
                    key="tracker-group"
                    style={{ pointerEvents: "none" }}
                    transform={`translate(${leftWidth + paddingLeft},${paddingTop + titleHeight})`}
                >
                    <TimeMarker
                        width={chartsWidth}
                        height={chartsHeight}
                        showInfoBox={false}
                        time={this.props.trackerPosition}
                        timeScale={timeScale}
                        timeFormat={this.props.format}
                        infoWidth={this.props.trackerHintWidth}
                        infoHeight={this.props.trackerHintHeight}
                        info={this.props.trackerValues}
                        infoStyle={trackerStyle}
                    />
                </g>
            );
        }

        //
        // TimeAxis
        //

        let timeAxisStyle;
        if (this.props.hideTimeAxis) {
            timeAxisStyle = {
                axis: {
                    display: "none"
                }
            };
        } else {
            timeAxisStyle = merge(
                true,
                defaultTimeAxisStyle.axis,
                this.props.timeAxisStyle.axis ? this.props.timeAxisStyle.axis : {}
            );
        }

        const timeAxis = (
            <g
                transform={`translate(${leftWidth + paddingLeft},${paddingTop +
                    titleHeight +
                    chartsHeight})`}
            >
                <line
                    x1={-leftWidth}
                    y1={0.5}
                    x2={chartsWidth + rightWidth}
                    y2={0.5}
                    style={timeAxisStyle}
                />
                <TimeAxis
                    scale={timeScale}
                    utc={this.props.utc}
                    angled={this.props.timeAxisAngledLabels}
                    style={this.props.timeAxisStyle}
                    format={this.props.format}
                    showGrid={this.props.showGrid}
                    gridHeight={chartsHeight}
                    tickCount={this.props.timeAxisTickCount}
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
                    onMouseMove={this.handleMouseMove}
                    onMouseClick={this.handleBackgroundClick}
                    onZoom={this.handleZoom}
                >
                    {chartRows}
                </EventHandler>
            </g>
        );

        const rowTitles = (
            <g transform={`translate(${leftWidth + paddingLeft},${paddingTop + titleHeight})`}>
                {chartRowTitles}
            </g>
        );

        //
        // Final render of the ChartContainer is composed of a number of
        // chartRows, a timeAxis and the tracker indicator
        //

        const svgWidth = this.props.width;
        const svgHeight = chartsHeight + timeAxisHeight + paddingTop + paddingBottom + titleHeight;

        const svgStyle = merge(
            true,
            { display: "block" },
            this.props.style ? this.props.style : {}
        );

        return this.props.showGridPosition === "over" ? (
            <svg width={svgWidth} height={svgHeight} style={svgStyle} ref={this.saveSvgRef}>
                {title}
                {rows}
                {tracker}
                {timeAxis}
                {rowTitles}
            </svg>
        ) : (
            <svg
                width={svgWidth}
                height={svgHeight}
                style={{ display: "block" }}
                ref={this.saveSvgRef}
            >
                {title}
                {timeAxis}
                {rows}
                {rowTitles}
                {tracker}
            </svg>
        );
    }
}

ChartContainer.propTypes = {
    /**
     * A [Pond TimeRange](https://esnet-pondjs.appspot.com/#/timerange) representing the
     * begin and end time of the chart.
     */
    timeRange: PropTypes.instanceOf(TimeRange).isRequired,

    /**
     * Should the time axis use a UTC scale or local
     */
    utc: PropTypes.bool,

    /**
     * Children of the ChartContainer should be ChartRows.
     */
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
        .isRequired,

    /**
     * The width of the chart. This library also includes a <Resizable> component
     * that can be wrapped around a \<ChartContainer\>. The purpose of this is to
     * inject a width prop into the ChartContainer so that it will fit the
     * surrounding element. This is very handy when you need the chart to resize
     * based on a responsive layout.
     */
    width: PropTypes.number,

    /**
     * Constrain the timerange to not move back in time further than this Date.
     */
    minTime: PropTypes.instanceOf(Date),

    /**
     * Constrain the timerange to not move forward in time than this Date. A
     * common example is setting this to the current time or the end time
     * of a fixed set of data.
     */
    maxTime: PropTypes.instanceOf(Date),

    /**
     * Boolean to turn on interactive pan and zoom behavior for the chart.
     */
    enablePanZoom: PropTypes.bool,

    /**
     * Boolean to turn on interactive drag to zoom behavior for the chart.
     */
    enableDragZoom: PropTypes.bool,

    /**
     * If this is set the timerange of the chart cannot be zoomed in further
     * than this duration, in milliseconds. This might be determined by the
     * resolution of your data.
     */
    minDuration: PropTypes.number,

    /**
     * Provides several options as to the format of the time axis labels.
     *
     * In general the time axis will generate an appropriate time scale based
     * on the timeRange prop and there is no need to set this.
     *
     * However, some options exist:
     *
     *  - setting format to "day", "month" or "year" will show only ticks on those,
     * and every one of those intervals. For example maybe you are showing a bar
     * chart for October 2014 then setting the format to "day" will insure that a
     * label is placed for each and every day
     *
     *  - setting format to "relative" interprets the time as a duration. This
     * is good for data that is specified relative to its start time, rather than
     * as an actual date/time
     *
     *  - setting the format to a d3 format string will use that format
     *
     *  - supplying a function for format will cause that function to be called
     * whenever rendering a time
     */
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    /**
     * Time in milliseconds to transition from one Y-scale to the next
     */
    transition: PropTypes.number,

    /**
     * Show grid lines for each time marker
     */
    showGrid: PropTypes.bool,

    /**
     * Defines whether grid is overlayed ("over"( or underlayed ("under")
     * with respect to the charts
     */
    showGridPosition: PropTypes.oneOf(["over", "under"]),

    /**
     * Defines how to style the SVG
     */
    style: PropTypes.object,

    /**
     * The width of the tracker info box
     */
    trackerHintWidth: PropTypes.number,

    /**
     * The height of the tracker info box
     */
    trackerHintHeight: PropTypes.number,

    /**
     * Info box value or values to place next to the tracker line.
     * This is either an array of objects, with each object
     * specifying the label and value to be shown in the info box,
     * or a simple string label.
     */
    trackerValues: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.string
            })
        )
    ]),

    /**
     * A Date specifying the position of the tracker line on the chart. It is
     * common to take this from the onTrackerChanged callback so that the tracker
     * followers the user's cursor, but it could be modified to snap to a point or
     * to the nearest minute, for example.
     */
    trackerPosition: PropTypes.instanceOf(Date),

    /**
     * The style of the time marker. This is an object of the form { line, box, dot }.
     * Line, box and dot are themselves objects representing inline CSS for each of
     * the pieces of the info marker.
     *
     * When we use the TimeMarker as a tracker, we can style the box and dot as well.
     */
    trackerStyle: PropTypes.shape({
        line: PropTypes.object, // eslint-disable-line
        box: PropTypes.object, // eslint-disable-line
        dot: PropTypes.object // eslint-disable-line
    }),

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
    onTrackerChanged: PropTypes.func,

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
    onTimeRangeChanged: PropTypes.func,

    /**
     * Called when the size of the chart changes
     */
    onChartResize: PropTypes.func,

    /**
     * Called when the user clicks the background plane of the chart. This is
     * useful when deselecting elements.
     */
    onBackgroundClick: PropTypes.func,

    /**
     * Props for handling the padding
     */
    padding: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    paddingBottom: PropTypes.number,

    /**
     * Specify the title for the chart
     */
    title: PropTypes.string,

    /**
     * Specify the height of the title
     * Default value is 28 pixels
     */
    titleHeight: PropTypes.number,

    /**
     * Specify the styling of the chart's title
     */
    titleStyle: PropTypes.object,

    /**
     * Object specifying the CSS by which the `TimeAxis` can be styled. The object can contain:
     * "values" (the time labels), "axis" (the main horizontal line) and "ticks" (which may
     * optionally extend the height of all chart rows using the `showGrid` prop. Each of these
     * is an inline CSS style applied to the axis label, axis values, axis line and ticks
     * respectively.
     *
     * Note that "ticks" and "values" are passed into d3's styles, so they are regular CSS property names
     * and not React's camel case names (e.g. "stroke-dasharray" not "strokeDasharray"). "axis" is a
     * regular React rendered SVG line, so it uses camel case.
     */
    timeAxisStyle: PropTypes.shape({
        axis: PropTypes.object,
        values: PropTypes.object,
        ticks: PropTypes.object
    }),

    /**
     * Height of the time axis
     * Default value is 35 pixels
     */
    timeAxisHeight: PropTypes.number,

    /**
     * Specify the number of ticks
     * The default ticks for quantitative scales are multiples of 2, 5 and 10.
     * So, while you can use this prop to increase or decrease the tick count, it will always return multiples of 2, 5 and 10.
     */
    timeAxisTickCount: PropTypes.number,

    /**
     * Angle the time axis labels
     */
    timeAxisAngledLabels: PropTypes.bool,

    /**
     * Prop to hide time axis if required
     */
    hideTimeAxis: PropTypes.bool
};

ChartContainer.defaultProps = {
    width: 800,
    padding: 0,
    enablePanZoom: false,
    enableDragZoom: false,
    utc: false,
    showGrid: false,
    showGridPosition: "over",
    timeAxisStyle: defaultTimeAxisStyle,
    titleStyle: defaultTitleStyle,
    trackerStyle: defaultTrackerStyle,
    hideTimeAxis: false
};
