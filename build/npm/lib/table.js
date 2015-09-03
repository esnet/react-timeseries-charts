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

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _esnetPond = require("@esnet/pond");

exports["default"] = _reactAddons2["default"].createClass({

    displayName: "Table",

    propTypes: function propTypes() {
        return {
            series: _reactAddons2["default"].PropTypes.instanceOf(_esnetPond.TimeSeries).isRequired
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
                    cells.push(_reactAddons2["default"].createElement(
                        "td",
                        null,
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
                            cells.push(_reactAddons2["default"].createElement(
                                "td",
                                null,
                                event.index().toNiceString(_this.props.timeFormat)
                            ));
                        } else {
                            var ts = (0, _moment2["default"])(event.timestamp());
                            cells.push(_reactAddons2["default"].createElement(
                                "td",
                                null,
                                ts.format(_this.props.timeFormat)
                            ));
                        }
                    } else {
                        var value = event.data().get(column.key);
                        if (formatter) {
                            value = formatter(parseFloat(value, 10));
                        }
                        cells.push(_reactAddons2["default"].createElement(
                            "td",
                            null,
                            value
                        ));
                    }
                }
            });
        } else {
            if (event instanceof _esnetPond.IndexedEvent) {
                cells.push(_reactAddons2["default"].createElement(
                    "td",
                    null,
                    event.index().toNiceString(this.props.timeFormat)
                ));
            } else {
                var ts = (0, _moment2["default"])(event.timestamp());
                cells.push(_reactAddons2["default"].createElement(
                    "td",
                    null,
                    ts.format(this.props.timeFormat)
                ));
            }

            event.data().forEach(function (d, i) {
                var cell = undefined;
                if (_this.props.renderCell) {
                    cell = _this.props.renderCell(event, i);
                }

                if (cell) {
                    cells.push(_reactAddons2["default"].createElement(
                        "td",
                        null,
                        cell
                    ));
                } else {
                    cells.push(_reactAddons2["default"].createElement(
                        "td",
                        null,
                        d.toString()
                    ));
                }
            });
        }

        return cells;
    },

    renderRows: function renderRows() {
        var rows = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.props.series.events()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _event = _step.value;

                rows.push(_reactAddons2["default"].createElement(
                    "tr",
                    null,
                    this.renderCells(_event)
                ));
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
                return _reactAddons2["default"].createElement(
                    "td",
                    null,
                    _reactAddons2["default"].createElement(
                        "b",
                        null,
                        value
                    )
                );
            });
            rows.push(_reactAddons2["default"].createElement(
                "tr",
                { style: summaryStyle },
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
                headerCells.push(_reactAddons2["default"].createElement(
                    "th",
                    { style: headerStyle },
                    column.label
                ));
            });
        } else {
            headerCells.push(_reactAddons2["default"].createElement(
                "th",
                null,
                "time"
            ));
            this.props.series._columns.forEach(function (column) {
                headerCells.push(_reactAddons2["default"].createElement(
                    "th",
                    { style: headerStyle },
                    column
                ));
            });
        }

        return _reactAddons2["default"].createElement(
            "tr",
            null,
            headerCells
        );
    },

    render: function render() {
        var style = { marginBottom: 0 };

        return _reactAddons2["default"].createElement(
            "table",
            { className: "table table-condensed table-striped", width: this.props.width, style: style },
            _reactAddons2["default"].createElement(
                "tbody",
                null,
                this.renderHeader(),
                this.renderRows()
            )
        );
    }
});
module.exports = exports["default"];