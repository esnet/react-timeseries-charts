/**
 *  Copyright (c) 2020-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import { scaleLinear, scaleLog, scalePow, ScaleTime } from "d3-scale";
import _ from "lodash";
import { TimeRange } from "pondjs";
import React from "react";
import { ElementMap, LabelValueList, Scale, ScaleType } from "../types";
import ScaleInterpolator from "../util/scaleInterpolator";
import { AxisProps, ChartProps, Charts, ChartsProps } from "./charts/Charts";
import { YAxis } from "./YAxis";

//
// Axis types
//

/**
 * Given an axis props create a d3 scale
 */
function createScale(
    yaxis: React.ReactElement<any>,
    type: string,
    min: number,
    max: number,
    y0: number,
    y1: number
): Scale | null {
    if (_.isUndefined(min) || _.isUndefined(max)) {
        return null;
    }
    switch (type.toUpperCase()) {
        case ScaleType.Linear:
            return scaleLinear()
                .domain([min, max])
                .range([y0, y1])
                .nice();
        case ScaleType.Log:
            const base = yaxis.props.logBase || 10;
            return scaleLog()
                .base(base)
                .domain([min, max])
                .range([y0, y1]);
        case ScaleType.Power:
            const power = yaxis.props.powerExponent || 2;
            return scalePow()
                .exponent(power)
                .domain([min, max])
                .range([y0, y1]);
        default:
            throw new Error(`Unknown scale provided: ${type}`);
    }
}

export type ScalerFunction = (v: number) => number;

export interface ChartRowProps {
    children?: any;

    /**
     * The width of the row.
     */
    width?: number;

    /**
     * The height of the row.
     */
    height?: number;

    /**
     * The timeScale supplied by the surrounding ChartContainer
     */
    timeScale?: ScaleTime<number, number>;

    /**
     * A Javascript Date object to position the marker
     */
    trackerTime?: Date;

    /**
     * The format to display the time of the marker in
     */
    trackerTimeFormat?: string | ((d: Date) => string);

    /**
     * The format to display the time of the marker in
     */
    timeFormat?: string | ((d: Date) => string);

    /**
     * Should the time be shown on top of the tracker info box
     */
    trackerShowTime?: boolean;

    /**
     * The width of the tracker info box
     */
    trackerInfoWidth?: number;

    /**
     * The height of the tracker info box
     */
    trackerInfoHeight?: number;

    /**
     * Info box value or values to place next to the tracker line
     * This is either an array of objects, with each object
     * specifying the label (a string) and value (also a string)
     * to be shown in the info box, or a simple string label.
     */
    trackerInfoValues?: LabelValueList | string;

    axisMargin?: number;
    leftAxisWidths?: number[];
    rightAxisWidths?: number[];
    paddingLeft?: number;
    paddingRight?: number;

    /**
     * Show or hide this row
     */
    visible?: boolean;

    /**
     * Boolean to turn on interactive pan and zoom behavior for the chart.
     */
    enablePanZoom?: boolean;

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
     * If this is set the timerange of the chart cannot be zoomed in further
     * than this duration, in milliseconds. This might be determined by the
     * resolution of your data.
     */
    minDuration?: number;

    /**
     * Show grid lines for each time marker
     */
    showGrid?: boolean;

    /**
     * This will be called if the user pans and/or zooms the chart. The callback
     * will be called with the new TimeRange. This can be fed into the timeRange
     * prop as well as used elsewhere on the greater page.
     *
     */
    onTimeRangeChanged?: (timeRange: TimeRange) => any;

    /**
     * Will be called when the user hovers over a chart. The callback will
     * be called with the timestamp (a Date object) of the position hovered
     * over as well as the current time axis' time scale. The timestamp may
     * be used as the trackerPosition (see above), or to provide information
     * about the time hovered over within the greater page. The time scale
     * may be used to translate the timestamp into an x coordinate, which
     * can then be used to position arbitrary components in sync with the
     * current tracker position.
     */
    onTrackerChanged?: (time: Date, number: (t: any) => number) => any;
}

// XXX this was originally an instance variable
let scaleInterpolatorMap: { [key: string]: ScaleInterpolator } = {};

/**
 * A ChartRow is a container for a set of YAxis and multiple charts
 * which are overlaid on each other in a central canvas.
 *
 * Here is an example where a single `<ChartRow>` is defined within
 * the `<ChartContainer>`. Of course you can have any number of rows.
 *
 * For this row we specify the one prop `height` as 200 pixels high.
 *
 * Within the `<ChartRow>` we add:
 *
 * * `<YAxis>` elements for axes to the left of the chart
 * * `<Chart>` block containing our central chart area
 * * `<YAxis>` elements for our axes to the right of the charts
 *
 * ```
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis />
 *         <YAxis />
 *         <Charts>
 *             charts...
 *        </Charts>
 *         <YAxis />
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
const ChartRow: React.FunctionComponent<ChartRowProps> = (props: ChartRowProps) => {
    // Component State
    const clipId = _.uniqueId("clip_");
    const clipPathURL = `url(#${clipId})`;

    // Component Props
    const {
        //trackerTimeFormat = "%b %d %Y %X",
        //enablePanZoom = false,
        //visible = true,
        height = 100,
        paddingLeft = 0,
        paddingRight = 0,
        axisMargin = 15,
        width,
        leftAxisWidths,
        rightAxisWidths,
        timeScale,
        timeFormat
    } = props;

    // Build a map of YAxis ids -> Scales
    const scaleMap: { [key: string]: Scale } = {};
    const innerHeight = +height - axisMargin * 2;
    const rangeTop = axisMargin;
    const rangeBottom = innerHeight - axisMargin;
    React.Children.forEach(props.children, (child: React.ReactElement<any>) => {
        if (child === null) return;
        if (child.type === YAxis) {
            const { id, max, min, type = ScaleType.Linear } = child.props as AxisProps;

            // Get the scale for this YAxis.
            let scale: Scale | null;
            if (_.has(child.props, "yScale")) {
                // If the yScale prop is passed explicitly, use that.
                scale = child.props.yScale;
            } else {
                // Otherwise, compute the scale based on the max and min props.
                scale = createScale(child, type, min, max, rangeBottom, rangeTop);
            }

            if (scale) {
                scaleMap[id] = scale;
            }
        }
    });

    // Make sure we have some key props passed down from the ChartContainer
    if (!leftAxisWidths || !rightAxisWidths || !width) {
        return <g>`A ChartRow should be constructed inside a ChartContainer`</g>;
    }

    // Utility to tell us if a given ReactElement is a YAxis
    const isChildYAxis = (child: React.ReactElement<any>) =>
        child.type === YAxis || (_.has(child.props, "min") && _.has(child.props, "max"));

    const isChildCharts = (child: React.ReactElement<any>) => child.type === Charts;

    // Contains all the yAxis elements used in the render
    const axes = [];

    //
    // Build a map of elements that occupy left or right slots next to the chart.
    //

    const yAxisMap: ElementMap = {}; // Maps axis id -> axis element
    const leftAxisList: string[] = []; // Ordered list of left axes ids
    const rightAxisList: string[] = []; // Ordered list of right axes ids

    let alignLeft = true;
    React.Children.forEach(props.children, (child: React.ReactElement<any>) => {
        if (child === null) return;
        if (isChildCharts(child)) {
            alignLeft = false;
        } else {
            const id = child.props.id;
            // Check to see if we think this 'axis' is actually an axis
            if (isChildYAxis(child)) {
                const yaxis = child;

                // If the axis is visible relate id to the axis element itself
                if (yaxis.props.id && yaxis.props.visible !== false) {
                    yAxisMap[yaxis.props.id] = yaxis;
                }

                // Update out ordered list of axis ids, either on left or right
                if (alignLeft) {
                    leftAxisList.push(id);
                } else {
                    rightAxisList.push(id);
                }
            }
        }
    });

    // Since we'll be building the left axis items from the inside to the outside
    leftAxisList.reverse();

    //
    // Push each axis onto the axes list that we'll render, positionally transforming
    // each into its correct column location
    //

    // Space used by columns on left and right of charts
    const leftWidth = _.reduce(leftAxisWidths, (a, b) => a + b, 0);
    const rightWidth = _.reduce(rightAxisWidths, (a, b) => a + b, 0);
    const chartWidth = width - leftWidth - rightWidth - paddingLeft - paddingRight;

    // Left side axes
    let posx = leftWidth;
    for (let leftColumnIndex = 0; leftColumnIndex < leftAxisWidths.length; leftColumnIndex += 1) {
        const colWidth = leftAxisWidths[leftColumnIndex];
        posx -= colWidth;
        if (colWidth > 0 && leftColumnIndex < leftAxisList.length) {
            const id = leftAxisList[leftColumnIndex];
            if (_.has(yAxisMap, id)) {
                // Additional props for left aligned axes
                const axisProps = {
                    width: colWidth,
                    height: innerHeight,
                    chartExtent: chartWidth,
                    align: "left",
                    scale: scaleInterpolatorMap[id]?.latestScale()
                };

                // Cloned left axis
                const key = `y-axis-left-${leftColumnIndex}`;
                const transform = `translate(${posx + paddingLeft},0)`;
                const axis = React.cloneElement(yAxisMap[id], axisProps);
                axes.push(
                    <g key={key} transform={transform}>
                        {axis}
                    </g>
                );
            }
        }
    }

    // Right side axes
    posx = width - rightWidth;
    for (
        let rightColumnIndex = 0;
        rightColumnIndex < rightAxisWidths.length;
        rightColumnIndex += 1
    ) {
        const colWidth = rightAxisWidths[rightColumnIndex];
        if (colWidth > 0 && rightColumnIndex < rightAxisList.length) {
            const id = rightAxisList[rightColumnIndex];
            if (_.has(yAxisMap, id)) {
                // Additional props for right aligned axes
                const axisProps = {
                    width: colWidth,
                    height: innerHeight,
                    chartExtent: chartWidth,
                    align: "right",
                    scale: scaleInterpolatorMap[id]?.latestScale()
                };

                // Cloned right axis
                const transform = `translate(${posx + paddingLeft},0)`;
                const key = `y-axis-right-${rightColumnIndex}`;
                const axis = React.cloneElement(yAxisMap[id], axisProps);

                axes.push(
                    <g key={key} transform={transform}>
                        {axis}
                    </g>
                );
            }
        }
        posx += colWidth;
    }

    //
    // Push each chart onto the chartList, transforming each to the right
    // of the left axis slots and specifying its width. Each chart is passed
    // its time and y-scale. The y-scale is looked up in scaleInterpolatorMap, whose
    // current value is stored in the component state.
    //
    const chartTransform = `translate(${leftWidth + paddingLeft},0)`;
    let k = 0;
    const chartList: JSX.Element[] = [];
    React.Children.forEach(props.children, (child: React.ReactElement<ChartsProps>) => {
        if (child === null) return;
        if (isChildCharts(child)) {
            const charts = child;
            React.Children.forEach(charts.props.children, (chart: React.ReactElement<any>) => {
                let scale = null;
                if (_.has(scaleMap, chart.props.axis)) {
                    scale = scaleMap[chart.props.axis];
                }

                const chartProps: Partial<ChartProps> = {
                    key: k,
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: timeScale,
                    timeFormat: timeFormat
                };

                if (scale) {
                    chartProps.yScale = scale;
                }

                chartList.push(React.cloneElement(chart, chartProps));
                k += 1;
            });
        }
    });

    const charts = (
        <g transform={chartTransform} key="charts-group">
            <g key="charts" clipPath={clipPathURL}>
                {chartList}
            </g>
        </g>
    );

    return (
        <g>
            <rect
                width={width}
                height={height}
                style={{ fill: "#dcdcec", strokeWidth: 1, stroke: "rgb(255,0,0)" }}
            />
            {axes}
            {charts}
        </g>
    );
};

export default ChartRow;
