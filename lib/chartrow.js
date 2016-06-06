"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require("d3-scale");

var _d3Interpolate = require("d3-interpolate");

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
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var AXIS_MARGIN = 5;

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

        var yAxisScaleMap = this.getYAxisScaleMap(this.props);

        return { yAxisScaleMap: yAxisScaleMap, clipId: clipId, clipPathURL: clipPathURL };
    },
    componentWillMount: function componentWillMount() {
        this.scaleInterpolator = {};
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
    updateAnimation: function updateAnimation(id, pos, scale) {
        var _this = this;

        var stepSize = 0.1;
        var duration = this.props.transition || 0;
        var p = Math.min(pos, 1.0);
        if (p <= 1.0) {
            (function () {
                var s = _this.scaleInterpolator[id](p);

                // New scale
                var newScale = scale.copy();
                newScale.domain(s);

                var yAxisScaleMap = _this.state.yAxisScaleMap;
                yAxisScaleMap[id] = newScale;
                _this.setState({ yAxisScaleMap: yAxisScaleMap });

                if (p < 1.0) {
                    setTimeout(function () {
                        return _this.updateAnimation(id, p + stepSize, newScale);
                    }, duration * stepSize);
                }
            })();
        }
    },
    getYAxisScaleMap: function getYAxisScaleMap(props) {
        var _this2 = this;

        var yAxisScaleMap = {};

        // Dimensions
        var innerHeight = +props.height - AXIS_MARGIN * 2;
        var rangeTop = AXIS_MARGIN;
        var rangeBottom = innerHeight - AXIS_MARGIN;

        _react2.default.Children.forEach(props.children, function (child) {
            if (child.type === _yaxis2.default || _underscore2.default.has(child.props, "min") && _underscore2.default.has(child.props, "max")) {
                var _child$props = child.props;
                var id = _child$props.id;
                var max = _child$props.max;
                var min = _child$props.min;
                var _child$props$type = _child$props.type;
                var type = _child$props$type === undefined ? "linear" : _child$props$type;

                yAxisScaleMap[id] = _this2.createScale(child, type, min, max, rangeBottom, rangeTop);
            }
        });

        return yAxisScaleMap;
    },


    /**
     * When we get changes to the row's props we update our map of
     * axis scales.
     */
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var _this3 = this;

        var oldYAxisScaleMap = this.state.yAxisScaleMap;

        // Dimensions
        var innerHeight = +nextProps.height - AXIS_MARGIN * 2;
        var rangeTop = AXIS_MARGIN;
        var rangeBottom = innerHeight - AXIS_MARGIN;

        _react2.default.Children.forEach(nextProps.children, function (child) {
            if (child.type === _yaxis2.default || _underscore2.default.has(child.props, "min") && _underscore2.default.has(child.props, "max")) {
                (function () {
                    var _child$props2 = child.props;
                    var id = _child$props2.id;
                    var max = _child$props2.max;
                    var min = _child$props2.min;
                    var _child$props2$type = _child$props2.type;
                    var type = _child$props2$type === undefined ? "linear" : _child$props2$type;

                    if (_underscore2.default.has(oldYAxisScaleMap, id)) {
                        if (oldYAxisScaleMap[id].domain()[0] !== max && oldYAxisScaleMap[id].domain()[1] !== max) {
                            (function () {

                                var targetScale = _this3.createScale(child, type, min, max, rangeBottom, rangeTop);

                                _this3.scaleInterpolator[id] = (0, _d3Interpolate.interpolate)(oldYAxisScaleMap[id].domain(), targetScale.domain());

                                var pos = 1.0;
                                if (_this3.props.transition && _this3.props.transition > 0) {
                                    pos = 0.0;
                                }

                                setTimeout(function () {
                                    return _this3.updateAnimation(id, pos, oldYAxisScaleMap[id]);
                                }, 0);
                            })();
                        }
                    } else {
                        oldYAxisScaleMap[id] = _this3.createScale(child, type, min, max, rangeBottom, rangeTop);
                    }
                })();
            }
        });
    },
    render: function render() {
        var _this4 = this;

        var axes = []; // Contains all the yAxis elements used in the render
        var chartList = []; // Contains all the Chart elements used in the render

        // Dimensions
        var innerHeight = +this.props.height - AXIS_MARGIN * 2;

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

        var yAxisMap = {}; // Maps axis id -> axis element
        var leftAxisList = []; // Ordered list of left axes ids
        var rightAxisList = []; // Ordered list of right axes ids

        var alignLeft = true;
        _react2.default.Children.forEach(this.props.children, function (child) {
            if (child.type === _charts3.default) {
                alignLeft = false;
            } else {
                var _id = child.props.id;
                // Check to see if we think this 'axis' is actually an axis
                if (child.type === _yaxis2.default || _underscore2.default.has(child.props, "min") && _underscore2.default.has(child.props, "max")) {
                    var yaxis = child;

                    if (yaxis.props.id) {
                        // Relate id to the axis
                        yAxisMap[yaxis.props.id] = yaxis;
                    }

                    // Columns counts
                    if (alignLeft) {
                        leftAxisList.push(_id);
                    } else {
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
                props = {
                    width: colWidth,
                    height: innerHeight,
                    align: "left",
                    transition: this.props.transition
                };
                if (_underscore2.default.has(this.state.yAxisScaleMap, id)) {
                    props.scale = this.state.yAxisScaleMap[id];
                }

                // Cloned left axis
                axis = _react2.default.cloneElement(yAxisMap[id], props);

                // Debug rect
                if (this.props.debug) {
                    debug = _react2.default.createElement("rect", {
                        className: "yaxis-debug",
                        x: "0",
                        y: "0",
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
                props = {
                    width: _colWidth,
                    height: innerHeight,
                    align: "right",
                    transition: this.props.transition
                };
                if (_underscore2.default.has(this.state.yAxisScaleMap, id)) {
                    props.scale = this.state.yAxisScaleMap[id];
                }

                // Cloned right axis
                axis = _react2.default.cloneElement(yAxisMap[id], props);

                // Debug rect
                if (this.props.debug) {
                    debug = _react2.default.createElement("rect", {
                        className: "yaxis-debug",
                        x: "0",
                        y: "0",
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
        // its time and y-scale. The y-scale is looked up in yAxisScaleMap, whose
        // current value is stored in the component state.
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
                        clipPathURL: _this4.state.clipPathURL,
                        timeScale: _this4.props.timeScale,
                        timeFormat: _this4.props.timeFormat,
                        yScale: _this4.state.yAxisScaleMap[chart.props.axis],
                        transition: _this4.props.transition
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
                    clipPathURL: _this4.state.clipPathURL,
                    timeScale: _this4.props.timeScale,
                    yScale: _this4.state.yAxisScaleMap[child.props.axis]
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
            var timeFormat = this.props.trackerTimeFormat || this.props.timeFormat;
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
});