"use strict";
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var React = require("react");
var style_1 = require("./style");
var Label = (function (_super) {
    __extends(Label, _super);
    function Label() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Label.prototype.render = function () {
        var _a = this.props, label = _a.label, style = _a.style, align = _a.align, width = _a.width, height = _a.height;
        var textStyle = __assign({}, style.text, { textAnchor: "left", pointerEvents: "none" });
        var textStyleCentered = __assign({}, style.text, { textAnchor: "middle", pointerEvents: "none" });
        var labelStyle = align === "center" ? textStyleCentered : textStyle;
        var boxStyle = style.box;
        var posx = align === "center" ? Math.round(width / 2) : 10;
        var text = (React.createElement("text", { x: posx, y: 5, dy: "1.2em", style: labelStyle }, label));
        var box = React.createElement("rect", { x: 0, y: 0, style: boxStyle, width: width, height: height });
        return (React.createElement("g", null,
            box,
            text));
    };
    Label.defaultProps = {
        align: "center",
        width: 100,
        height: 100,
        style: style_1.defaultInfoBoxStyle
    };
    return Label;
}(React.Component));
exports.Label = Label;
var ValueList = (function (_super) {
    __extends(ValueList, _super);
    function ValueList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValueList.prototype.render = function () {
        var _this = this;
        var _a = this.props, align = _a.align, style = _a.style, width = _a.width, height = _a.height;
        var textStyle = __assign({}, style.text, { textAnchor: "left", pointerEvents: "none" });
        var textStyleCentered = __assign({}, style.text, { textAnchor: "middle", pointerEvents: "none" });
        var values = this.props.values.map(function (item, i) {
            if (align === "left") {
                return (React.createElement("g", { key: i },
                    React.createElement("text", { x: 10, y: 5, dy: (i + 1) * 1.2 + "em", style: textStyle },
                        React.createElement("tspan", { style: { fontWeight: 700 } }, item.label + ": "),
                        React.createElement("tspan", null, "" + item.value))));
            }
            var posx = Math.round(_this.props.width / 2);
            return (React.createElement("g", { key: i },
                React.createElement("text", { x: posx, y: 5, dy: (i + 1) * 1.2 + "em", style: textStyleCentered },
                    React.createElement("tspan", { style: { fontWeight: 700 } }, item.label + ": "),
                    React.createElement("tspan", null, "" + item.value))));
        });
        var box = React.createElement("rect", { style: style.box, x: 0, y: 0, width: width, height: height });
        return (React.createElement("g", null,
            box,
            values));
    };
    ValueList.defaultProps = {
        align: "center",
        width: 100,
        height: 100,
        style: style_1.defaultInfoBoxStyle
    };
    return ValueList;
}(React.Component));
exports.ValueList = ValueList;
var InfoBox = (function (_super) {
    __extends(InfoBox, _super);
    function InfoBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InfoBox.prototype.render = function () {
        var _a = this.props, info = _a.info, props = __rest(_a, ["info"]);
        if (_.isString(info)) {
            return React.createElement(Label, __assign({ label: info }, props));
        }
        else {
            return React.createElement(ValueList, __assign({ values: info }, props));
        }
    };
    InfoBox.defaultProps = {
        align: "center",
        width: 150,
        height: 100,
        style: style_1.defaultInfoBoxStyle
    };
    return InfoBox;
}(React.Component));
exports.InfoBox = InfoBox;
//# sourceMappingURL=info.js.map