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
import * as React from "react";
import { defaultInfoBoxStyle as defaultStyle } from "./style";
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
        style: defaultStyle
    };
    return ValueList;
}(React.Component));
export { ValueList };
//# sourceMappingURL=ValueList.js.map