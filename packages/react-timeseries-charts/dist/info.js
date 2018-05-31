"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var React = require("react");
var style_1 = require("./style");
var Label = (function (_super) {
    tslib_1.__extends(Label, _super);
    function Label() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Label.prototype.render = function () {
        var _a = this.props, label = _a.label, align = _a.align, width = _a.width, height = _a.height;
        var textStyle = _.merge(true, style_1.defaultInfoBoxStyle.text, this.props.style.text ? this.props.style.text : {}, { textAnchor: "start", pointerEvents: "none" });
        var textStyleCentered = _.merge(true, style_1.defaultInfoBoxStyle.text, this.props.style.text ? this.props.style.text : {}, { textAnchor: "middle", pointerEvents: "none" });
        var labelStyle = align === "center" ? textStyleCentered : textStyle;
        var boxStyle = _.merge(true, style_1.defaultInfoBoxStyle.box, this.props.style.box ? this.props.style.box : {});
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
    tslib_1.__extends(ValueList, _super);
    function ValueList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValueList.prototype.render = function () {
        var _this = this;
        var _a = this.props, align = _a.align, width = _a.width, height = _a.height;
        var textStyle = _.merge(true, style_1.defaultInfoBoxStyle.text, this.props.style.text ? this.props.style.text : {}, { textAnchor: "start", pointerEvents: "none" });
        var textStyleCentered = _.merge(true, style_1.defaultInfoBoxStyle.text, this.props.style.text ? this.props.style.text : {}, { textAnchor: "middle", pointerEvents: "none" });
        var boxStyle = _.merge(true, style_1.defaultInfoBoxStyle.box, this.props.style.box ? this.props.style.box : {});
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
        var box = React.createElement("rect", { style: boxStyle, x: 0, y: 0, width: width, height: height });
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
    tslib_1.__extends(InfoBox, _super);
    function InfoBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InfoBox.prototype.render = function () {
        var _a = this.props, info = _a.info, props = tslib_1.__rest(_a, ["info"]);
        if (_.isString(info)) {
            return React.createElement(Label, tslib_1.__assign({ label: info }, props));
        }
        else {
            return React.createElement(ValueList, tslib_1.__assign({ values: info }, props));
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
//# sourceMappingURL=Info.js.map