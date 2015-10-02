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

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _pathsJsPolygon = require("paths-js/polygon");

var _pathsJsPolygon2 = _interopRequireDefault(_pathsJsPolygon);

var _pathsJsBezier = require("paths-js/bezier");

var _pathsJsBezier2 = _interopRequireDefault(_pathsJsBezier);

exports["default"] = _react2["default"].createClass({
    displayName: "linechart",

    getDefaultProps: function getDefaultProps() {
        return {
            smooth: true,
            style: {
                color: "#9DA3FF",
                width: 1
            }
        };
    },

    /**
     * Uses paths.js to generate an SVG element for a path passing
     * through the points passed in. May be smoothed or not, depending
     * on this.props.smooth.
     */
    generatePath: function generatePath(points) {
        var fn = this.props.smooth ? _pathsJsBezier2["default"] : _pathsJsPolygon2["default"];
        return fn({ points: points, closed: false }).path.print();
    },

    /**
     * Checks if the passed in point is within the bounds of the drawing area
     */
    inBounds: function inBounds(p) {
        return p[0] > 0 && p[0] < this.props.width;
    },

    /**
     * Returns the style used for drawing the path
     */
    pathStyle: function pathStyle() {
        return {
            fill: "none",
            pointerEvents: "none",
            stroke: this.props.style.color || "#9DA3FF",
            strokeWidth: this.props.style.width + "px" || "1px"
        };
    },

    renderLine: function renderLine() {
        var _this = this;

        // Map series data to scaled points and filter to bounds of drawing area
        var points = _underscore2["default"].filter(_underscore2["default"].map(this.props.series.toJSON().points, function (d) {
            return [_this.props.timeScale(d[0]), _this.props.yScale(d[1])];
        }), function (p) {
            return _this.inBounds(p);
        });

        return _react2["default"].createElement("path", { style: this.pathStyle(),
            onMouseMove: this.handleMouseMove,
            d: this.generatePath(points),
            clipPath: this.props.clipPathURL });
    },

    render: function render() {
        return _react2["default"].createElement(
            "g",
            null,
            this.renderLine()
        );
    }
});
module.exports = exports["default"];