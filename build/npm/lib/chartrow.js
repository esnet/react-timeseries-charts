/*
 * ESnet React Charts, Copyright (c) 2014, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
 *
 * If you have questions about your rights to use or distribute this
 * software, please contact Berkeley Lab's Technology Transfer
 * Department at TTD@lbl.gov.
 *
 * NOTICE.  This software is owned by the U.S. Department of Energy.
 * As such, the U.S. Government has been granted for itself and others
 * acting on its behalf a paid-up, nonexclusive, irrevocable,
 * worldwide license in the Software to reproduce, prepare derivative
 * works, and perform publicly and display publicly.  Beginning five
 * (5) years after the date permission to assert copyright is obtained
 * from the U.S. Department of Energy, and subject to any subsequent
 * five (5) year renewals, the U.S. Government is granted for itself
 * and others acting on its behalf a paid-up, nonexclusive,
 * irrevocable, worldwide license in the Software to reproduce,
 * prepare derivative works, distribute copies to the public, perform
 * publicly and display publicly, and to permit others to do so.
 *
 * This code is distributed under a BSD style license, see the LICENSE
 * file for complete information.
 */

"use strict";

var React = require("react/addons");
var d3 = require("d3");
var _ = require("underscore");

var YAxis = require("./yaxis");
var Charts = require("./charts");
var Brush = require("./brush");
var Tracker = require("./tracker");
var EventRect = require("./eventrect");
var PointIndicator = require("./pointindicator");

/**
 * Hacky workaround for the fact that clipPath is not currently a supported tag in React.
 */
var ClipDefs = React.createClass({
    displayName: "ClipDefs",

    renderClipPath: function renderClipPath(props) {
        d3.select(this.getDOMNode()).selectAll("*").remove();

        d3.select(this.getDOMNode()).append("clipPath").attr("id", props.id).append("rect").attr("width", props.clipWidth).attr("height", props.clipHeight);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.renderClipPath(nextProps);
    },

    componentDidMount: function componentDidMount() {
        this.renderClipPath(this.props);
    },

    // For now we'll always update to ensure clipping id and rectangle track props
    // Could probably optimize this to detect changes to width/height to avoid d3 touching
    // the real DOM on every re-render.
    shouldComponentUpdate: function shouldComponentUpdate() {
        return true;
    },

    render: function render() {
        return React.createElement("defs", null);
    }
});

/**
 * A ChartRow has a set of Y axes and multiple charts which are overlayed on each other
 * in a central canvas.
 */
var ChartRow = React.createClass({

    displayName: "ChartRow",

    getInitialState: function getInitialState() {
        // id of clipping rectangle we will generate and use for each child chart
        // Lives in state to ensure just one clipping rectangle and id per chart row instance; we don't
        // want a fresh id generated on each render.
        var clipId = _.uniqueId("clip_");
        var clipPathURL = "url(#" + clipId + ")";

        return { clipId: clipId,
            clipPathURL: clipPathURL };
    },

    handleMouseMove: function handleMouseMove(t) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t);
        }
    },

    handleMouseOut: function handleMouseOut() {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(null);
        }
    },

    handleZoom: function handleZoom(beginTime, endTime) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(beginTime, endTime);
        }
    },

    handleResize: function handleResize(width, height) {
        if (this.props.onChartResize) {
            this.props.onChartResize(width, height);
        }
    },

    createScale: function createScale(type, min, max, y0, y1) {
        var scale = undefined;
        if (_.isUndefined(min) || min !== min || _.isUndefined(max) || max !== max) {
            scale = null;
        } else if (type === "linear") {
            scale = d3.scale.linear().domain([min, max]).range([y0, y1]).nice();
        } else if (type === "log") {
            var base = yaxis.props.logBase || 10;
            scale = d3.scale.log().base(base).domain([min, max]).range([y0, y1]);
        } else if (type === "power") {
            var power = yaxis.props.powerExponent || 2;
            scale = d3.scale.pow().exponent(power).domain([min, max]).range([y0, y1]);
        }
        return scale;
    },

    render: function render() {
        var _this = this;

        var yAxisList = []; // Contains all the yAxis elements used in the render
        var chartList = []; // Contains all the chart elements used in the render

        var margin = this.props.margin !== undefined ? Number(this.props.margin) : 5;
        var padding = this.props.padding !== undefined ? Number(this.props.padding) : 2;

        // Extra padding above and below the axis since numbers need to be displayed there
        var AXIS_MARGIN = 5;
        var innerHeight = Number(this.props.height) - AXIS_MARGIN * 2;
        var rangeTop = AXIS_MARGIN;
        var rangeBottom = innerHeight - AXIS_MARGIN;

        //
        // Build a map of elements that occupy left or right slots next to the chart.
        //
        // If an element has both and id and a min/max range, then we consider it to be a y axis.
        // For those we calculate a d3 scale that can be reference by a chart. That scale will
        // also be available to the axis when it renders.
        //
        // For this row, we will need to know how many axis slots we are using and the
        // scales associated with them. We store the scales in a map from attr name to
        // the d3 scale.
        //

        var yAxisMap = {}; // Maps axis id -> axis element
        var yAxisScaleMap = {}; // Maps axis id -> axis scale
        var leftAxisList = []; // Ordered list of left axes ids
        var rightAxisList = []; // Ordered list of right axes ids
        var align = "left";

        React.Children.forEach(this.props.children, function (child) {

            //
            // TODO:
            // This code currently assumes each child (except in Charts) has an id, but
            // this is just because leftAxisList and rightAxisList below pushes an id.
            // Perhaps it could put the element itself?
            //

            if (child.type === Charts) {
                align = "right";
            } else {
                var _id = child.props.id;

                //Check to see if we think this 'axis' is actually an axis
                if (child.type === YAxis || _.has(child.props, "min") && _.has(child.props, "max")) {
                    var _yaxis = child;
                    var _yaxis$props = _yaxis.props;
                    var max = _yaxis$props.max;
                    var min = _yaxis$props.min;

                    var type = _yaxis.props.type || "linear";

                    if (_yaxis.props.id) {
                        yAxisMap[_yaxis.props.id] = _yaxis; //Relate id to the axis
                    }

                    //Relate id to a d3 scale generated from the max, min and scaleType props
                    yAxisScaleMap[_id] = _this.createScale(type, min, max, rangeBottom, rangeTop);
                }

                //Columns counts
                if (align === "left") {
                    leftAxisList.push(_id);
                } else if (align === "right") {
                    rightAxisList.push(_id);
                }
            }
        });

        //Since we'll be building the left axis items from the inside to the outside
        leftAxisList.reverse();

        //
        // Push each axis onto the yAxisList, transforming each into its column location
        //

        var transform = undefined;
        var id = undefined;
        var props = undefined;
        var axis = undefined;
        var i = 0;
        var posx = 0;

        //Extra space used by padding between columns
        var leftExtra = (this.props.leftAxisWidths.length - 1) * padding;
        var rightExtra = (this.props.rightAxisWidths.length - 1) * padding;

        //Space used by columns on left and right of charts
        var leftWidth = _.reduce(this.props.leftAxisWidths, function (a, b) {
            return a + b;
        }, 0) + leftExtra;
        var rightWidth = _.reduce(this.props.rightAxisWidths, function (a, b) {
            return a + b;
        }, 0) + rightExtra;

        var debug = undefined;

        posx = leftWidth;
        for (var leftColumnIndex = 0; leftColumnIndex < this.props.leftAxisWidths.length; leftColumnIndex++) {
            var colWidth = this.props.leftAxisWidths[leftColumnIndex];

            posx = posx - colWidth;
            if (leftColumnIndex > 0) {
                posx = posx - padding;
            }

            if (leftColumnIndex < leftAxisList.length) {
                id = leftAxisList[leftColumnIndex];
                transform = "translate(" + posx + "," + margin + ")";

                //Additional props for left aligned axes
                props = { "width": colWidth,
                    "height": innerHeight,
                    "align": "left",
                    "transition": this.props.transition };
                if (_.has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                //Cloned left axis
                axis = React.addons.cloneWithProps(yAxisMap[id], props);

                //Debug rect
                if (this.props.debug) {
                    debug = React.createElement("rect", { className: "yaxis-debug", x: "0", y: "0", width: colWidth, height: innerHeight });
                } else {
                    debug = null;
                }

                yAxisList.push(React.createElement(
                    "g",
                    { key: "y-axis-left-" + leftColumnIndex, transform: transform },
                    debug,
                    axis
                ));
            }
        }

        posx = this.props.width - rightWidth;
        for (var rightColumnIndex = 0; rightColumnIndex < this.props.rightAxisWidths.length; rightColumnIndex++) {
            var colWidth = this.props.rightAxisWidths[rightColumnIndex];

            if (rightColumnIndex < rightAxisList.length) {
                id = rightAxisList[rightColumnIndex];
                transform = "translate(" + posx + "," + margin + ")";

                //Additional props for right aligned axes
                props = { "width": colWidth,
                    "height": innerHeight,
                    "align": "right",
                    "transition": this.props.transition };
                if (_.has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                //Cloned right axis
                axis = React.addons.cloneWithProps(yAxisMap[id], props);

                //Debug rect
                if (this.props.debug) {
                    debug = React.createElement("rect", { className: "yaxis-debug", x: "0", y: "0", width: colWidth, height: innerHeight });
                } else {
                    debug = null;
                }

                yAxisList.push(React.createElement(
                    "g",
                    { key: "y-axis-right-" + rightColumnIndex, transform: transform },
                    debug,
                    axis
                ));
            }

            posx = posx + colWidth + padding;
        }

        //
        // Push each chart onto the chartList, transforming each to the right of the left axis slots
        // and specifying its width. Each chart is passed its time and y scale. The yscale is looked
        // up in yAxisScaleMap.
        //

        var chartWidth = this.props.width - leftWidth - rightWidth;
        var chartTransform = "translate(" + leftWidth + "," + margin + ")";

        var keyCount = 0;
        React.Children.forEach(this.props.children, function (child) {

            if (child.type === Charts) {
                var charts = child;
                React.Children.forEach(charts.props.children, function (chart) {
                    //Additional props for charts
                    var props = {
                        key: chart.props.key ? chart.props.key : "chart-" + keyCount,
                        width: chartWidth,
                        height: innerHeight,
                        clipPathURL: _this.state.clipPathURL,
                        timeScale: _this.props.timeScale,
                        yScale: yAxisScaleMap[chart.props.axis],
                        transition: _this.props.transition
                    };

                    chartList.push(React.addons.cloneWithProps(chart, props));

                    keyCount++;
                });
            }
        });

        //
        // Push each child Brush on to the brush list.  We need brushed to be rendered last (on top) of
        // everything else in the Z order, both for visual correctness and to ensure that the brush gets
        // mouse events before anything underneath
        //

        var brushList = [];
        keyCount = 0;
        React.Children.forEach(this.props.children, function (child) {
            if (child.type === Brush) {
                var _props = {
                    key: "brush-" + keyCount,
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: _this.props.timeScale,
                    yScale: yAxisScaleMap[child.props.axis]
                };
                brushList.push(React.addons.cloneWithProps(child, _props));
            }
            keyCount++;
        });

        var enableZoom = _.has(this.props, "enableZoom") ? this.props.enableZoom : false;

        var zoomHandler = null;
        if (enableZoom) {
            zoomHandler = this.handleZoom;
        }

        var chartDebug = null;
        if (this.props.debug) {
            chartDebug = React.createElement("rect", { className: "chart-debug", x: leftWidth, y: margin, width: chartWidth, height: innerHeight });
        }

        return React.createElement(
            "svg",
            { width: this.props.width, height: Number(this.props.height) },
            yAxisList,
            chartDebug,
            React.createElement(
                "g",
                { transform: chartTransform, key: "chart-group" },
                React.createElement(ClipDefs, { id: this.state.clipId, clipWidth: chartWidth, clipHeight: innerHeight }),
                chartList
            ),
            React.createElement(
                "g",
                { transform: chartTransform, key: "tracker-group" },
                React.createElement(Tracker, { height: innerHeight,
                    scale: this.props.timeScale, position: this.props.trackerPosition })
            ),
            React.createElement(
                "g",
                { transform: chartTransform, key: "event-rect-group" },
                React.createElement(EventRect, { width: chartWidth, height: innerHeight,
                    scale: this.props.timeScale,
                    onMouseOut: this.handleMouseOut,
                    onMouseMove: this.handleMouseMove,
                    enableZoom: enableZoom,
                    onZoom: zoomHandler,
                    minTime: this.props.minTime,
                    maxTime: this.props.maxTime,
                    onResize: this.handleResize })
            ),
            React.createElement(
                "g",
                { transform: chartTransform, key: "brush-group" },
                brushList
            )
        );
    }
});

module.exports = ChartRow;