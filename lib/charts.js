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

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

/**
 * A Charts component is a grouping of charts which will be composited on top of
 * each other. It does no actual rendering itself, but instead is used for
 * organizing ChartRow children. There must be one, and only one, Charts
 * grouping within a ChartRow. All children of a ChartRow, for which there must
 * be at least one, are considered a chart. They should return an SVG <g>
 * containing their render.
 */
exports["default"] = _react2["default"].createClass({

    displayName: "Charts",

    render: function render() {
        (0, _invariant2["default"])(false, this.constructor.name + " elements are for schema configuration only\nand should not be rendered");
    }
});
module.exports = exports["default"];