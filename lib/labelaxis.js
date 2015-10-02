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

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _underscore = require("underscore");

/**
 * Renders a 'axis' that display a label for a data channel and a
 * max and average value
 *      +----------------+-----+------- ...
 *      | Traffic        | 120 |
 *      | Max 100 Gbps   |     | Chart  ...
 *      | Avg 26 Gbps    | 0   |
 *      +----------------+-----+------- ...
 *
 * EXPERIMENTAL
 *
 */

var _underscore2 = _interopRequireDefault(_underscore);

exports["default"] = _reactAddons2["default"].createClass({

    displayName: "LabelAxis",

    render: function render() {
        var labelStyle = {
            fontSize: 14,
            textAnchor: "middle",
            fill: "#838383"
        };
        var detailStyle = {
            fontSize: 12,
            textAnchor: "left",
            fill: "#bdbdbd"
        };
        var VALWIDTH = this.props.valWidth ? this.props.valWidth : 40;
        var rectWidth = this.props.width - VALWIDTH;
        var valXPos = rectWidth + 3; // padding

        var format = _underscore2["default"].has(this.props, "format") ? this.props.format : ".2f";
        var maxStr = _d32["default"].format(format)(this.props.max);
        var minStr = _d32["default"].format(format)(this.props.min);
        return _reactAddons2["default"].createElement(
            "g",
            null,
            _reactAddons2["default"].createElement("rect", { x: "0", y: "0", width: rectWidth, height: this.props.height,
                style: { fill: "#E4E4E4", fillOpacity: 0.65 } }),
            _reactAddons2["default"].createElement(
                "text",
                { x: parseInt(rectWidth / 2, 10),
                    y: this.props.height / 2,
                    style: labelStyle },
                this.props.label
            ),
            _reactAddons2["default"].createElement(
                "text",
                { x: valXPos, y: 0, dy: "1.2em", style: detailStyle },
                maxStr
            ),
            _reactAddons2["default"].createElement(
                "text",
                { x: valXPos, y: this.props.height, style: detailStyle },
                minStr
            )
        );
    }
});
module.exports = exports["default"];