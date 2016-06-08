"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _flexboxReact = require("flexbox-react");

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Legends are simple to define.
 *
 * First specify the styles you want each item to have. This is the CSS that should
 * be appied to rendered symbol.
 *
 * Next build a list of categories you want in it
 *
 * For example:
 *
 * ```
 * const audStyle = {stroke: "#1f77b4"};
 * const usdStyle = {stroke: "#aec7e8"};
 *
 * const categories = [
 *     {key: "aust", label: "AUD", value: "1.52", disabled={true} style: audStyle},
 *     {key: "usa", label: "USD", value: "1.43", disabled={false} style: usdStyle}
 * ];
 * ```
 *
 * Then render the legend as either "line", "swatch" or "dot" style:
 *
 * ```
 * <Legend type="line" categories={categories} onChange={this.handleLegendChange}/>
 * ```
 *
 * For each category to display you must provide a key, a label and
 * if it should be displayed disabled or not. As mentioned above, you also
 * provide a style.
 *
 * Optionally you can also display a value below the label. This is
 * useful when hovering over another chart on the page, or to display
 * the current value of live data.
 *
 * The legend can also be supplied with a callback function which will
 * tell you if the user has clicked on one of the legend items to
 * enable/disable that item. The callback will be called with the key and
 * the new enabled/disabled state. You can use this to hide or show a series
 * on the chart, for example. Note that you'll want to pass the state back
 * into the legend as that category's disabled value.
 */
exports.default = _react2.default.createClass({

    displayName: "Legend",

    getDefaultProps: function getDefaultProps() {
        return {
            style: {},
            labelStyle: {},
            type: "swatch", // or "line" or "dot"
            align: "left",
            width: 16,
            height: 16
        };
    },


    propTypes: {

        /**
         * The overall style of the legend items, either a color "swatch", a
         * colored "line", or a "dot".
         */
        type: _react2.default.PropTypes.oneOf(["swatch", "line", "dot"]),

        /**
         * Alignment of the legend within the available space. Either left or right.
         */
        align: _react2.default.PropTypes.oneOf(["left", "right"]),

        /**
         * The categories array specifies details and style for each item in the legend. For each item:
         *  * "key" - (required) the name by which the legend will be known
         *  * "label" - (required) the displayed label
         *  * "style" - the swatch, dot, or line style. Typically you'd just specify {backgroundColor: "#1f77b4"}
         *  * "labelStyle" - the label style
         *  * "disabled" - a disabled state
         *
         * ```
         * const categories = [
         *    {key: "aust", label: "AUD", disabled: this.state.disabled["aust"], style: {backgroundColor: "#1f77b4"}},
         *    {key: "usa", label: "USD", disabled: this.state.disabled["usa"], style: {backgroundColor: "#aec7e8"}}
         * ];
         * ```
         */
        categories: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
            key: _react2.default.PropTypes.string.isRequired,
            label: _react2.default.PropTypes.string.isRequired,
            disabled: _react2.default.PropTypes.bool,
            style: _react2.default.PropTypes.object,
            labelStyle: _react2.default.PropTypes.object
        })).isRequired,

        /**
         * Callback which will be called when the use enables/disables the legend item
         * by clicking on it. The callback will be called with the key and the new
         * disabled state.
         */
        onChange: _react2.default.PropTypes.func
    },

    handleClick: function handleClick(key, disabled) {
        if (this.props.onChange) {
            this.props.onChange(key, disabled);
        }
    },
    renderLine: function renderLine(style) {
        var _props = this.props;
        var width = _props.width;
        var height = _props.height;

        return _react2.default.createElement(
            "svg",
            { style: { float: "left" }, height: height, width: width },
            _react2.default.createElement("line", {
                style: style,
                x1: 0, y1: parseInt(width / 2),
                x2: width, y2: parseInt(width / 2),
                stroke: "black",
                strokeWidth: "2" })
        );
    },
    renderSwatch: function renderSwatch(style) {
        var _props2 = this.props;
        var width = _props2.width;
        var height = _props2.height;

        return _react2.default.createElement(
            "svg",
            { style: { float: "left" }, height: height, width: width },
            _react2.default.createElement("rect", {
                style: style,
                x: 2, y: 2,
                width: width - 4, height: height - 4,
                rx: 2, ry: 2 })
        );
    },
    renderDot: function renderDot(style) {
        var _props3 = this.props;
        var width = _props3.width;
        var height = _props3.height;

        return _react2.default.createElement(
            "svg",
            { style: { float: "left" }, height: height, width: width },
            _react2.default.createElement("ellipse", {
                style: style,
                cx: parseInt(width / 2) + 2, cy: parseInt(height / 2) + 1,
                rx: parseInt(width / 2) - 2, ry: parseInt(height / 2) - 2 })
        );
    },
    render: function render() {
        var _this = this;

        var baseLabelStyle = {
            paddingRight: 15,
            cursor: this.props.onChange ? "pointer" : "hand"
        };

        var baseValueStyle = {
            fontSize: "1.2rem",
            color: "#999",
            cursor: "pointer"
        };

        var items = this.props.categories.map(function (category) {
            var categoryStyle = (0, _merge2.default)(true, {}, category.style);

            var categoryLabelStyle = category.labelStyle || {};
            var categoryValueStyle = category.valueStyle || {};
            var disabled = category.disabled || false;

            if (disabled) {
                categoryStyle.opacity = 0.25;
            }

            var symbol = void 0;
            if (_this.props.type === "swatch") {
                symbol = _this.renderSwatch(categoryStyle);
            } else if (_this.props.type === "line") {
                symbol = _this.renderLine(categoryStyle);
            } else if (_this.props.type === "dot") {
                symbol = _this.renderDot(categoryStyle);
            }

            var labelStyle = (0, _merge2.default)(true, baseLabelStyle, categoryLabelStyle);
            var valueStyle = (0, _merge2.default)(true, baseValueStyle, categoryValueStyle);

            return _react2.default.createElement(
                _flexboxReact.Flexbox,
                { flexDirection: "column",
                    key: category.key },
                _react2.default.createElement(
                    "div",
                    { onClick: function onClick() {
                            return _this.handleClick(category.key, !disabled);
                        } },
                    _react2.default.createElement(
                        _flexboxReact.Flexbox,
                        { flexDirection: "row" },
                        _react2.default.createElement(
                            _flexboxReact.FlexItem,
                            { width: "20px" },
                            symbol
                        ),
                        _react2.default.createElement(
                            _flexboxReact.Flexbox,
                            { flexDirection: "column" },
                            _react2.default.createElement(
                                _flexboxReact.FlexItem,
                                null,
                                _react2.default.createElement(
                                    "div",
                                    { style: labelStyle },
                                    category.label
                                )
                            ),
                            _react2.default.createElement(
                                _flexboxReact.FlexItem,
                                null,
                                _react2.default.createElement(
                                    "div",
                                    { style: valueStyle },
                                    category.value
                                )
                            )
                        )
                    )
                )
            );
        });

        var align = this.props.align === "left" ? "flex-start" : "flex-end";

        return _react2.default.createElement(
            _flexboxReact.Flexbox,
            { justifyContent: align },
            items
        );
    }
}); /**
     *  Copyright (c) 2015-2016, The Regents of the University of California,
     *  through Lawrence Berkeley National Laboratory (subject to receipt
     *  of any required approvals from the U.S. Dept. of Energy).
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree.
     */