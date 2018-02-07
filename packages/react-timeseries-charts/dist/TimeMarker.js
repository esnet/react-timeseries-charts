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
import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { timeFormat } from "d3-time-format";
import "moment-duration-format";
import { InfoBox } from "./info";
import { defaultTimeMarkerStyle } from "./style";
import "@types/moment-duration-format";
var TimeMarker = (function (_super) {
    __extends(TimeMarker, _super);
    function TimeMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeMarker.prototype.renderLine = function (posx) {
        var style = this.props.style;
        return React.createElement("line", { style: style.line, x1: posx, y1: 0, x2: posx, y2: this.props.height });
    };
    TimeMarker.prototype.renderTimeMarker = function (d) {
        var style = this.props.style;
        var dateStr = "" + d;
        if (this.props.timeFormat === "day") {
            var formatter = timeFormat("%d");
            dateStr = formatter(d);
        }
        else if (this.props.timeFormat === "month") {
            var formatter = timeFormat("%B");
            dateStr = formatter(d);
        }
        else if (this.props.timeFormat === "year") {
            var formatter = timeFormat("%Y");
            dateStr = formatter(d);
        }
        else if (this.props.timeFormat === "relative") {
            dateStr = moment.duration(+d).format();
        }
        else if (_.isString(this.props.timeFormat)) {
            var formatter = timeFormat(this.props.timeFormat);
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
            if (info) {
                infoBox = React.createElement(InfoBox, __assign({}, infoBoxProps, { info: info }));
            }
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
        showInfoBox: true,
        showLine: true,
        showTime: true,
        style: defaultTimeMarkerStyle,
        infoWidth: 90,
        infoHeight: 25
    };
    return TimeMarker;
}(React.Component));
export { TimeMarker };
//# sourceMappingURL=TimeMarker.js.map