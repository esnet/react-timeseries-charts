"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var style_1 = require("./style");
var ValueList = (function (_super) {
    tslib_1.__extends(ValueList, _super);
    function ValueList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValueList.prototype.render = function () {
        var _this = this;
        var _a = this.props, align = _a.align, style = _a.style, width = _a.width, height = _a.height;
        var textStyle = tslib_1.__assign({}, style.text, { textAnchor: "left", pointerEvents: "none" });
        var textStyleCentered = tslib_1.__assign({}, style.text, { textAnchor: "middle", pointerEvents: "none" });
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
//# sourceMappingURL=ValueList.js.map