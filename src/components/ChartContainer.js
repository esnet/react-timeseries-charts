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
import React from "react";
import PropTypes from "prop-types";
import { scaleTime, scaleUtc } from "d3-scale";
import { TimeRange } from "pondjs";

import Brush from "./Brush";
import ChartRow from "./ChartRow";
import Charts from "./Charts";
import EventHandler from "./EventHandler";
import TimeAxis from "./TimeAxis";
import TimeMarker from "./TimeMarker";

const defaultTimeAxisStyle = {
    labels: {
        labelColor: "#8B7E7E",
        labelWeight: 100,
        labelSize: 11
    },
    axis: {
        axisColor: "#C0C0C0",
        axisWidth: 1
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
    //
    // Event handlers
    //

    handleTrackerChanged(t) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t);
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
        if (this.props.onTrackerChanged) {
            const time = this.timeScale.invert(x);
            this.props.onTrackerChanged(time);
        }
        if (this.props.onMouseMove) {
            this.props.onMouseMove(x, y);
        }
    }

    handleMouseOut() {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(null);
        }
    }

    handleBackgroundClick() {
        if (this.props.onBackgroundClick) {
            this.props.onBackgroundClick();
        }
    }

    handleZoom(timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    }

    handleResize(width, height) {
        if (this.props.onChartResize) {
            this.props.onChartResize(width, height);
        }
    }

    //
    // Render
    //

    render() {
        const chartRows = [];
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
            if (childRow.type === ChartRow) {
                //
                // Within this row, count the number of columns that will be
                // left and right of the Charts tag, as well as the total number
                // of Charts tags for error handling
                //

                let countLeft = 0;
                let countCharts = 0;

                let align = "left";

                React.Children.forEach(childRow.props.children, child => {
                    if (child.type === Charts) {
                        countCharts += 1;
                        align = "right";
                    } else if (child.type !== Brush) {
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
                    if (child.type === Charts || child.type === Brush) {
                        if (child.type === Charts) {
                            align = "right";
                            pos = 0;
                        }
                    } else {
                        const width = Number(child.props.width) || 40;
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
        const leftWidth = _.reduce(leftAxisWidths, (a, b) => a + b, 0);
        const rightWidth = _.reduce(rightAxisWidths, (a, b) => a + b, 0);

        //
        // Time scale
        //

        const timeAxisHeight = 35;
        const timeAxisWidth = this.props.width - leftWidth - rightWidth;

        if (!this.props.timeRange) {
            throw Error("Invalid timerange passed to ChartContainer");
        }

        const timeScale = (this.timeScale = this.props.utc
            ? scaleUtc().domain(this.props.timeRange.toJSON()).range([0, timeAxisWidth])
            : scaleTime().domain(this.props.timeRange.toJSON()).range([0, timeAxisWidth]));

        let i = 0;
        let yPosition = 0;
        React.Children.forEach(this.props.children, child => {
            if (child.type === ChartRow) {
                const chartRow = child;
                const rowKey = `chart-row-row-${i}`;
                const firstRow = i === 0;
                const props = {
                    timeScale,
                    leftAxisWidths,
                    rightAxisWidths,
                    width: this.props.width,
                    minTime: this.props.minTime,
                    maxTime: this.props.maxTime,
                    transition: this.props.transition,
                    enablePanZoom: this.props.enablePanZoom,
                    minDuration: this.props.minDuration,
                    timeFormat: this.props.format,
                    trackerShowTime: firstRow,
                    trackerTime: this.props.trackerPosition,
                    trackerTimeFormat: this.props.format,
                    onTimeRangeChanged: tr => this.handleTimeRangeChanged(tr),
                    onTrackerChanged: t => this.handleTrackerChanged(t)
                };
                const transform = `translate(${-leftWidth},${yPosition})`;
                chartRows.push(
                    <g transform={transform} key={rowKey}>
                        {React.cloneElement(chartRow, props)}
                    </g>
                );
                yPosition += parseInt(child.props.height, 10);
            }
            i += 1;
        });

        const chartsHeight = yPosition;
        const chartsWidth = this.props.width - leftWidth - rightWidth;

        // Hover tracker line
        let tracker;
        if (
            this.props.trackerPosition && this.props.timeRange.contains(this.props.trackerPosition)
        ) {
            tracker = (
                <g
                    key="tracker-group"
                    style={{ pointerEvents: "none" }}
                    transform={`translate(${leftWidth},0)`}
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
                    />
                </g>
            );
        }

        //
        // TimeAxis
        //

        const xStyle = {
            stroke: this.props.timeAxisStyle.axis.axisColor,
            strokeWidth: this.props.timeAxisStyle.axis.axisWidth,
            fill: "none",
            pointerEvents: "none"
        };

        const timeAxis = (
            <g transform={`translate(${leftWidth},${chartsHeight})`}>
                <line x1={-leftWidth} y1={0.5} x2={this.props.width} y2={0.5} style={xStyle} />
                <TimeAxis
                    scale={timeScale}
                    utc={this.props.utc}
                    style={this.props.timeAxisStyle}
                    format={this.props.format}
                    showGrid={this.props.showGrid}
                    gridHeight={chartsHeight}
                />
            </g>
        );

        //
        // Event handler
        //

        const rows = (
            <g transform={`translate(${leftWidth},${0})`}>
                <EventHandler
                    key="event-handler"
                    width={chartsWidth}
                    height={chartsHeight + timeAxisHeight}
                    scale={timeScale}
                    enablePanZoom={this.props.enablePanZoom}
                    minDuration={this.props.minDuration}
                    minTime={this.props.minTime}
                    maxTime={this.props.maxTime}
                    onMouseOut={e => this.handleMouseOut(e)}
                    onMouseMove={(x, y) => this.handleMouseMove(x, y)}
                    onMouseClick={e => this.handleBackgroundClick(e)}
                    onZoom={tr => this.handleZoom(tr)}
                    onResize={(width, height) => this.handleResize(width, height)}
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
        const svgHeight = yPosition + timeAxisHeight;

        return this.props.showGridPosition === "over"
            ? <svg width={svgWidth} height={svgHeight} style={{ display: "block" }}>
                  {rows}
                  {tracker}
                  {timeAxis}
              </svg>
            : <svg width={svgWidth} height={svgHeight} style={{ display: "block" }}>
                  {timeAxis}
                  {rows}
                  {tracker}
              </svg>;
    }
}

ChartContainer.propTypes = {
    /**
   * A Pond TimeRange representing the begin and end time of the chart.
   */
    timeRange: PropTypes.instanceOf(TimeRange).isRequired,
    /**
   * Should the time axis use a UTC scale or local
   */
    utc: PropTypes.bool,
    /**
   * Children of the ChartContainer should be ChartRows.
   */
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element
    ]).isRequired,
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
   * Adjust the time axis style. This is an object of the
   * form { labels, axis } where "label" and "axis" are objects
   * themselves. The options here are best represented by
   * an example:
   *
   * ```
   *  const axisStyle = {
   *      labels: {
   *          labelColor: "grey",
   *          labelWeight: 100,
   *          labelSize: 11
   *      },
   *      axis: {
   *          axisColor: "grey",
   *          axisWidth: 1
   *      }
   *  };
   * ```
   */
    timeAxisStyle: PropTypes.shape({
        labels: PropTypes.object, // eslint-disable-line
        axis: PropTypes.object
    }),
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
                label: PropTypes.string, // eslint-disable-line
                value: PropTypes.string // eslint-disable-line
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
   * Will be called when the user hovers over a chart. The callback will
   * be called with the timestamp (a Date object) of the position hovered
   * over. This maybe then used as the trackerPosition (see above), or to
   * information data about the time hovered over within the greater page.
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
    onBackgroundClick: PropTypes.func
};

ChartContainer.defaultProps = {
    width: 800,
    padding: 0,
    enablePanZoom: false,
    utc: false,
    showGrid: false,
    showGridPosition: "over",
    timeAxisStyle: defaultTimeAxisStyle
};
