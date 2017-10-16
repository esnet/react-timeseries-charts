"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Renders a simple label surrounded by a box within in svg
 *
 *      +----------------+
 *      | My label       |
 *      |                |
 *      +----------------+
 */

/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var Label = function Label(_ref) {
    var label = _ref.label,
        style = _ref.style,
        align = _ref.align,
        width = _ref.width,
        height = _ref.height;

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

    var tstyle = align === "center" ? textStyleCentered : textStyle;
    var posx = align === "center" ? parseInt(width / 2, 10) : 10;

    var text = _react2.default.createElement(
        "text",
        { x: posx, y: 5, dy: "1.2em", style: tstyle },
        label
    );

    var box = _react2.default.createElement("rect", {
        x: 0,
        y: 0,
        style: style,
        width: width,
        height: height
    });

    return _react2.default.createElement("g", null, box, text);
};

Label.defaultProps = {
    align: "center",
    width: 100,
    height: 100,
    pointerEvents: "none",
    style: { fill: "#FEFEFE", stroke: "#DDD", opacity: 0.8 }
};

Label.propTypes = {
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
