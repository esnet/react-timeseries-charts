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
import React, { ReactElement, ReactNode } from "react";
import { scaleTime, scaleUtc } from "d3-scale";
import { TimeRange } from "pondjs";

import { Brush } from "./Brush";
import { ChartRow, ChartRowProps } from "./ChartRow";
import { Charts, ChartsProps } from "./Charts";
import { EventHandler } from "./EventHandler";
import { TimeAxis, TimeAxisStyle } from "./TimeAxis";
import { TimeMarker, InfoValues } from "./TimeMarker";

import "@types/d3-scale";

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

interface StyleTargets {
    labels: any;
    axis: any;
}
type StyleTargetKeys = keyof StyleTargets;
export type TimeAxisStyleType = {[K in StyleTargetKeys]: object };

enum ShowGridPosition {
    Over = "OVER",
    Under = "UNDER"
}

type ChartContainerProps = {
    children?: any;
    timeRange: TimeRange;
    utc?: boolean;
    width?: number;
    minTime?: Date;
    maxTime?: Date;
    timeFormat?: string;
    timeAxisStyle: TimeAxisStyle;
    enablePanZoom?: boolean;
    minDuration?: number;
    transition?: number;
    showGrid?: boolean;
    showGridPosition: ShowGridPosition;
    trackerTime?: Date;
    trackerValues?: InfoValues;
    trackerInfoWidth?: number;
    trackerInfoHeight?: number;
    onTrackerChanged?: (...args: any[]) => any;
    onTimeRangeChanged?: (...args: any[]) => any;
    onChartResize?: (...args: any[]) => any;
    onBackgroundClick?: (...args: any[]) => any;
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
export default class ChartContainer extends React.Component<ChartContainerProps> {

    static defaultProps: Partial<ChartContainerProps> = {
        width: 800,
        enablePanZoom: false,
        utc: false,
        showGrid: false,
        showGridPosition: ShowGridPosition.Under,
        timeAxisStyle: defaultTimeAxisStyle
    };

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

    /**
     * Called from the EventHandler.onMouseMove with the cursor
     * position as a Date.
     */
    handleMouseMove(t: Date) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t);
        }
    }

    /**
     * Called from the EventHandler.onMouseOut when the cursor leaves
     * the chart area.
     */
    handleMouseOut() {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(null);
        }
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

    render() {
        const chartRows = [];
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
            if (childRow.type === ChartRow) {
                //
                // Within this row, count the number of columns that will be
                // left and right of the Charts tag, as well as the total number
                // of Charts tags for error handling
                //
                let countLeft = 0;
                let countCharts = 0;
                let align = "left";
                React.Children.forEach(childRow.props.children, (child: ReactElement<any>) => {
                    if (child.type === Charts) {
                        countCharts += 1;
                        align = "right";
                    }
                    else if (child.type !== Brush) {
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
                React.Children.forEach(childRow.props.children, (child: ReactElement<any>) => {
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
                        }
                        else if (align === "right") {
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
        console.log("timerange ", this.props.timeRange);
        const timeScale = this.props.utc
            ? scaleUtc()
                .domain([this.props.timeRange.begin(), this.props.timeRange.end()])
                .range([0, timeAxisWidth])
            : scaleTime()
                .domain([this.props.timeRange.begin(), this.props.timeRange.end()])
                .range([0, timeAxisWidth]);
        let i = 0;
        let yPosition = 0;
        React.Children.forEach(this.props.children, (child: ReactElement<any>) => {
            if (child.type === ChartRow) {
                const chartRow = child;
                const rowKey = `chart-row-row-${i}`;
                const firstRow = i === 0;
                const props: ChartRowProps = {
                    timeScale,
                    leftAxisWidths,
                    rightAxisWidths,
                    width: this.props.width,
                    transition: this.props.transition,
                    timeFormat: this.props.timeFormat,
                    trackerShowTime: firstRow,
                    trackerTime: this.props.trackerTime,
                    trackerTimeFormat: this.props.timeFormat
                };
                const transform = `translate(${-leftWidth},${yPosition})`;
                chartRows.push(<g transform={transform} key={rowKey}>
                    {React.cloneElement(chartRow, props)}
                </g>);
                yPosition += parseInt(child.props.height, 10);
            }
            i += 1;
        });
        const chartsHeight = yPosition;
        const chartsWidth = this.props.width - leftWidth - rightWidth;

        //
        // Hover tracker line
        //
        let tracker;
        if (this.props.trackerTime && this.props.timeRange.contains(this.props.trackerTime)) {
            tracker = (<g key="tracker-group" style={{ pointerEvents: "none" }} transform={`translate(${leftWidth},0)`}>
                <TimeMarker
                    width={chartsWidth}
                    height={chartsHeight}
                    showInfoBox={false}
                    time={this.props.trackerTime}
                    timeScale={timeScale}
                    timeFormat={this.props.timeFormat}
                    infoWidth={this.props.trackerInfoWidth}
                    infoHeight={this.props.trackerInfoHeight}
                    infoValues={this.props.trackerValues}
                />
            </g>);
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
                    format={this.props.timeFormat}
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
                    onMouseOut={() => this.handleMouseOut()}
                    onMouseMove={d => this.handleMouseMove(d)}
                    onMouseClick={() => this.handleBackgroundClick()}
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
        const svgHeight = yPosition + timeAxisHeight;
        return this.props.showGridPosition === ShowGridPosition.Over
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
