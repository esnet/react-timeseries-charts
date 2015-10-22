/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

"use strict";

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _timeaxis = require("./timeaxis");

var _timeaxis2 = _interopRequireDefault(_timeaxis);

var _chartrow = require("./chartrow");

var _chartrow2 = _interopRequireDefault(_chartrow);

var _charts = require("./charts");

var _charts2 = _interopRequireDefault(_charts);

var _brush = require("./brush");

var _brush2 = _interopRequireDefault(_brush);

require("./chartcontainer.css");

exports["default"] = _react2["default"].createClass({
    displayName: "chartcontainer",

    getDefaultProps: function getDefaultProps() {
        return {
            transition: 0,
            enablePanZoom: false
        };
    },

    propTypes: {
        enablePanZoom: _react2["default"].PropTypes.bool,
        children: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.element), _react2["default"].PropTypes.element])
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

    render: function render() {
        var _this = this;

        var chartRows = [];
        var padding = this.props.padding || 0;

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

        _react2["default"].Children.forEach(this.props.children, function (childRow) {
            if (childRow.type === _chartrow2["default"]) {
                (function () {

                    //
                    // Within this row, count the number of columns that will be
                    // left and right of the Charts tag, as well as the total number
                    // of Charts tags for error handling
                    //

                    var countLeft = 0;
                    var countRight = 0;
                    var countCharts = 0;

                    var align = "left";

                    _react2["default"].Children.forEach(childRow.props.children, function (child) {
                        if (child.type === _charts2["default"]) {
                            countCharts++;
                            align = "right";
                        } else if (child.type !== _brush2["default"]) {
                            if (align === "left") {
                                countLeft++;
                            } else {
                                countRight++;
                            }
                        }
                    });

                    if (countCharts !== 1) {
                        var msg = "ChartRow should have one and only one ";
                        msg += "<Charts> tag within it";
                        (0, _invariant2["default"])(false, msg, childRow.constructor.name);
                    }

                    align = "left";
                    var pos = countLeft - 1;

                    _react2["default"].Children.forEach(childRow.props.children, function (child) {
                        if (child.type === _charts2["default"]) {
                            align = "right";
                            pos = 0;
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

        // Extra space used by padding between columns
        var leftExtra = (leftAxisWidths.length - 1) * padding;
        var rightExtra = (rightAxisWidths.length - 1) * padding;

        // Space used by columns on left and right of charts
        var leftWidth = _underscore2["default"].reduce(leftAxisWidths, function (a, b) {
            return a + b;
        }, 0) + leftExtra;
        var rightWidth = _underscore2["default"].reduce(rightAxisWidths, function (a, b) {
            return a + b;
        }, 0) + rightExtra;

        //
        // Time scale and time axis elements
        //

        var X_AXIS_HEIGHT = 35;

        var transform = "translate(" + leftWidth + ",0)";
        var timeAxisWidth = this.props.width - leftWidth - rightWidth - padding * 2;

        var _props$timeRange$toJSON = this.props.timeRange.toJSON();

        var _props$timeRange$toJSON2 = _slicedToArray(_props$timeRange$toJSON, 2);

        var beginTime = _props$timeRange$toJSON2[0];
        var endTime = _props$timeRange$toJSON2[1];

        var timeScale = _d32["default"].time.scale().domain([beginTime, endTime]).range([0, timeAxisWidth]);

        var timeaxis = _react2["default"].createElement(_timeaxis2["default"], { scale: timeScale, format: this.props.format });

        var timeAxis = _react2["default"].createElement(
            "div",
            { className: "row" },
            _react2["default"].createElement(
                "div",
                { className: "col-md-12", style: { height: X_AXIS_HEIGHT } },
                _react2["default"].createElement(
                    "div",
                    { className: "chartcontainer timeaxis" },
                    _react2["default"].createElement(
                        "svg",
                        { width: this.props.width, height: X_AXIS_HEIGHT },
                        _react2["default"].createElement(
                            "g",
                            { transform: transform },
                            timeaxis
                        )
                    )
                )
            )
        );

        //
        // For valid children (those children which are ChartRows), we actually
        // build a Bootstrap row wrapper around those and then create cloned
        // ChartRows that are passed the sizes of the determined axis columns.
        //

        var i = 0;
        _react2["default"].Children.forEach(this.props.children, function (child) {
            if (child.type === _chartrow2["default"]) {
                var chartRow = child;
                var rowKey = child.props.key ? child.props.key : "chart-row-row-" + i;
                var props = {
                    key: rowKey,
                    width: _this.props.width,
                    timeScale: timeScale,
                    leftAxisWidths: leftAxisWidths,
                    rightAxisWidths: rightAxisWidths,
                    padding: _this.props.padding,
                    minTime: _this.props.minTime,
                    maxTime: _this.props.maxTime,
                    transition: _this.props.transition,
                    enablePanZoom: _this.props.enablePanZoom,
                    minDuration: _this.props.minDuration,
                    trackerPosition: _this.props.trackerPosition,
                    onTimeRangeChanged: _this.handleTimeRangeChanged,
                    onTrackerChanged: _this.handleTrackerChanged
                };

                var row = _react2["default"].addons.cloneWithProps(chartRow, props);

                chartRows.push(_react2["default"].createElement(
                    "div",
                    { key: "chart-row-div-" + i, className: "row" },
                    _react2["default"].createElement(
                        "div",
                        { className: "col-md-12" },
                        _react2["default"].createElement(
                            "div",
                            { className: "chartcontainer chartrow" },
                            row
                        )
                    )
                ));
            }
            i++;
        });

        //
        // Final render of the ChartContainer is composed of a number of
        // chartRows and a timeAxis
        //
        // TODO: We might want to consider rendering this whole thing in a
        // single SVG rather than depending on Bootstrap for layout.
        //

        return _react2["default"].createElement(
            "div",
            { className: "chartcontainer" },
            chartRows,
            timeAxis
        );
    }
});
module.exports = exports["default"];