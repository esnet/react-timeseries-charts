"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require("d3");

var _d2 = _interopRequireDefault(_d);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

require("moment-duration-format");

require("./timeaxis.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

/**
 * Renders a horizontal time axis
 */
exports.default = _react2.default.createClass({

    displayName: "TimeAxis",

    renderTimeAxis: function renderTimeAxis(scale) {
        var axis = undefined;

        if (this.props.format === "day") {
            axis = _d2.default.svg.axis().scale(scale).orient("bottom").ticks(_d2.default.time.days, 1).tickFormat(_d2.default.time.format("%d"));
        } else if (this.props.format === "month") {
            axis = _d2.default.svg.axis().scale(scale).orient("bottom").ticks(_d2.default.time.months, 1).tickFormat(_d2.default.time.format("%B"));
        } else if (this.props.format === "year") {
            axis = _d2.default.svg.axis().scale(scale).orient("bottom").ticks(_d2.default.time.years, 1).tickFormat(_d2.default.time.format("%Y"));
        } else if (this.props.format === "relative") {
            axis = _d2.default.svg.axis().scale(scale).orient("bottom").tickFormat(function (d) {
                return _moment2.default.duration(+d).format();
            });
        } else {
            axis = _d2.default.svg.axis().scale(scale).orient("bottom");
        }

        // Remove the old axis from under this DOM node
        _d2.default.select(_reactDom2.default.findDOMNode(this)).selectAll("*").remove();

        var axisGroup = _d2.default.select(_reactDom2.default.findDOMNode(this)).append("g").attr("class", "x axis").call(axis.tickSize(10));

        axisGroup.selectAll("tick").append("line").attr("shape-rendering", "crispEdge").attr("stroke", "#FFF").attr("y1", 0).attr("y2", this.props.height);
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