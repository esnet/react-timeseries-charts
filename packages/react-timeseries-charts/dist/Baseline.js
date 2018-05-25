"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var React = require("react");
var style_1 = require("./style");
var Baseline = (function (_super) {
    tslib_1.__extends(Baseline, _super);
    function Baseline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Baseline.prototype.render = function () {
        var _a = this.props, vposition = _a.vposition, yScale = _a.yScale, value = _a.value, position = _a.position, style = _a.style, width = _a.width;
        if (!yScale || _.isUndefined(value)) {
            return null;
        }
        var y = yScale(value);
        var transform = "translate(0 " + y + ")";
        var textAnchor;
        var textPositionX;
        var pts = [];
        var labelBelow = (vposition === "auto" && y < 15) || vposition === "below";
        var textPositionY = labelBelow ? 2 : -2;
        var alignmentBaseline = labelBelow ? "hanging" : "auto";
        if (position === "left") {
            textAnchor = "start";
            textPositionX = 5;
        }
        if (position === "right") {
            textAnchor = "end";
            textPositionX = width - 5;
        }
        pts.push("0 0");
        pts.push(this.props.width + " 0");
        var points = pts.join(" ");
        var baseLabelStyle = tslib_1.__assign({}, style_1.baselineDefaultStyle.label, { alignmentBaseline: alignmentBaseline });
        var labelStyle = _.merge(true, baseLabelStyle, style.label ? style.label : {});
        var lineStyle = _.merge(true, style_1.baselineDefaultStyle.line, style.line ? style.line : {});
        return (React.createElement("g", { className: "baseline", transform: transform },
            React.createElement("polyline", { points: points, style: lineStyle }),
            React.createElement("text", { style: labelStyle, x: textPositionX, y: textPositionY, textAnchor: textAnchor }, this.props.label)));
    };
    Baseline.defaultProps = {
        visible: true,
        value: 0,
        label: "",
        position: "left",
        vposition: "auto",
        style: style_1.baselineDefaultStyle
    };
    return Baseline;
}(React.Component));
exports.Baseline = Baseline;
//# sourceMappingURL=Baseline.js.map