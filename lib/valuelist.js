"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders a list of values in svg
 *
 *      +----------------+
 *      | Max 100 Gbps   |
 *      | Avg 26 Gbps    |
 *      +----------------+
 */

exports.default = _react2.default.createClass({

    displayName: "ValueList",

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
         * An array of label value pairs to render
         */
        values: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
            label: _react2.default.PropTypes.string,
            value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string])
        })).isRequired,

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
        var _this = this;

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

        var values = this.props.values.map(function (item, i) {
            if (_this.props.align === "left") {
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
                        _react2.default.createElement(
                            "tspan",
                            null,
                            "" + item.value
                        )
                    )
                );
            } else {
                var posx = parseInt(_this.props.width / 2, 10);
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
                        _react2.default.createElement(
                            "tspan",
                            null,
                            "" + item.value
                        )
                    )
                );
            }
        });

        var box = _react2.default.createElement("rect", {
            style: this.props.style,
            x: 0, y: 0,
            width: this.props.width, height: this.props.height });

        return _react2.default.createElement(
            "g",
            null,
            box,
            values
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