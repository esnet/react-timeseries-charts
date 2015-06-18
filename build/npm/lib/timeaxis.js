/*
 * ESnet React Charts, Copyright (c) 2014, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
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

        if (this.props.dayFormat === true) {
            axis = _d32["default"].svg.axis().scale(scale).orient("bottom").ticks(_d32["default"].time.days, 1).tickFormat(_d32["default"].time.format("%d"));
        } else if (this.props.monthFormat === true) {
            axis = _d32["default"].svg.axis().scale(scale).orient("bottom").ticks(_d32["default"].time.months, 1).tickFormat(_d32["default"].time.format("%B"));
        } else {
            axis = _d32["default"].svg.axis().scale(scale).orient("bottom");
        }

        //Remove the old axis from under this DOM node
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