"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require("d3-scale");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _yaxis = require("./yaxis");

var _yaxis2 = _interopRequireDefault(_yaxis);

var _charts2 = require("./charts");

var _charts3 = _interopRequireDefault(_charts2);

var _brush = require("./brush");

var _brush2 = _interopRequireDefault(_brush);

var _tracker = require("./tracker");

var _tracker2 = _interopRequireDefault(_tracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
exports.default = _react2.default.createClass({

    displayName: "ChartRow",

    getDefaultProps: function getDefaultProps() {
        return {
            trackerTimeFormat: "%b %d %Y %X",
            enablePanZoom: false,
            height: 100
        };
    },


    propTypes: {
        /**
         * The height of the row.
         */
        height: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number])
    },

    getInitialState: function getInitialState() {
        // id of clipping rectangle we will generate and use for each child
        // chart. Lives in state to ensure just one clipping rectangle and
        // id per chart row instance; we don't want a fresh id generated on
        // each render.
        var clipId = _underscore2.default.uniqueId("clip_");
        var clipPathURL = "url(#" + clipId + ")";

        return { clipId: clipId, clipPathURL: clipPathURL };
    },
    createScale: function createScale(yaxis, type, min, max, y0, y1) {
        var scale = void 0;
        if (_underscore2.default.isUndefined(min) || min !== min || _underscore2.default.isUndefined(max) || max !== max) {
            scale = null;
        } else if (type === "linear") {
            scale = (0, _d3Scale.scaleLinear)().domain([min, max]).range([y0, y1]).nice();
        } else if (type === "log") {
            var base = yaxis.props.logBase || 10;
            scale = (0, _d3Scale.scaleLog)().base(base).domain([min, max]).range([y0, y1]);
        } else if (type === "power") {
            var power = yaxis.props.powerExponent || 2;
            scale = (0, _d3Scale.scalePow)().exponent(power).domain([min, max]).range([y0, y1]);
        }
        return scale;
    },
    render: function render() {
        var _this = this;

        var axes = []; // Contains all the yAxis elements used in the render
        var chartList = []; // Contains all the chart elements used
        // in the render

        // Extra padding above and below the axis since numbers need to be
        // displayed there
        var AXIS_MARGIN = 5;

        var innerHeight = +this.props.height - AXIS_MARGIN * 2;
        var rangeTop = AXIS_MARGIN;
        var rangeBottom = innerHeight - AXIS_MARGIN;

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

        var yAxisMap = {}; // Maps axis id -> axis element
        var yAxisScaleMap = {}; // Maps axis id -> axis scale
        var leftAxisList = []; // Ordered list of left axes ids
        var rightAxisList = []; // Ordered list of right axes ids
        var align = "left";

        _react2.default.Children.forEach(this.props.children, function (child) {

            //
            // TODO:
            // This code currently assumes each child (except in Charts) has an
            // id, but this is just because leftAxisList and rightAxisList
            // below pushes an id. Perhaps it could put the element itself?
            //

            if (child.type === _charts3.default) {
                align = "right";
            } else {
                var _id = child.props.id;
                // Check to see if we think this 'axis' is actually an axis
                if (child.type === _yaxis2.default || _underscore2.default.has(child.props, "min") && _underscore2.default.has(child.props, "max")) {
                    var yaxis = child;
                    var _yaxis$props = yaxis.props;
                    var max = _yaxis$props.max;
                    var min = _yaxis$props.min;

                    var type = yaxis.props.type || "linear";

                    if (yaxis.props.id) {
                        // Relate id to the axis
                        yAxisMap[yaxis.props.id] = yaxis;
                    }

                    // Relate id to a d3 scale generated from the max, min
                    // and scaleType props
                    yAxisScaleMap[_id] = _this.createScale(yaxis, type, min, max, rangeBottom, rangeTop);
                    // Columns counts
                    if (align === "left") {
                        leftAxisList.push(_id);
                    } else if (align === "right") {
                        rightAxisList.push(_id);
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

        var transform = void 0;
        var id = void 0;
        var props = void 0;
        var axis = void 0;
        var posx = 0;

        // Space used by columns on left and right of charts
        var leftWidth = _underscore2.default.reduce(this.props.leftAxisWidths, function (a, b) {
            return a + b;
        }, 0);
        var rightWidth = _underscore2.default.reduce(this.props.rightAxisWidths, function (a, b) {
            return a + b;
        }, 0);

        var debug = void 0;

        posx = leftWidth;
        for (var leftColumnIndex = 0; leftColumnIndex < this.props.leftAxisWidths.length; leftColumnIndex++) {

            var colWidth = this.props.leftAxisWidths[leftColumnIndex];

            posx -= colWidth;

            if (leftColumnIndex < leftAxisList.length) {
                id = leftAxisList[leftColumnIndex];
                transform = "translate(" + posx + ",0)";

                // Additional props for left aligned axes
                props = { width: colWidth,
                    height: innerHeight,
                    align: "left",
                    transition: this.props.transition };
                if (_underscore2.default.has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                // Cloned left axis
                axis = _react2.default.cloneElement(yAxisMap[id], props);

                // Debug rect
                if (this.props.debug) {
                    debug = _react2.default.createElement("rect", { className: "yaxis-debug",
                        x: "0", y: "0",
                        width: colWidth,
                        height: innerHeight });
                } else {
                    debug = null;
                }

                axes.push(_react2.default.createElement(
                    "g",
                    { key: "y-axis-left-" + leftColumnIndex,
                        transform: transform },
                    debug,
                    axis
                ));
            }
        }

        posx = this.props.width - rightWidth;
        for (var rightColumnIndex = 0; rightColumnIndex < this.props.rightAxisWidths.length; rightColumnIndex++) {

            var _colWidth = this.props.rightAxisWidths[rightColumnIndex];

            if (rightColumnIndex < rightAxisList.length) {
                id = rightAxisList[rightColumnIndex];
                transform = "translate(" + posx + ",0)";

                // Additional props for right aligned axes
                props = { width: _colWidth,
                    height: innerHeight,
                    align: "right",
                    transition: this.props.transition };
                if (_underscore2.default.has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                // Cloned right axis
                axis = _react2.default.cloneElement(yAxisMap[id], props);

                // Debug rect
                if (this.props.debug) {
                    debug = _react2.default.createElement("rect", { className: "yaxis-debug",
                        x: "0", y: "0",
                        width: _colWidth,
                        height: innerHeight });
                } else {
                    debug = null;
                }

                axes.push(_react2.default.createElement(
                    "g",
                    { key: "y-axis-right-" + rightColumnIndex,
                        transform: transform },
                    debug,
                    axis
                ));
            }

            posx = posx + _colWidth;
        }

        //
        // Push each chart onto the chartList, transforming each to the right
        // of the left axis slots and specifying its width. Each chart is passed
        // its time and y scale. The yscale is looked up in yAxisScaleMap.
        //

        var chartWidth = this.props.width - leftWidth - rightWidth;
        var chartTransform = "translate(" + leftWidth + ",0)";

        var keyCount = 0;
        _react2.default.Children.forEach(this.props.children, function (child) {

            if (child.type === _charts3.default) {
                var _charts = child;
                _react2.default.Children.forEach(_charts.props.children, function (chart) {
                    // Additional props for charts
                    var chartProps = {
                        key: chart.props.key ? chart.props.key : "chart-" + keyCount,
                        width: chartWidth,
                        height: innerHeight,
                        clipPathURL: _this.state.clipPathURL,
                        timeScale: _this.props.timeScale,
                        yScale: yAxisScaleMap[chart.props.axis],
                        transition: _this.props.transition
                    };

                    chartList.push(_react2.default.cloneElement(chart, chartProps));

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

        var brushList = [];
        keyCount = 0;
        _react2.default.Children.forEach(this.props.children, function (child) {
            if (child.type === _brush2.default) {
                var brushProps = {
                    key: "brush-" + keyCount,
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: _this.props.timeScale,
                    yScale: yAxisScaleMap[child.props.axis]
                };
                brushList.push(_react2.default.cloneElement(child, brushProps));
            }
            keyCount++;
        });

        var charts = _react2.default.createElement(
            "g",
            { transform: chartTransform, key: "event-rect-group" },
            _react2.default.createElement(
                "g",
                { key: "charts" },
                chartList
            )
        );

        // Debug outlining
        var chartDebug = null;
        if (this.props.debug) {
            chartDebug = _react2.default.createElement("rect", { className: "chart-debug",
                x: leftWidth, y: 0,
                width: chartWidth, height: innerHeight });
        }

        // Clipping
        var clipper = _react2.default.createElement(
            "defs",
            null,
            _react2.default.createElement(
                "clipPath",
                { id: this.state.clipId },
                _react2.default.createElement("rect", { x: "0", y: "0", width: chartWidth, height: innerHeight })
            )
        );

        // Pan and zoom brushes
        var brushes = _react2.default.createElement(
            "g",
            { transform: chartTransform, key: "brush-group" },
            brushList
        );

        // Row tracker
        var tracker = void 0;
        if (this.props.trackerPosition) {
            var timeFormat = this.props.trackerTimeFormat || this.props.format;
            tracker = _react2.default.createElement(
                "g",
                {
                    key: "tracker-group",
                    style: { pointerEvents: "none" },
                    transform: "translate(" + leftWidth + ",0)" },
                _react2.default.createElement(_tracker2.default, {
                    showLine: false,
                    showTime: this.props.trackerShowTime,
                    timeScale: this.props.timeScale,
                    position: this.props.trackerPosition,
                    timeFormat: timeFormat,
                    width: chartWidth,
                    trackerHintWidth: this.props.trackerHintWidth,
                    trackerHintHeight: this.props.trackerHintHeight,
                    trackerValues: this.props.trackerValues })
            );
        }

        return _react2.default.createElement(
            "g",
            null,
            clipper,
            axes,
            charts,
            chartDebug,
            brushes,
            tracker
        );
    }
}); /**
     *  Copyright (c) 2015, The Regents of the University of California,
     *  through Lawrence Berkeley National Laboratory (subject to receipt
     *  of any required approvals from the U.S. Dept. of Energy).
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree.
     */