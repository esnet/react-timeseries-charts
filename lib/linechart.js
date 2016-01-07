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

var _pondjs = require("pondjs");

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

exports["default"] = _react2["default"].createClass({
    displayName: "linechart",

    getDefaultProps: function getDefaultProps() {
        return {
            smooth: true,
            style: {
                color: "#9DA3FF",
                width: 1
            },
            breakLine: true
        };
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

    /**
     * Uses paths.js to generate an SVG element for a path passing
     * through the points passed in. May be smoothed or not, depending
     * on this.props.smooth.
     */
    generatePath: function generatePath(points) {
        var fn = !this.props.smooth || points.length < 3 ? _pathsJsPolygon2["default"] : _pathsJsBezier2["default"];
        return fn({ points: points, closed: false }).path.print();
    },

    renderPath: function renderPath(points, key) {
        return _react2["default"].createElement("path", {
            key: key,
            style: this.pathStyle(),
            d: this.generatePath(points),
            clipPath: this.props.clipPathURL });
    },

    renderLines: function renderLines() {
        var _this = this;

        var pathLines = [];
        var count = 1;
        if (this.props.breakLine) {
            (function () {
                // Remove nulls and NaNs from the line
                var currentPoints = null;
                _underscore2["default"].each(_this.props.series.toJSON().points, function (d) {
                    var value = d[1];
                    var badPoint = _underscore2["default"].isNull(value) || _underscore2["default"].isNaN(value) || !_underscore2["default"].isFinite(value);
                    if (!badPoint) {
                        if (!currentPoints) {
                            currentPoints = [];
                        }
                        currentPoints.push([d[0], d[1]]);
                    } else {
                        if (currentPoints) {
                            var points = _underscore2["default"].map(currentPoints, function (d) {
                                return [_this.props.timeScale(d[0]), _this.props.yScale(d[1])];
                            });
                            if (points.length > 1) {
                                pathLines.push(_this.renderPath(points, count++));
                            }
                            currentPoints = null;
                        }
                    }
                });
                if (currentPoints) {
                    var points = _underscore2["default"].map(currentPoints, function (d) {
                        return [_this.props.timeScale(d[0]), _this.props.yScale(d[1])];
                    });
                    if (points.length > 1) {
                        pathLines.push(_this.renderPath(points, count));
                    }
                }
            })();
        } else {
            (function () {
                // Remove nulls and NaNs from the line
                var cleanedPoints = [];
                _underscore2["default"].each(_this.props.series.toJSON().points, function (d) {
                    var value = d[1];
                    var badPoint = _underscore2["default"].isNull(value) || _underscore2["default"].isNaN(value) || !_underscore2["default"].isFinite(value);
                    if (!badPoint) {
                        cleanedPoints.push([d[0], d[1]]);
                    }
                });

                // Map series data to scaled points
                var points = _underscore2["default"].map(cleanedPoints, function (d) {
                    return [_this.props.timeScale(d[0]), _this.props.yScale(d[1])];
                });

                pathLines.push(_this.renderPath(points, count));
            })();
        }

        return _react2["default"].createElement(
            "g",
            null,
            pathLines
        );
    },

    shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
        var newSeries = nextProps.series;
        var oldSeries = this.props.series;

        var width = nextProps.width;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var interpolate = nextProps.interpolate;
        var isPanning = nextProps.isPanning;

        // What changed?
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
        var yAxisScaleChanged = scaleAsString(this.props.yScale) !== scaleAsString(yScale);
        var interpolateChanged = this.props.interpolate !== interpolate;
        var isPanningChanged = this.props.isPanning !== isPanning;

        var seriesChanged = false;
        if (oldSeries.length !== newSeries.length) {
            seriesChanged = true;
        } else {
            seriesChanged = !_pondjs.TimeSeries.is(oldSeries, newSeries);
        }

        return widthChanged || seriesChanged || timeScaleChanged || interpolateChanged || isPanningChanged || yAxisScaleChanged;
    },

    render: function render() {
        return _react2["default"].createElement(
            "g",
            null,
            this.renderLines()
        );
    }
});
module.exports = exports["default"];