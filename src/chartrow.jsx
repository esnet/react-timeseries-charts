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
import d3 from "d3";
import _ from "underscore";

import YAxis from "./yaxis";
import Charts from "./charts";
import Brush from "./brush";

/**
 * A ChartRow is a container for a set of Y axes and multiple charts
 * which are overlaid on each other in a central canvas.
 *
 * ![ChartRow](https://raw.githubusercontent.com/esnet/react-timeseries-charts/master/docs/chartrows.png "ChartRow")
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
export default React.createClass({

    displayName: "ChartRow",

    getDefaultProps() {
        return {
            enablePanZoom: false,
            height: 100
        };
    },

    propTypes: {
        /**
         * The height of the row.
         */
        height: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    },

    getInitialState() {
        // id of clipping rectangle we will generate and use for each child
        // chart. Lives in state to ensure just one clipping rectangle and
        // id per chart row instance; we don't want a fresh id generated on
        // each render.
        const clipId = _.uniqueId("clip_");
        const clipPathURL = `url(#${clipId})`;

        return {clipId, clipPathURL};
    },

    createScale(yaxis, type, min, max, y0, y1) {
        let scale;
        if (_.isUndefined(min) || min !== min ||
            _.isUndefined(max) || max !== max) {
            scale = null;
        } else if (type === "linear") {
            scale = d3.scale.linear()
                .domain([min, max])
                .range([y0, y1])
                .nice();
        } else if (type === "log") {
            const base = yaxis.props.logBase || 10;
            scale = d3.scale.log()
                .base(base)
                .domain([min, max])
                .range([y0, y1]);
        } else if (type === "power") {
            const power = yaxis.props.powerExponent || 2;
            scale = d3.scale.pow()
                .exponent(power)
                .domain([min, max])
                .range([y0, y1]);
        }
        return scale;
    },

    render() {
        const axes = []; // Contains all the yAxis elements used in the render
        const chartList = []; // Contains all the chart elements used
                            // in the render

        // Extra padding above and below the axis since numbers need to be
        // displayed there
        const AXIS_MARGIN = 5;

        const innerHeight = +this.props.height - AXIS_MARGIN * 2;
        const rangeTop = AXIS_MARGIN;
        const rangeBottom = innerHeight - AXIS_MARGIN;

        //
        // Build a map of elements that occupy left or right slots next to the
        // chart.
        //
        // If an element has both and id and a min/max range, then we consider
        // it to be a y axis. For those we calculate a d3 scale that can be
        // reference by a chart. That scale will also be available to the axis
        // when it renders.
        //
        // For this row, we will need to know how many axis slots we are using
        // and the scales associated with them. We store the scales in a map
        // from attr name to the d3 scale.
        //

        const yAxisMap = {};          // Maps axis id -> axis element
        const yAxisScaleMap = {};     // Maps axis id -> axis scale
        const leftAxisList = [];      // Ordered list of left axes ids
        const rightAxisList = [];     // Ordered list of right axes ids
        let align = "left";

        React.Children.forEach(this.props.children, child => {

            //
            // TODO:
            // This code currently assumes each child (except in Charts) has an
            // id, but this is just because leftAxisList and rightAxisList
            // below pushes an id. Perhaps it could put the element itself?
            //

            if (child.type === Charts) {
                align = "right";
            } else {
                const id = child.props.id;
                // Check to see if we think this 'axis' is actually an axis
                if (child.type === YAxis ||
                    (_.has(child.props, "min") &&
                    _.has(child.props, "max"))) {
                    const yaxis = child;
                    const {max, min} = yaxis.props;
                    const type = yaxis.props.type || "linear";

                    if (yaxis.props.id) {
                        // Relate id to the axis
                        yAxisMap[yaxis.props.id] = yaxis;
                    }

                    // Relate id to a d3 scale generated from the max, min
                    // and scaleType props
                    yAxisScaleMap[id] = this.createScale(yaxis, type, min, max,
                                                         rangeBottom, rangeTop);
                    // Columns counts
                    if (align === "left") {
                        leftAxisList.push(id);
                    } else if (align === "right") {
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

        let transform;
        let id;
        let props;
        let axis;
        let posx = 0;

        // Space used by columns on left and right of charts
        const leftWidth = _.reduce(this.props.leftAxisWidths, (a, b) => {
            return a + b;
        }, 0);
        const rightWidth = _.reduce(this.props.rightAxisWidths, (a, b) => {
            return a + b;
        }, 0);

        let debug;

        posx = leftWidth;
        for (let leftColumnIndex = 0;
                 leftColumnIndex < this.props.leftAxisWidths.length;
                 leftColumnIndex++) {

            const colWidth = this.props.leftAxisWidths[leftColumnIndex];

            posx -= colWidth;

            if (leftColumnIndex < leftAxisList.length) {
                id = leftAxisList[leftColumnIndex];
                transform = `translate(${posx},0)`;

                // Additional props for left aligned axes
                props = {width: colWidth,
                         height: innerHeight,
                         align: "left",
                         transition: this.props.transition};
                if (_.has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                // Cloned left axis
                axis = React.cloneElement(yAxisMap[id], props);

                // Debug rect
                if (this.props.debug) {
                    debug = (
                        <rect className="yaxis-debug"
                              x="0" y="0"
                              width={colWidth}
                              height={innerHeight} />
                    );
                } else {
                    debug = null;
                }

                axes.push(
                    <g key={`y-axis-left-${leftColumnIndex}`}
                       transform={transform}>
                        {debug}
                        {axis}
                    </g>
                );
            }
        }

        posx = this.props.width - rightWidth;
        for (let rightColumnIndex = 0;
                 rightColumnIndex < this.props.rightAxisWidths.length;
                 rightColumnIndex++) {

            const colWidth = this.props.rightAxisWidths[rightColumnIndex];

            if (rightColumnIndex < rightAxisList.length) {
                id = rightAxisList[rightColumnIndex];
                transform = `translate(${posx},0)`;

                // Additional props for right aligned axes
                props = {width: colWidth,
                         height: innerHeight,
                         align: "right",
                         transition: this.props.transition};
                if (_.has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                // Cloned right axis
                axis = React.cloneElement(yAxisMap[id], props);

                // Debug rect
                if (this.props.debug) {
                    debug = (
                        <rect className="yaxis-debug"
                              x="0" y="0"
                              width={colWidth}
                              height={innerHeight} />
                    );
                } else {
                    debug = null;
                }

                axes.push(
                    <g key={`y-axis-right-${rightColumnIndex}`}
                       transform={transform}>
                        {debug}
                        {axis}
                    </g>
                );
            }

            posx = posx + colWidth;
        }

        //
        // Push each chart onto the chartList, transforming each to the right
        // of the left axis slots and specifying its width. Each chart is passed
        // its time and y scale. The yscale is looked up in yAxisScaleMap.
        //

        const chartWidth = this.props.width - leftWidth - rightWidth;
        const chartTransform = `translate(${leftWidth},0)`;

        let keyCount = 0;
        React.Children.forEach(this.props.children, child => {

            if (child.type === Charts) {
                const charts = child;
                React.Children.forEach(charts.props.children, chart => {
                    // Additional props for charts
                    const chartProps = {
                        key: chart.props.key ?
                                chart.props.key : `chart-${keyCount}`,
                        width: chartWidth,
                        height: innerHeight,
                        clipPathURL: this.state.clipPathURL,
                        timeScale: this.props.timeScale,
                        yScale: yAxisScaleMap[chart.props.axis],
                        transition: this.props.transition
                    };

                    chartList.push(
                        React.cloneElement(chart, chartProps)
                    );

                    keyCount++;
                });
            }
        });

        //
        // Push each child Brush on to the brush list.  We need brushed to be
        // rendered last (on top) of everything else in the Z order, both for
        // visual correctness and to ensure that the brush gets mouse events
        // before anything underneath
        //

        const brushList = [];
        keyCount = 0;
        React.Children.forEach(this.props.children, child => {
            if (child.type === Brush) {
                const brushProps = {
                    key: `brush-${keyCount}`,
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: this.props.timeScale,
                    yScale: yAxisScaleMap[child.props.axis]
                };
                brushList.push(React.cloneElement(child, brushProps));
            }
            keyCount++;

        });

        const charts = (
            <g transform={chartTransform} key="event-rect-group">
                <g key="charts">
                    {chartList}
                </g>
            </g>
        );

        // Debug outlining
        let chartDebug = null;
        if (this.props.debug) {
            chartDebug = (
                <rect className="chart-debug"
                      x={leftWidth} y={0}
                      width={chartWidth} height={innerHeight} />
            );
        }

        // Clipping
        const clipper = (
            <defs>
                <clipPath id={this.state.clipId}>
                    <rect x="0" y="0" width={chartWidth} height={innerHeight} />
                </clipPath>
            </defs>
        );

        // Pan and zoom brushes
        const brushes = (
            <g transform={chartTransform} key="brush-group">
                {brushList}
            </g>
        );

        return (
            <g>
                {clipper}
                {axes}
                {charts}
                {chartDebug}
                {brushes}
            </g>
        );
    }
});
