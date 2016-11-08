"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _flexboxReact = require("flexbox-react");

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _styler = require("../js/styler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultStyle = {
    symbol: {
        normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
        selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
        muted: { stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1 }
    },
    label: {
        normal: { fontSize: "normal", color: "#333" },
        highlighted: { fontSize: "normal", color: "#222" },
        selected: { fontSize: "normal", color: "#333" },
        muted: { fontSize: "normal", color: "#333", opacity: 0.4 }
    },
    value: {
        normal: { fontSize: "normal", color: "#333" },
        highlighted: { fontSize: "normal", color: "#222" },
        selected: { fontSize: "normal", color: "#333" },
        muted: { fontSize: "normal", color: "#333", opacity: 0.4 }
    }
};

/**
 * Legends are simple to define.
 *
 * First specify the styles you want each item to have. This is either
 * the CSS that should be appied to rendered symbol. Or you can provide
 * a Styler object. See below for full styling details.
 *
 * ```
 * const style = Styler([
 *     {key: "aud", color: "steelblue", width: 1, dashed: true},
 *     {key: "euro", color: "#F68B24", width: 2}
 * ]);
 * ```
 *
 * Next build a list of categories you want in the legend.
 *
 * ```
 * const categories = [
 *     {key: "aust", label: "AUD", value: "1.52", disabled: true},
 *     {key: "usa", label: "USD", value: "1.43", disabled: false}
 * ];
 * ```
 * For each category to display you must provide a key, a label and
 * if it should be displayed disabled or not.
 *
 * Then render the legend, with type either "line", "swatch" or "dot":
 *
 * ```
 * <Legend type="line" style={style} categories={categories} />
 * ```
 *
 * Optionally you can also display a value below the label. This is
 * useful when hovering over another chart on the page, or to display
 * the current value of live data. You can see this defined in the
 * above categories.
 *
 * The legend can also be supplied with callback functions which will
 * tell you if the user has clicked or hovered over on one of the legend
 * items. You can use this to sync highlighting and selection to a
 * chart.
 *
 * ## Styling
 *
 * There are three methods of styling a legend:
 *  - using a Styler object
 *  - using an object containing inline styles
 *  - using a function which returns an inline style
 *
 * A Styler object can be supplied directly to the `style` prop
 * of the legend. This is the simplest approach, since you can
 * usually just use the same Styler as you use for your chart.
 *
 * Supplying an object to the `style` prop gives you more control
 * than the Styler, since you can provide the actual CSS properties
 * for each element of the legend. The format for the object is:
 *
 * ```
 * {
 *     columnName1: {
            symbol: {
                normal: {...styleSymbol},
                highlighted: {...styleSymbol},
                selected: {...styleSymbol},
                muted: {...styleSymbol}
            },
            label: {
                normal: {...labelStyle},
                highlighted: {...labelStyle},
                selected: {...labelStyle},
                muted: {...labelStyle}
            },
            value: {
                normal: {...valueStyle},
                highlighted: {...valueStyle},
                selected: {...valueStyle},
                muted: {...valueStyle}
            }
 *     },
 *     columnName2 : {
 *         ...
 *     },
 *     ...
 *  }
 *
 *  - symbolStyle is the CSS properties for the symbol, which
 * is either a swatch, dot or line. For a line, you'd want to
 * provide the SVG <line> properties, for a swatch you'd provide
 * the SVG <rect> properties and for a dot the <ellipse> properties.
 *  - labelStyle is the main label for the legend item. It is a
 *  SVG <text> element, so you can control the font properties.
 *  - valueStyle is the optional value. As with the labelStyle you
 *  this is an SVG <text> element.
 *
 * Finally, you can provide a function to the `style` prop. This
 * is similar to providing an object, except your function will
 * be called with the columnName and you should return the map
 * containing symbol, label and value styles.
 */
/**
 *  Copyright (c) 2015-2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
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

        style: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.func, _react2.default.PropTypes.instanceOf(_styler.Styler)]).isRequired,

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

    handleClick: function handleClick(e, key) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(key);
        }
    },
    handleHover: function handleHover(e, key) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(key);
        }
    },
    handleHoverLeave: function handleHoverLeave() {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    },
    renderLine: function renderLine(style) {
        var _props = this.props,
            width = _props.width,
            height = _props.height;

        return _react2.default.createElement(
            "svg",
            { style: { float: "left" }, height: height, width: width },
            _react2.default.createElement("line", {
                style: style,
                x1: 0, y1: parseInt(width / 2, 10),
                x2: width, y2: parseInt(width / 2, 10),
                stroke: "black",
                strokeWidth: "2" })
        );
    },
    renderSwatch: function renderSwatch(style) {
        var _props2 = this.props,
            width = _props2.width,
            height = _props2.height;

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
        var _props3 = this.props,
            width = _props3.width,
            height = _props3.height;

        return _react2.default.createElement(
            "svg",
            { style: { float: "left" }, height: height, width: width },
            _react2.default.createElement("ellipse", {
                style: style,
                cx: parseInt(width / 2, 10) + 2, cy: parseInt(height / 2, 10) + 1,
                rx: parseInt(width / 2, 10) - 2, ry: parseInt(height / 2, 10) - 2 })
        );
    },
    providedStyle: function providedStyle(category) {
        var style = {};
        if (this.props.style) {
            if (this.props.style instanceof _styler.Styler) {
                style = this.props.style.legendStyle(category.key, this.props.type);
            } else if (_underscore2.default.isObject(this.props.style)) {
                style = this.props.style[category.key];
            } else if (_underscore2.default.isFunction(this.props.style)) {
                style = this.props.style(category.key);
            }
        }
        return style;
    },
    styleMode: function styleMode(category) {
        var isHighlighted = this.props.highlight && category.key === this.props.highlight;
        var isSelected = this.props.selection && category.key === this.props.selection;
        var isDisabled = category.disabled;

        var mode = "normal";
        if (this.props.selection) {
            if (isSelected) {
                mode = "selected";
            } else if (isHighlighted) {
                mode = "highlighted";
            } else {
                mode = "muted";
            }
        } else if (isHighlighted) {
            mode = "highlighted";
        } else if (isDisabled) {
            mode = "muted";
        }
        return mode;
    },
    symbolStyle: function symbolStyle(category) {
        var styleMap = this.providedStyle(category, this.props.type);
        var styleMode = this.styleMode(category);
        return (0, _merge2.default)(true, defaultStyle[styleMode], styleMap.symbol[styleMode] ? styleMap.symbol[styleMode] : {});
    },
    labelStyle: function labelStyle(category) {
        var styleMap = this.providedStyle(category);
        var styleMode = this.styleMode(category);
        return (0, _merge2.default)(true, defaultStyle[styleMode], styleMap.label[styleMode] ? styleMap.label[styleMode] : {});
    },
    valueStyle: function valueStyle(category) {
        var styleMap = this.providedStyle(category);
        var styleMode = this.styleMode(category);
        return (0, _merge2.default)(true, defaultStyle[styleMode], styleMap.value[styleMode] ? styleMap.value[styleMode] : {});
    },
    render: function render() {
        var _this = this;

        var items = this.props.categories.map(function (category) {
            var symbolStyle = _this.symbolStyle(category);
            var labelStyle = _this.labelStyle(category);
            var valueStyle = _this.valueStyle(category);

            var symbol = void 0;
            if (_this.props.type === "swatch") {
                symbol = _this.renderSwatch(symbolStyle);
            } else if (_this.props.type === "line") {
                symbol = _this.renderLine(symbolStyle);
            } else if (_this.props.type === "dot") {
                symbol = _this.renderDot(symbolStyle);
            }

            return _react2.default.createElement(
                _flexboxReact.Flexbox,
                { flexDirection: "column",
                    key: category.key },
                _react2.default.createElement(
                    "div",
                    {
                        onClick: function onClick(e) {
                            return _this.handleClick(e, category.key);
                        },
                        onMouseMove: function onMouseMove(e) {
                            return _this.handleHover(e, category.key);
                        },
                        onMouseLeave: _this.handleHoverLeave },
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
});