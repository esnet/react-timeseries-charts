"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var d3_format_1 = require("d3-format");
var ValueList_1 = require("./ValueList");
var LabelAxis = (function (_super) {
    tslib_1.__extends(LabelAxis, _super);
    function LabelAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LabelAxis.prototype.renderAxis = function () {
        var valueWidth = this.props.valWidth;
        var rectWidth = this.props.width - valueWidth;
        var style = {
            fontSize: 11,
            textAnchor: "start",
            fill: "#bdbdbd"
        };
        if (this.props.hideScale) {
            return React.createElement("g", null);
        }
        var valXPos = rectWidth + 3;
        var fmt = this.props.format;
        var maxStr = d3_format_1.format(fmt)(this.props.max);
        var minStr = d3_format_1.format(fmt)(this.props.min);
        return (React.createElement("g", null,
            React.createElement("text", { x: valXPos, y: 0, dy: "1.2em", style: style }, maxStr),
            React.createElement("text", { x: valXPos, y: this.props.height, style: style }, minStr)));
    };
    LabelAxis.prototype.render = function () {
        var textStyle = {
            fontSize: 12,
            textAnchor: "middle",
            fill: "#838383"
        };
        var valueWidth = this.props.valWidth;
        var rectWidth = this.props.width - valueWidth;
        var valueList = null;
        var labelYPos;
        if (this.props.values) {
            labelYPos = Math.max(Math.round(this.props.height / 4), 10);
            var style = {
                text: textStyle,
                box: {
                    fill: "none",
                    stroke: "none"
                }
            };
            valueList = React.createElement(ValueList_1.ValueList, { style: style, values: this.props.values, width: rectWidth });
        }
        else {
            labelYPos = Math.round(this.props.height / 2);
        }
        return (React.createElement("g", null,
            React.createElement("rect", { x: "0", y: "0", width: rectWidth, height: this.props.height, style: { fill: "none", stroke: "none" } }),
            React.createElement("text", { x: Math.round(rectWidth / 2), y: labelYPos, style: textStyle }, this.props.label),
            React.createElement("g", { transform: "translate(0," + (labelYPos + 2) + ")" }, valueList),
            this.renderAxis()));
    };
    LabelAxis.defaultProps = {
        hideScale: false,
        values: [],
        valWidth: 40,
        format: ".2f"
    };
    return LabelAxis;
}(React.Component));
exports.LabelAxis = LabelAxis;
//# sourceMappingURL=LabelAxis.js.map