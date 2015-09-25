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

exports["default"] = _reactAddons2["default"].createClass({

    displayName: "Tracker",

    propTypes: {
        style: _reactAddons2["default"].PropTypes.object,
        position: _reactAddons2["default"].PropTypes.instanceOf(Date),
        height: _reactAddons2["default"].PropTypes.number,
        timeScale: _reactAddons2["default"].PropTypes.func.isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return {
            offset: 0,
            style: { stroke: "#AAA", cursor: "crosshair" }
        };
    },

    render: function render() {
        var posx = this.props.timeScale(this.props.position);
        if (posx) {
            return _reactAddons2["default"].createElement("line", { style: this.props.style, x1: posx, y1: 0,
                x2: posx, y2: this.props.height });
        }
        return null;
    }
});
module.exports = exports["default"];