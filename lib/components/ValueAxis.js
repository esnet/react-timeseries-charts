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
 * Renders a 'axis' that display a label for a current tracker value:
 * ```
 *      ----+----------------+
 *          |     56.2G      |
 *          |      bps       |
 *          |                |
 *      ----+----------------+
 * ```
 * This would be used when you have many rows of data and the user is required
 * to interact with the data to see actual values. You would use this at the
 * end of the row and supply it with the current value. See the cycling example
 * for how that would all work.
 */
/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var ValueAxis = function ValueAxis(_ref) {
    var width = _ref.width,
        height = _ref.height,
        value = _ref.value,
        detail = _ref.detail;

    var labelStyle = {
        fill: "#666",
        fontSize: 20,
        textAnchor: "middle"
    };
    var detailStyle = {
        fontSize: 12,
        textAnchor: "middle",
        fill: "#9a9a9a"
    };
    return _react2.default.createElement(
        "g",
        null,
        _react2.default.createElement("rect", {
            key: "background",
            x: "0",
            y: "0",
            width: width,
            height: height,
            style: { fill: "none", stroke: "none" }
        }),
        _react2.default.createElement(
            "text",
            { key: "value", x: parseInt(width / 2, 10), y: height / 2, style: labelStyle },
            value
        ),
        _react2.default.createElement(
            "text",
            {
                key: "detail",
                x: parseInt(width / 2, 10),
                y: height / 2,
                dy: "1.2em",
                style: detailStyle
            },
            detail
        )
    );
};

ValueAxis.propTypes = {
    /**
     * Show or hide this
     */
    visible: _propTypes2.default.bool,

    /**
     * If values are numbers, use this format string
     */
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),

    /**
     * Use this to show what units are being used. It will appear below
     * the value.
     */
    detail: _propTypes2.default.string,

    /**
     * The width of the axis
     */
    width: _propTypes2.default.number,

    /**
     * [Internal] The height of the axis
     */
    height: _propTypes2.default.number
};

ValueAxis.defaultProps = {
    visible: true
};

exports.default = ValueAxis;
