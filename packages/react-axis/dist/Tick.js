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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Tick = (function (_super) {
    __extends(Tick, _super);
    function Tick(props) {
        return _super.call(this, props) || this;
    }
    Tick.prototype.renderLabel = function (label, isTop, tickSize) {
        var labelAlign = this.props.labelAlign;
        var textStyle = {
            fontSize: 11,
            textAnchor: "start",
            fill: "#b0b0b0",
            pointerEvents: "none"
        };
        var baseLine = isTop ? "baseline" : "hanging";
        if (labelAlign === "adjacent") {
            var x = 2;
            var y = isTop ? -6 : 6;
            return (React.createElement("text", { key: "label-" + label, className: "tick-label", style: textStyle, textAnchor: "start", x: x, y: y, alignmentBaseline: baseLine }, label));
        }
        else if (labelAlign === "center") {
            var x = 0;
            var y = isTop ? -tickSize - 3 : tickSize + 3;
            return (React.createElement("text", { key: "label-" + label, className: "tick-label", style: textStyle, textAnchor: "middle", x: x, y: y, alignmentBaseline: baseLine }, label));
        }
    };
    Tick.prototype.renderVerticalTick = function (id, label, labelPosition, size, extend, isTop) {
        var dir = isTop ? -1 : 1;
        var line = {
            x1: 0,
            y1: -dir * extend,
            x2: 0,
            y2: dir * size
        };
        var tickTransitionStyle = {
            transition: "transform 100ms"
        };
        var style = { stroke: "#AAA", strokeWidth: 1 };
        var groupKey = "grp-" + id + "}";
        var tickKey = "tick-" + id;
        return (React.createElement("g", { style: tickTransitionStyle, key: groupKey },
            React.createElement("line", __assign({ key: tickKey, className: "tick-line", style: style }, line)),
            this.renderLabel(label, isTop, size)));
    };
    Tick.prototype.renderHorizontalTick = function (id, label, labelPosition, size, extend, isLeft) {
        var dir = isLeft ? -1 : 1;
        var line = {
            x1: -dir * extend,
            y1: 0,
            x2: dir * size,
            y2: 0
        };
        var textStyle = {
            fontSize: 11,
            textAnchor: "start",
            fill: "#b0b0b0",
            pointerEvents: "none"
        };
        var style = { stroke: "#AAA", strokeWidth: 1 };
        var groupKey = "grp-" + id + "}";
        var tickKey = "tick-" + id;
        var tickTransitionStyle = {
            transition: "transform 100ms"
        };
        return (React.createElement("g", { style: tickTransitionStyle, key: groupKey },
            React.createElement("line", __assign({ key: tickKey, className: "tick-line", style: style }, line)),
            React.createElement("text", { key: "label-" + label, className: "tick-label", style: textStyle, textAnchor: isLeft ? "end" : "begin", alignmentBaseline: "middle", x: isLeft ? -size - 3 : size + 3, y: 0 }, label)));
    };
    Tick.prototype.render = function () {
        var _a = this.props, id = _a.id, label = _a.label, width = _a.width, height = _a.height, position = _a.position, _b = _a.size, size = _b === void 0 ? 10 : _b, _c = _a.extend, extend = _c === void 0 ? 0 : _c, _d = _a.align, align = _d === void 0 ? "top" : _d, _e = _a.smoothTransition, smoothTransition = _e === void 0 ? false : _e;
        var shouldTransition = false;
        var transition = "transform 100ms";
        if (align === "top" || align === "bottom") {
            var transform = "translate(" + position + "px, " + (align === "top" ? height : 0) + "px)";
            return (React.createElement("g", { style: smoothTransition ? { transform: transform, transition: transition } : { transform: transform } }, this.renderVerticalTick(id, label, position, size, extend, align === "top")));
        }
        else {
            var transform = "translate(" + (align === "left" ? width : 0) + "px," + position + "px)";
            return (React.createElement("g", { style: smoothTransition ? { transform: transform, transition: transition } : { transform: transform } }, this.renderHorizontalTick(id, label, position, size, extend, align === "left")));
        }
    };
    Tick.defaultProps = {
        position: 0,
        size: 15,
        align: "bottom",
        labelAlign: "adjacent",
        tickSize: 15,
        tickExtend: 0,
        extend: 0,
        smoothTransition: true
    };
    return Tick;
}(React.Component));
exports.Tick = Tick;
//# sourceMappingURL=Tick.js.map