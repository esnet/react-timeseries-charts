"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Format = require("d3-format");

var _valuelist = require("./valuelist");

var _valuelist2 = _interopRequireDefault(_valuelist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders a 'axis' that display a label for a data channel and a
 * max and average value
 *      +----------------+-----+------- ...
 *      | Traffic        | 120 |
 *      | Max 100 Gbps   |     | Chart  ...
 *      | Avg 26 Gbps    | 0   |
 *      +----------------+-----+------- ...
 *
 * EXPERIMENTAL
 *
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

    displayName: "LabelAxis",

    propTypes: {

        values: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
            label: _react2.default.PropTypes.string,
            value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string])
        })).isRequired,

        /**
         * The width of the axis
         */
        width: _react2.default.PropTypes.number
    },

    renderAxis: function renderAxis() {
        var valueWidth = this.props.valWidth ? this.props.valWidth : 40;
        var rectWidth = this.props.width - valueWidth;

        var style = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd"
        };

        if (this.props.hideScale) {
            return _react2.default.createElement("g", null);
        }
        var valXPos = rectWidth + 3; // padding
        var fmt = _underscore2.default.has(this.props, "format") ? this.props.format : ".2f";
        var maxStr = (0, _d3Format.format)(fmt)(this.props.max);
        var minStr = (0, _d3Format.format)(fmt)(this.props.min);

        return _react2.default.createElement(
            "g",
            null,
            _react2.default.createElement(
                "text",
                {
                    x: valXPos,
                    y: 0,
                    dy: "1.2em",
                    style: style },
                maxStr
            ),
            _react2.default.createElement(
                "text",
                {
                    x: valXPos,
                    y: this.props.height,
                    style: style },
                minStr
            )
        );
    },
    render: function render() {
        var valueWidth = this.props.valWidth ? this.props.valWidth : 40;
        var rectWidth = this.props.width - valueWidth;

        var labelStyle = {
            fontSize: 12,
            textAnchor: "middle",
            fill: "#838383"
        };

        var valueList = null;
        var labelYPos = void 0;
        if (this.props.values) {
            labelYPos = parseInt(this.props.height / 4, 10);
            valueList = _react2.default.createElement(_valuelist2.default, {
                style: { fill: "none", stroke: "none" },
                values: this.props.values,
                width: rectWidth });
        } else {
            labelYPos = parseInt(this.props.height / 2, 10);
        }

        return _react2.default.createElement(
            "g",
            null,
            _react2.default.createElement("rect", {
                x: "0",
                y: "0",
                width: rectWidth,
                height: this.props.height,
                style: { fill: "none", stroke: "none" } }),
            _react2.default.createElement(
                "text",
                {
                    x: parseInt(rectWidth / 2, 10),
                    y: labelYPos,
                    style: labelStyle },
                this.props.label
            ),
            _react2.default.createElement(
                "g",
                {
                    transform: "translate(0," + (labelYPos + 2) + ")" },
                valueList
            ),
            this.renderAxis()
        );
    }
});