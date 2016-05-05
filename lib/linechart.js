"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _d3Shape = require("d3-shape");

var _d3Shape2 = _interopRequireDefault(_d3Shape);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _pondjs = require("pondjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

/**
 * The LineChart widget is able to display a single line chart.
 *
 * The LineChart should be used within `<ChartContainer>` etc., as this will
 * construct the horizontal and vertical axis, and manage other elements.
 * Here is an example of two LineCharts overlaid on top of each other, along
 * with a BaseLine:
 *
 * ```
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
 *         <Charts>
 *             <LineChart axis="axis1" series={audSeries} style={audStyle}/>
 *             <LineChart axis="axis2" series={euroSeries} style={euroStyle}/>
 *             <Baseline  axis="axis1" value={1.0} label="USD Baseline" position="right"/>
 *         </Charts>
 *         <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 *
 * Note: Currently the line chart will take the first column for rendering.
 */
/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

exports.default = _react2.default.createClass({

    displayName: "LineChart",

    getDefaultProps: function getDefaultProps() {
        return {
            smooth: true,
            interpolation: "curveLinear",
            style: {
                stroke: "steelblue",
                strokeWidth: 1
            },
            breakLine: true
        };
    },


    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: _react2.default.PropTypes.instanceOf(_pondjs.TimeSeries).isRequired,

        /**
         * Reference to the axis which provides the vertical scale for drawing.
         * e.g. specifying `axis="trafficRate"` would refer the y-scale of the YAxis
         * with id="trafficRate".
         */
        axis: _react2.default.PropTypes.string.isRequired,

        /**
         * The style of the line chart, with format:
         * ```
         *  const dashedBlueStyle = {
         *      stroke: "steelblue",
         *      strokeWidth: 1,
         *      strokeDasharray: "4,2"
         *  };
         *
         *  <LineChart style={dashedBlueStyle} ... />
         *  ```
         */
        style: _react2.default.PropTypes.object,

        /**
         * Any of D3's interpolation modes.
         */
        interpolation: _react2.default.PropTypes.oneOf(["curveBasis", "curveBasisOpen", "curveBundle", "curveCardinal", "curveCardinalOpen", "curveCatmullRom", "curveCatmullRomOpen", "curveLinear", "curveMonotone", "curveNatural", "curveRadial", "curveStep", "curveStepAfter", "curveStepBefore"]),

        /**
         * The determines how to handle bad/missing values in the supplied
         * TimeSeries. A missing value can be null or NaN. If breakLine
         * is set to true then the line will be broken on either side of
         * the bad value(s). If breakLine is false (the default) bad values
         * are simply removed and the adjoining points are connected.
         */
        breakLine: _react2.default.PropTypes.bool
    },

    /**
     * Returns the style used for drawing the path
     */
    pathStyle: function pathStyle() {
        var baseStyle = {
            fill: "none",
            pointerEvents: "none",
            stroke: this.props.style.color || "#9DA3FF",
            strokeWidth: this.props.style.width + "px" || "1px"
        };
        return (0, _merge2.default)(true, baseStyle, this.props.style);
    },
    renderPath: function renderPath(data, key) {
        var _this = this;

        var lineFunction = _d3Shape2.default.line().curve(_d3Shape2.default[this.props.interpolation]).x(function (data) {
            return _this.props.timeScale(data.x);
        }).y(function (data) {
            return _this.props.yScale(data.y);
        });
        var path = lineFunction(data);
        return _react2.default.createElement("path", {
            key: key,
            clipPath: this.props.clipPathURL,
            style: this.pathStyle(),
            d: path });
    },
    renderLines: function renderLines() {
        var _this2 = this;

        var pathLines = [];
        var count = 1;
        if (this.props.breakLine) {
            (function () {
                // Remove nulls and NaNs from the line
                var currentPoints = null;
                _underscore2.default.each(_this2.props.series.toJSON().points, function (d) {
                    var value = d[1];
                    var badPoint = _underscore2.default.isNull(value) || _underscore2.default.isNaN(value) || !_underscore2.default.isFinite(value);
                    if (!badPoint) {
                        if (!currentPoints) currentPoints = [];
                        currentPoints.push([d[0], d[1]]);
                    } else {
                        if (currentPoints) {
                            var points = _underscore2.default.map(currentPoints, function (d) {
                                return { x: d[0], y: d[1] };
                            });
                            if (points.length > 1) pathLines.push(_this2.renderPath(points, count++));
                            currentPoints = null;
                        }
                    }
                });
                if (currentPoints) {
                    var points = _underscore2.default.map(currentPoints, function (d) {
                        return { x: d[0], y: d[1] };
                    });
                    if (points.length > 1) {
                        pathLines.push(_this2.renderPath(points, count));
                    }
                }
            })();
        } else {
            (function () {
                // Remove nulls and NaNs from the line
                var cleanedPoints = [];
                _underscore2.default.each(_this2.props.series.toJSON().points, function (d) {
                    var value = d[1];
                    var badPoint = _underscore2.default.isNull(value) || _underscore2.default.isNaN(value) || !_underscore2.default.isFinite(value);
                    if (!badPoint) {
                        cleanedPoints.push([d[0], d[1]]);
                    }
                });

                // Map series data to scaled points
                var points = _underscore2.default.map(cleanedPoints, function (d) {
                    return { x: d[0], y: d[1] };
                });

                pathLines.push(_this2.renderPath(points, count));
            })();
        }

        return _react2.default.createElement(
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
        var isPanning = nextProps.isPanning;
        var interpolation = nextProps.interpolation;

        // What changed?
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
        var yAxisScaleChanged = scaleAsString(this.props.yScale) !== scaleAsString(yScale);
        var isPanningChanged = this.props.isPanning !== isPanning;
        var interpolationChanged = this.props.interpolation !== interpolation;

        var seriesChanged = false;
        if (oldSeries.length !== newSeries.length) {
            seriesChanged = true;
        } else {
            seriesChanged = !_pondjs.TimeSeries.is(oldSeries, newSeries);
        }

        return widthChanged || seriesChanged || timeScaleChanged || isPanningChanged || yAxisScaleChanged || interpolationChanged;
    },
    render: function render() {
        return _react2.default.createElement(
            "g",
            null,
            this.renderLines()
        );
    }
});