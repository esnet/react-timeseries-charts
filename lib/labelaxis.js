"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
 */
exports.default = _react2.default.createClass({

    displayName: "LabelAxis",

    propTypes: {

        /**
         * The label to show as the axis.
         */
        label: _react2.default.PropTypes.string.isRequired,

        /**
         * Show or hide the max/min values that appear alongside the label
         */
        hideScale: _react2.default.PropTypes.boolean,

        /**
         * Supply a list of label value pairs to render within the LabelAxis.
         * This expects an array of objects. Each object is of the form:
         *     {label: "Speed", value: "26.2 mph"}.
         */
        values: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
            label: _react2.default.PropTypes.string,
            value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string])
        })),

        /**
         * Width to provide the values
         */
        valWidth: _react2.default.PropTypes.number,

        /**
         * Max value of the axis scale
         */
        max: _react2.default.PropTypes.number.isRequired,

        /**
         * Min value of the axis scale
         */
        min: _react2.default.PropTypes.number.isRequired,

        /**
         * If values are numbers, use this format string
         */
        format: _react2.default.PropTypes.string,

        /**
         * The width of the axis
         */
        width: _react2.default.PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
        return {
            hideScale: false,
            values: [],
            valWidth: 40,
            format: ".2f"
        };
    },
    renderAxis: function renderAxis() {
        var valueWidth = this.props.valWidth;
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
        var fmt = this.props.format;
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
        var valueWidth = this.props.valWidth;
        var rectWidth = this.props.width - valueWidth;

        var labelStyle = {
            fontSize: 12,
            textAnchor: "middle",
            fill: "#838383"
        };

        var valueList = null;
        var labelYPos = void 0;
        if (this.props.values) {
            labelYPos = Math.max(parseInt(this.props.height / 4, 10), 10);
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
}); /**
     *  Copyright (c) 2015, The Regents of the University of California,
     *  through Lawrence Berkeley National Laboratory (subject to receipt
     *  of any required approvals from the U.S. Dept. of Energy).
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree.
     */