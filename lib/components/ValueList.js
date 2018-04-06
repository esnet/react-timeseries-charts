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
 * Renders a list of values in svg
 *
 *      +----------------+
 *      | Max 100 Gbps   |
 *      | Avg 26 Gbps    |
 *      +----------------+
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

var ValueList = function ValueList(props) {
    var align = props.align,
        style = props.style,
        width = props.width,
        height = props.height;

    if (!props.values.length) {
        return _react2.default.createElement("g", null);
    }

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

    var values = props.values.map(function(item, i) {
        if (align === "left") {
            return _react2.default.createElement(
                "g",
                { key: i },
                _react2.default.createElement(
                    "text",
                    { x: 10, y: 5, dy: (i + 1) * 1.2 + "em", style: textStyle },
                    _react2.default.createElement(
                        "tspan",
                        { style: { fontWeight: 700 } },
                        item.label + ": "
                    ),
                    _react2.default.createElement("tspan", null, "" + item.value)
                )
            );
        }

        var posx = parseInt(props.width / 2, 10);
        return _react2.default.createElement(
            "g",
            { key: i },
            _react2.default.createElement(
                "text",
                { x: posx, y: 5, dy: (i + 1) * 1.2 + "em", style: textStyleCentered },
                _react2.default.createElement(
                    "tspan",
                    { style: { fontWeight: 700 } },
                    item.label + ": "
                ),
                _react2.default.createElement("tspan", null, "" + item.value)
            )
        );
    });

    var box = _react2.default.createElement("rect", {
        style: style,
        x: 0,
        y: 0,
        width: width,
        height: height
    });

    return _react2.default.createElement("g", null, box, values);
};

ValueList.defaultProps = {
    align: "center",
    width: 100,
    height: 100,
    pointerEvents: "none",
    style: { fill: "#FEFEFE", stroke: "#DDD", opacity: 0.8 }
};

ValueList.propTypes = {
    align: _propTypes2.default.oneOf(["center", "left"]),
    /**
     * An array of label value pairs to render
     */
    values: _propTypes2.default.arrayOf(
        _propTypes2.default.shape({
            label: _propTypes2.default.string, // eslint-disable-line
            value: _propTypes2.default.oneOfType([
                // eslint-disable-line
                _propTypes2.default.number,
                _propTypes2.default.string
            ])
        })
    ).isRequired,
    /**
     * CSS object to be applied to the ValueList surrounding box
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

exports.default = ValueList;
