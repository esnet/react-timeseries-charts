"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d3Axis = require("d3-axis");

var _d3TimeFormat = require("d3-time-format");

var _d3Time = require("d3-time");

var _d3Selection = require("d3-selection");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

require("moment-duration-format");

require("./timeaxis.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

/**
 * Renders a horizontal time axis
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

    displayName: "TimeAxis",

    renderTimeAxis: function renderTimeAxis(scale) {
        var axis = void 0;

        var tickSize = this.props.showGrid ? -this.props.gridHeight : 10;

        if (this.props.format === "day") {
            axis = (0, _d3Axis.axisBottom)(scale).tickArguments([_d3Time.timeDay, 1]).tickFormat((0, _d3TimeFormat.timeFormat)("%d"));
        } else if (this.props.format === "month") {
            axis = (0, _d3Axis.axisBottom)(scale).tickArguments([_d3Time.timeMonth, 1]).tickFormat((0, _d3TimeFormat.timeFormat)("%B"));
        } else if (this.props.format === "year") {
            axis = (0, _d3Axis.axisBottom)(scale).tickArguments([_d3Time.timeYear, 1]).tickFormat((0, _d3TimeFormat.timeFormat)("%Y"));
        } else if (this.props.format === "relative") {
            axis = (0, _d3Axis.axisBottom)(scale).tickFormat(function (d) {
                return _moment2.default.duration(+d).format();
            });
        } else {
            axis = (0, _d3Axis.axisBottom)(scale).tickSize(-100, 0, 0);
        }

        // Remove the old axis from under this DOM node
        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).selectAll("*").remove();

        // Draw the new axis
        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).append("g").attr("class", "x axis").call(axis.tickSize(tickSize));
    },
    componentDidMount: function componentDidMount() {
        this.renderTimeAxis(this.props.scale);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var scale = nextProps.scale;
        if (scaleAsString(this.props.scale) !== scaleAsString(scale)) {
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