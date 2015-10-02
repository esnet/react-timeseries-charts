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

var _reactAddons = require("react/addons");

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _reactLibInvariant = require("react/lib/invariant");

/**
 * A Charts component is a grouping of charts which will be composited on top of
 * each other. It does no actual rendering itself, but instead is used for
 * organizing ChartRow children. There must be one, and only one, Charts
 * grouping within a ChartRow. All children of a ChartRow, for which there must
 * be at least one, are considered a chart. They should return an SVG <g>
 * containing their render.
 */

var _reactLibInvariant2 = _interopRequireDefault(_reactLibInvariant);

exports["default"] = _reactAddons2["default"].createClass({

    displayName: "Charts",

    render: function render() {
        (0, _reactLibInvariant2["default"])(false, this.constructor.name + " elements are for schema configuration only\nand should not be rendered");
    }
});
module.exports = exports["default"];