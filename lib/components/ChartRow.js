"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Ease = require("d3-ease");

var _d3Scale = require("d3-scale");

var _reactHotLoader = require("react-hot-loader");

var _Brush = require("./Brush");

var _Brush2 = _interopRequireDefault(_Brush);

var _YAxis = require("./YAxis");

var _YAxis2 = _interopRequireDefault(_YAxis);

var _Charts = require("./Charts");

var _Charts2 = _interopRequireDefault(_Charts);

var _MultiBrush = require("./MultiBrush");

var _MultiBrush2 = _interopRequireDefault(_MultiBrush);

var _TimeMarker = require("./TimeMarker");

var _TimeMarker2 = _interopRequireDefault(_TimeMarker);

var _interpolators = require("../js/interpolators");

var _interpolators2 = _interopRequireDefault(_interpolators);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
            "Super expression must either be null or a function, not " + typeof superClass
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
    });
    if (superClass)
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
}
/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var AXIS_MARGIN = 5;

function createScale(yaxis, type, min, max, y0, y1) {
    var scale = void 0;
    if (_underscore2.default.isUndefined(min) || _underscore2.default.isUndefined(max)) {
        scale = null;
    } else if (type === "linear") {
        scale = (0, _d3Scale.scaleLinear)()
            .domain([min, max])
            .range([y0, y1])
            .nice();
    } else if (type === "log") {
        var base = yaxis.props.logBase || 10;
        scale = (0, _d3Scale.scaleLog)()
            .base(base)
            .domain([min, max])
            .range([y0, y1]);
    } else if (type === "power") {
        var power = yaxis.props.powerExponent || 2;
        scale = (0, _d3Scale.scalePow)()
            .exponent(power)
            .domain([min, max])
            .range([y0, y1]);
    }
    return scale;
}

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

var ChartRow = (function(_React$Component) {
    _inherits(ChartRow, _React$Component);

    function ChartRow(props) {
        _classCallCheck(this, ChartRow);

        // id of clipping rectangle we will generate and use for each child
        // chart. Lives in state to ensure just one clipping rectangle and
        // id per chart row instance; we don't want a fresh id generated on
        // each render.
        var _this = _possibleConstructorReturn(
            this,
            (ChartRow.__proto__ || Object.getPrototypeOf(ChartRow)).call(this, props)
        );

        _this.isChildYAxis = function(child) {
            return (
                (0, _reactHotLoader.areComponentsEqual)(child.type, _YAxis2.default) ||
                (_underscore2.default.has(child.props, "min") &&
                    _underscore2.default.has(child.props, "max"))
            );
        };

        var clipId = _underscore2.default.uniqueId("clip_");
        var clipPathURL = "url(#" + clipId + ")";
        _this.state = {
            clipId: clipId,
            clipPathURL: clipPathURL
        };
        return _this;
    }

    _createClass(ChartRow, [
        {
            key: "updateScales",
            value: function updateScales(props) {
                var _this2 = this;

                var innerHeight = +props.height - AXIS_MARGIN * 2;
                var rangeTop = AXIS_MARGIN;
                var rangeBottom = innerHeight - AXIS_MARGIN;
                _react2.default.Children.forEach(props.children, function(child) {
                    if (child === null) return;
                    if (_this2.isChildYAxis(child)) {
                        var _child$props = child.props,
                            id = _child$props.id,
                            max = _child$props.max,
                            min = _child$props.min,
                            _child$props$transiti = _child$props.transition,
                            transition =
                                _child$props$transiti === undefined ? 0 : _child$props$transiti,
                            _child$props$type = _child$props.type,
                            type = _child$props$type === undefined ? "linear" : _child$props$type;

                        if (!_underscore2.default.has(_this2.scaleMap, id)) {
                            // If necessary, initialize a ScaleInterpolator for this y-axis.
                            // When the yScale changes, we will update this interpolator.
                            _this2.scaleMap[id] = new _interpolators2.default(
                                transition,
                                _d3Ease.easeSinOut,
                                function(s) {
                                    var yAxisScalerMap = _this2.state.yAxisScalerMap;
                                    yAxisScalerMap[id] = s;
                                    _this2.setState(yAxisScalerMap);
                                }
                            );
                        }
                        // Get the vertical scale for this y-axis.
                        var scale = void 0;
                        if (_underscore2.default.has(child.props, "yScale")) {
                            // If the yScale prop is passed explicitly, use that.
                            scale = child.props.yScale;
                        } else {
                            // Otherwise, compute the scale based on the max and min props.
                            scale = createScale(child, type, min, max, rangeBottom, rangeTop);
                        }

                        // Update the scale on the interpolator for this y-axis.
                        var cacheKey =
                            type + "-" + min + "-" + max + "-" + rangeBottom + "-" + rangeTop;
                        _this2.scaleMap[id].setScale(cacheKey, scale);
                    }
                });

                // Update the state with the newly interpolated scaler for each y-axis.
                var scalerMap = {};
                _underscore2.default.forEach(this.scaleMap, function(interpolator, id) {
                    scalerMap[id] = interpolator.scaler();
                });

                this.setState({ yAxisScalerMap: scalerMap });
            }
        },
        {
            key: "componentWillMount",
            value: function componentWillMount() {
                // Our chart scales are driven off a mapping between id of the axis
                // and the scale that axis represents. Depending on the transition time,
                // this scale will animate over time. The controller of this animation is
                // the ScaleInterpolator. We create new Scale Interpolators here for each
                // axis id.
                this.scaleMap = {};
                this.updateScales(this.props);
            }

            /**
             * When we get changes to the row's props we update our map of
             * axis scales.
             */
        },
        {
            key: "componentWillReceiveProps",
            value: function componentWillReceiveProps(nextProps) {
                this.updateScales(nextProps);
            }
        },
        {
            key: "render",
            value: function render() {
                var _this3 = this;

                var _props = this.props,
                    paddingLeft = _props.paddingLeft,
                    paddingRight = _props.paddingRight;

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
                _react2.default.Children.forEach(this.props.children, function(child) {
                    if (child === null) return;
                    if ((0, _reactHotLoader.areComponentsEqual)(child.type, _Charts2.default)) {
                        alignLeft = false;
                    } else {
                        var _id = child.props.id;
                        // Check to see if we think this 'axis' is actually an axis
                        if (_this3.isChildYAxis(child)) {
                            var yaxis = child;

                            if (yaxis.props.id && yaxis.props.visible !== false) {
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

                // Since we'll be building the left axis items from the inside to the outside
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
                var leftWidth = _underscore2.default.reduce(
                    this.props.leftAxisWidths,
                    function(a, b) {
                        return a + b;
                    },
                    0
                );
                var rightWidth = _underscore2.default.reduce(
                    this.props.rightAxisWidths,
                    function(a, b) {
                        return a + b;
                    },
                    0
                );
                var chartWidth =
                    this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;

                posx = leftWidth;
                for (
                    var leftColumnIndex = 0;
                    leftColumnIndex < this.props.leftAxisWidths.length;
                    leftColumnIndex += 1
                ) {
                    var colWidth = this.props.leftAxisWidths[leftColumnIndex];
                    posx -= colWidth;
                    if (colWidth > 0 && leftColumnIndex < leftAxisList.length) {
                        id = leftAxisList[leftColumnIndex];
                        if (_underscore2.default.has(yAxisMap, id)) {
                            transform = "translate(" + (posx + paddingLeft) + ",0)";

                            // Additional props for left aligned axes
                            props = {
                                width: colWidth,
                                height: innerHeight,
                                chartExtent: chartWidth,
                                isInnerAxis: leftColumnIndex === 0,
                                align: "left",
                                scale: this.scaleMap[id].latestScale()
                            };

                            // Cloned left axis
                            axis = _react2.default.cloneElement(yAxisMap[id], props);

                            axes.push(
                                _react2.default.createElement(
                                    "g",
                                    { key: "y-axis-left-" + leftColumnIndex, transform: transform },
                                    axis
                                )
                            );
                        }
                    }
                }

                posx = this.props.width - rightWidth - paddingRight;
                for (
                    var rightColumnIndex = 0;
                    rightColumnIndex < this.props.rightAxisWidths.length;
                    rightColumnIndex += 1
                ) {
                    var _colWidth = this.props.rightAxisWidths[rightColumnIndex];
                    if (_colWidth > 0 && rightColumnIndex < rightAxisList.length) {
                        id = rightAxisList[rightColumnIndex];
                        if (_underscore2.default.has(yAxisMap, id)) {
                            transform = "translate(" + (posx + paddingLeft) + ",0)";

                            // Additional props for right aligned axes
                            props = {
                                width: _colWidth,
                                height: innerHeight,
                                chartExtent: chartWidth,
                                //showGrid: this.props.showGrid,
                                isInnerAxis: rightColumnIndex === 0,
                                align: "right",
                                scale: this.scaleMap[id].latestScale()
                            };

                            // Cloned right axis
                            axis = _react2.default.cloneElement(yAxisMap[id], props);

                            axes.push(
                                _react2.default.createElement(
                                    "g",
                                    {
                                        key: "y-axis-right-" + rightColumnIndex,
                                        transform: transform
                                    },
                                    axis
                                )
                            );
                        }
                    }

                    posx += _colWidth;
                }

                //
                // Push each chart onto the chartList, transforming each to the right
                // of the left axis slots and specifying its width. Each chart is passed
                // its time and y-scale. The y-scale is looked up in scaleMap, whose
                // current value is stored in the component state.
                //

                var chartTransform = "translate(" + (leftWidth + paddingLeft) + ",0)";

                var keyCount = 0;
                _react2.default.Children.forEach(this.props.children, function(child) {
                    if (child === null) return;
                    if ((0, _reactHotLoader.areComponentsEqual)(child.type, _Charts2.default)) {
                        var _charts = child;
                        _react2.default.Children.forEach(_charts.props.children, function(chart) {
                            if (
                                !_underscore2.default.has(chart.props, "visible") ||
                                chart.props.visible
                            ) {
                                var scale = null;
                                if (
                                    _underscore2.default.has(
                                        _this3.state.yAxisScalerMap,
                                        chart.props.axis
                                    )
                                ) {
                                    scale = _this3.state.yAxisScalerMap[chart.props.axis];
                                }

                                var ytransition = null;
                                if (_underscore2.default.has(_this3.scaleMap, chart.props.axis)) {
                                    ytransition = _this3.scaleMap[chart.props.axis];
                                }

                                var chartProps = {
                                    key: keyCount,
                                    width: chartWidth,
                                    height: innerHeight,
                                    timeScale: _this3.props.timeScale,
                                    timeFormat: _this3.props.timeFormat
                                };

                                if (scale) {
                                    chartProps.yScale = scale;
                                }

                                if (ytransition) {
                                    chartProps.transition = ytransition;
                                }

                                chartList.push(_react2.default.cloneElement(chart, chartProps));
                                keyCount += 1;
                            }
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
                var multiBrushList = [];
                keyCount = 0;
                _react2.default.Children.forEach(this.props.children, function(child) {
                    if (child === null) return;
                    if (
                        (0, _reactHotLoader.areComponentsEqual)(child.type, _Brush2.default) ||
                        (0, _reactHotLoader.areComponentsEqual)(child.type, _MultiBrush2.default)
                    ) {
                        var brushProps = {
                            key: "brush-" + keyCount,
                            width: chartWidth,
                            height: innerHeight,
                            timeScale: _this3.props.timeScale
                        };
                        if ((0, _reactHotLoader.areComponentsEqual)(child.type, _Brush2.default)) {
                            brushList.push(_react2.default.cloneElement(child, brushProps));
                        } else {
                            multiBrushList.push(_react2.default.cloneElement(child, brushProps));
                        }
                    }
                    keyCount += 1;
                });

                var charts = _react2.default.createElement(
                    "g",
                    { transform: chartTransform, key: "event-rect-group" },
                    _react2.default.createElement(
                        "g",
                        { key: "charts", clipPath: this.state.clipPathURL },
                        chartList
                    )
                );

                //
                // Clipping
                //
                var clipper = _react2.default.createElement(
                    "defs",
                    null,
                    _react2.default.createElement(
                        "clipPath",
                        { id: this.state.clipId },
                        _react2.default.createElement("rect", {
                            x: "0",
                            y: "0",
                            style: { strokeOpacity: 0.0 },
                            width: chartWidth,
                            height: innerHeight
                        })
                    )
                );

                //
                // Brush
                //
                var brushes = _react2.default.createElement(
                    "g",
                    { transform: chartTransform, key: "brush-group" },
                    brushList
                );

                //
                // Multi Brush
                //
                var multiBrushes = _react2.default.createElement(
                    "g",
                    { transform: chartTransform, key: "multi-brush-group" },
                    multiBrushList
                );

                //
                // TimeMarker used as a tracker
                //
                var tracker = void 0;
                if (this.props.trackerTime) {
                    var timeFormat = this.props.trackerTimeFormat || this.props.timeFormat;
                    var timeMarkerProps = {
                        timeFormat: timeFormat,
                        showLine: false,
                        showTime: this.props.trackerShowTime,
                        time: this.props.trackerTime,
                        timeScale: this.props.timeScale,
                        width: chartWidth,
                        infoStyle: this.props.trackerStyle
                    };
                    if (this.props.trackerInfoValues) {
                        timeMarkerProps.infoWidth = this.props.trackerInfoWidth;
                        timeMarkerProps.infoHeight = this.props.trackerInfoHeight;
                        timeMarkerProps.infoValues = this.props.trackerInfoValues;
                        timeMarkerProps.timeFormat = this.props.trackerTimeFormat;
                    }
                    var trackerStyle = {
                        pointerEvents: "none"
                    };
                    var trackerTransform = "translate(" + (leftWidth + paddingLeft) + ",0)";

                    tracker = _react2.default.createElement(
                        "g",
                        { key: "tracker-group", style: trackerStyle, transform: trackerTransform },
                        _react2.default.createElement(_TimeMarker2.default, timeMarkerProps)
                    );
                }

                return _react2.default.createElement(
                    "g",
                    null,
                    clipper,
                    axes,
                    charts,
                    brushes,
                    multiBrushes,
                    tracker
                );
            }
        }
    ]);

    return ChartRow;
})(_react2.default.Component);

exports.default = ChartRow;

ChartRow.defaultProps = {
    trackerTimeFormat: "%b %d %Y %X",
    enablePanZoom: false,
    height: 100,
    visible: true
};

ChartRow.propTypes = {
    /**
     * The height of the row.
     */
    height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),

    /**
     * Show or hide this row
     */
    visible: _propTypes2.default.bool,

    /**
     * Should the time be shown on top of the tracker info box
     */
    trackerShowTime: _propTypes2.default.bool,
    /**
     * The width of the tracker info box
     */
    trackerInfoWidth: _propTypes2.default.number,
    /**
     * The height of the tracker info box
     */
    trackerInfoHeight: _propTypes2.default.number,
    /**
     * Info box value or values to place next to the tracker line
     * This is either an array of objects, with each object
     * specifying the label (a string) and value (also a string)
     * to be shown in the info box, or a simple string label.
     */
    trackerInfoValues: _propTypes2.default.oneOfType([
        _propTypes2.default.string,
        _propTypes2.default.arrayOf(
            _propTypes2.default.shape({
                label: _propTypes2.default.string, // eslint-disable-line
                value: _propTypes2.default.string // eslint-disable-line
            })
        )
    ]),

    children: _propTypes2.default.oneOfType([
        _propTypes2.default.arrayOf(_propTypes2.default.node),
        _propTypes2.default.node
    ]),
    leftAxisWidths: _propTypes2.default.arrayOf(_propTypes2.default.number),
    rightAxisWidths: _propTypes2.default.arrayOf(_propTypes2.default.number),
    width: _propTypes2.default.number,
    timeScale: _propTypes2.default.func,
    trackerTimeFormat: _propTypes2.default.oneOfType([
        _propTypes2.default.string,
        _propTypes2.default.func
    ]),
    timeFormat: _propTypes2.default.oneOfType([
        _propTypes2.default.string,
        _propTypes2.default.func
    ]),
    trackerTime: _propTypes2.default.instanceOf(Date)
};
