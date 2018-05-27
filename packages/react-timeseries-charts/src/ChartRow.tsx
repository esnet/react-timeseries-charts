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
import * as React from "react";

import { easeSinOut } from "d3-ease";
import {
    scaleLinear,
    scaleLog,
    scalePow,
    ScaleTime,
    ScaleLogarithmic,
    ScaleLinear
} from "d3-scale";
import { TimeRange } from "pondjs";
import { areComponentsEqual } from "react-hot-loader";

import { Brush } from "./Brush";
import { Charts, ChartsProps, ChartProps, AxisProps, ScaleType, Scale } from "./Charts";
import ScaleInterpolator, { ScalerFunction } from "./interpolators";
import { MultiBrush } from "./MultiBrush";
import { TimeMarker, TimeMarkerProps } from "./TimeMarker";
import { LabelValueList } from "./types";
import { YAxis, YAxisProps } from "./YAxis";

const AXIS_MARGIN = 5;

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
): Scale {
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
    }
}

export type ChartRowProps = {
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

    leftAxisWidths?: number[];
    rightAxisWidths?: number[];
    paddingLeft?: number;
    paddingRight?: number;

    /**
     * Time in milliseconds to transition from one Y-scale to the next
     */
    transition: number;

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
    onTimeRangeChanged: (timeRange: TimeRange) => any;

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
    onTrackerChanged: (time: Date, number: (t: any) => number) => any;
};

/**
 * @private
 */
export type ChartRowState = {
    yAxisScalerMap?: { [key: string]: ScalerFunction };
    clipId?: string;
    clipPathURL?: string;
};

export type ScalarMap = { [id: string]: (v: number) => number };
export type ElementMap = { [id: string]: React.ReactElement<any> };

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
export class ChartRow extends React.Component<ChartRowProps, ChartRowState> {
    static defaultProps: Partial<ChartRowProps> = {
        trackerTimeFormat: "%b %d %Y %X",
        enablePanZoom: false,
        height: 100,
        visible: true
    };

    // A mapping from axis id to scale
    scaleInterpolatorMap: { [key: string]: ScaleInterpolator };

    constructor(props: ChartRowProps) {
        super(props);

        // id of clipping rectangle we will generate and use for each child
        // chart. Lives in state to ensure just one clipping rectangle and
        // id per chart row instance; we don't want a fresh id generated on
        // each render.
        const clipId = _.uniqueId("clip_");
        const clipPathURL = `url(#${clipId})`;
        this.state = {
            clipId,
            clipPathURL
        };
    }

    isChildYAxis = (child: React.ReactElement<any>) =>
        areComponentsEqual(child.type as React.ComponentType<any>, YAxis) ||
        (_.has(child.props, "min") && _.has(child.props, "max"));

    updateScales(props: ChartRowProps) {
        const innerHeight = +props.height - AXIS_MARGIN * 2;
        const rangeTop = AXIS_MARGIN;
        const rangeBottom = innerHeight - AXIS_MARGIN;
        React.Children.forEach(props.children, (child: React.ReactElement<any>) => {
            if (child === null) return;
            if (this.isChildYAxis(child)) {
                const { 
                    id, 
                    max, 
                    min, 
                    transition = 0, 
                    type = ScaleType.Linear 
                } = child.props as AxisProps;
                if (!_.has(this.scaleInterpolatorMap, id)) {
                    // If necessary, initialize a ScaleInterpolator for this y-axis.
                    // When the yScale changes, we will update this interpolator.
                    this.scaleInterpolatorMap[id] = new ScaleInterpolator(transition, easeSinOut, s => {
                        const yAxisScalerMap = this.state.yAxisScalerMap;
                        yAxisScalerMap[id] = s;
                        this.setState(yAxisScalerMap);
                    });
                }
                // Get the vertical scale for this y-axis.
                let scale: Scale;
                if (_.has(child.props, "yScale")) {
                    // If the yScale prop is passed explicitly, use that.
                    scale = child.props.yScale;
                } else {
                    // Otherwise, compute the scale based on the max and min props.
                    scale = createScale(child, type, min, max, rangeBottom, rangeTop);
                }

                // Update the scale on the interpolator for this y-axis.
                const cacheKey = `${type}-${min}-${max}-${rangeBottom}-${rangeTop}`;
                this.scaleInterpolatorMap[id].setScale(cacheKey, scale);
            }
        });

        // Update the state with the newly interpolated scaler for each y-axis.
        const scalerMap = {};
        _.forEach(this.scaleInterpolatorMap, (interpolator, id) => {
            scalerMap[id] = interpolator.scaler();
        });

        this.setState({ yAxisScalerMap: scalerMap });
    }
    
    componentWillMount() {
        // Our chart scales are driven off a mapping between id of the axis
        // and the scale that axis represents. Depending on the transition time,
        // this scale will animate over time. The controller of this animation is
        // the ScaleInterpolator. We create new Scale Interpolators here for each
        // axis id.
        this.scaleInterpolatorMap = {};
        this.updateScales(this.props);
    }

    /**
     * When we get changes to the row's props we update our map of
     * axis scales.
     */
    componentWillReceiveProps(nextProps: ChartRowProps) {
        this.updateScales(nextProps);
    }

    render() {
        const { paddingLeft, paddingRight } = this.props;

        const axes = []; // Contains all the yAxis elements used in the render
        const chartList: JSX.Element[] = []; // Contains all the Chart elements used in the render

        // Dimensions
        const innerHeight = +this.props.height - AXIS_MARGIN * 2;

        //
        // Build a map of elements that occupy left or right slots next to the
        // chart.
        //
        // If an element has both and id and a min/max range, then we consider
        // it to be a y axis. For those we calculate a d3 scale that can be
        // reference by a chart. That scale will also be available to the axis
        // when it renders.
        //
        // For this row, we will need to know how many axis slots we are using.
        //

        const yAxisMap: ElementMap = {}; // Maps axis id -> axis element
        const leftAxisList: string[] = []; // Ordered list of left axes ids
        const rightAxisList: string[] = []; // Ordered list of right axes ids
        let alignLeft = true;
        React.Children.forEach(this.props.children, (child: React.ReactElement<any>) => {
            if (child === null) return;
            if (areComponentsEqual(child.type as React.ComponentType<any>, Charts)) {
                alignLeft = false;
            } else {
                const id = child.props.id;
                // Check to see if we think this 'axis' is actually an axis
                if (this.isChildYAxis(child)) {
                    const yaxis = child;

                    if (yaxis.props.id && yaxis.props.visible !== false) {
                        // Relate id to the axis
                        yAxisMap[yaxis.props.id] = yaxis;
                    }

                    // Columns counts
                    if (alignLeft) {
                        leftAxisList.push(id);
                    } else {
                        rightAxisList.push(id);
                    }
                }
            }
        });

        // Since we'll be building the left axis items from the
        // inside to the outside
        leftAxisList.reverse();

        //
        // Push each axis onto the axes, transforming each into its
        // column location
        //
        let transform: string;
        let id: string;
        let props;
        let axis;
        let posx = 0;

        // Space used by columns on left and right of charts
        const leftWidth = _.reduce(this.props.leftAxisWidths, (a, b) => a + b, 0);
        const rightWidth = _.reduce(this.props.rightAxisWidths, (a, b) => a + b, 0);
        const chartWidth = this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;

        posx = leftWidth;
        for (
            let leftColumnIndex = 0;
            leftColumnIndex < this.props.leftAxisWidths.length;
            leftColumnIndex += 1
        ) {
            const colWidth = this.props.leftAxisWidths[leftColumnIndex];
            posx -= colWidth;
            if (colWidth > 0 && leftColumnIndex < leftAxisList.length) {
                id = leftAxisList[leftColumnIndex];
                if (_.has(yAxisMap, id)) {
                    transform = `translate(${posx + paddingLeft},0)`;
                    // Additional props for left aligned axes
                    props = {
                        width: colWidth,
                        height: innerHeight,
                        chartExtent: chartWidth,
                        isInnerAxis: leftColumnIndex === 0,
                        align: "left",
                        scale: this.scaleInterpolatorMap[id].latestScale()
                    };

                    // Cloned left axis
                    axis = React.cloneElement(yAxisMap[id], props);

                    axes.push(
                        <g key={`y-axis-left-${leftColumnIndex}`} transform={transform}>
                            {axis}
                        </g>
                    );
                }
            }
        }

        posx = this.props.width - rightWidth;
        for (
            let rightColumnIndex = 0;
            rightColumnIndex < this.props.rightAxisWidths.length;
            rightColumnIndex += 1
        ) {
            const colWidth = this.props.rightAxisWidths[rightColumnIndex];
            if (colWidth > 0 && rightColumnIndex < rightAxisList.length) {
                id = rightAxisList[rightColumnIndex];
                if (_.has(yAxisMap, id)) {
                    transform = `translate(${posx + paddingLeft},0)`;

                    // Additional props for right aligned axes
                    props = {
                        width: colWidth,
                        height: innerHeight,
                        chartExtent: chartWidth,
                        //showGrid: this.props.showGrid,
                        isInnerAxis: rightColumnIndex === 0,
                        align: "right",
                        scale: this.scaleInterpolatorMap[id].latestScale()
                    };

                    // Cloned right axis
                    axis = React.cloneElement(yAxisMap[id], props);

                    axes.push(
                        <g key={`y-axis-right-${rightColumnIndex}`} transform={transform}>
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
        React.Children.forEach(this.props.children, (child: React.ReactElement<ChartsProps>) => {
            if (child === null) return;
            if (areComponentsEqual(child.type as React.ComponentType<any>, Charts)) {
                const charts = child;
                React.Children.forEach(charts.props.children, (chart: React.ReactElement<any>) => {
                    let scale = null;
                    if (_.has(this.state.yAxisScalerMap, chart.props.axis)) {
                        scale = this.state.yAxisScalerMap[chart.props.axis];
                    }

                    let ytransition = null;
                    if (_.has(this.scaleInterpolatorMap, chart.props.axis)) {
                        ytransition = this.scaleInterpolatorMap[chart.props.axis];
                    }

                    const chartProps: Partial<ChartProps> = {
                        key: k,
                        width: chartWidth,
                        height: innerHeight,
                        timeScale: this.props.timeScale,
                        timeFormat: this.props.timeFormat
                    };

                    if (scale) {
                        chartProps.yScale = scale;
                    }

                    if (ytransition) {
                        chartProps.transition = ytransition;
                    }

                    chartList.push(React.cloneElement(chart, chartProps));
                    k += 1;
                });
            }
        });

        //
        // Push each child Brush on to the brush list.  We need brushed to be
        // rendered last (on top) of everything else in the Z order, both for
        // visual correctness and to ensure that the brush gets mouse events
        // before anything underneath
        //
        const brushList: React.ReactElement<any>[] = [];
        const multiBrushList: React.ReactElement<any>[] = [];
        k = 0;
        React.Children.forEach(this.props.children, (child: React.ReactElement<any>) => {
            if (child === null) return;
            if (
                areComponentsEqual(child.type as React.ComponentType<any>, Brush) ||
                areComponentsEqual(child.type as React.ComponentType<any>, MultiBrush)
            ) {
                const brushProps: ChartProps = {
                    key: `brush-${k}`,
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: this.props.timeScale
                };
                if (areComponentsEqual(child.type as React.ComponentType<any>, Brush)) {
                    brushList.push(React.cloneElement(child, brushProps));
                } else {
                    multiBrushList.push(React.cloneElement(child, brushProps));
                }
            }
            k += 1;
        });

        const charts = (
            <g transform={chartTransform} key="event-rect-group">
                <g key="charts" clipPath={this.state.clipPathURL}>
                    {chartList}
                </g>
            </g>
        );

        //
        // Clipping
        //
        const clipper = (
            <defs>
                <clipPath id={this.state.clipId}>
                    <rect 
                        x="0" 
                        y="0" 
                        style={{ strokeOpacity: 0.0 }} 
                        width={chartWidth} 
                        height={innerHeight} 
                    />
                </clipPath>
            </defs>
        );

        //
        // Brush
        //
        const brushes = (
            <g transform={chartTransform} key="brush-group">
                {brushList}
            </g>
        );

        //
        // Multi Brush
        //
        const multiBrushes = (
            <g transform={chartTransform} key="multi-brush-group">
                {multiBrushList}
            </g>
        );

        //
        // TimeMarker used as a tracker
        //
        let tracker;
        if (this.props.trackerTime) {
            const timeFormat = this.props.trackerTimeFormat || this.props.timeFormat;
            const timeMarkerProps: TimeMarkerProps = {
                key: "tracker",
                timeFormat,
                showLine: false,
                showTime: this.props.trackerShowTime,
                time: this.props.trackerTime,
                timeScale: this.props.timeScale,
                width: chartWidth
            };
            if (this.props.trackerInfoValues) {
                timeMarkerProps.infoWidth = this.props.trackerInfoWidth;
                timeMarkerProps.infoHeight = this.props.trackerInfoHeight;
                timeMarkerProps.info = this.props.trackerInfoValues;
                timeMarkerProps.timeFormat = this.props.trackerTimeFormat;
            }
            const trackerStyle: React.CSSProperties = {
                pointerEvents: "none"
            };
            const trackerTransform = `translate(${leftWidth + paddingLeft},0)`;

            tracker = (
                <g key="tracker-group" style={trackerStyle} transform={trackerTransform}>
                    <TimeMarker {...timeMarkerProps} />
                </g>
            );
        }

        return (
            <g>
                {clipper}
                {axes}
                {charts}
                {brushes}
                {multiBrushes}
                {tracker}
            </g>
        );
    }
}
