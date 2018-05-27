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
var ReactCSSTransitionGroup = require("react-addons-css-transition-group");
var d3_format_1 = require("d3-format");
var d3_scale_1 = require("d3-scale");
var Tick_1 = require("./Tick");
require("./Axis.css");
var Axis = (function (_super) {
    __extends(Axis, _super);
    function Axis(props) {
        return _super.call(this, props) || this;
    }
    Axis.prototype.renderAxisLabel = function () {
        var _a = this.props, width = _a.width, height = _a.height, position = _a.position, labelPosition = _a.labelPosition, labelStyle = _a.labelStyle;
        var translate;
        var rotate = "rotate(0)";
        var anchor = "start";
        switch (position) {
            case "left":
                translate = "translate(" + (width - labelPosition) + ",5)";
                rotate = "rotate(-90)";
                anchor = "end";
                break;
            case "right":
                translate = "translate(" + labelPosition + ",5)";
                rotate = "rotate(-90)";
                anchor = "end";
                break;
            case "top":
                translate = "translate(5, " + (height - labelPosition) + ")";
                break;
            case "bottom":
                translate = "translate(5, " + labelPosition + ")";
                break;
            default:
        }
        return (React.createElement("g", { transform: translate },
            React.createElement("text", { transform: rotate, textAnchor: anchor, style: labelStyle }, this.props.label)));
    };
    Axis.prototype.renderAxisLine = function () {
        var p = this.props.position;
        if (p === "left" || p === "right") {
            return (React.createElement("line", { key: "axis", className: "axis", style: { stroke: "#AAA", strokeWidth: 0.5 }, x1: p === "left" ? this.props.width : 0, y1: this.props.margin, x2: p === "left" ? this.props.width : 0, y2: this.props.height - this.props.margin }));
        }
        else {
            return (React.createElement("line", { key: "axis", className: "axis", style: { stroke: "#AAA", strokeWidth: 0.5 }, x1: this.props.margin, y1: p === "bottom" ? 0 : this.props.height, x2: this.props.width - this.props.margin, y2: p === "bottom" ? 0 : this.props.height }));
        }
    };
    Axis.prototype.renderAxisTicks = function () {
        var _this = this;
        var p = this.props.position;
        var scale;
        switch (this.props.type.toLowerCase()) {
            case "linear":
                scale = d3_scale_1.scaleLinear()
                    .domain([this.props.min, this.props.max])
                    .range(p === "left" || p === "right"
                    ? [this.props.height - this.props.margin * 2, 0]
                    : [0, this.props.width - this.props.margin * 2]);
                break;
            case "log":
                scale = d3_scale_1.scaleLog()
                    .domain([this.props.min, this.props.max])
                    .range(p === "left" || p === "right"
                    ? [this.props.height - this.props.margin * 2, 0]
                    : [0, this.props.width - this.props.margin * 2]);
                break;
            case "power":
                scale = d3_scale_1.scalePow()
                    .exponent(this.props.exponent)
                    .domain([this.props.min, this.props.max])
                    .range(p === "left" || p === "right"
                    ? [this.props.height - this.props.margin * 2, 0]
                    : [0, this.props.width - this.props.margin * 2]);
                break;
            default:
        }
        return scale.ticks(this.props.tickCount).map(function (tickValue, tickIndex) {
            var tickPosition = scale(tickValue) + _this.props.margin;
            var tickFormatSpecifier = _this.props.tickFormatSpecifier;
            var d3Format = _this.props.format
                ? d3_format_1.format(_this.props.format)
                : scale.tickFormat(_this.props.tickCount, tickFormatSpecifier);
            var absolute = _this.props.absolute;
            var formatter = function (d) { return (absolute ? d3Format(Math.abs(d)) : d3Format(d)); };
            var label = formatter(tickValue);
            return (React.createElement(Tick_1.Tick, { id: "tick-" + tickIndex, key: tickValue, align: _this.props.position, label: label, labelAlign: "center", position: tickPosition, size: _this.props.tickSize, extend: _this.props.tickExtend, width: _this.props.width, height: _this.props.height, angled: _this.props.angled }));
        });
    };
    Axis.prototype.renderAxis = function () {
        return (React.createElement("g", null,
            this.renderAxisLine(),
            React.createElement(ReactCSSTransitionGroup, { component: "g", transitionName: "ticks", transitionEnterTimeout: 500, transitionLeaveTimeout: 500 }, this.renderAxisTicks()),
            this.renderAxisLabel()));
    };
    Axis.prototype.render = function () {
        if (this.props.standalone) {
            return (React.createElement("svg", { height: this.props.height, width: this.props.width }, this.renderAxis()));
        }
        else {
            return this.renderAxis();
        }
    };
    Axis.defaultProps = {
        width: 100,
        height: 100,
        tickCount: 10,
        tickSize: 5,
        tickExtend: 0,
        margin: 10,
        type: "linear",
        exponent: 2,
        standalone: false,
        labelPosition: 50,
        labelStyle: {
            fill: "#8B7E7E",
            fontWeight: 100,
            fontSize: 12,
            fontFamily: '"Goudy Bookletter 1911", sans-serif"',
            stroke: "none",
            pointerEvents: "none"
        },
        absolute: false,
        angled: false
    };
    return Axis;
}(React.Component));
exports.Axis = Axis;
//# sourceMappingURL=Axis.js.map