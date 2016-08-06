"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders a simple label surrounded by a box within in svg
 *
 *      +----------------+
 *      | My label       |
 *      |                |
 *      +----------------+
 */

exports.default = _react2.default.createClass({

    displayName: "Label",

    getDefaultProps: function getDefaultProps() {
        return {
            align: "center",
            width: 100,
            height: 100,
            pointerEvents: "none",
            style: { fill: "#FEFEFE", stroke: "#DDD", opacity: 0.8 }
        };
    },


    propTypes: {

        align: _react2.default.PropTypes.oneOf(["center", "left"]),

        /**
         * The label to render
         */
        label: _react2.default.PropTypes.string.isRequired,

        /**
         * The width of the rectangle to render into
         */
        width: _react2.default.PropTypes.number,

        /**
         * The height of the rectangle to render into
         */
        height: _react2.default.PropTypes.number
    },

    render: function render() {
        var textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#b0b0b0",
            pointerEvents: "none"
        };

        var textStyleCentered = {
            fontSize: 11,
            textAnchor: "middle",
            fill: "#bdbdbd",
            pointerEvents: "none"
        };

        var style = this.props.align === "center" ? textStyleCentered : textStyle;

        var posx = this.props.align === "center" ? parseInt(this.props.width / 2, 10) : 10;

        var label = _react2.default.createElement(
            "text",
            { x: posx, y: 5, dy: "1.2em", style: style },
            this.props.label
        );

        var box = _react2.default.createElement("rect", {
            style: this.props.style,
            x: 0, y: 0,
            width: this.props.width, height: this.props.height });

        return _react2.default.createElement(
            "g",
            null,
            box,
            label
        );
    }
}); /**
     *  Copyright (c) 2016, The Regents of the University of California,
     *  through Lawrence Berkeley National Laboratory (subject to receipt
     *  of any required approvals from the U.S. Dept. of Energy).
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree.
     */