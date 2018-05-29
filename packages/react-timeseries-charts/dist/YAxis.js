"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var react_axis_1 = require("react-axis");
var Charts_1 = require("./Charts");
var YAxis = (function (_super) {
    tslib_1.__extends(YAxis, _super);
    function YAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YAxis.prototype.render = function () {
        return (React.createElement(react_axis_1.Axis, { label: this.props.label ? this.props.label : this.props.id, width: this.props.width, position: this.props.align, margin: 5, height: this.props.height, max: this.props.max, min: this.props.min, type: this.props.type, format: this.props.format, tickCount: this.props.tickCount, absolute: this.props.absolute, style: this.props.style }));
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
        width: 80
    };
    return YAxis;
}(React.Component));
exports.YAxis = YAxis;
//# sourceMappingURL=YAxis.js.map