"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require("d3-scale");

var _d3Ease = require("d3-ease");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _YAxis = require("./YAxis");

var _YAxis2 = _interopRequireDefault(_YAxis);

var _Charts = require("./Charts");

var _Charts2 = _interopRequireDefault(_Charts);

var _Brush = require("./Brush");

var _Brush2 = _interopRequireDefault(_Brush);

var _Tracker = require("./Tracker");

var _Tracker2 = _interopRequireDefault(_Tracker);

var _interpolators = require("../js/interpolators");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
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
    componentWillMount: function componentWillMount() {
        var _this = this;

        // Our chart scales are driven off a mapping between id of the axis
        // and the scale that axis represents. Depending on the transition time,
        // this scale will animate over time. The controller of this animation is
        // the ScaleInterpolator. We create new Scale Interpolators here for each
        // axis id.
        this.scaleMap = {};

        var innerHeight = +this.props.height - AXIS_MARGIN * 2;
        var rangeTop = AXIS_MARGIN;
        var rangeBottom = innerHeight - AXIS_MARGIN;
        _react2.default.Children.forEach(this.props.children, function (child) {
            if (child.type === _YAxis2.default || _underscore2.default.has(child.props, "min") && _underscore2.default.has(child.props, "max")) {
                (function () {
                    var _child$props = child.props;
                    var id = _child$props.id;
                    var max = _child$props.max;
                    var min = _child$props.min;
                    var _child$props$transiti = _child$props.transition;
                    var transition = _child$props$transiti === undefined ? 0 : _child$props$transiti;
                    var _child$props$type = _child$props.type;
                    var type = _child$props$type === undefined ? "linear" : _child$props$type;

                    var initialScale = _this.createScale(child, type, min, max, rangeBottom, rangeTop);
                    _this.scaleMap[id] = new _interpolators.ScaleInterpolator(transition, _d3Ease.easeSinOut, function (s) {
                        var yAxisScalerMap = _this.state.yAxisScalerMap;
                        yAxisScalerMap[id] = s;
                        _this.setState(yAxisScalerMap);
                    });
                    var cacheKey = type + "-" + min + "-" + max + "-" + rangeBottom + "-" + rangeTop;
                    _this.scaleMap[id].setScale(cacheKey, initialScale);
                })();
            }
        });

        var scalerMap = {};
        _underscore2.default.forEach(this.scaleMap, function (interpolator, id) {
            scalerMap[id] = interpolator.scaler();
        });

        this.setState({ yAxisScalerMap: scalerMap });
    },
    createScale: function createScale(yaxis, type, min, max, y0, y1) {
        var scale = void 0;
        if (_underscore2.default.isUndefined(min) || _underscore2.default.isUndefined(max)) {
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


    /**
     * When we get changes to the row's props we update our map of
     * axis scales.
     */
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        // Dimensions
        var innerHeight = +nextProps.height - AXIS_MARGIN * 2;
        var rangeTop = AXIS_MARGIN;
        var rangeBottom = innerHeight - AXIS_MARGIN;

        // Loop over all the children who are YAxis. If this is our first time here, we'll
        // populate the scaleMap with new ScaleInterpolators. If we already have a ScaleInterpolator
        // then we can set a new scale target on it.
        _react2.default.Children.forEach(nextProps.children, function (child) {
            if (child.type === _YAxis2.default || _underscore2.default.has(child.props, "min") && _underscore2.default.has(child.props, "max")) {
                (function () {
                    var _child$props2 = child.props;
                    var id = _child$props2.id;
                    var max = _child$props2.max;
                    var min = _child$props2.min;
                    var _child$props2$transit = _child$props2.transition;
                    var transition = _child$props2$transit === undefined ? 0 : _child$props2$transit;
                    var _child$props2$type = _child$props2.type;
                    var type = _child$props2$type === undefined ? "linear" : _child$props2$type;


                    var scale = _this2.createScale(child, type, min, max, rangeBottom, rangeTop);
                    if (!_underscore2.default.has(_this2.scaleMap, id)) {
                        _this2.scaleMap[id] = new _interpolators.ScaleInterpolator(transition, _d3Ease.easeSinOut, function (s) {
                            var yAxisScalerMap = _this2.state.yAxisScalerMap;
                            yAxisScalerMap[id] = s;
                            _this2.setState(yAxisScalerMap);
                        });
                    }
                    var cacheKey = type + "-" + min + "-" + max + "-" + rangeBottom + "-" + rangeTop;
                    _this2.scaleMap[id].setScale(cacheKey, scale);
                })();
            }
        });

        var scalerMap = {};
        _underscore2.default.forEach(this.scaleMap, function (interpolator, id) {
            scalerMap[id] = interpolator.scaler();
        });

        this.setState({ yAxisScalerMap: scalerMap });
    },
    render: function render() {
        var _this3 = this;

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
            if (child.type === _Charts2.default) {
                alignLeft = false;
            } else {
                var _id = child.props.id;
                // Check to see if we think this 'axis' is actually an axis
                if (child.type === _YAxis2.default || _underscore2.default.has(child.props, "min") && _underscore2.default.has(child.props, "max")) {
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
                    scale: this.scaleMap[id].latestScale()
                };

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
                    scale: this.scaleMap[id].latestScale()
                };

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

            posx += _colWidth;
        }

        //
        // Push each chart onto the chartList, transforming each to the right
        // of the left axis slots and specifying its width. Each chart is passed
        // its time and y-scale. The y-scale is looked up in scaleMap, whose
        // current value is stored in the component state.
        //

        var chartWidth = this.props.width - leftWidth - rightWidth;
        var chartTransform = "translate(" + leftWidth + ",0)";

        var keyCount = 0;
        _react2.default.Children.forEach(this.props.children, function (child) {

            if (child.type === _Charts2.default) {
                var _charts = child;
                _react2.default.Children.forEach(_charts.props.children, function (chart) {

                    // Additional props for charts
                    var chartProps = {
                        key: keyCount,
                        width: chartWidth,
                        height: innerHeight,
                        clipPathURL: _this3.state.clipPathURL,
                        timeScale: _this3.props.timeScale,
                        timeFormat: _this3.props.timeFormat,
                        yScale: _this3.state.yAxisScalerMap[chart.props.axis],
                        transition: _this3.scaleMap[chart.props.axis].transition()
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
            if (child.type === _Brush2.default) {
                var brushProps = {
                    key: "brush-" + keyCount,
                    width: chartWidth,
                    height: innerHeight,
                    clipPathURL: _this3.state.clipPathURL,
                    timeScale: _this3.props.timeScale
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
                _react2.default.createElement(_Tracker2.default, {
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