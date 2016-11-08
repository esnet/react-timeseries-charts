"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _d3Axis = require("d3-axis");

var _d3TimeFormat = require("d3-time-format");

var _d3Time = require("d3-time");

var _d3Selection = require("d3-selection");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

require("moment-duration-format");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
} /**
   *  Copyright (c) 2015, The Regents of the University of California,
   *  through Lawrence Berkeley National Laboratory (subject to receipt
   *  of any required approvals from the U.S. Dept. of Energy).
   *  All rights reserved.
   *
   *  This source code is licensed under the BSD-style license found in the
   *  LICENSE file in the root directory of this source tree.
   */

var defaultStyle = {
    labels: {
        labelColor: "#8B7E7E", // Default label color
        labelWeight: 100,
        labelSize: 11
    },
    axis: {
        axisColor: "#C0C0C0"
    }
};

/**
 * Renders a horizontal time axis. The TimeAxis is generally rendered by
 * the <ChartContainer> so you do not have to create one of these yourself.
 */
exports.default = _react2.default.createClass({

    displayName: "TimeAxis",

    getDefaultProps: function getDefaultProps() {
        return {
            showGrid: false,
            style: defaultStyle
        };
    },
    renderTimeAxis: function renderTimeAxis(scale) {
        var axis = void 0;

        var tickSize = this.props.showGrid ? -this.props.gridHeight : 10;
        var utc = this.props.utc;

        if (this.props.format === "day") {
            axis = (0, _d3Axis.axisBottom)(scale).tickArguments([utc ? _d3Time.utcDay : _d3Time.timeDay, 1]).tickFormat((0, _d3TimeFormat.timeFormat)("%d")).tickSizeOuter(0);
        } else if (this.props.format === "month") {
            axis = (0, _d3Axis.axisBottom)(scale).tickArguments([utc ? _d3Time.utcMonth : _d3Time.timeMonth, 1]).tickFormat((0, _d3TimeFormat.timeFormat)("%B")).tickSizeOuter(0);
        } else if (this.props.format === "year") {
            axis = (0, _d3Axis.axisBottom)(scale).tickArguments([utc ? _d3Time.utcYear : _d3Time.timeYear, 1]).tickFormat((0, _d3TimeFormat.timeFormat)("%Y")).tickSizeOuter(0);
        } else if (this.props.format === "relative") {
            axis = (0, _d3Axis.axisBottom)(scale).tickFormat(function (d) {
                return _moment2.default.duration(+d).format();
            }).tickSizeOuter(0);
        } else {
            axis = (0, _d3Axis.axisBottom)(scale).tickSize(0);
        }

        // Style

        var labelStyle = (0, _merge2.default)(true, defaultStyle.labels, this.props.style.labels ? this.props.style.labels : {});
        var axisStyle = (0, _merge2.default)(true, defaultStyle.axis, this.props.style.axis ? this.props.style.axis : {});
        var axisColor = axisStyle.axisColor;
        var labelColor = labelStyle.labelColor,
            labelWeight = labelStyle.labelWeight,
            labelSize = labelStyle.labelSize;

        // Remove the old axis from under this DOM node

        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).selectAll("*").remove();

        // Draw the new axis
        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).append("g").attr("class", "x axis").style("stroke", "none").style("fill", labelColor).style("font-weight", labelWeight).style("font-size", labelSize).call(axis.tickSize(tickSize));

        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").selectAll(".tick").select("text").style("fill", labelColor).style("stroke", "none");

        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").selectAll(".tick").select("line").style("stroke", axisColor);

        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").select("path").remove();
    },
    componentDidMount: function componentDidMount() {
        this.renderTimeAxis(this.props.scale);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var scale = nextProps.scale,
            utc = nextProps.utc;

        if (scaleAsString(this.props.scale) !== scaleAsString(scale) || this.props.utc !== utc) {
            this.renderTimeAxis(scale);
        }
    },
    shouldComponentUpdate: function shouldComponentUpdate() {
        return false;
    },
    render: function render() {
        return _react2.default.createElement("g", null);
    }
});