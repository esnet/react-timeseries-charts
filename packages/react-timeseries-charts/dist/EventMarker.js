"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var React = require("react");
var d3_time_format_1 = require("d3-time-format");
var pondjs_1 = require("pondjs");
var Info_1 = require("./Info");
var style_1 = require("./style");
var textStyle = {
    fontSize: 11,
    textAnchor: "start",
    fill: "#bdbdbd",
    pointerEvents: "none",
    stroke: "none"
};
var EventTime = function (_a) {
    var time = _a.time, _b = _a.format, format = _b === void 0 ? "%m/%d/%y %X" : _b;
    var text;
    if (_.isFunction(format)) {
        text = format(time);
    }
    else {
        var fmt = d3_time_format_1.timeFormat(format);
        text = fmt(time);
    }
    return (React.createElement("text", { x: 0, y: 0, dy: "1.2em", style: textStyle }, text));
};
var EventTimeRange = function (_a) {
    var timerange = _a.timerange, _b = _a.format, format = _b === void 0 ? "%m/%d/%y %X" : _b;
    var d1 = timerange.begin();
    var d2 = timerange.end();
    var beginText;
    var endText;
    if (_.isFunction(format)) {
        beginText = format(d1);
        endText = format(d2);
    }
    else {
        var fmt = d3_time_format_1.timeFormat(format);
        beginText = fmt(d1);
        endText = fmt(d2);
    }
    return (React.createElement("text", { x: 0, y: 0, dy: "1.2em", style: textStyle }, beginText + " to " + endText));
};
var EventIndex = function (_a) {
    var index = _a.index, _b = _a.format, format = _b === void 0 ? "%m/%d/%y %X" : _b;
    var text;
    if (_.isFunction(format)) {
        text = format(index.timestamp());
    }
    else if (_.isString(format)) {
        var fmt = d3_time_format_1.timeFormat(format);
        text = fmt(index.timestamp());
    }
    else {
        text = index.toString();
    }
    return (React.createElement("text", { x: 0, y: 0, dy: "1.2em", style: textStyle }, text));
};
var EventMarker = (function (_super) {
    tslib_1.__extends(EventMarker, _super);
    function EventMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventMarker.prototype.renderTime = function (event) {
        if (event.keyType() === "time") {
            return React.createElement(EventTime, { time: event.timestamp(), format: this.props.infoTimeFormat });
        }
        else if (event.keyType() === "index") {
            return (React.createElement(EventIndex, { index: pondjs_1.index(event.indexAsString()), format: this.props.infoTimeFormat }));
        }
        else if (event.keyType() === "timerange") {
            return (React.createElement(EventTimeRange, { timerange: event.timerange(), format: this.props.infoTimeFormat }));
        }
        return React.createElement("g", null);
    };
    EventMarker.prototype.renderMarker = function (event, column, info) {
        var t;
        if (event.keyType() === "time") {
            t = event.timestamp();
        }
        else {
            t = new Date(event.begin().getTime() + (event.end().getTime() - event.begin().getTime()) / 2);
        }
        var value;
        if (this.props.yValueFunc) {
            value = this.props.yValueFunc(event, column);
        }
        else {
            value = event.get(column);
        }
        var posx = this.props.timeScale(t) + this.props.offsetX;
        var posy = this.props.yScale(value) - this.props.offsetY;
        var style = this.props.style;
        var align = "left";
        var infoBoxProps = {
            align: align,
            style: {
                text: style.text,
                box: style.box
            },
            width: this.props.infoWidth,
            height: this.props.infoHeight
        };
        var w = this.props.infoWidth;
        var lineBottom = posy - 10;
        var verticalStem;
        var horizontalStem;
        var dot;
        var infoBox;
        var transform;
        var label;
        if (info) {
            infoBox = React.createElement(Info_1.InfoBox, tslib_1.__assign({}, infoBoxProps, { info: info }));
        }
        if (this.props.type === "point") {
            var dx = 0;
            var dy = 0;
            var textDefaultStyle = {
                fontSize: 11,
                pointerEvents: "none",
                paintOrder: "stroke",
                fill: "#b0b0b0",
                stroke: "none",
                strokeWidth: 2,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                fontWeight: 800
            };
            switch (this.props.markerLabelAlign) {
                case "left":
                    dx = 5;
                    textDefaultStyle.textAnchor = "start";
                    textDefaultStyle.alignmentBaseline = "central";
                    break;
                case "right":
                    dx = -5;
                    textDefaultStyle.textAnchor = "end";
                    textDefaultStyle.alignmentBaseline = "central";
                    break;
                case "top":
                    dy = -5;
                    textDefaultStyle.textAnchor = "middle";
                    textDefaultStyle.alignmentBaseline = "hanging";
                    break;
                case "bottom":
                    dy = 5;
                    textDefaultStyle.textAnchor = "middle";
                    textDefaultStyle.alignmentBaseline = "hanging";
                    break;
                default:
            }
            var tstyle = _.merge(true, textDefaultStyle, this.props.style.text);
            dot = (React.createElement("circle", { cx: posx, cy: posy, r: this.props.markerRadius, pointerEvents: "none", style: this.props.style.marker }));
            label = (React.createElement("text", { x: posx, y: posy, dx: dx, dy: dy, style: tstyle }, this.props.markerLabel));
            return (React.createElement("g", null,
                dot,
                label));
        }
        else {
            if (posx + 10 + w < this.props.width * 3 / 4) {
                if (info) {
                    verticalStem = (React.createElement("line", { pointerEvents: "none", style: this.props.style.stem, x1: -10, y1: lineBottom, x2: -10, y2: 20 }));
                    horizontalStem = (React.createElement("line", { pointerEvents: "none", style: this.props.style.stem, x1: -10, y1: 20, x2: -2, y2: 20 }));
                }
                dot = (React.createElement("circle", { cx: -10, cy: lineBottom, r: this.props.markerRadius, pointerEvents: "none", style: this.props.style.marker }));
                transform = "translate(" + (posx + 10) + "," + 10 + ")";
            }
            else {
                if (info) {
                    verticalStem = (React.createElement("line", { pointerEvents: "none", style: this.props.style.stem, x1: w + 10, y1: lineBottom, x2: w + 10, y2: 20 }));
                    horizontalStem = (React.createElement("line", { pointerEvents: "none", style: this.props.style.stem, x1: w + 10, y1: 20, x2: w + 2, y2: 20 }));
                }
                dot = (React.createElement("circle", { cx: w + 10, cy: lineBottom, r: this.props.markerRadius, pointerEvents: "none", style: this.props.style.marker }));
                transform = "translate(" + (posx - w - 10) + "," + 10 + ")";
            }
            return (React.createElement("g", { transform: transform },
                verticalStem,
                horizontalStem,
                dot,
                this.renderTime(event),
                React.createElement("g", { transform: "translate(0," + 20 + ")" }, infoBox)));
        }
    };
    EventMarker.prototype.render = function () {
        var _a = this.props, event = _a.event, column = _a.column, info = _a.info;
        if (!event) {
            return React.createElement("g", null);
        }
        return React.createElement("g", null, this.renderMarker(event, column, info));
    };
    EventMarker.defaultProps = {
        type: "flag",
        column: "value",
        infoWidth: 90,
        infoHeight: 25,
        style: style_1.defaultEventMarkerStyle,
        markerRadius: 2,
        markerLabelAlign: "left",
        offsetX: 0,
        offsetY: 0
    };
    return EventMarker;
}(React.Component));
exports.EventMarker = EventMarker;
//# sourceMappingURL=EventMarker.js.map