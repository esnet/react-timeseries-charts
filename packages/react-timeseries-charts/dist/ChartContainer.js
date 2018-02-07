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
import * as _ from "lodash";
import * as invariant from "invariant";
import * as moment from "moment-timezone";
import * as React from "react";
import { scaleTime, scaleUtc } from "d3-scale";
import { TimeAxis } from "react-axis";
import { Brush } from "./Brush";
import { ChartRow } from "./ChartRow";
import { Charts } from "./Charts";
import { EventHandler } from "./EventHandler";
import { TimeMarker } from "./TimeMarker";
import "@types/d3-scale";
import "@types/moment-timezone";
import "@types/invariant";
var defaultTimeAxisStyle = {
    labels: {
        labelColor: "#8B7E7E",
        labelWeight: 100,
        labelSize: 11
    },
    axis: {
        axisColor: "#C0C0C0",
        axisWidth: 1
    }
};
export var ShowGridPosition;
(function (ShowGridPosition) {
    ShowGridPosition["Over"] = "OVER";
    ShowGridPosition["Under"] = "UNDER";
})(ShowGridPosition || (ShowGridPosition = {}));
var ChartContainer = (function (_super) {
    __extends(ChartContainer, _super);
    function ChartContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChartContainer.prototype.handleMouseMove = function (t) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t);
        }
    };
    ChartContainer.prototype.handleMouseOut = function () {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(null);
        }
    };
    ChartContainer.prototype.handleBackgroundClick = function () {
        if (this.props.onBackgroundClick) {
            this.props.onBackgroundClick();
        }
    };
    ChartContainer.prototype.handleZoom = function (timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    };
    ChartContainer.prototype.render = function () {
        var _this = this;
        var chartRows = [];
        var leftAxisWidths = [];
        var rightAxisWidths = [];
        React.Children.forEach(this.props.children, function (childRow) {
            if (childRow.type === ChartRow) {
                var countLeft_1 = 0;
                var countCharts_1 = 0;
                var align_1 = "left";
                React.Children.forEach(childRow.props.children, function (child) {
                    if (child.type === Charts) {
                        countCharts_1 += 1;
                        align_1 = "right";
                    }
                    else if (child.type !== Brush) {
                        if (align_1 === "left") {
                            countLeft_1 += 1;
                        }
                    }
                });
                if (countCharts_1 !== 1) {
                    var msg = "ChartRow should have one and only one <Charts> tag within it";
                    invariant(false, msg, childRow.constructor.name);
                }
                align_1 = "left";
                var pos_1 = countLeft_1 - 1;
                React.Children.forEach(childRow.props.children, function (child) {
                    if (child.type === Charts || child.type === Brush) {
                        if (child.type === Charts) {
                            align_1 = "right";
                            pos_1 = 0;
                        }
                    }
                    else {
                        var width = Number(child.props.width) || 40;
                        if (align_1 === "left") {
                            leftAxisWidths[pos_1] = leftAxisWidths[pos_1]
                                ? Math.max(width, leftAxisWidths[pos_1])
                                : width;
                            pos_1 -= 1;
                        }
                        else if (align_1 === "right") {
                            rightAxisWidths[pos_1] = rightAxisWidths[pos_1]
                                ? Math.max(width, rightAxisWidths[pos_1])
                                : width;
                            pos_1 += 1;
                        }
                    }
                });
            }
        });
        var leftWidth = _.reduce(leftAxisWidths, function (a, b) { return a + b; }, 0);
        var rightWidth = _.reduce(rightAxisWidths, function (a, b) { return a + b; }, 0);
        var timeAxisHeight = 35;
        var timeAxisWidth = this.props.width - leftWidth - rightWidth;
        if (!this.props.timeRange) {
            throw Error("Invalid timerange passed to ChartContainer");
        }
        console.log("timerange ", this.props.timeRange);
        var timeScale = this.props.timezone === "Etc/UTC"
            ? scaleUtc()
                .domain([this.props.timeRange.begin(), this.props.timeRange.end()])
                .range([0, timeAxisWidth])
            : scaleTime()
                .domain([this.props.timeRange.begin(), this.props.timeRange.end()])
                .range([0, timeAxisWidth]);
        var i = 0;
        var yPosition = 0;
        React.Children.forEach(this.props.children, function (child) {
            if (child.type === ChartRow) {
                var chartRow = child;
                var rowKey = "chart-row-row-" + i;
                var firstRow = i === 0;
                var props = {
                    timeScale: timeScale,
                    leftAxisWidths: leftAxisWidths,
                    rightAxisWidths: rightAxisWidths,
                    width: _this.props.width,
                    transition: _this.props.transition,
                    timeFormat: _this.props.timeFormat,
                    trackerShowTime: firstRow,
                    trackerTime: _this.props.trackerTime,
                    trackerTimeFormat: _this.props.timeFormat
                };
                var transform = "translate(" + -leftWidth + "," + yPosition + ")";
                chartRows.push(React.createElement("g", { transform: transform, key: rowKey }, React.cloneElement(chartRow, props)));
                yPosition += parseInt(child.props.height, 10);
            }
            i += 1;
        });
        var chartsHeight = yPosition;
        var chartsWidth = this.props.width - leftWidth - rightWidth;
        var tracker;
        if (this.props.trackerTime && this.props.timeRange.contains(this.props.trackerTime)) {
            tracker = (React.createElement("g", { key: "tracker-group", style: { pointerEvents: "none" }, transform: "translate(" + leftWidth + ",0)" },
                React.createElement(TimeMarker, { key: "marker", width: chartsWidth, height: chartsHeight, showInfoBox: false, time: this.props.trackerTime, timeScale: timeScale, timeFormat: this.props.timeFormat, info: this.props.trackerInfo, infoWidth: this.props.trackerInfoWidth, infoHeight: this.props.trackerInfoHeight })));
        }
        var xStyle = {
            stroke: this.props.timeAxisStyle.axis.axisColor,
            strokeWidth: this.props.timeAxisStyle.axis.axisWidth,
            fill: "none",
            pointerEvents: "none"
        };
        var gridHeight = this.props.showGrid ? chartsHeight : 0;
        var timezone = this.props.timezone === "local" ? moment.tz.guess() : this.props.timezone;
        var timeAxis = (React.createElement("g", { transform: "translate(" + leftWidth + "," + chartsHeight + ")" },
            React.createElement("line", { x1: -leftWidth, y1: 0.5, x2: this.props.width, y2: 0.5, style: xStyle }),
            React.createElement(TimeAxis, { timezone: timezone, position: "bottom", beginTime: new Date(this.props.timeRange.begin().getTime()), endTime: new Date(this.props.timeRange.end().getTime()), width: timeAxisWidth, margin: 0, height: 50, tickExtend: gridHeight })));
        var rows = (React.createElement("g", { transform: "translate(" + leftWidth + "," + 0 + ")" },
            React.createElement(EventHandler, { key: "event-handler", width: chartsWidth, height: chartsHeight + timeAxisHeight, scale: timeScale, enablePanZoom: this.props.enablePanZoom, minDuration: this.props.minDuration, minTime: this.props.minTime, maxTime: this.props.maxTime, onMouseOut: function () { return _this.handleMouseOut(); }, onMouseMove: function (d) { return _this.handleMouseMove(d); }, onMouseClick: function () { return _this.handleBackgroundClick(); }, onZoom: function (tr) { return _this.handleZoom(tr); } }, chartRows)));
        var svgWidth = this.props.width;
        var svgHeight = yPosition + timeAxisHeight;
        return this.props.showGridPosition === ShowGridPosition.Over ? (React.createElement("svg", { width: svgWidth, height: svgHeight, style: { display: "block" } },
            rows,
            tracker,
            timeAxis)) : (React.createElement("svg", { width: svgWidth, height: svgHeight, style: { display: "block" } },
            timeAxis,
            rows,
            tracker));
    };
    ChartContainer.defaultProps = {
        width: 800,
        enablePanZoom: false,
        timezone: "Etc/UTC",
        showGrid: false,
        showGridPosition: ShowGridPosition.Under,
        timeAxisStyle: defaultTimeAxisStyle
    };
    return ChartContainer;
}(React.Component));
export { ChartContainer };
//# sourceMappingURL=ChartContainer.js.map