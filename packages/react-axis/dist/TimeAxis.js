"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moment_timezone_1 = require("moment-timezone");
var _ = require("lodash");
var React = require("react");
var react_addons_css_transition_group_1 = require("react-addons-css-transition-group");
var d3_scale_1 = require("d3-scale");
var Tick_1 = require("./Tick");
var duration_format_1 = require("./util/duration-format");
var time_format_1 = require("./util/time-format");
require("./Axis.css");
var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationMonth = durationDay * 30;
var durationYear = durationDay * 365;
var majors = {
    second: "minute",
    minute: "hour",
    hour: "day",
    day: "month",
    week: "month",
    month: "year",
    year: "year"
};
var tickIntervals = [
    [durationSecond, "second", 1],
    [5 * durationSecond, "second", 5],
    [15 * durationSecond, "second", 15],
    [30 * durationSecond, "second", 30],
    [durationMinute, "minute", 1],
    [5 * durationMinute, "minute", 5],
    [15 * durationMinute, "minute", 15],
    [30 * durationMinute, "minute", 30],
    [durationHour, "hour", 1],
    [3 * durationHour, "hour", 3],
    [6 * durationHour, "hour", 6],
    [12 * durationHour, "hour", 12],
    [durationDay, "day", 1],
    [2 * durationDay, "day", 2],
    [3 * durationDay, "day", 3],
    [4 * durationDay, "day", 4],
    [5 * durationDay, "day", 5],
    [durationWeek, "week", 1],
    [durationMonth, "month", 1],
    [3 * durationMonth, "month", 3],
    [durationYear, "year", 1],
    [2 * durationYear, "year", 2],
    [5 * durationYear, "year", 5],
    [10 * durationYear, "year", 10],
    [25 * durationYear, "year", 25],
    [100 * durationYear, "year", 100],
    [500 * durationYear, "year", 250]
];
var TimeAxis = (function (_super) {
    tslib_1.__extends(TimeAxis, _super);
    function TimeAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeAxis.prototype.getDefaultProps = function () {
        return {
            width: 100,
            height: 100,
            tickCount: 10,
            tickMajor: 20,
            tickMinor: 14,
            tickExtend: 0,
            margin: 10,
            standalone: false,
            labelPosition: 50,
            labelStyle: {
                fill: "grey",
                stroke: "none",
                pointerEvents: "none"
            },
            absolute: false,
            smoothTransition: false
        };
    };
    TimeAxis.prototype.renderAxisLabel = function () {
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
    TimeAxis.prototype.renderAxisLine = function () {
        var p = this.props.position;
        return (React.createElement("line", { key: "axis", className: "axis", style: { stroke: "#AAA", strokeWidth: 2 }, x1: this.props.margin, y1: p === "bottom" ? 0 : this.props.height, x2: this.props.width - this.props.margin, y2: p === "bottom" ? 0 : this.props.height }));
    };
    TimeAxis.prototype.renderAxisTicks = function () {
        var formatter = this.props.format;
        var timezone = this.props.timezone;
        var formatAsDuration = this.props.format === "duration";
        if (formatAsDuration) {
            timezone = "Etc/UTC";
        }
        var interval = 5;
        var scale = d3_scale_1.scaleTime()
            .domain([this.props.beginTime, this.props.endTime])
            .range([this.props.margin, this.props.width - this.props.margin * 2]);
        var start = +this.props.beginTime;
        var stop = +this.props.endTime;
        var target = Math.abs(stop - start) / interval;
        var type, num;
        if (_.isString(formatter) && formatter !== "duration") {
            type = formatter;
            num = 1;
        }
        else {
            for (var _i = 0, tickIntervals_1 = tickIntervals; _i < tickIntervals_1.length; _i++) {
                var _a = tickIntervals_1[_i], d_1 = _a[0], t = _a[1], n = _a[2];
                if (target < d_1)
                    break;
                type = t;
                num = n;
            }
        }
        formatter = time_format_1.default(type, timezone);
        if (formatAsDuration) {
            formatter = duration_format_1.default();
        }
        var starttz = timezone ? moment_timezone_1.default(start).tz(timezone) : moment_timezone_1.default(start);
        var stoptz = timezone ? moment_timezone_1.default(stop).tz(timezone) : moment_timezone_1.default(stop);
        var startd = starttz.startOf(majors[type]).add(num, "type");
        var stopd = stoptz.endOf(type);
        var i = 0;
        var d = startd;
        var ticks = [];
        while (d.isBefore(stopd)) {
            var date = d.toDate();
            var pos = scale(date);
            var _b = formatter(date), label = _b.label, size = _b.size, labelAlign = _b.labelAlign;
            if (+d >= start && +d < stop) {
                ticks.push(React.createElement(Tick_1.Tick, { key: +d, id: "" + i, align: this.props.position, label: label, size: size, position: pos, extend: this.props.tickExtend, labelAlign: labelAlign, width: this.props.width, height: this.props.height, smoothTransition: this.props.smoothTransition }));
            }
            d = d.add(num, type);
            i++;
        }
        return ticks;
    };
    TimeAxis.prototype.renderAxis = function () {
        if (this.props.transition === true) {
            return (React.createElement("g", null,
                this.renderAxisLine(),
                React.createElement(react_addons_css_transition_group_1.default, { component: "g", transitionName: "ticks", transitionEnterTimeout: 500, transitionLeaveTimeout: 500 }, this.renderAxisTicks()),
                this.renderAxisLabel()));
        }
        else {
            return (React.createElement("g", null,
                this.renderAxisLine(),
                this.renderAxisTicks(),
                this.renderAxisLabel()));
        }
    };
    TimeAxis.prototype.render = function () {
        if (this.props.standalone) {
            return (React.createElement("svg", { height: this.props.height, width: this.props.width, style: { shapeRendering: "crispEdges" } }, this.renderAxis()));
        }
        else {
            return this.renderAxis();
        }
    };
    return TimeAxis;
}(React.Component));
exports.TimeAxis = TimeAxis;
//# sourceMappingURL=TimeAxis.js.map