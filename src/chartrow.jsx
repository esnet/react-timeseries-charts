/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react/addons";
import d3 from "d3";
import _ from "underscore";

import YAxis from "./yaxis";
import Charts from "./charts";
import Brush from "./brush";
import Tracker from "./tracker"; //eslint-disable-line
import EventHandler from "./eventhandler"; //eslint-disable-line

/**
 * A ChartRow has a set of Y axes and multiple charts which are overlayed
 * on each other in a central canvas.
 */
export default React.createClass({

    displayName: "ChartRow",

    getDefaultProps() {
        return {
            enablePanZoom: false
        };
    },

    propTypes: {
        enablePanZoom: React.PropTypes.bool
    },

    getInitialState() {
        // id of clipping rectangle we will generate and use for each child
        // chart. Lives in state to ensure just one clipping rectangle and
        // id per chart row instance; we don't want a fresh id generated on
        // each render.
        let clipId = _.uniqueId("clip_");
        let clipPathURL = "url(#" + clipId + ")";

        return {clipId: clipId,
                clipPathURL: clipPathURL};
    },

    handleMouseMove(t) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t);
        }
    },

    handleMouseOut() {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(null);
        }
    },

    handleZoom(timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    },

    handleResize(width, height) {
        if (this.props.onChartResize) {
            this.props.onChartResize(width, height);
        }
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
            let base = yaxis.props.logBase || 10;
            scale = d3.scale.log()
                .base(base)
                .domain([min, max])
                .range([y0, y1]);
        } else if (type === "power") {
            let power = yaxis.props.powerExponent || 2;
            scale = d3.scale.pow()
                .exponent(power)
                .domain([min, max])
                .range([y0, y1]);
        }
        return scale;
    },

    render() {
        let axes = []; // Contains all the yAxis elements used in the render
        let chartList = []; // Contains all the chart elements used
                            // in the render

        let margin = this.props.margin !== undefined ?
            Number(this.props.margin) : 5;
        let padding = this.props.padding !== undefined ?
            Number(this.props.padding) : 2;

        // Extra padding above and below the axis since numbers need to be
        // displayed there
        const AXIS_MARGIN = 5;

        let innerHeight = Number(this.props.height) - AXIS_MARGIN * 2;
        let rangeTop = AXIS_MARGIN;
        let rangeBottom = innerHeight - AXIS_MARGIN;

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

        let yAxisMap = {};          // Maps axis id -> axis element
        let yAxisScaleMap = {};     // Maps axis id -> axis scale
        let leftAxisList = [];      // Ordered list of left axes ids
        let rightAxisList = [];     // Ordered list of right axes ids
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
                let id = child.props.id;

                // Check to see if we think this 'axis' is actually an axis
                if (child.type === YAxis || (_.has(child.props, "min") &&
                                             _.has(child.props, "max"))) {
                    let yaxis = child;
                    let {max, min} = yaxis.props;
                    let type = yaxis.props.type || "linear";

                    if (yaxis.props.id) {
                        // Relate id to the axis
                        yAxisMap[yaxis.props.id] = yaxis;
                    }

                    // Relate id to a d3 scale generated from the max, min
                    // and scaleType props
                    yAxisScaleMap[id] = this.createScale(yaxis, type, min, max,
                                                         rangeBottom, rangeTop);
                }

                // Columns counts
                if (align === "left") {
                    leftAxisList.push(id);
                } else if (align === "right") {
                    rightAxisList.push(id);
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

        // Extra space used by padding between columns
        let leftExtra = (this.props.leftAxisWidths.length - 1) * padding;
        let rightExtra = (this.props.rightAxisWidths.length - 1) * padding;

        // Space used by columns on left and right of charts
        let leftWidth = _.reduce(this.props.leftAxisWidths, (a, b) => {
            return a + b;
        }, 0) + leftExtra;
        let rightWidth = _.reduce(this.props.rightAxisWidths, (a, b) => {
            return a + b;
        }, 0) + rightExtra;

        let debug;

        posx = leftWidth;
        for (let leftColumnIndex = 0;
                 leftColumnIndex < this.props.leftAxisWidths.length;
                 leftColumnIndex++) {

            let colWidth = this.props.leftAxisWidths[leftColumnIndex];

            posx -= colWidth;
            if (leftColumnIndex > 0) {
                posx -= padding;
            }

            if (leftColumnIndex < leftAxisList.length) {
                id = leftAxisList[leftColumnIndex];
                transform = "translate(" + posx + "," + margin + ")";

                // Additional props for left aligned axes
                props = {width: colWidth,
                         height: innerHeight,
                         align: "left",
                         transition: this.props.transition};
                if (_.has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                // Cloned left axis
                axis = React.addons.cloneWithProps(yAxisMap[id], props);

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

            let colWidth = this.props.rightAxisWidths[rightColumnIndex];

            if (rightColumnIndex < rightAxisList.length) {
                id = rightAxisList[rightColumnIndex];
                transform = "translate(" + posx + "," + margin + ")";

                // Additional props for right aligned axes
                props = {width: colWidth,
                         height: innerHeight,
                         align: "right",
                         transition: this.props.transition};
                if (_.has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                // Cloned right axis
                axis = React.addons.cloneWithProps(yAxisMap[id], props);

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

            posx = posx + colWidth + padding;
        }

        //
        // Push each chart onto the chartList, transforming each to the right
        // of the left axis slots and specifying its width. Each chart is passed
        // its time and y scale. The yscale is looked up in yAxisScaleMap.
        //

        let chartWidth = this.props.width - leftWidth - rightWidth;
        let chartTransform = "translate(" + leftWidth + "," + margin + ")";

        let keyCount = 0;
        React.Children.forEach(this.props.children, child => {

            if (child.type === Charts) {
                let charts = child;
                React.Children.forEach(charts.props.children, chart => {
                    // Additional props for charts
                    let chartProps = {
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
                        React.addons.cloneWithProps(chart, chartProps)
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

        let brushList = [];
        keyCount = 0;
        React.Children.forEach(this.props.children, child => {
            if (child.type === Brush) {
                let brushProps = {
                    key: "brush-" + keyCount,
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: this.props.timeScale,
                    yScale: yAxisScaleMap[child.props.axis]
                };
                brushList.push(React.addons.cloneWithProps(child, brushProps));
            }
            keyCount++;

        });

        // Hover tracker line
        const tracker = (
            <g key="tracker-group" style={{pointerEvents: "none"}}>
                <Tracker height={innerHeight}
                         timeScale={this.props.timeScale}
                         position={this.props.trackerPosition} />
            </g>
        );

        // Charts with or without pan and zoom event handling
        let charts;
        if (this.props.enablePanZoom || this.props.onTrackerChanged) {
            charts = (
                <g transform={chartTransform} key="event-rect-group">
                    <EventHandler key="event-handler"
                                  width={chartWidth} height={innerHeight}
                                  scale={this.props.timeScale}
                                  enablePanZoom={this.props.enablePanZoom}
                                  minDuration={this.props.minDuration}
                                  minTime={this.props.minTime}
                                  maxTime={this.props.maxTime}
                                  onMouseOut={this.handleMouseOut}
                                  onMouseMove={this.handleMouseMove}
                                  onZoom={this.handleZoom}
                                  onResize={this.handleResize}>

                        {chartList}
                        {tracker}

                    </EventHandler>
                </g>
            );
        } else {
            charts = (
                <g transform={chartTransform} key="event-rect-group">
                    <g key="charts">
                        {chartList}
                    </g>
                    <g key="tracker">
                        {tracker}
                    </g>
                </g>
            );
        }

        // Debug outlining
        let chartDebug = null;
        if (this.props.debug) {
            chartDebug = (
                <rect className="chart-debug"
                      x={leftWidth} y={margin}
                      width={chartWidth} height={innerHeight} />
            );
        }

        // Clipping
        const clipDefs = (
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
            <div>
                <svg width={this.props.width}
                     height={Number(this.props.height)}>
                    {clipDefs}
                    {axes}
                    {charts}
                    {chartDebug}
                    {brushes}
                </svg>
            </div>
        );
    }
});
