var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as _ from "lodash";
import * as React from "react";
import Flexbox from "flexbox-react";
import { LegendItem, LegendItemType } from "./LegendItem";
import { Styler } from "./styler";
import { defaultLegendCategoryStyle as defaultStyle } from "./style";
var Legend = (function (_super) {
    __extends(Legend, _super);
    function Legend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Legend.prototype.providedStyle = function (category, type) {
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
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
        return _.merge(defaultStyle[styleMode], styleMap.symbol[styleMode] ? styleMap.symbol[styleMode] : {});
    };
    Legend.prototype.labelStyle = function (category) {
        var styleMap = this.providedStyle(category, this.props.type);
        var styleMode = this.styleMode(category);
        return _.merge(defaultStyle[styleMode], styleMap.label[styleMode] ? styleMap.label[styleMode] : {});
    };
    Legend.prototype.valueStyle = function (category) {
        var styleMap = this.providedStyle(category, this.props.type);
        var styleMode = this.styleMode(category);
        return _.merge(defaultStyle[styleMode], styleMap.value[styleMode] ? styleMap.value[styleMode] : {});
    };
    Legend.prototype.render = function () {
        var _this = this;
        var _a = this.props, type = _a.type, symbolWidth = _a.symbolWidth, symbolHeight = _a.symbolHeight;
        var items = this.props.categories.map(function (category) {
            var key = category.key, label = category.label, value = category.value;
            var symbolStyle = _this.symbolStyle(category);
            var labelStyle = _this.labelStyle(category);
            var valueStyle = _this.valueStyle(category);
            return (React.createElement(LegendItem, { key: key, type: type, itemKey: key, label: label, value: value, symbolWidth: symbolWidth, symbolHeight: symbolHeight, symbolStyle: symbolStyle, labelStyle: labelStyle, valueStyle: valueStyle, onSelectionChange: _this.props.onSelectionChange, onHighlightChange: _this.props.onHighlightChange }));
        });
        var align = this.props.align === "left" ? "flex-start" : "flex-end";
        return React.createElement(Flexbox, { justifyContent: align }, items);
    };
    Legend.defaultProps = {
        style: {},
        type: LegendItemType.Swatch,
        align: "left",
        symbolWidth: 16,
        symbolHeight: 16
    };
    return Legend;
}(React.Component));
export { Legend };
//# sourceMappingURL=Legend.js.map