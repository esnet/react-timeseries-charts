"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var flexbox_react_1 = require("flexbox-react");
var LegendItemType;
(function (LegendItemType) {
    LegendItemType["Swatch"] = "SWATCH";
    LegendItemType["Line"] = "LINE";
    LegendItemType["Dot"] = "DOT";
})(LegendItemType = exports.LegendItemType || (exports.LegendItemType = {}));
var LegendItem = (function (_super) {
    tslib_1.__extends(LegendItem, _super);
    function LegendItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LegendItem.prototype.handleClick = function (e, key) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(key);
        }
    };
    LegendItem.prototype.handleHover = function (e, key) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(key);
        }
    };
    LegendItem.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    LegendItem.prototype.renderLine = function (style) {
        var _a = this.props, symbolWidth = _a.symbolWidth, symbolHeight = _a.symbolHeight;
        return (React.createElement("svg", { style: { float: "left" }, width: symbolWidth, height: symbolHeight },
            React.createElement("line", { style: style, x1: 0, y1: Math.round(symbolWidth / 2), x2: symbolWidth, y2: Math.round(symbolWidth / 2), stroke: "black", strokeWidth: "2" })));
    };
    LegendItem.prototype.renderSwatch = function (style) {
        var _a = this.props, symbolWidth = _a.symbolWidth, symbolHeight = _a.symbolHeight;
        return (React.createElement("svg", { style: { float: "left" }, width: symbolWidth, height: symbolHeight },
            React.createElement("rect", { style: style, x: 2, y: 2, width: symbolWidth - 4, height: symbolHeight - 4, rx: 2, ry: 2 })));
    };
    LegendItem.prototype.renderDot = function (style) {
        var _a = this.props, symbolWidth = _a.symbolWidth, symbolHeight = _a.symbolHeight;
        return (React.createElement("svg", { style: { float: "left" }, width: symbolWidth, height: symbolHeight },
            React.createElement("ellipse", { style: style, cx: Math.round(symbolWidth / 2) + 2, cy: Math.round(symbolHeight / 2) + 1, rx: Math.round(symbolWidth / 2) - 2, ry: Math.round(symbolHeight / 2) - 2 })));
    };
    LegendItem.prototype.render = function () {
        var _this = this;
        var _a = this.props, symbolStyle = _a.symbolStyle, labelStyle = _a.labelStyle, valueStyle = _a.valueStyle, itemKey = _a.itemKey;
        var symbol;
        switch (this.props.type.toUpperCase()) {
            case LegendItemType.Swatch:
                symbol = this.renderSwatch(symbolStyle);
                break;
            case LegendItemType.Line:
                symbol = this.renderLine(symbolStyle);
                break;
            case LegendItemType.Dot:
                symbol = this.renderDot(symbolStyle);
                break;
            default:
        }
        return (React.createElement(flexbox_react_1.default, { flexDirection: "column", key: itemKey },
            React.createElement("div", { onClick: function (e) { return _this.handleClick(e, itemKey); }, onMouseMove: function (e) { return _this.handleHover(e, itemKey); }, onMouseLeave: function () { return _this.handleHoverLeave(); } },
                React.createElement(flexbox_react_1.default, { flexDirection: "row" },
                    React.createElement(flexbox_react_1.default, { width: "20px" }, symbol),
                    React.createElement(flexbox_react_1.default, { flexDirection: "column" },
                        React.createElement(flexbox_react_1.default, null,
                            React.createElement("div", { style: labelStyle }, this.props.label)),
                        React.createElement(flexbox_react_1.default, null,
                            React.createElement("div", { style: valueStyle }, this.props.value)))))));
    };
    return LegendItem;
}(React.Component));
exports.LegendItem = LegendItem;
//# sourceMappingURL=LegendItem.js.map