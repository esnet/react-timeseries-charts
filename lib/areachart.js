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

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _pondjs = require("pondjs");

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

/**
 * Build up our data from the series. For each layer in the up (or down)
 * direction, layer, we have layer.values = [points] where each point is
 * in the format {data: .., value, ..}
 */
function getLayers(columns, series) {
    var up = columns.up || [];
    var down = columns.down || [];
    return {
        upLayers: up.map(function (columnName) {
            var points = [];
            for (var i = 0; i < series.size(); i++) {
                var point = series.at(i);
                points.push({
                    date: point.timestamp(),
                    value: point.get(columnName)
                });
            }
            return { values: points };
        }),

        downLayers: down.map(function (columnName) {
            var points = [];
            for (var i = 0; i < series.size(); i++) {
                var point = series.at(i);
                points.push({
                    date: point.timestamp(),
                    value: point.get(columnName)
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

function getCroppedSeries(scale, width, series) {
    var beginTime = scale.invert(0);
    var endTime = scale.invert(width);
    var beginIndex = series.bisect(beginTime);
    var endIndex = series.bisect(endTime);
    return series.slice(beginIndex, endIndex === series.size() - 1 ? endIndex : endIndex + 1);
}

/**
 * The AreaChart widget is able to display single or multiple stacked
 * areas above or below the axis. It used throughout the
 * [My ESnet Portal](http://my.es.net).

 * The AreaChart should be used within a `<ChartContainer>` structure,
 * as this will construct the horizontal and vertical axis, and manage
 * other elements. Here is an example of an AreaChart with an up and down
 * traffic visualization:
 *
 *  ```
 *   render() {
 *      return (
 *          ...
 *          <ChartContainer timeRange={trafficSeries.timerange()} width="1080">
 *              <ChartRow height="150">
 *                  <Charts>
 *                      <AreaChart
 *                          axis="traffic"
 *                          series={trafficSeries}
 *                          columns={{up: ["in"], down: ["out"]}}/>
 *                  </Charts>
 *                  <YAxis id="traffic" label="Traffic (bps)" min={-max} max={max} absolute={true} width="60" type="linear"/>
 *              </ChartRow>
 *          </ChartContainer>
 *          ...
 *      );
 *  }
 *  ```
 * The `<AreaChart>`` takes a single `TimeSeries` object into its `series` prop. This
 * series can contain multiple columns and those columns can be referenced using the `columns`
 * prop. The `columns` props allows you to map columns in the series to the chart,
 * letting you specify the stacking and orientation of the data. In the above example
 * we map the "in" column in `trafficSeries` to the up direction and the "out" column to
 * the down direction. Each direction is specified as an array, so adding multiple
 * columns into a direction will stack the areas in that direction.
 *
 * Note: It is recommended that `<ChartContainer>`s be placed within a <Resizable> tag,
 * rather than hard coding the width as in the above example.
 */
exports["default"] = _react2["default"].createClass({

    displayName: "AreaChart",

    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: _react2["default"].PropTypes.instanceOf(_pondjs.TimeSeries).isRequired,

        /**
         * Reference to the axis which provides the vertical scale for ## drawing. e.g.
         * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
         */
        axis: _react2["default"].PropTypes.string.isRequired,

        /**
         * The series series columns mapped to stacking up and down.
         * Has the format:
         * ```
         *  "columns": {
         *      up: ["in", ...],
         *      down: ["out", ...]
         *  }
         *  ```
         */
        columns: _react2["default"].PropTypes.shape({
            up: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string),
            down: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string)
        }),

        /**
         * The style of the area chart, with format:
         * ```
         * "style": {
         *     up: ["#448FDD", "#75ACE6", "#A9CBEF", ...],
         *     down: ["#FD8D0D", "#FDA949", "#FEC686", ...]
         * }
         * ```
         * Where each color in the array corresponds to each area stacked
         * either up or down.
         */
        style: _react2["default"].PropTypes.shape({
            up: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string),
            down: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string)
        }),

        /**
         * The d3 interpolation method
         */
        interpolate: _react2["default"].PropTypes.string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            transition: 0,
            interpolate: "step-after",
            style: {
                up: ["#448FDD", "#75ACE6", "#A9CBEF"],
                down: ["#FD8D0D", "#FDA949", "#FEC686"]
            },
            columns: {
                up: ["value"],
                down: []
            }
        };
    },

    /**
     * Checks if the passed in point is within the bounds of the drawing area
     */
    inBounds: function inBounds(p) {
        return p[0] > 0 && p[0] < this.props.width;
    },

    renderAreaChart: function renderAreaChart(series, timeScale, yScale, interpolate, isPanning, columns, width, style) {
        if (!yScale) {
            return null;
        }

        _d32["default"].select(_reactDom2["default"].findDOMNode(this)).selectAll("*").remove();

        var croppedSeries = getCroppedSeries(timeScale, width, series);

        var _getAreaGenerators = getAreaGenerators(interpolate, timeScale, yScale);

        var upArea = _getAreaGenerators.upArea;
        var downArea = _getAreaGenerators.downArea;

        var _getLayers = getLayers(columns, croppedSeries);

        var upLayers = _getLayers.upLayers;
        var downLayers = _getLayers.downLayers;

        var _getAreaStackers = getAreaStackers();

        var stackUp = _getAreaStackers.stackUp;
        var stackDown = _getAreaStackers.stackDown;

        // Stack our layers
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
        var upChart = _d32["default"].select(_reactDom2["default"].findDOMNode(this)).selectAll(".areachart-up-group").data(upLayers).enter().append("g").attr("id", function () {
            return _underscore2["default"].uniqueId("areachart-up-");
        });

        // Append the area chart path onto the areachart-up-group group
        this.upChart = upChart.append("path").style("fill", function (d, i) {
            return style.up[i];
        }).style("pointerEvents", "none").style("cursor", cursor).attr("d", function (d) {
            return upArea(d.values);
        }).attr("clip-path", this.props.clipPathURL);

        //
        // Stacked area drawing down
        //

        // Make a group 'areachart-down-group' for each stacked area
        var downChart = _d32["default"].select(_reactDom2["default"].findDOMNode(this)).selectAll(".areachart-down-group").data(downLayers).enter().append("g").attr("id", function () {
            return _underscore2["default"].uniqueId("areachart-down-");
        });

        // Append the area chart path onto the areachart-down-group group
        this.downChart = downChart.append("path").style("fill", function (d, i) {
            return style.down[i];
        }).style("pointerEvents", "none").style("cursor", cursor).attr("d", function (d) {
            return downArea(d.values);
        }).attr("clip-path", this.props.clipPathURL);
    },

    updateAreaChart: function updateAreaChart(series, timeScale, yScale, interpolate, columns, width) {
        var croppedSeries = getCroppedSeries(timeScale, width, series);

        var _getAreaGenerators2 = getAreaGenerators(interpolate, timeScale, yScale);

        var upArea = _getAreaGenerators2.upArea;
        var downArea = _getAreaGenerators2.downArea;

        var _getLayers2 = getLayers(columns, croppedSeries);

        var upLayers = _getLayers2.upLayers;
        var downLayers = _getLayers2.downLayers;

        var _getAreaStackers2 = getAreaStackers();

        var stackUp = _getAreaStackers2.stackUp;
        var stackDown = _getAreaStackers2.stackDown;

        // Stack our layers
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
        this.renderAreaChart(this.props.series, this.props.timeScale, this.props.yScale, this.props.interpolate, this.props.isPanning, this.props.columns, this.props.width, this.props.style);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var newSeries = nextProps.series;
        var oldSeries = this.props.series;

        var width = nextProps.width;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var interpolate = nextProps.interpolate;
        var isPanning = nextProps.isPanning;
        var columns = nextProps.columns;
        var style = nextProps.style;

        // What changed?
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
        var yAxisScaleChanged = scaleAsString(this.props.yScale) !== scaleAsString(yScale);
        var interpolateChanged = this.props.interpolate !== interpolate;
        var isPanningChanged = this.props.isPanning !== isPanning;
        var columnsChanged = JSON.stringify(this.props.columns) !== JSON.stringify(columns);
        var styleChanged = JSON.stringify(this.props.style) !== JSON.stringify(style);

        var seriesChanged = false;
        if (oldSeries.length !== newSeries.length) {
            seriesChanged = true;
        } else {
            seriesChanged = !_pondjs.TimeSeries.is(oldSeries, newSeries);
        }

        //
        // Currently if the series changes we completely rerender it. If the
        // y axis scale changes then we just update the existing paths using a
        // transition so that we can get smooth axis transitions.
        //

        if (seriesChanged || timeScaleChanged || widthChanged || interpolateChanged || isPanningChanged || columnsChanged || styleChanged) {
            this.renderAreaChart(newSeries, timeScale, yScale, interpolate, isPanning, columns, width, style);
        } else if (yAxisScaleChanged) {
            this.updateAreaChart(newSeries, timeScale, yScale, interpolate, columns, width);
        }
    },

    shouldComponentUpdate: function shouldComponentUpdate() {
        return false;
    },

    render: function render() {
        return _react2["default"].createElement("g", null);
    }
});
module.exports = exports["default"];