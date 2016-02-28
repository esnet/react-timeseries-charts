"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Legends are simple to define. First define the items you want in
 * it using an array as follows:
 *
 * ```
 * const categories = [
 *     {key: "aust", label: "AUD", disabled={true} style: {backgroundColor: "#1f77b4"}},
 *     {key: "usa", label: "USD", disabled={false} style: {backgroundColor: "#aec7e8"}}
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
 * if it should be displayed disabled or not. You may also provide a
 * style which will be merged in with the base style for that type and
 * a disabled boolean if it should be rendered with a disabled appearance.
 *
 * The legend can also be supplied with a callback function which will
 * tell you if the user has clicked on one of the legend items to
 * enable/disable that item. The callback will be called with the key and
 * the new enabled/disabled state. You can use this to hide or show the series
 * on the chart, for example. Note that you'll want to pass the state back
 * into the legend as that category's disabled value.
 */
exports.default = _react2.default.createClass({

    displayName: "Legend",

    getDefaultProps: function getDefaultProps() {
        return {
            style: {},
            labelStyle: {},
            type: "swatch" // or "line" or "dot"
        };
    },


    propTypes: {

        /**
         * The overall style of the legend items, either a color "swatch", a
         * colored "line", or a "dot".
         */
        type: _react2.default.PropTypes.oneOf(["swatch", "line", "dot"]),

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
    render: function render() {
        var _this = this;

        var legendStyle = {
            listStyle: "none",
            paddingLeft: 0,
            cursor: "pointer"
        };

        var legendListStyle = {
            float: "left",
            marginRight: 10
        };

        var swatchStyle = {
            float: "left",
            width: 15,
            height: 15,
            margin: 2,
            borderRadius: 2,
            backgroundColor: "#EFEFEF"
        };

        var lineStyle = {
            float: "left",
            width: 15,
            height: 3,
            margin: 2,
            marginTop: 8,
            backgroundColor: "#EFEFEF"
        };

        var dotStyle = {
            float: "left",
            width: 8,
            height: 8,
            margin: 2,
            marginTop: 6,
            borderRadius: 4,
            backgroundColor: "#EFEFEF"
        };

        var baseLabelStyle = {};

        var items = [];
        _underscore2.default.each(this.props.categories, function (category) {
            var style = undefined;
            var categoryStyle = category.style || {};
            var categoryLabelStyle = category.labelStyle || {};
            var disabled = category.disabled || false;
            if (_this.props.type === "swatch") {
                style = disabled ? swatchStyle : (0, _merge2.default)(true, swatchStyle, categoryStyle);
            } else if (_this.props.type === "line") {
                style = disabled ? lineStyle : (0, _merge2.default)(true, lineStyle, categoryStyle);
            } else if (_this.props.type === "dot") {
                style = disabled ? dotStyle : (0, _merge2.default)(true, dotStyle, categoryStyle);
            }

            var labelStyle = (0, _merge2.default)(true, baseLabelStyle, categoryLabelStyle);

            items.push(_react2.default.createElement(
                "li",
                {
                    key: "legend-item-" + category.key,
                    style: legendListStyle,
                    onClick: function onClick() {
                        return _this.handleClick(category.key, !disabled);
                    } },
                _react2.default.createElement("span", { style: style }),
                _react2.default.createElement(
                    "span",
                    { style: labelStyle },
                    " ",
                    category.label,
                    " "
                )
            ));
        });

        return _react2.default.createElement(
            "ul",
            { style: legendStyle },
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