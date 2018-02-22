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
var react_axis_1 = require("react-axis");
var Charts_1 = require("./Charts");
var defaultStyle = {
    labels: {
        labelColor: "#8B7E7E",
        labelWeight: 100,
        labelSize: 11
    },
    axis: {
        axisColor: "#C0C0C0"
    }
};
var YAxis = (function (_super) {
    __extends(YAxis, _super);
    function YAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YAxis.prototype.render = function () {
        return (React.createElement(react_axis_1.Axis, { label: this.props.label ? this.props.label : this.props.id, labelStyle: this.props.style, width: this.props.width, position: this.props.align, margin: 5, height: this.props.height, max: this.props.max, min: this.props.min, type: this.props.type, format: this.props.format, tickCount: this.props.tickCount, absolute: this.props.absolute }));
    };
    YAxis.defaultProps = {
        id: "yaxis",
        align: "left",
        min: 0,
        max: 1,
        type: Charts_1.ScaleType.Linear,
        absolute: false,
        format: ".2s",
        labelOffset: 0,
        transition: 100,
        width: 80,
        style: defaultStyle
    };
    return YAxis;
}(React.Component));
exports.YAxis = YAxis;
//# sourceMappingURL=YAxis.js.map