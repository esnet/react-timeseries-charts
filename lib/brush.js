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

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

exports["default"] = _react2["default"].createClass({

    displayName: "Brush",

    getInitialState: function getInitialState() {
        return {
            d3brush: null
        };
    },

    handleBrushed: function handleBrushed(brush) {
        var extent = brush.extent();
        if (this.props.onBrushed) {
            this.props.onBrushed(brush, extent[0], extent[1]);
        }
    },

    renderBrush: function renderBrush(timeScale, beginTime, endTime) {
        var _this = this;

        var d3brush = this.state.d3brush;

        if (!d3brush) {
            d3brush = _d32["default"].svg.brush().x(timeScale).on("brush", function () {
                _this.handleBrushed(d3brush);
            });
            this.setState({ d3brush: d3brush });
            d3brush.extent([beginTime, endTime]);
        } else {
            var currentExtent = d3brush.extent();
            var curBegin = currentExtent[0];
            var curEnd = currentExtent[1];

            // This check is critical to break feedback cycles that
            // will cause the brush to get very confused.
            if (curBegin.getTime() !== beginTime.getTime() || curEnd.getTime() !== endTime.getTime()) {
                d3brush.extent([beginTime, endTime]);
            } else {
                return;
            }
        }
        _d32["default"].select(this.getDOMNode()).selectAll("*").remove();

        _d32["default"].select(this.getDOMNode()).append("g").attr("class", "x brush").call(d3brush).selectAll("rect").attr("y", -6).attr("height", this.props.height + 7);
    },

    componentDidMount: function componentDidMount() {
        this.renderBrush(this.props.timeScale, this.props.beginTime, this.props.endTime);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var timeScale = nextProps.timeScale;
        var beginTime = nextProps.beginTime;
        var endTime = nextProps.endTime;

        if (scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) || this.props.beginTime.getTime() !== beginTime.getTime() || this.props.endTime.getTime() !== endTime.getTime()) {
            this.renderBrush(timeScale, beginTime, endTime);
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