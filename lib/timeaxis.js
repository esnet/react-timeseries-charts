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

require("./timeaxis.css");

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

/**
 * Renders a horizontal time axis
 */
exports["default"] = _reactAddons2["default"].createClass({

    displayName: "TimeAxis",

    renderTimeAxis: function renderTimeAxis(scale) {
        var axis;

        if (this.props.format === "day") {
            axis = _d32["default"].svg.axis().scale(scale).orient("bottom").ticks(_d32["default"].time.days, 1).tickFormat(_d32["default"].time.format("%d"));
        } else if (this.props.format === "month") {
            axis = _d32["default"].svg.axis().scale(scale).orient("bottom").ticks(_d32["default"].time.months, 1).tickFormat(_d32["default"].time.format("%B"));
        } else if (this.props.format === "year") {
            axis = _d32["default"].svg.axis().scale(scale).orient("bottom").ticks(_d32["default"].time.years, 1).tickFormat(_d32["default"].time.format("%Y"));
        } else {
            axis = _d32["default"].svg.axis().scale(scale).orient("bottom");
        }

        // Remove the old axis from under this DOM node
        _d32["default"].select(this.getDOMNode()).selectAll("*").remove();

        var axisGroup = _d32["default"].select(this.getDOMNode()).append("g").attr("class", "x axis").call(axis.tickSize(10));

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
        return _reactAddons2["default"].createElement("g", null);
    }

});
module.exports = exports["default"];