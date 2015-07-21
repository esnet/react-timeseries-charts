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

var _pond = require("pond");

exports["default"] = _reactAddons2["default"].createClass({

    displayName: "Table",

    propTypes: function propTypes() {
        return {
            series: _reactAddons2["default"].PropTypes.instanceOf(_pond.TimeSeries).isRequired
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            timeFormat: undefined
        };
    },

    renderCells: function renderCells(event) {
        var _this = this;

        var cells = [];

        if (this.props.columns) {
            _underscore2["default"].each(this.props.columns, function (column) {
                var formatter = column.format ? _d32["default"].format(column.format) : undefined;
                if (column.key === "time") {
                    if (event instanceof _pond.IndexedEvent) {
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
            });
        } else {
            if (event instanceof _pond.IndexedEvent) {
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
                cells.push(_reactAddons2["default"].createElement(
                    "td",
                    null,
                    d.toString()
                ));
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

        return rows;
    },

    renderHeader: function renderHeader() {
        var headerCells = [];
        if (this.props.columns) {
            _underscore2["default"].each(this.props.columns, function (column) {
                headerCells.push(_reactAddons2["default"].createElement(
                    "th",
                    null,
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
                    null,
                    column
                ));
            });
        }

        return headerCells;
    },

    render: function render() {
        return _reactAddons2["default"].createElement(
            "table",
            { className: "table table-condensed table-striped", width: "300" },
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