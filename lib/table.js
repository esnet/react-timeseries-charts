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

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

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

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _esnetPond = require("@esnet/pond");

exports["default"] = _react2["default"].createClass({

    displayName: "Table",

    propTypes: function propTypes() {
        return {
            series: _react2["default"].PropTypes.instanceOf(_esnetPond.TimeSeries).isRequired
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            timeFormat: undefined,
            width: 300
        };
    },

    renderCells: function renderCells(event) {
        var _this = this;

        var cells = [];

        if (this.props.columns) {
            _underscore2["default"].each(this.props.columns, function (column) {
                var cell = undefined;
                if (_this.props.renderCell) {
                    cell = _this.props.renderCell(event, column.key);
                }

                if (cell) {
                    cells.push(_react2["default"].createElement(
                        "td",
                        { key: column.key },
                        cell
                    ));
                } else {
                    var formatter = undefined;
                    if (column.format) {
                        if (_underscore2["default"].isFunction(column.format)) {
                            formatter = column.format;
                        } else if (_underscore2["default"].isString(column.format)) {
                            formatter = _d32["default"].format(column.format);
                        }
                    }

                    if (column.key === "time") {
                        if (event instanceof _esnetPond.IndexedEvent) {
                            var format = _this.props.timeFormat;
                            var eventIndex = event.index().toNiceString(format);
                            cells.push(_react2["default"].createElement(
                                "td",
                                { key: event.index().asString() },
                                eventIndex
                            ));
                        } else {
                            var ts = (0, _moment2["default"])(event.timestamp());
                            cells.push(_react2["default"].createElement(
                                "td",
                                { key: ts.valueOf() },
                                ts.format(_this.props.timeFormat)
                            ));
                        }
                    } else {
                        var value = event.data().get(column.key);
                        if (formatter) {
                            value = formatter(parseFloat(value, 10));
                        }
                        cells.push(_react2["default"].createElement(
                            "td",
                            { key: column.key },
                            value
                        ));
                    }
                }
            });
        } else {
            if (event instanceof _esnetPond.IndexedEvent) {
                cells.push(_react2["default"].createElement(
                    "td",
                    { key: event.index().asString() },
                    event.index().toNiceString(this.props.timeFormat)
                ));
            } else {
                var ts = (0, _moment2["default"])(event.timestamp());
                cells.push(_react2["default"].createElement(
                    "td",
                    { key: ts.valueOf() },
                    ts.format(this.props.timeFormat)
                ));
            }

            event.data().forEach(function (d, i) {
                var cell = undefined;
                if (_this.props.renderCell) {
                    cell = _this.props.renderCell(event, i);
                }

                if (cell) {
                    cells.push(_react2["default"].createElement(
                        "td",
                        { key: i },
                        cell
                    ));
                } else {
                    cells.push(_react2["default"].createElement(
                        "td",
                        { key: i },
                        d.toString()
                    ));
                }
            });
        }

        return cells;
    },

    renderRows: function renderRows() {
        var rows = [];
        var i = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _getIterator(this.props.series.events()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _event = _step.value;

                rows.push(_react2["default"].createElement(
                    "tr",
                    { key: i },
                    this.renderCells(_event)
                ));
                i++;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var summaryStyle = {
            backgroundColor: "#ECECEC",
            borderTop: "#E0E0E0",
            borderTopWidth: 1,
            borderTopStyle: "solid"
        };

        if (this.props.summary) {
            var cells = _underscore2["default"].map(this.props.summary, function (value, key) {
                return _react2["default"].createElement(
                    "td",
                    { key: key },
                    _react2["default"].createElement(
                        "b",
                        null,
                        value
                    )
                );
            });
            rows.push(_react2["default"].createElement(
                "tr",
                { key: "summary", style: summaryStyle },
                cells
            ));
        }

        return rows;
    },

    renderHeader: function renderHeader() {
        var headerCells = [];
        var headerStyle = { borderTop: "none" };
        if (this.props.columns) {
            _underscore2["default"].each(this.props.columns, function (column) {
                headerCells.push(_react2["default"].createElement(
                    "th",
                    { key: column.label,
                        style: headerStyle },
                    column.label
                ));
            });
        } else {
            headerCells.push(_react2["default"].createElement(
                "th",
                { key: "time" },
                "time"
            ));
            this.props.series._columns.forEach(function (column) {
                headerCells.push(_react2["default"].createElement(
                    "th",
                    { key: column.label, style: headerStyle },
                    column
                ));
            });
        }

        return _react2["default"].createElement(
            "tr",
            { key: "header" },
            headerCells
        );
    },

    render: function render() {
        var style = { marginBottom: 0 };

        return _react2["default"].createElement(
            "table",
            { className: "table table-condensed table-striped",
                width: this.props.width,
                style: style },
            _react2["default"].createElement(
                "tbody",
                null,
                this.renderHeader(),
                this.renderRows()
            )
        );
    }
});
module.exports = exports["default"];