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

require("./scatterchart.css");

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

exports["default"] = _react2["default"].createClass({
    displayName: "scatterchart",

    getDefaultProps: function getDefaultProps() {
        return {
            radius: 2.0,
            style: {
                color: "steelblue",
                opacity: 1
            }
        };
    },

    renderScatterChart: function renderScatterChart(series, timeScale, yScale, radius) {

        var data = series.toJSON().points;

        if (!yScale || !data[0]) {
            return null;
        }

        if (this.props.dropNulls) {
            data = _underscore2["default"].filter(data, function (d) {
                return d.value !== null;
            });
        }

        var style = {
            fill: this.props.style.color || "steelblue",
            fillOpacity: this.props.style.opacity || 1.0,
            stroke: "none"
        };

        _d32["default"].select(_reactDom2["default"].findDOMNode(this)).selectAll("*").remove();

        this.scatter = _d32["default"].select(_reactDom2["default"].findDOMNode(this)).selectAll("dot").data(data).enter().append("circle").style(style).attr("r", function (d) {
            return d[2] ? d[2] : radius;
        }).attr("cx", function (d) {
            return timeScale(d[0]);
        }).attr("cy", function (d) {
            return yScale(d[1]);
        }).attr("clip-path", this.props.clipPathURL);
    },

    updateScatterChart: function updateScatterChart(series, timeScale, yScale, radius) {
        var data = series.toJSON().points;
        this.scatter.data(data).transition().duration(this.props.transiton).ease("sin-in-out").attr("r", function (d) {
            return d[2] ? d[2] : radius;
        }).attr("cx", function (d) {
            return timeScale(d[0]);
        }).attr("cy", function (d) {
            return yScale(d[1]);
        });
    },

    componentDidMount: function componentDidMount() {
        this.renderScatterChart(this.props.series, this.props.timeScale, this.props.yScale, this.props.radius, this.props.classed);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var series = nextProps.series;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var radius = nextProps.radius;

        // What changed
        var timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
        var yAxisScaleChanged = scaleAsString(this.props.yScale) !== scaleAsString(yScale);
        var defaultRadiusChanged = this.props.radius !== radius;
        var seriesChanged = _pondjs.TimeSeries.is(this.props.series, series);

        //
        // Currently if the series changes we completely rerender it.
        // If the y axis scale changes then we just update the existing
        // paths using a transition so that we can get smooth axis transitions.
        //

        if (seriesChanged || timeScaleChanged || defaultRadiusChanged) {
            this.renderScatterChart(series, timeScale, yScale, radius);
        } else if (yAxisScaleChanged) {
            this.updateScatterChart(series, timeScale, yScale, radius);
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