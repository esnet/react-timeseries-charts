/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _reactFlexbox = require("react-flexbox");

var _reactFlexbox2 = _interopRequireDefault(_reactFlexbox);

var _pondjs = require("pondjs");

var _resizable = require("./resizable");

var _resizable2 = _interopRequireDefault(_resizable);

var Bars = _react2["default"].createClass({
    displayName: "Bars",

    render: function render() {
        var _props = this.props;
        var display = _props.display;
        var series = _props.series;
        var max = _props.max;
        var columns = _props.columns;
        var spacing = _props.spacing;
        var padding = _props.padding;
        var size = _props.size;
        var width = _props.width;
        var style = _props.style;
        var format = _props.format;
        var timestamp = _props.timestamp;

        // Highlighted value
        var index = timestamp ? series.bisect(timestamp) : null;

        var columnElements = columns.map(function (column, i) {

            // Vertical position of the bar
            var y = padding + i * (size + spacing);

            // Scale
            var scale = _d32["default"].scale.linear().domain([0, max]).range([0, width - 100]);

            // Start and end of the bar
            var start = undefined,
                end = undefined,
                value = undefined,
                centerStart = undefined,
                centerEnd = undefined;
            var textElement = undefined;
            switch (display) {
                case "avg":
                case "max":

                    // Style of the bar
                    var rectStyle = _underscore2["default"].isArray(style) && style.length > i ? _underscore2["default"].clone(style[i]) : { fill: "#DDD" };

                    value = display === "avg" ? series.avg(column) : series.max(column);
                    start = scale(0);
                    end = scale(value);
                    var w = end - start;
                    if (w <= 1) {
                        w = 1;
                    }
                    var barElement = _react2["default"].createElement("rect", { style: rectStyle, x: start, y: y, width: w, height: size });

                    // Text
                    var text = undefined;
                    if (format && _underscore2["default"].isString(format)) {
                        var formatter = _d32["default"].format(format);
                        text = formatter(value);
                    } else if (_underscore2["default"].isFunction(format)) {
                        text = format(value);
                    }

                    if (text) {
                        textElement = _react2["default"].createElement(
                            "text",
                            { style: { fill: "#666", fontSize: 12 }, x: end + 2, y: y + size - 1 },
                            text
                        );
                    }

                    return _react2["default"].createElement(
                        "g",
                        { key: i },
                        barElement,
                        textElement
                    );

                    break;

                case "range":

                    // Styles
                    var rectStyleBackground = _underscore2["default"].isArray(style) && style.length > i ? _underscore2["default"].clone(style[i]) : { fill: "#DDD" };
                    rectStyleBackground.opacity = 0.2;

                    var rectStyleCenter = _underscore2["default"].isArray(style) && style.length > i ? _underscore2["default"].clone(style[i]) : { fill: "#DDD" };
                    rectStyleCenter.opacity = 0.2;

                    var rectStyleValue = _underscore2["default"].isArray(style) && style.length > i ? _underscore2["default"].clone(style[i]) : { fill: "#DDD" };

                    // Statistics
                    var avg = series.avg(column);
                    var stdev = series.stdev(column);

                    var seriesMin = series.min(column);
                    if (_underscore2["default"].isNull(seriesMin)) seriesMin = 0;

                    var seriesMax = series.max(column);
                    if (_underscore2["default"].isNull(seriesMax)) seriesMax = 0;

                    start = scale(seriesMin);
                    end = scale(seriesMax);
                    centerStart = scale(avg - stdev);
                    centerEnd = scale(avg + stdev);

                    // Current value
                    var barElementValue = undefined;
                    if (index) {
                        value = series.at(index).get(column);
                        var valueStart = scale(value);
                        barElementValue = _react2["default"].createElement("rect", { style: rectStyleValue, x: valueStart - 2, y: y - 2, width: 4, height: size + 4 });

                        // Text
                        var _text = undefined;
                        if (format && _underscore2["default"].isString(format)) {
                            var formatter = _d32["default"].format(format);
                            _text = formatter(value);
                        } else if (_underscore2["default"].isFunction(format)) {
                            _text = format(value);
                        }

                        if (_text) {
                            textElement = _react2["default"].createElement(
                                "text",
                                { style: { fill: "#666", fontSize: 12 }, x: end + 2, y: y + size - 1 },
                                _text
                            );
                        }
                    }

                    var backgroundWidth = end - start;
                    if (backgroundWidth < 1) backgroundWidth = 1;

                    var centerWidth = centerEnd - centerStart;
                    if (centerWidth <= 1) centerWidth = 1;

                    var barElementBackground = _react2["default"].createElement("rect", { style: rectStyleBackground, rx: "2", ry: 2, x: start, y: y + 1, width: backgroundWidth, height: size - 2 });
                    var barElementCenter = _react2["default"].createElement("rect", { style: rectStyleCenter, x: centerStart, y: y, width: centerWidth, height: size });
                    return _react2["default"].createElement(
                        "g",
                        { key: i },
                        barElementBackground,
                        barElementCenter,
                        barElementValue,
                        textElement
                    );

                    break;
            }
        });

        var height = columns.length * size + (columns.length - 1) * spacing + padding * 2;

        return _react2["default"].createElement(
            "svg",
            {
                width: "100%",
                height: height },
            columnElements
        );
    }
});

exports["default"] = _react2["default"].createClass({

    displayName: "HorizontalBarChart",

    propTypes: {

        /**
         * Sort by either "max", "avg" or "name"
         */
        display: _react2["default"].PropTypes.oneOf(["avg", "max", "range"]),

        /**
         * A list of [TimeSeries](http://software.es.net/pond#timeseries) objects to visualize
         */
        seriesList: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.instanceOf(_pondjs.TimeSeries)).isRequired,

        /**
         * Columns in each timeseries to display
         */
        columns: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string),

        /**
         * Sort by either "max", "avg" or "name"
         */
        sortBy: _react2["default"].PropTypes.oneOf(["name", "max", "avg"]),

        /**
         * Display only the top n
         */
        top: _react2["default"].PropTypes.number,

        /**
         * The height or thickness of each bar
         */
        size: _react2["default"].PropTypes.number,

        /**
         * The spacing between each bar (column) of the series
         */
        spacing: _react2["default"].PropTypes.number,

        /**
         * The spacing above and below each series
         */
        padding: _react2["default"].PropTypes.number,

        /**
         * The width of the label area
         */
        labelWidth: _react2["default"].PropTypes.number,

        /**
         * The format is used to format the display text for the bar. It can be specified as a d3
         * format string (such as ".2f") or a function. The function will be called with the value
         * and should return a string.
         */
        format: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.func, _react2["default"].PropTypes.string])
    },

    getDefaultProps: function getDefaultProps() {
        return {
            display: "avg",
            size: 14,
            spacing: 2,
            padding: 5,
            labelWidth: 240,
            style: [{ fill: "steelblue" }],
            seriesList: [],
            columns: ["value"],
            sortBy: "max"
        };
    },

    renderName: function renderName(series) {
        return _react2["default"].createElement(
            "span",
            { style: { marginTop: 5 } },
            series.name().toUpperCase()
        );
    },

    renderRows: function renderRows(seriesList) {
        var _this = this;

        var max = 0;

        var _props2 = this.props;
        var columns = _props2.columns;
        var spacing = _props2.spacing;
        var padding = _props2.padding;
        var size = _props2.size;
        var style = _props2.style;
        var format = _props2.format;
        var display = _props2.display;
        var timestamp = _props2.timestamp;

        seriesList.forEach(function (series) {
            _this.props.columns.forEach(function (column) {
                var smax = series.max(column);
                if (smax > max) max = smax;
            });
        });

        var boxStyle = {
            width: "100%",
            boxShadow: "inset 11px 0px 7px -9px rgba(0,0,0,0.28)"
        };

        return seriesList.map(function (series, i) {
            return _react2["default"].createElement(
                _reactFlexbox2["default"],
                { column: true },
                _react2["default"].createElement(
                    _reactFlexbox2["default"],
                    { key: i, row: true, style: { background: i % 2 ? "#F8F8F8" : "white" } },
                    _react2["default"].createElement(
                        _reactFlexbox2["default"],
                        { column: true, width: "220px" },
                        _this.renderName(series)
                    ),
                    _react2["default"].createElement(
                        _reactFlexbox2["default"],
                        { row: true },
                        _react2["default"].createElement(
                            "div",
                            { style: boxStyle },
                            _react2["default"].createElement(
                                _resizable2["default"],
                                { style: { margin: 3 } },
                                _react2["default"].createElement(Bars, {
                                    display: display,
                                    series: series,
                                    max: max,
                                    columns: columns,
                                    spacing: spacing,
                                    padding: padding,
                                    size: size,
                                    style: style,
                                    format: format,
                                    timestamp: timestamp })
                            )
                        )
                    )
                )
            );
        });
    },

    render: function render() {
        var _this2 = this;

        // Sort the list
        var sortedList = _underscore2["default"].sortBy(this.props.seriesList, function (series) {
            switch (_this2.props.sortBy) {
                case "name":
                    return series.name;
                case "avg":
                    return -_underscore2["default"].reduce(_this2.props.columns.map(function (column) {
                        return series.avg(column);
                    }), function (memo, num) {
                        return memo + num;
                    }, 0);
                case "max":
                    return -_underscore2["default"].max(_this2.props.columns.map(function (column) {
                        return series.max(column);
                    }));
            }
        });

        // Top n
        var list = this.props.top ? sortedList.slice(0, this.props.top) : sortedList;

        var containerStyle = {
            borderTopStyle: "solid",
            borderTopWidth: 1,
            borderTopColor: "#EEE",
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "#EEE"
        };

        return _react2["default"].createElement(
            "div",
            { style: containerStyle },
            this.renderRows(list)
        );
    }
});
module.exports = exports["default"];