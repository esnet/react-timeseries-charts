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

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Scale = require("d3-scale");

var _pondjs = require("pondjs");

var _reactHotLoader = require("react-hot-loader");

var _Brush = require("./Brush");

var _Brush2 = _interopRequireDefault(_Brush);

var _MultiBrush = require("./MultiBrush");

var _MultiBrush2 = _interopRequireDefault(_MultiBrush);

var _ChartRow = require("./ChartRow");

var _ChartRow2 = _interopRequireDefault(_ChartRow);

var _Charts = require("./Charts");

var _Charts2 = _interopRequireDefault(_Charts);

var _EventHandler = require("./EventHandler");

var _EventHandler2 = _interopRequireDefault(_EventHandler);

var _TimeAxis = require("./TimeAxis");

var _TimeAxis2 = _interopRequireDefault(_TimeAxis);

var _TimeMarker = require("./TimeMarker");

var _TimeMarker2 = _interopRequireDefault(_TimeMarker);

var _Label = require("./Label");

var _Label2 = _interopRequireDefault(_Label);

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

var defaultTimeAxisStyle = {
    axis: {
        fill: "none",
        stroke: "#C0C0C0",
        pointerEvents: "none"
    }
};

var defaultTitleStyle = {
    fontWeight: 100,
    fontSize: 14,
    font: '"Goudy Bookletter 1911", sans-serif"',
    fill: "#C0C0C0"
};

var defaultTrackerStyle = {
    line: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    },
    box: {
        fill: "white",
        opacity: 0.9,
        stroke: "#999",
        pointerEvents: "none"
    },
    dot: {
        fill: "#999"
    }
};

/**
 * The `<ChartContainer>` is the outer most element of a chart and is
 * responsible for generating and arranging its sub-elements. Specifically,
 * it is a container for one or more `<ChartRows>` (each of which contains
 * charts, axes etc) and in addition it manages the overall time range of
 * the chart and so also is responsible for the time axis, which is always
 * shared by all the rows.
 *
 * Here is an example:
 *
 * ```xml
 * <ChartContainer timeRange={audSeries.timerange()} width="800">
 *     <ChartRow>
 *         ...
 *     </ChartRow>
 *     <ChartRow>
 *         ...
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */

var ChartContainer = (function(_React$Component) {
    _inherits(ChartContainer, _React$Component);

    function ChartContainer(props) {
        _classCallCheck(this, ChartContainer);

        var _this = _possibleConstructorReturn(
            this,
            (ChartContainer.__proto__ || Object.getPrototypeOf(ChartContainer)).call(this, props)
        );

        _this.handleTrackerChanged = _this.handleTrackerChanged.bind(_this);
        _this.handleTimeRangeChanged = _this.handleTimeRangeChanged.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleMouseOut = _this.handleMouseOut.bind(_this);
        _this.handleBackgroundClick = _this.handleBackgroundClick.bind(_this);
        _this.handleZoom = _this.handleZoom.bind(_this);
        _this.saveSvgRef = _this.saveSvgRef.bind(_this);
        return _this;
    }

    //
    // Event handlers
    //

    _createClass(ChartContainer, [
        {
            key: "handleTrackerChanged",
            value: function handleTrackerChanged(t) {
                var _this2 = this;

                if (this.props.onTrackerChanged) {
                    this.props.onTrackerChanged(
                        t,
                        // Adjust the scaled time so that the result
                        // is the true x position relative to the whole chart
                        function(t) {
                            return _this2.timeScale(t) + _this2.leftWidth;
                        }
                    );
                }
            }

            /**
             * Within the charts library the time range of the x axis is kept as a begin
             * and end time (Javascript Date objects). But the interface is Pond based,
             * so this callback returns a Pond TimeRange.
             */
        },
        {
            key: "handleTimeRangeChanged",
            value: function handleTimeRangeChanged(timerange) {
                if (this.props.onTimeRangeChanged) {
                    this.props.onTimeRangeChanged(timerange);
                }
            }
        },
        {
            key: "handleMouseMove",
            value: function handleMouseMove(x, y) {
                this.handleTrackerChanged(this.timeScale.invert(x));
                if (this.props.onMouseMove) {
                    this.props.onMouseMove(x, y);
                }
            }
        },
        {
            key: "handleMouseOut",
            value: function handleMouseOut(e) {
                this.handleTrackerChanged(null);
            }
        },
        {
            key: "handleBackgroundClick",
            value: function handleBackgroundClick(x, y) {
                if (this.props.onBackgroundClick) {
                    var t = this.props.scale
                        ? this.props.scale.invert(x)
                        : this.timeScale.invert(x);
                    this.props.onBackgroundClick(x, y, t);
                }
            }
        },
        {
            key: "handleZoom",
            value: function handleZoom(timerange) {
                if (this.props.onTimeRangeChanged) {
                    this.props.onTimeRangeChanged(timerange);
                }
            }
        },
        {
            key: "saveSvgRef",
            value: function saveSvgRef(c) {
                this.svg = c;
            }

            //
            // Render
            //
        },
        {
            key: "render",
            value: function render() {
                var _this3 = this;

                var _props$padding = this.props.padding,
                    padding = _props$padding === undefined ? 0 : _props$padding;
                var _props = this.props,
                    _props$paddingLeft = _props.paddingLeft,
                    paddingLeft = _props$paddingLeft === undefined ? padding : _props$paddingLeft,
                    _props$paddingRight = _props.paddingRight,
                    paddingRight =
                        _props$paddingRight === undefined ? padding : _props$paddingRight;
                var _props2 = this.props,
                    _props2$paddingTop = _props2.paddingTop,
                    paddingTop = _props2$paddingTop === undefined ? padding : _props2$paddingTop,
                    _props2$paddingBottom = _props2.paddingBottom,
                    paddingBottom =
                        _props2$paddingBottom === undefined ? padding : _props2$paddingBottom;
                var _props$titleHeight = this.props.titleHeight,
                    titleHeight = _props$titleHeight === undefined ? 28 : _props$titleHeight;

                if (_underscore2.default.isUndefined(this.props.title)) {
                    titleHeight = 0;
                }

                var chartRows = [];
                var leftAxisWidths = [];
                var rightAxisWidths = [];

                //
                // How much room does the axes of all the charts take up on the right
                // and left. The result is an array for left and right axis which
                // contain the min column width needed to hold the axes widths at the
                // pos for all rows.
                //
                // pos   1      0        <charts>     0        1        2
                //     | Axis | Axis |   CHARTS    |  Axis  |                      Row 1
                //            | Axis |   CHARTS    |  Axis  |  Axis  |  Axis |     Row 2
                //     ...............              ..........................
                //          left cols              right cols
                //

                _react2.default.Children.forEach(this.props.children, function(childRow) {
                    if (
                        (0, _reactHotLoader.areComponentsEqual)(childRow.type, _ChartRow2.default)
                    ) {
                        //
                        // Within this row, count the number of columns that will be
                        // left and right of the Charts tag, as well as the total number
                        // of Charts tags for error handling
                        //
                        var countLeft = 0;
                        var countCharts = 0;

                        var align = "left";

                        _react2.default.Children.forEach(childRow.props.children, function(child) {
                            if (child === null) return;
                            if (
                                (0, _reactHotLoader.areComponentsEqual)(
                                    child.type,
                                    _Charts2.default
                                )
                            ) {
                                countCharts += 1;
                                align = "right";
                            } else if (
                                !(0, _reactHotLoader.areComponentsEqual)(
                                    child.type,
                                    _Brush2.default
                                ) &&
                                !(0, _reactHotLoader.areComponentsEqual)(
                                    child.type,
                                    _MultiBrush2.default
                                )
                            ) {
                                if (align === "left") {
                                    countLeft += 1;
                                }
                            }
                        });

                        if (countCharts !== 1) {
                            var msg =
                                "ChartRow should have one and only one <Charts> tag within it";
                            (0, _invariant2.default)(false, msg, childRow.constructor.name);
                        }

                        align = "left";
                        var pos = countLeft - 1;

                        _react2.default.Children.forEach(childRow.props.children, function(child) {
                            if (child === null) return;
                            if (
                                (0, _reactHotLoader.areComponentsEqual)(
                                    child.type,
                                    _Charts2.default
                                ) ||
                                (0, _reactHotLoader.areComponentsEqual)(
                                    child.type,
                                    _Brush2.default
                                ) ||
                                (0, _reactHotLoader.areComponentsEqual)(
                                    child.type,
                                    _MultiBrush2.default
                                )
                            ) {
                                if (
                                    (0, _reactHotLoader.areComponentsEqual)(
                                        child.type,
                                        _Charts2.default
                                    )
                                ) {
                                    align = "right";
                                    pos = 0;
                                }
                            } else {
                                var width = Number(child.props.width) || 40;
                                var visible =
                                    !_underscore2.default.has(child.props, "visible") ||
                                    child.props.visible;
                                if (!visible) width = 0;

                                if (align === "left") {
                                    leftAxisWidths[pos] = leftAxisWidths[pos]
                                        ? Math.max(width, leftAxisWidths[pos])
                                        : width;
                                    pos -= 1;
                                } else if (align === "right") {
                                    rightAxisWidths[pos] = rightAxisWidths[pos]
                                        ? Math.max(width, rightAxisWidths[pos])
                                        : width;
                                    pos += 1;
                                }
                            }
                        });
                    }
                });

                // Space used by columns on left and right of charts
                var leftWidth = (this.leftWidth = _underscore2.default.reduce(
                    leftAxisWidths,
                    function(a, b) {
                        return a + b;
                    },
                    0
                ));
                var rightWidth = (this.rightWidth = _underscore2.default.reduce(
                    rightAxisWidths,
                    function(a, b) {
                        return a + b;
                    },
                    0
                ));

                //
                // Time scale
                //

                var _props$timeAxisHeight = this.props.timeAxisHeight,
                    timeAxisHeight =
                        _props$timeAxisHeight === undefined ? 35 : _props$timeAxisHeight;

                if (this.props.hideTimeAxis) {
                    timeAxisHeight = 0;
                }

                var timeAxisWidth =
                    this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;

                if (!this.props.timeRange) {
                    throw Error("Invalid timerange passed to ChartContainer");
                }

                var timeScale = (this.timeScale = this.props.utc
                    ? (0, _d3Scale.scaleUtc)()
                          .domain(this.props.timeRange.toJSON())
                          .range([0, timeAxisWidth])
                    : (0, _d3Scale.scaleTime)()
                          .domain(this.props.timeRange.toJSON())
                          .range([0, timeAxisWidth]));

                var chartsWidth =
                    this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;

                var i = 0;
                var yPosition = paddingTop;

                // Chart title
                var transform = "translate(" + (leftWidth + paddingLeft) + "," + yPosition + ")";
                var titleStyle = (0, _merge2.default)(
                    true,
                    defaultTitleStyle,
                    this.props.titleStyle ? this.props.titleStyle : {}
                );
                var title = this.props.title
                    ? _react2.default.createElement(
                          "g",
                          { transform: transform },
                          _react2.default.createElement(_Label2.default, {
                              align: "center",
                              label: this.props.title,
                              style: { label: titleStyle, box: { fill: "none", stroke: "none" } },
                              width: chartsWidth,
                              height: titleHeight
                          })
                      )
                    : _react2.default.createElement("g", null);

                var trackerStyle = (0, _merge2.default)(
                    true,
                    defaultTrackerStyle,
                    this.props.trackerStyle ? this.props.trackerStyle : {}
                );

                //yPosition += titleHeight;
                var chartsHeight = 0;
                _react2.default.Children.forEach(this.props.children, function(child) {
                    if ((0, _reactHotLoader.areComponentsEqual)(child.type, _ChartRow2.default)) {
                        var chartRow = child;
                        var rowKey = "chart-row-row-" + i;
                        var firstRow = i === 0;
                        var isVisible = child.props.visible;
                        var props = {
                            timeScale: timeScale,
                            paddingLeft: paddingLeft,
                            paddingRight: paddingRight,
                            leftAxisWidths: leftAxisWidths,
                            rightAxisWidths: rightAxisWidths,
                            width: _this3.props.width,
                            minTime: _this3.props.minTime,
                            maxTime: _this3.props.maxTime,
                            transition: _this3.props.transition,
                            enablePanZoom: _this3.props.enablePanZoom,
                            minDuration: _this3.props.minDuration,
                            showGrid: _this3.props.showGrid,
                            timeFormat: _this3.props.format,
                            trackerShowTime: firstRow,
                            trackerTime: _this3.props.trackerPosition,
                            trackerTimeFormat: _this3.props.format,
                            trackerStyle: trackerStyle,
                            onTimeRangeChanged: _this3.handleTimeRangeChanged,
                            onTrackerChanged: _this3.handleTrackerChanged
                        };
                        var _transform =
                            "translate(" + (-leftWidth - paddingLeft) + "," + yPosition + ")";
                        if (isVisible) {
                            chartRows.push(
                                _react2.default.createElement(
                                    "g",
                                    { transform: _transform, key: rowKey },
                                    _react2.default.cloneElement(chartRow, props)
                                )
                            );

                            var height = parseInt(child.props.height, 10);
                            yPosition += height;
                            chartsHeight += height;
                        }
                    }
                    i += 1;
                });

                // Hover tracker line
                var tracker = void 0;
                if (
                    this.props.trackerPosition &&
                    this.props.timeRange.contains(this.props.trackerPosition)
                ) {
                    tracker = _react2.default.createElement(
                        "g",
                        {
                            key: "tracker-group",
                            style: { pointerEvents: "none" },
                            transform:
                                "translate(" +
                                (leftWidth + paddingLeft) +
                                "," +
                                (paddingTop + titleHeight) +
                                ")"
                        },
                        _react2.default.createElement(_TimeMarker2.default, {
                            width: chartsWidth,
                            height: chartsHeight,
                            showInfoBox: false,
                            time: this.props.trackerPosition,
                            timeScale: timeScale,
                            timeFormat: this.props.format,
                            infoWidth: this.props.trackerHintWidth,
                            infoHeight: this.props.trackerHintHeight,
                            info: this.props.trackerValues,
                            infoStyle: trackerStyle
                        })
                    );
                }

                //
                // TimeAxis
                //

                var timeAxisStyle = void 0;
                if (this.props.hideTimeAxis) {
                    timeAxisStyle = {
                        axis: {
                            display: "none"
                        }
                    };
                } else {
                    timeAxisStyle = (0, _merge2.default)(
                        true,
                        defaultTimeAxisStyle.axis,
                        this.props.timeAxisStyle.axis ? this.props.timeAxisStyle.axis : {}
                    );
                }

                var timeAxis = _react2.default.createElement(
                    "g",
                    {
                        transform:
                            "translate(" +
                            (leftWidth + paddingLeft) +
                            "," +
                            (paddingTop + titleHeight + chartsHeight) +
                            ")"
                    },
                    _react2.default.createElement("line", {
                        x1: -leftWidth,
                        y1: 0.5,
                        x2: chartsWidth + rightWidth,
                        y2: 0.5,
                        style: timeAxisStyle
                    }),
                    _react2.default.createElement(_TimeAxis2.default, {
                        scale: timeScale,
                        utc: this.props.utc,
                        angled: this.props.timeAxisAngledLabels,
                        style: this.props.timeAxisStyle,
                        format: this.props.format,
                        showGrid: this.props.showGrid,
                        gridHeight: chartsHeight,
                        tickCount: this.props.timeAxisTickCount
                    })
                );

                //
                // Event handler
                //

                var rows = _react2.default.createElement(
                    "g",
                    {
                        transform:
                            "translate(" +
                            (leftWidth + paddingLeft) +
                            "," +
                            (paddingTop + titleHeight) +
                            ")"
                    },
                    _react2.default.createElement(
                        _EventHandler2.default,
                        {
                            key: "event-handler",
                            width: chartsWidth,
                            height: chartsHeight + timeAxisHeight,
                            scale: timeScale,
                            enablePanZoom: this.props.enablePanZoom,
                            enableDragZoom: this.props.enableDragZoom,
                            minDuration: this.props.minDuration,
                            minTime: this.props.minTime,
                            maxTime: this.props.maxTime,
                            onMouseOut: this.handleMouseOut,
                            onMouseMove: this.handleMouseMove,
                            onMouseClick: this.handleBackgroundClick,
                            onZoom: this.handleZoom
                        },
                        chartRows
                    )
                );

                //
                // Final render of the ChartContainer is composed of a number of
                // chartRows, a timeAxis and the tracker indicator
                //

                var svgWidth = this.props.width;
                var svgHeight =
                    chartsHeight + timeAxisHeight + paddingTop + paddingBottom + titleHeight;

                var svgStyle = (0, _merge2.default)(
                    true,
                    { display: "block" },
                    this.props.style ? this.props.style : {}
                );

                return this.props.showGridPosition === "over"
                    ? _react2.default.createElement(
                          "svg",
                          {
                              width: svgWidth,
                              height: svgHeight,
                              style: svgStyle,
                              ref: this.saveSvgRef
                          },
                          title,
                          rows,
                          tracker,
                          timeAxis
                      )
                    : _react2.default.createElement(
                          "svg",
                          {
                              width: svgWidth,
                              height: svgHeight,
                              style: { display: "block" },
                              ref: this.saveSvgRef
                          },
                          title,
                          timeAxis,
                          rows,
                          tracker
                      );
            }
        }
    ]);

    return ChartContainer;
})(_react2.default.Component);

exports.default = ChartContainer;

ChartContainer.propTypes = {
    /**
     * A [Pond TimeRange](https://esnet-pondjs.appspot.com/#/timerange) representing the
     * begin and end time of the chart.
     */
    timeRange: _propTypes2.default.instanceOf(_pondjs.TimeRange).isRequired,

    /**
     * Should the time axis use a UTC scale or local
     */
    utc: _propTypes2.default.bool,

    /**
     * Children of the ChartContainer should be ChartRows.
     */
    children: _propTypes2.default.oneOfType([
        _propTypes2.default.arrayOf(_propTypes2.default.element),
        _propTypes2.default.element
    ]).isRequired,

    /**
     * The width of the chart. This library also includes a <Resizable> component
     * that can be wrapped around a \<ChartContainer\>. The purpose of this is to
     * inject a width prop into the ChartContainer so that it will fit the
     * surrounding element. This is very handy when you need the chart to resize
     * based on a responsive layout.
     */
    width: _propTypes2.default.number,

    /**
     * Constrain the timerange to not move back in time further than this Date.
     */
    minTime: _propTypes2.default.instanceOf(Date),

    /**
     * Constrain the timerange to not move forward in time than this Date. A
     * common example is setting this to the current time or the end time
     * of a fixed set of data.
     */
    maxTime: _propTypes2.default.instanceOf(Date),

    /**
     * Boolean to turn on interactive pan and zoom behavior for the chart.
     */
    enablePanZoom: _propTypes2.default.bool,

    /**
     * Boolean to turn on interactive drag to zoom behavior for the chart.
     */
    enableDragZoom: _propTypes2.default.bool,

    /**
     * If this is set the timerange of the chart cannot be zoomed in further
     * than this duration, in milliseconds. This might be determined by the
     * resolution of your data.
     */
    minDuration: _propTypes2.default.number,

    /**
     * Provides several options as to the format of the time axis labels.
     *
     * In general the time axis will generate an appropriate time scale based
     * on the timeRange prop and there is no need to set this.
     *
     * However, some options exist:
     *
     *  - setting format to "day", "month" or "year" will show only ticks on those,
     * and every one of those intervals. For example maybe you are showing a bar
     * chart for October 2014 then setting the format to "day" will insure that a
     * label is placed for each and every day
     *
     *  - setting format to "relative" interprets the time as a duration. This
     * is good for data that is specified relative to its start time, rather than
     * as an actual date/time
     *
     *  - setting the format to a d3 format string will use that format
     *
     *  - supplying a function for format will cause that function to be called
     * whenever rendering a time
     */
    format: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),

    /**
     * Time in milliseconds to transition from one Y-scale to the next
     */
    transition: _propTypes2.default.number,

    /**
     * Show grid lines for each time marker
     */
    showGrid: _propTypes2.default.bool,

    /**
     * Defines whether grid is overlayed ("over"( or underlayed ("under")
     * with respect to the charts
     */
    showGridPosition: _propTypes2.default.oneOf(["over", "under"]),

    /**
     * Defines how to style the SVG
     */
    style: _propTypes2.default.object,

    /**
     * The width of the tracker info box
     */
    trackerHintWidth: _propTypes2.default.number,

    /**
     * The height of the tracker info box
     */
    trackerHintHeight: _propTypes2.default.number,

    /**
     * Info box value or values to place next to the tracker line.
     * This is either an array of objects, with each object
     * specifying the label and value to be shown in the info box,
     * or a simple string label.
     */
    trackerValues: _propTypes2.default.oneOfType([
        _propTypes2.default.string,
        _propTypes2.default.arrayOf(
            _propTypes2.default.shape({
                label: _propTypes2.default.string,
                value: _propTypes2.default.string
            })
        )
    ]),

    /**
     * A Date specifying the position of the tracker line on the chart. It is
     * common to take this from the onTrackerChanged callback so that the tracker
     * followers the user's cursor, but it could be modified to snap to a point or
     * to the nearest minute, for example.
     */
    trackerPosition: _propTypes2.default.instanceOf(Date),

    /**
     * The style of the time marker. This is an object of the form { line, box, dot }.
     * Line, box and dot are themselves objects representing inline CSS for each of
     * the pieces of the info marker.
     *
     * When we use the TimeMarker as a tracker, we can style the box and dot as well.
     */
    trackerStyle: _propTypes2.default.shape({
        line: _propTypes2.default.object, // eslint-disable-line
        box: _propTypes2.default.object, // eslint-disable-line
        dot: _propTypes2.default.object // eslint-disable-line
    }),

    /**
     * Will be called when the user hovers over a chart. The callback will
     * be called with the timestamp (a Date object) of the position hovered
     * over as well as the current time axis' time scale. The timestamp may
     * be used as the trackerPosition (see above), or to provide information
     * about the time hovered over within the greater page. The time scale
     * may be used to translate the timestamp into an x coordinate, which
     * can then be used to position arbitrary components in sync with the
     * current tracker position.
     * Commonly we might do something like this:
     * ```
     *   <ChartContainer
     *     onTrackerChanged={(tracker) => this.setState({tracker})}
     *     trackerPosition={this.state.tracker}
     *     ... />
     * ```
     */
    onTrackerChanged: _propTypes2.default.func,

    /**
     * This will be called if the user pans and/or zooms the chart. The callback
     * will be called with the new TimeRange. This can be fed into the timeRange
     * prop as well as used elsewhere on the greater page. Typical use might look
     * like this:
     * ```
     *   <ChartContainer
     *     onTimeRangeChanged={(timerange) => this.setState({timerange})}
     *     timeRange={this.state.timerange}
     *     ... />
     * ```
     */
    onTimeRangeChanged: _propTypes2.default.func,

    /**
     * Called when the size of the chart changes
     */
    onChartResize: _propTypes2.default.func,

    /**
     * Called when the user clicks the background plane of the chart. This is
     * useful when deselecting elements.
     */
    onBackgroundClick: _propTypes2.default.func,

    /**
     * Props for handling the padding
     */
    padding: _propTypes2.default.number,
    paddingLeft: _propTypes2.default.number,
    paddingRight: _propTypes2.default.number,
    paddingTop: _propTypes2.default.number,
    paddingBottom: _propTypes2.default.number,

    /**
     * Specify the title for the chart
     */
    title: _propTypes2.default.string,

    /**
     * Specify the height of the title
     * Default value is 28 pixels
     */
    titleHeight: _propTypes2.default.number,

    /**
     * Specify the styling of the chart's title
     */
    titleStyle: _propTypes2.default.object,

    /**
     * Object specifying the CSS by which the `TimeAxis` can be styled. The object can contain:
     * "values" (the time labels), "axis" (the main horizontal line) and "ticks" (which may
     * optionally extend the height of all chart rows using the `showGrid` prop. Each of these
     * is an inline CSS style applied to the axis label, axis values, axis line and ticks
     * respectively.
     *
     * Note that "ticks" and "values" are passed into d3's styles, so they are regular CSS property names
     * and not React's camel case names (e.g. "stroke-dasharray" not "strokeDasharray"). "axis" is a
     * regular React rendered SVG line, so it uses camel case.
     */
    timeAxisStyle: _propTypes2.default.shape({
        axis: _propTypes2.default.object,
        values: _propTypes2.default.object,
        ticks: _propTypes2.default.object
    }),

    /**
     * Height of the time axis
     * Default value is 35 pixels
     */
    timeAxisHeight: _propTypes2.default.number,

    /**
     * Specify the number of ticks
     * The default ticks for quantitative scales are multiples of 2, 5 and 10.
     * So, while you can use this prop to increase or decrease the tick count, it will always return multiples of 2, 5 and 10.
     */
    timeAxisTickCount: _propTypes2.default.number,

    /**
     * Angle the time axis labels
     */
    timeAxisAngledLabels: _propTypes2.default.bool,

    /**
     * Prop to hide time axis if required
     */
    hideTimeAxis: _propTypes2.default.bool
};

ChartContainer.defaultProps = {
    width: 800,
    padding: 0,
    enablePanZoom: false,
    enableDragZoom: false,
    utc: false,
    showGrid: false,
    showGridPosition: "over",
    timeAxisStyle: defaultTimeAxisStyle,
    titleStyle: defaultTitleStyle,
    trackerStyle: defaultTrackerStyle,
    hideTimeAxis: false
};
