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

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _reactAddons = require("react/addons");

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _reactTooltip = require("react-tooltip");

var _reactTooltip2 = _interopRequireDefault(_reactTooltip);

var _yaxis2 = require("./yaxis");

var _yaxis3 = _interopRequireDefault(_yaxis2);

var _charts2 = require("./charts");

var _charts3 = _interopRequireDefault(_charts2);

var _brush = require("./brush");

var _brush2 = _interopRequireDefault(_brush);

var _tracker = require("./tracker");

var _tracker2 = _interopRequireDefault(_tracker);

var _eventhandler = require("./eventhandler");

/**
 * A ChartRow has a set of Y axes and multiple charts which are overlayed on each other
 * in a central canvas.
 */

var _eventhandler2 = _interopRequireDefault(_eventhandler);

exports["default"] = _reactAddons2["default"].createClass({

    displayName: "ChartRow",

    getDefaultProps: function getDefaultProps() {
        return {
            "enablePanZoom": false
        };
    },

    propTypes: {
        enablePanZoom: _reactAddons2["default"].PropTypes.bool
    },

    getInitialState: function getInitialState() {
        // id of clipping rectangle we will generate and use for each child chart
        // Lives in state to ensure just one clipping rectangle and id per chart row instance; we don't
        // want a fresh id generated on each render.
        var clipId = _underscore2["default"].uniqueId("clip_");
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

    handleZoom: function handleZoom(timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    },

    handleResize: function handleResize(width, height) {
        if (this.props.onChartResize) {
            this.props.onChartResize(width, height);
        }
    },

    createScale: function createScale(type, min, max, y0, y1) {
        var scale = undefined;
        if (_underscore2["default"].isUndefined(min) || min !== min || _underscore2["default"].isUndefined(max) || max !== max) {
            scale = null;
        } else if (type === "linear") {
            scale = _d32["default"].scale.linear().domain([min, max]).range([y0, y1]).nice();
        } else if (type === "log") {
            var base = yaxis.props.logBase || 10;
            scale = _d32["default"].scale.log().base(base).domain([min, max]).range([y0, y1]);
        } else if (type === "power") {
            var power = yaxis.props.powerExponent || 2;
            scale = _d32["default"].scale.pow().exponent(power).domain([min, max]).range([y0, y1]);
        }
        return scale;
    },

    render: function render() {
        var _this = this;

        var axes = []; // Contains all the yAxis elements used in the render
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

        _reactAddons2["default"].Children.forEach(this.props.children, function (child) {

            //
            // TODO:
            // This code currently assumes each child (except in Charts) has an id, but
            // this is just because leftAxisList and rightAxisList below pushes an id.
            // Perhaps it could put the element itself?
            //

            if (child.type === _charts3["default"]) {
                align = "right";
            } else {
                var _id = child.props.id;

                //Check to see if we think this 'axis' is actually an axis
                if (child.type === _yaxis3["default"] || _underscore2["default"].has(child.props, "min") && _underscore2["default"].has(child.props, "max")) {
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
        // Push each axis onto the axes, transforming each into its column location
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
        var leftWidth = _underscore2["default"].reduce(this.props.leftAxisWidths, function (a, b) {
            return a + b;
        }, 0) + leftExtra;
        var rightWidth = _underscore2["default"].reduce(this.props.rightAxisWidths, function (a, b) {
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
                if (_underscore2["default"].has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                //Cloned left axis
                axis = _reactAddons2["default"].addons.cloneWithProps(yAxisMap[id], props);

                //Debug rect
                if (this.props.debug) {
                    debug = _reactAddons2["default"].createElement("rect", { className: "yaxis-debug", x: "0", y: "0", width: colWidth, height: innerHeight });
                } else {
                    debug = null;
                }

                axes.push(_reactAddons2["default"].createElement(
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
                if (_underscore2["default"].has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                //Cloned right axis
                axis = _reactAddons2["default"].addons.cloneWithProps(yAxisMap[id], props);

                //Debug rect
                if (this.props.debug) {
                    debug = _reactAddons2["default"].createElement("rect", { className: "yaxis-debug", x: "0", y: "0", width: colWidth, height: innerHeight });
                } else {
                    debug = null;
                }

                axes.push(_reactAddons2["default"].createElement(
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
        _reactAddons2["default"].Children.forEach(this.props.children, function (child) {

            if (child.type === _charts3["default"]) {
                var _charts = child;
                _reactAddons2["default"].Children.forEach(_charts.props.children, function (chart) {
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

                    chartList.push(_reactAddons2["default"].addons.cloneWithProps(chart, props));

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
        _reactAddons2["default"].Children.forEach(this.props.children, function (child) {
            if (child.type === _brush2["default"]) {
                var _props = {
                    key: "brush-" + keyCount,
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: _this.props.timeScale,
                    yScale: yAxisScaleMap[child.props.axis]
                };
                brushList.push(_reactAddons2["default"].addons.cloneWithProps(child, _props));
            }
            keyCount++;
        });

        //Hover tracker line
        var tracker = _reactAddons2["default"].createElement(
            "g",
            { key: "tracker-group", style: { pointerEvents: "none" } },
            _reactAddons2["default"].createElement(_tracker2["default"], { height: innerHeight,
                timeScale: this.props.timeScale,
                position: this.props.trackerPosition })
        );

        //Charts with or without pan and zoom event handling
        var charts = undefined;
        if (this.props.enablePanZoom || this.props.onTrackerChanged) {
            charts = _reactAddons2["default"].createElement(
                "g",
                { transform: chartTransform, key: "event-rect-group" },
                _reactAddons2["default"].createElement(
                    _eventhandler2["default"],
                    { key: "event-handler",
                        width: chartWidth, height: innerHeight,
                        scale: this.props.timeScale,
                        enablePanZoom: this.props.enablePanZoom,
                        minDuration: this.props.minDuration,
                        minTime: this.props.minTime,
                        maxTime: this.props.maxTime,
                        onMouseOut: this.handleMouseOut,
                        onMouseMove: this.handleMouseMove,
                        onZoom: this.handleZoom,
                        onResize: this.handleResize },
                    chartList,
                    tracker
                )
            );
        } else {
            charts = _reactAddons2["default"].createElement(
                "g",
                { transform: chartTransform, key: "event-rect-group" },
                _reactAddons2["default"].createElement(
                    "g",
                    { key: "charts" },
                    chartList
                ),
                _reactAddons2["default"].createElement(
                    "g",
                    { key: "tracker" },
                    tracker
                )
            );
        }

        //Debug outlining
        var chartDebug = null;
        if (this.props.debug) {
            chartDebug = _reactAddons2["default"].createElement("rect", { className: "chart-debug", x: leftWidth, y: margin, width: chartWidth, height: innerHeight });
        }

        //Clipping
        var clipDefs = _reactAddons2["default"].createElement(
            "defs",
            null,
            _reactAddons2["default"].createElement(
                "clipPath",
                { id: this.state.clipId },
                _reactAddons2["default"].createElement("rect", { x: "0", y: "0", width: chartWidth, height: innerHeight })
            )
        );

        //Pan and zoom brushes
        var brushes = _reactAddons2["default"].createElement(
            "g",
            { transform: chartTransform, key: "brush-group" },
            brushList
        );

        return _reactAddons2["default"].createElement(
            "div",
            null,
            _reactAddons2["default"].createElement(_reactTooltip2["default"], { place: "top", type: "warning", effect: "solid" }),
            _reactAddons2["default"].createElement(
                "svg",
                { width: this.props.width, height: Number(this.props.height) },
                clipDefs,
                axes,
                charts,
                chartDebug,
                brushes
            )
        );
    }
});
module.exports = exports["default"];