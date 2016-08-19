"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require("d3-scale");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _pondjs = require("pondjs");

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _Brush = require("./Brush");

var _Brush2 = _interopRequireDefault(_Brush);

var _EventHandler = require("./EventHandler");

var _EventHandler2 = _interopRequireDefault(_EventHandler);

var _ChartRow = require("./ChartRow");

var _ChartRow2 = _interopRequireDefault(_ChartRow);

var _Charts = require("./Charts");

var _Charts2 = _interopRequireDefault(_Charts);

var _TimeAxis = require("./TimeAxis");

var _TimeAxis2 = _interopRequireDefault(_TimeAxis);

var _TimeMarker = require("./TimeMarker");

var _TimeMarker2 = _interopRequireDefault(_TimeMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The `<ChartContainer>` is the outer most element of a chart and is responsible for generating and arranging its sub-elements. Specifically, it is a container for one or more `<ChartRows>` (each of which contains charts, axes etc) and in addition it manages the overall time range of the chart and so also is responsible for the time axis, which is always shared by all the rows.
 *
 * ![ChartContainer](https://raw.githubusercontent.com/esnet/react-timeseries-charts/master/docs/chartcontainer.png "ChartContainer")
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
exports.default = _react2.default.createClass({

    displayName: "ChartContainer",

    getDefaultProps: function getDefaultProps() {
        return {
            width: 800,
            padding: 0,
            enablePanZoom: false,
            utc: false,
            showGrid: false
        };
    },


    propTypes: {

        /**
         * A Pond TimeRange representing the begin and end time of the chart.
         */
        timeRange: _react2.default.PropTypes.instanceOf(_pondjs.TimeRange).isRequired,

        /**
         * Should the time axis use a UTC scale or local
         */
        utc: _react2.default.PropTypes.bool,

        /**
         * Children of the ChartContainer should be ChartRows.
         */
        children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.arrayOf(_react2.default.PropTypes.element), _react2.default.PropTypes.element]).isRequired,

        /**
         * The width of the chart. This library also includes a <Resizable> component
         * that can be wrapped around a \<ChartContainer\>. The purpose of this is to
         * inject a width prop into the ChartContainer so that it will fit the
         * surrounding element. This is very handy when you need the chart to resize
         * based on a responsive layout.
         */
        width: _react2.default.PropTypes.number,

        /**
         * Constrain the timerange to not move back in time further than this Date.
         */
        minTime: _react2.default.PropTypes.instanceOf(Date),

        /**
         * Constrain the timerange to not move forward in time than this Date. A
         * common example is setting this to the current time or the end time
         * of a fixed set of data.
         */
        maxTime: _react2.default.PropTypes.instanceOf(Date),

        /**
         * Boolean to turn on interactive pan and zoom behavior for the chart.
         */
        enablePanZoom: _react2.default.PropTypes.bool,

        /**
         * If this is set the timerange of the chart cannot be zoomed in further
         * than this duration, in milliseconds. This might be determined by the
         * resolution of your data.
         */
        minDuration: _react2.default.PropTypes.number,

        /**
         * Provides several options as to the format of the time axis labels.
         * In general the time axis will generate an appropriate time scale based
         * on the timeRange prop and there is no need to set this.
         *
         * However, four special options exist: setting format to "day", "month" or
         * "year" will show only ticks on those, and every one of those intervals.
         * For example maybe you are showing a bar chart for October 2014 then setting
         * the format to "day" will insure that a label is placed for each and every day.
         *
         * The last option is "relative". This interprets the time as a duration. This
         * is good for data that is specified relative to its start time, rather than
         * as an actual date/time.
         */
        format: _react2.default.PropTypes.string,

        /**
         * Show grid lines for each time marker
         */
        showGrid: _react2.default.PropTypes.bool,

        /**
         * A Date specifying the position of the tracker line on the chart. It is
         * common to take this from the onTrackerChanged callback so that the tracker
         * followers the user's cursor, but it could be modified to snap to a point or
         * to the nearest minute, for example.
         */
        trackerPosition: _react2.default.PropTypes.instanceOf(Date),

        /**
         * Will be called when the user hovers over a chart. The callback will
         * be called with the timestamp (a Date object) of the position hovered
         * over. This maybe then used as the trackerPosition (see above), or to
         * information data about the time hovered over within the greater page.
         * Commonly we might do something like this:
         * ```
         *   <ChartContainer
         *     onTrackerChanged={(tracker) => this.setState({tracker})}
         *     trackerPosition={this.state.tracker}
         *     ... />
         * ```
         */
        onTrackerChanged: _react2.default.PropTypes.func,

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
        onTimeRangeChanged: _react2.default.PropTypes.func,

        /**
         * Called when the size of the chart changes
         */
        onChartResize: _react2.default.PropTypes.func
    },

    handleTrackerChanged: function handleTrackerChanged(t) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t);
        }
    },


    /**
     * Within the charts library the time range of the x axis is kept as a begin
     * and end time (Javascript Date objects). But the interface is Pond based,
     * so this callback returns a Pond TimeRange.
     */
    handleTimeRangeChanged: function handleTimeRangeChanged(timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
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
    handleBackgroundClick: function handleBackgroundClick() {
        if (this.props.onBackgroundClick) {
            this.props.onBackgroundClick();
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
    render: function render() {
        var _this = this;

        var chartRows = [];
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

        var leftAxisWidths = [];
        var rightAxisWidths = [];

        _react2.default.Children.forEach(this.props.children, function (childRow) {
            if (childRow.type === _ChartRow2.default) {
                (function () {

                    //
                    // Within this row, count the number of columns that will be
                    // left and right of the Charts tag, as well as the total number
                    // of Charts tags for error handling
                    //

                    var countLeft = 0;
                    var countCharts = 0;

                    var align = "left";

                    _react2.default.Children.forEach(childRow.props.children, function (child) {
                        if (child.type === _Charts2.default) {
                            countCharts++;
                            align = "right";
                        } else if (child.type !== _Brush2.default) {
                            if (align === "left") {
                                countLeft++;
                            }
                        }
                    });

                    if (countCharts !== 1) {
                        var msg = "ChartRow should have one and only one ";
                        msg += "<Charts> tag within it";
                        (0, _invariant2.default)(false, msg, childRow.constructor.name);
                    }

                    align = "left";
                    var pos = countLeft - 1;

                    _react2.default.Children.forEach(childRow.props.children, function (child) {
                        if (child.type === _Charts2.default || child.type === _Brush2.default) {
                            if (child.type === _Charts2.default) {
                                align = "right";
                                pos = 0;
                            }
                        } else {
                            var width = Number(child.props.width) || 40;
                            if (align === "left") {
                                leftAxisWidths[pos] = leftAxisWidths[pos] ? Math.max(width, leftAxisWidths[pos]) : width;
                                pos--;
                            } else if (align === "right") {
                                rightAxisWidths[pos] = rightAxisWidths[pos] ? Math.max(width, rightAxisWidths[pos]) : width;
                                pos++;
                            }
                        }
                    });
                })();
            }
        });

        // Space used by columns on left and right of charts
        var leftWidth = _underscore2.default.reduce(leftAxisWidths, function (a, b) {
            return a + b;
        }, 0);
        var rightWidth = _underscore2.default.reduce(rightAxisWidths, function (a, b) {
            return a + b;
        }, 0);

        //
        // Time scale
        //

        var timeAxisHeight = 35;
        var timeAxisWidth = this.props.width - leftWidth - rightWidth;

        if (!this.props.timeRange) {
            throw Error("Invalid timerange passed to ChartContainer");
        }

        var timeScale = this.props.utc ? (0, _d3Scale.scaleUtc)().domain(this.props.timeRange.toJSON()).range([0, timeAxisWidth]) : (0, _d3Scale.scaleTime)().domain(this.props.timeRange.toJSON()).range([0, timeAxisWidth]);

        var i = 0;
        var yPosition = 0;
        _react2.default.Children.forEach(this.props.children, function (child) {
            if (child.type === _ChartRow2.default) {
                var chartRow = child;
                var rowKey = "chart-row-row-" + i;
                var firstRow = i === 0;
                var props = {
                    timeScale: timeScale,
                    leftAxisWidths: leftAxisWidths,
                    rightAxisWidths: rightAxisWidths,
                    width: _this.props.width,
                    padding: _this.props.padding,
                    minTime: _this.props.minTime,
                    maxTime: _this.props.maxTime,
                    transition: _this.props.transition,
                    enablePanZoom: _this.props.enablePanZoom,
                    minDuration: _this.props.minDuration,
                    timeFormat: _this.props.format,
                    trackerShowTime: firstRow,
                    trackerTime: _this.props.trackerPosition,
                    trackerTimeFormat: _this.props.format,
                    onTimeRangeChanged: _this.handleTimeRangeChanged,
                    onTrackerChanged: _this.handleTrackerChanged
                };
                var transform = "translate(" + -leftWidth + "," + yPosition + ")";
                chartRows.push(_react2.default.createElement(
                    "g",
                    { transform: transform, key: rowKey },
                    _react2.default.cloneElement(chartRow, props)
                ));
                yPosition += parseInt(child.props.height, 10);
            }
            i++;
        });

        var chartsHeight = yPosition;
        var chartsWidth = this.props.width - leftWidth - rightWidth;

        // Hover tracker line
        var tracker = void 0;
        if (this.props.trackerPosition && this.props.timeRange.contains(this.props.trackerPosition)) {
            tracker = _react2.default.createElement(
                "g",
                {
                    key: "tracker-group",
                    style: { pointerEvents: "none" },
                    transform: "translate(" + leftWidth + ",0)" },
                _react2.default.createElement(_TimeMarker2.default, {
                    width: chartsWidth,
                    height: chartsHeight,
                    showInfoBox: false,
                    time: this.props.trackerPosition,
                    timeScale: timeScale,
                    timeFormat: this.props.format,
                    infoWidth: this.props.trackerHintWidth,
                    infoHeight: this.props.trackerHintHeight,
                    info: this.props.trackerValues })
            );
        }

        //
        // TimeAxis
        //

        var timeAxisStyle = {
            stroke: "#C0C0C0",
            strokeWidth: 1,
            fill: "none",
            pointerEvents: "none"
        };

        var timeAxis = _react2.default.createElement(
            "g",
            { transform: "translate(" + leftWidth + "," + chartsHeight + ")" },
            _react2.default.createElement("line", {
                x1: -leftWidth, y1: 0.5, x2: this.props.width, y2: 0.5,
                style: timeAxisStyle }),
            _react2.default.createElement(_TimeAxis2.default, {
                scale: timeScale,
                utc: this.props.utc,
                format: this.props.format,
                showGrid: this.props.showGrid,
                gridHeight: chartsHeight })
        );

        //
        // Event handler
        //

        var rows = _react2.default.createElement(
            "g",
            { transform: "translate(" + leftWidth + "," + 0 + ")" },
            _react2.default.createElement(
                _EventHandler2.default,
                {
                    key: "event-handler",
                    width: chartsWidth,
                    height: chartsHeight + timeAxisHeight,
                    scale: timeScale,
                    enablePanZoom: this.props.enablePanZoom,
                    minDuration: this.props.minDuration,
                    minTime: this.props.minTime,
                    maxTime: this.props.maxTime,
                    onMouseOut: this.handleMouseOut,
                    onMouseMove: this.handleMouseMove,
                    onMouseClick: this.handleBackgroundClick,
                    onZoom: this.handleZoom,
                    onResize: this.handleResize },
                chartRows
            )
        );

        //
        // Final render of the ChartContainer is composed of a number of
        // chartRows, a timeAxis and the tracker indicator
        //

        return _react2.default.createElement(
            "svg",
            {
                width: this.props.width,
                height: yPosition + timeAxisHeight,
                style: { display: "block" } },
            rows,
            tracker,
            timeAxis
        );
    }
}); /**
     *  Copyright (c) 2015-2016, The Regents of the University of California,
     *  through Lawrence Berkeley National Laboratory (subject to receipt
     *  of any required approvals from the U.S. Dept. of Energy).
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree.
     */