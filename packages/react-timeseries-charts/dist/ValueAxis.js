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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ValueAxis = (function (_super) {
    __extends(ValueAxis, _super);
    function ValueAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValueAxis.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, value = _a.value, detail = _a.detail;
        var labelStyle = {
            fill: "#666",
            fontSize: 20,
            textAnchor: "middle"
        };
        var detailStyle = {
            fontSize: 12,
            textAnchor: "middle",
            fill: "#9a9a9a"
        };
        return (React.createElement("g", null,
            React.createElement("rect", { key: "background", x: "0", y: "0", width: width, height: height, style: { fill: "none", stroke: "none" } }),
            React.createElement("text", { key: "value", x: Math.round(width / 2), y: height / 2, style: labelStyle }, value),
            React.createElement("text", { key: "detail", x: Math.round(width / 2), y: height / 2, dy: "1.2em", style: detailStyle }, detail)));
    };
    return ValueAxis;
}(React.Component));
exports.ValueAxis = ValueAxis;
//# sourceMappingURL=ValueAxis.js.map