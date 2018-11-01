"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var defaultBoxStyle = {
    fill: "#FEFEFE",
    stroke: "#DDD",
    opacity: 0.8
};
/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var defaultTextStyle = {
    fontSize: 11,
    textAnchor: "left",
    fill: "#b0b0b0",
    pointerEvents: "none"
};

var defaultTextStyleCentered = {
    fontSize: 11,
    textAnchor: "middle",
    fill: "#bdbdbd",
    pointerEvents: "none"
};

function mergeStyles(style, isCentered) {
    return {
        boxStyle: (0, _merge2.default)(true, defaultBoxStyle, style.box ? style.box : {}),
        labelStyle: (0, _merge2.default)(
            true,
            isCentered ? defaultTextStyleCentered : defaultTextStyle,
            style.label ? style.label : {}
        )
    };
}

/**
 * Renders a simple label surrounded by a box within in svg
 *
 *      +----------------+
 *      | My label       |
 *      |                |
 *      +----------------+
 */

var Label = function Label(_ref) {
    var label = _ref.label,
        style = _ref.style,
        align = _ref.align,
        width = _ref.width,
        height = _ref.height;

    var _mergeStyles = mergeStyles(style, align === "center"),
        boxStyle = _mergeStyles.boxStyle,
        labelStyle = _mergeStyles.labelStyle;

    var posx = align === "center" ? parseInt(width / 2, 10) : 10;

    var text = _react2.default.createElement(
        "text",
        { x: posx, y: 5, dy: "1.2em", style: labelStyle },
        label
    );

    var box = _react2.default.createElement("rect", {
        x: 0,
        y: 0,
        style: boxStyle,
        width: width,
        height: height
    });

    return _react2.default.createElement("g", null, box, text);
};

Label.defaultProps = {
    align: "center",
    width: 100,
    height: 100,
    pointerEvents: "none"
};

Label.propTypes = {
    /**
     * Where to position the label, either "left" or "center" within the box
     */
    align: _propTypes2.default.oneOf(["center", "left"]),

    /**
     * The label to render
     */
    label: _propTypes2.default.string.isRequired,

    /**
     * The style of the label. This is the inline CSS applied directly
     * to the label box
     */
    style: _propTypes2.default.object, // eslint-disable-line

    /**
     * The width of the rectangle to render into
     */
    width: _propTypes2.default.number,

    /**
     * The height of the rectangle to render into
     */
    height: _propTypes2.default.number
};

exports.default = Label;
