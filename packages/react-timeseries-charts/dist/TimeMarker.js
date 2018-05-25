"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var moment = require("moment");
var React = require("react");
var d3_time_format_1 = require("d3-time-format");
require("moment-duration-format");
var Info_1 = require("./Info");
var style_1 = require("./style");
var TimeMarker = (function (_super) {
    tslib_1.__extends(TimeMarker, _super);
    function TimeMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeMarker.prototype.renderLine = function (posx) {
        var style = this.props.style;
        return (React.createElement("line", { style: style.line, x1: posx, y1: 0, x2: posx, y2: this.props.height }));
    };
    TimeMarker.prototype.renderTimeMarker = function (d) {
        var style = this.props.style;
        var dateStr = "" + d;
        if (this.props.timeFormat === "day") {
            var formatter = d3_time_format_1.timeFormat("%d");
            dateStr = formatter(d);
        }
        else if (this.props.timeFormat === "month") {
            var formatter = d3_time_format_1.timeFormat("%B");
            dateStr = formatter(d);
        }
        else if (this.props.timeFormat === "year") {
            var formatter = d3_time_format_1.timeFormat("%Y");
            dateStr = formatter(d);
        }
        else if (this.props.timeFormat === "relative") {
            dateStr = moment.duration(+d).format();
        }
        else if (_.isString(this.props.timeFormat)) {
            var formatter = d3_time_format_1.timeFormat(this.props.timeFormat);
            dateStr = formatter(d);
        }
        else if (_.isFunction(this.props.timeFormat)) {
            var fn = this.props.timeFormat;
            dateStr = fn(d);
        }
        return (React.createElement("text", { x: 0, y: 0, dy: "1.2em", style: style.text }, dateStr));
    };
    TimeMarker.prototype.renderInfoBox = function (posx) {
        var infoBox;
        var align = "left";
        var _a = this.props, time = _a.time, style = _a.style, info = _a.info, infoWidth = _a.infoWidth, infoHeight = _a.infoHeight, showTime = _a.showTime;
        var infoBoxProps = {
            align: align,
            style: {
                text: style.text,
                box: style.box
            },
            width: this.props.infoWidth,
            height: this.props.infoHeight
        };
        if (info) {
            infoBox = React.createElement(Info_1.InfoBox, tslib_1.__assign({}, infoBoxProps, { info: info }));
            if (posx + 10 + infoWidth < this.props.width - 50) {
                return (React.createElement("g", { transform: "translate(" + (posx + 10) + "," + 5 + ")" },
                    showTime ? this.renderTimeMarker(time) : null,
                    React.createElement("g", { transform: "translate(0," + (showTime ? 20 : 0) + ")" }, infoBox)));
            }
            return (React.createElement("g", { transform: "translate(" + (posx - infoWidth - 10) + "," + 5 + ")" },
                showTime ? this.renderTimeMarker(time) : null,
                React.createElement("g", { transform: "translate(0," + (showTime ? 20 : 0) + ")" }, infoBox)));
        }
        return React.createElement("g", null);
    };
    TimeMarker.prototype.render = function () {
        var posx = this.props.timeScale(this.props.time);
        if (posx) {
            return (React.createElement("g", null,
                this.props.showLine ? this.renderLine(posx) : null,
                this.props.showInfoBox ? this.renderInfoBox(posx) : null));
        }
        return null;
    };
    TimeMarker.defaultProps = {
        visible: true,
        showInfoBox: true,
        showLine: true,
        showTime: true,
        style: style_1.defaultTimeMarkerStyle,
        infoWidth: 90,
        infoHeight: 25
    };
    return TimeMarker;
}(React.Component));
exports.TimeMarker = TimeMarker;
//# sourceMappingURL=TimeMarker.js.map