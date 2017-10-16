"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Format = require("d3-format");

var _ValueList = require("./ValueList");

var _ValueList2 = _interopRequireDefault(_ValueList);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
            "Super expression must either be null or a function, not " + typeof superClass
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
    });
    if (superClass)
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2015-present, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * Renders a 'axis' that display a label for a data channel and a
 * max and average value:
 * ```
 *      +----------------+-----+------- ...
 *      | Traffic        | 120 |
 *      | Max 100 Gbps   |     | Chart  ...
 *      | Avg 26 Gbps    | 0   |
 *      +----------------+-----+------- ...
 * ```
 */
var LabelAxis = (function(_React$Component) {
    _inherits(LabelAxis, _React$Component);

    function LabelAxis() {
        _classCallCheck(this, LabelAxis);

        return _possibleConstructorReturn(
            this,
            (LabelAxis.__proto__ || Object.getPrototypeOf(LabelAxis)).apply(this, arguments)
        );
    }

    _createClass(LabelAxis, [
        {
            key: "renderAxis",
            value: function renderAxis() {
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
                        { x: valXPos, y: 0, dy: "1.2em", style: style },
                        maxStr
                    ),
                    _react2.default.createElement(
                        "text",
                        { x: valXPos, y: this.props.height, style: style },
                        minStr
                    )
                );
            }
        },
        {
            key: "render",
            value: function render() {
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
                    valueList = _react2.default.createElement(_ValueList2.default, {
                        style: { fill: "none", stroke: "none" },
                        values: this.props.values,
                        width: rectWidth
                    });
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
                        style: { fill: "none", stroke: "none" }
                    }),
                    _react2.default.createElement(
                        "text",
                        { x: parseInt(rectWidth / 2, 10), y: labelYPos, style: labelStyle },
                        this.props.label
                    ),
                    _react2.default.createElement(
                        "g",
                        { transform: "translate(0," + (labelYPos + 2) + ")" },
                        valueList
                    ),
                    this.renderAxis()
                );
            }
        }
    ]);

    return LabelAxis;
})(_react2.default.Component);

exports.default = LabelAxis;

LabelAxis.propTypes = {
    /**
    * The label to show as the axis.
    */
    label: _propTypes2.default.string.isRequired,
    /**
    * Show or hide the max/min values that appear alongside the label
    */
    hideScale: _propTypes2.default.bool,
    /**
    * Supply a list of label value pairs to render within the LabelAxis.
    * This expects an array of objects. Each object is of the form:
    *     {label: "Speed", value: "26.2 mph"}.
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
    * Width to provide the values
    */
    valWidth: _propTypes2.default.number,
    /**
    * Max value of the axis scale
    */
    max: _propTypes2.default.number.isRequired,
    /**
    * Min value of the axis scale
    */
    min: _propTypes2.default.number.isRequired,
    /**
    * If values are numbers, use this format string
    */
    format: _propTypes2.default.string,
    /**
    * The width of the axis
    */
    width: _propTypes2.default.number,
    /**
    * The height of the axis
    */
    height: _propTypes2.default.number
};

LabelAxis.defaultProps = {
    hideScale: false,
    values: [],
    valWidth: 40,
    format: ".2f"
};
