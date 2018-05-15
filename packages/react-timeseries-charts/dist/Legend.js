"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var React = require("react");
var flexbox_react_1 = require("flexbox-react");
var LegendItem_1 = require("./LegendItem");
var styler_1 = require("./styler");
var style_1 = require("./style");
var Legend = (function (_super) {
    tslib_1.__extends(Legend, _super);
    function Legend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Legend.prototype.providedStyle = function (category, type) {
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                return this.props.style.legendStyle(category.key, type);
            }
            else if (_.isObject(this.props.style)) {
                var s = this.props.style;
                return s[category.key];
            }
            else {
                var fn = this.props.style;
                return fn(category.key);
            }
        }
    };
    Legend.prototype.styleMode = function (category) {
        var isHighlighted = this.props.highlight && category.key === this.props.highlight;
        var isSelected = this.props.selection && category.key === this.props.selection;
        var isDisabled = category.disabled;
        var mode = "normal";
        if (this.props.selection) {
            if (isSelected) {
                mode = "selected";
            }
            else if (isHighlighted) {
                mode = "highlighted";
            }
            else {
                mode = "muted";
            }
        }
        else if (isHighlighted) {
            mode = "highlighted";
        }
        else if (isDisabled) {
            mode = "muted";
        }
        return mode;
    };
    Legend.prototype.symbolStyle = function (category) {
        var styleMap = this.providedStyle(category, this.props.type);
        var styleMode = this.styleMode(category);
        return _.merge(style_1.defaultLegendCategoryStyle[styleMode], styleMap.symbol[styleMode] ? styleMap.symbol[styleMode] : {});
    };
    Legend.prototype.labelStyle = function (category) {
        var styleMap = this.providedStyle(category, this.props.type);
        var styleMode = this.styleMode(category);
        return _.merge(style_1.defaultLegendCategoryStyle[styleMode], styleMap.label[styleMode] ? styleMap.label[styleMode] : {});
    };
    Legend.prototype.valueStyle = function (category) {
        var styleMap = this.providedStyle(category, this.props.type);
        var styleMode = this.styleMode(category);
        return _.merge(style_1.defaultLegendCategoryStyle[styleMode], styleMap.value[styleMode] ? styleMap.value[styleMode] : {});
    };
    Legend.prototype.render = function () {
        var _this = this;
        var _a = this.props, type = _a.type, symbolWidth = _a.symbolWidth, symbolHeight = _a.symbolHeight;
        var items = this.props.categories.map(function (category) {
            var key = category.key, label = category.label, value = category.value;
            var symbolStyle = _this.symbolStyle(category);
            var labelStyle = _this.labelStyle(category);
            var valueStyle = _this.valueStyle(category);
            return (React.createElement(LegendItem_1.LegendItem, { key: key, type: type, itemKey: key, label: label, value: value, symbolWidth: symbolWidth, symbolHeight: symbolHeight, symbolStyle: symbolStyle, labelStyle: labelStyle, valueStyle: valueStyle, onSelectionChange: _this.props.onSelectionChange, onHighlightChange: _this.props.onHighlightChange }));
        });
        var align = this.props.align === "left" ? "flex-start" : "flex-end";
        return React.createElement(flexbox_react_1.default, { justifyContent: align }, items);
    };
    Legend.defaultProps = {
        style: {},
        type: LegendItem_1.LegendItemType.Swatch,
        align: "left",
        symbolWidth: 16,
        symbolHeight: 16
    };
    return Legend;
}(React.Component));
exports.Legend = Legend;
//# sourceMappingURL=Legend.js.map