/*
 * ESnet react-timeseries-charts, Copyright (c) 2015, The Regents of
 * the University of California, through Lawrence Berkeley National
 * Laboratory (subject to receipt of any required approvals from the
 * U.S. Dept. of Energy).  All rights reserved.
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
            "smooth": true,
            "showPoints": false,
            "pointRadius": 1,
            "style": {
                "color": "#9DA3FF",
                "width": 1
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
            "fill": "none",
            "pointerEvents": "none",
            "stroke": this.props.style.color || "#9DA3FF",
            "strokeWidth": "" + this.props.style.width + "px" || "1px"
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

        return _react2["default"].createElement("path", { style: this.pathStyle(), onMouseMove: this.handleMouseMove,
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