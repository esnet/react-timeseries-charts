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

var _pondjs = require("pondjs");

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

exports["default"] = _react2["default"].createClass({

    displayName: "Brush",

    handleBrushed: function handleBrushed(brush) {
        var extent = brush.extent();
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(new _pondjs.TimeRange(extent[0], extent[1]));
        }
    },

    renderBrush: function renderBrush(timeScale, timeRange) {
        var _this = this;

        if (!this.brush) {
            this.brush = _d32["default"].svg.brush().x(timeScale).on("brush", function () {
                _this.handleBrushed(_this.brush);
            });
            this.brush.extent([timeRange.begin(), timeRange.end()]);
        } else {
            var currentExtent = this.brush.extent();
            var currentBegin = currentExtent[0];
            var currentEnd = currentExtent[1];

            // Break feedback cycles
            if (currentBegin.getTime() !== timeRange.begin().getTime() || currentEnd.getTime() !== timeRange.end().getTime()) {
                this.brush.extent([timeRange.begin(), timeRange.end()]);
            } else {
                return;
            }
        }
        _d32["default"].select(_reactDom2["default"].findDOMNode(this)).selectAll("*").remove();

        _d32["default"].select(_reactDom2["default"].findDOMNode(this)).append("g").attr("class", "x brush").call(this.brush).selectAll("rect").attr("y", -6).attr("height", this.props.height + 7);
    },

    componentDidMount: function componentDidMount() {
        this.renderBrush(this.props.timeScale, this.props.timeRange);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var timeScale = nextProps.timeScale;
        var timeRange = nextProps.timeRange;
        if (scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) || this.props.timeRange !== timeRange) {
            this.renderBrush(timeScale, timeRange);
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