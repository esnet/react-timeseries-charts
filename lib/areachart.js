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

var _underscore2 = _interopRequireDefault(_underscore);

var _esnetPond = require("@esnet/pond");

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

/**
 * Build up our data from the series. For each layer in the up (or down)
 * direction, layer, we have layer.values = [points] where each point is
 * in the format {data: .., value, ..}
 */
function getLayers(seriesList) {
    return {
        upLayers: seriesList[0].map(function (series) {
            var points = [];
            for (var i = 0; i < series.size(); i++) {
                var point = series.at(i);
                points.push({
                    date: point.timestamp(),
                    value: point.get()
                });
            }
            return { values: points };
        }),

        downLayers: seriesList[1].map(function (series) {
            var points = [];
            for (var i = 0; i < series.size(); i++) {
                var point = series.at(i);
                points.push({
                    date: point.timestamp(),
                    value: point.get()
                });
            }
            return { values: points };
        })
    };
}

/**
 * Build a D3 area generator based on the interpolate method and the supplied
 * timeScale and yScale. The result is an SVG area.
 *
 *   y|    |||  +y1   ||||||
 *    |||||||||||||||||||||||||
 *    | |||     +y0      |||||||||<-area
 *    |
 *    +---------|---------------- t
 *              x
 */
function getAreaGenerators(interpolate, timeScale, yScale) {
    var upArea = _d32["default"].svg.area().x(function (d) {
        return timeScale(d.date);
    }).y0(function (d) {
        return yScale(d.y0);
    }).y1(function (d) {
        return yScale(d.y0 + d.value);
    }).interpolate(interpolate);

    var downArea = _d32["default"].svg.area().x(function (d) {
        return timeScale(d.date);
    }).y0(function (d) {
        return yScale(d.y0);
    }).y1(function (d) {
        return yScale(d.y0 - d.value);
    }).interpolate(interpolate);

    return { upArea: upArea, downArea: downArea };
}

/**
 * Our D3 stack. When this is evoked with data (an array of layers) it builds up
 * the stack of graphs on top of each other (i.e propogates a baseline y
 * position up through the stack).
 */
function getAreaStackers() {
    return {
        stackUp: _d32["default"].layout.stack().values(function (d) {
            return d.values;
        }).x(function (d) {
            return d.date;
        }).y(function (d) {
            return d.value;
        }),

        stackDown: _d32["default"].layout.stack().values(function (d) {
            return d.values;
        }).x(function (d) {
            return d.date;
        }).y(function (d) {
            return -d.value;
        })
    };
}

function getCroppedSeries(scale, width, seriesList) {
    var beginTime = scale.invert(0);
    var endTime = scale.invert(width);
    return _underscore2["default"].map(seriesList, function (direction) {
        return _underscore2["default"].map(direction, function (series) {
            var beginIndex = series.bisect(beginTime);
            var endIndex = series.bisect(endTime);
            var cropped = series.slice(beginIndex, endIndex === series.size() - 1 ? endIndex : endIndex + 1);
            return cropped;
        });
    });
}

/**
 * Draws an area chart
 */
exports["default"] = _reactAddons2["default"].createClass({

    displayName: "AreaChart",

    propTypes: {
        /**
         * Time in ms to transition the chart when the axis changes scale
         */
        transition: _reactAddons2["default"].PropTypes.number,

        /**
         * The d3 interpolation method
         */
        interpolate: _reactAddons2["default"].PropTypes.string,

        /**
         * The style of the area chart, with format:
         *
         *  "style": {
         *      up: ["#448FDD", "#75ACE6", "#A9CBEF", ...],
         *      down: ["#FD8D0D", "#FDA949", "#FEC686", ...]
         *  }
         *
         *  Where each color in the array corresponds to each area stacked
         *  either up or down.
         */
        style: _reactAddons2["default"].PropTypes.shape({
            up: _reactAddons2["default"].PropTypes.arrayOf(_reactAddons2["default"].PropTypes.string),
            down: _reactAddons2["default"].PropTypes.arrayOf(_reactAddons2["default"].PropTypes.string)
        }),

        /**
         * The series list. This is a 2 element array, with the first element
         * build stacked up and the second element being stacked down. Each
         * element is itself an array of TimeSeries.
         */
        series: _reactAddons2["default"].PropTypes.arrayOf(_reactAddons2["default"].PropTypes.arrayOf(_reactAddons2["default"].PropTypes.instanceOf(_esnetPond.TimeSeries)))
    },

    getDefaultProps: function getDefaultProps() {
        return {
            transition: 0,
            interpolate: "step-after",
            style: {
                up: ["#448FDD", "#75ACE6", "#A9CBEF"],
                down: ["#FD8D0D", "#FDA949", "#FEC686"]
            }
        };
    },

    /**
     * Checks if the passed in point is within the bounds of the drawing area
     */
    inBounds: function inBounds(p) {
        return p[0] > 0 && p[0] < this.props.width;
    },

    renderAreaChart: function renderAreaChart(series, timeScale, yScale, interpolate, isPanning) {
        var _this = this;

        if (!yScale || !series[0]) {
            return null;
        }

        _d32["default"].select(this.getDOMNode()).selectAll("*").remove();

        var croppedSeries = getCroppedSeries(timeScale, this.props.width, series);

        var _getAreaGenerators = getAreaGenerators(interpolate, timeScale, yScale);

        var upArea = _getAreaGenerators.upArea;
        var downArea = _getAreaGenerators.downArea;

        var _getLayers = getLayers(croppedSeries);

        var upLayers = _getLayers.upLayers;
        var downLayers = _getLayers.downLayers;

        var _getAreaStackers = getAreaStackers();

        // Stack our layers
        var stackUp = _getAreaStackers.stackUp;
        var stackDown = _getAreaStackers.stackDown;
        stackUp(upLayers);
        if (downLayers.length) {
            stackDown(downLayers);
        }

        // Cursor
        var cursor = isPanning ? "-webkit-grabbing" : "default";

        //
        // Stacked area drawing up
        //

        // Make a group 'areachart-up-group' for each stacked area
        var upChart = _d32["default"].select(this.getDOMNode()).selectAll(".areachart-up-group").data(upLayers).enter().append("g").attr("id", function () {
            return _underscore2["default"].uniqueId("areachart-up-");
        });

        // Append the area chart path onto the areachart-up-group group
        this.upChart = upChart.append("path").style("fill", function (d, i) {
            return _this.props.style.up[i];
        }).style("pointerEvents", "none").style("cursor", cursor).attr("d", function (d) {
            return upArea(d.values);
        }).attr("clip-path", this.props.clipPathURL);

        //
        // Stacked area drawing down
        //

        // Make a group 'areachart-down-group' for each stacked area
        var downChart = _d32["default"].select(this.getDOMNode()).selectAll(".areachart-down-group").data(downLayers).enter().append("g").attr("id", function () {
            return _underscore2["default"].uniqueId("areachart-down-");
        });

        // Append the area chart path onto the areachart-down-group group
        this.downChart = downChart.append("path").style("fill", function (d, i) {
            return _this.props.style.down[i];
        }).style("pointerEvents", "none").style("cursor", cursor).attr("d", function (d) {
            return downArea(d.values);
        }).attr("clip-path", this.props.clipPathURL);
    },

    updateAreaChart: function updateAreaChart(series, timeScale, yScale, interpolate) {
        var croppedSeries = getCroppedSeries(timeScale, this.props.width, series);

        var _getAreaGenerators2 = getAreaGenerators(interpolate, timeScale, yScale);

        var upArea = _getAreaGenerators2.upArea;
        var downArea = _getAreaGenerators2.downArea;

        var _getLayers2 = getLayers(croppedSeries);

        var upLayers = _getLayers2.upLayers;
        var downLayers = _getLayers2.downLayers;

        var _getAreaStackers2 = getAreaStackers();

        // Stack our layers
        var stackUp = _getAreaStackers2.stackUp;
        var stackDown = _getAreaStackers2.stackDown;
        stackUp(upLayers);
        if (downLayers.length) {
            stackDown(downLayers);
        }

        this.upChart.transition().duration(this.props.transition).ease("sin-in-out").attr("d", function (d) {
            return upArea(d.values);
        });

        this.downChart.transition().duration(this.props.transition).ease("sin-in-out").attr("d", function (d) {
            return downArea(d.values);
        });
    },

    componentDidMount: function componentDidMount() {
        this.renderAreaChart(this.props.series, this.props.timeScale, this.props.yScale, this.props.interpolate);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var newSeries = nextProps.series;
        var oldSeries = this.props.series;

        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var interpolate = nextProps.interpolate;

        var isPanning = nextProps.isPanning;

        // What changed
        var timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
        var yAxisScaleChanged = scaleAsString(this.props.yScale) !== scaleAsString(yScale);
        var interpolateChanged = this.props.interpolate !== interpolate;
        var isPanningChanged = this.props.isPanning !== isPanning;

        var seriesChanged = false;
        if (oldSeries[0].length !== newSeries[0].length || oldSeries[0].length !== newSeries[0].length) {
            seriesChanged = true;
        } else {
            for (var d = 0; d < 2; d++) {
                for (var a = 0; a < oldSeries[d].length; a++) {
                    var o = oldSeries[d][a];
                    var n = newSeries[d][a];
                    if (!_esnetPond.TimeSeries.is(o, n)) {
                        seriesChanged = true;
                    }
                }
            }
        }

        //
        // Currently if the series changes we completely rerender it. If the
        // y axis scale changes then we just update the existing paths using a
        // transition so that we can get smooth axis transitions.
        //

        if (seriesChanged || timeScaleChanged || interpolateChanged || isPanningChanged) {
            this.renderAreaChart(newSeries, timeScale, yScale, interpolate, isPanning);
        } else if (yAxisScaleChanged) {
            this.updateAreaChart(newSeries, timeScale, yScale, interpolate);
        }
    },

    shouldComponentUpdate: function shouldComponentUpdate() {
        return false;
    },

    render: function render() {
        return _reactAddons2["default"].createElement("g", null);
    }
});
module.exports = exports["default"];