"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var moment = require("moment-timezone");
var React = require("react");
var d3_scale_1 = require("d3-scale");
var react_axis_1 = require("react-axis");
var react_hot_loader_1 = require("react-hot-loader");
var Brush_1 = require("./Brush");
var ChartRow_1 = require("./ChartRow");
var Charts_1 = require("./Charts");
var EventHandler_1 = require("./EventHandler");
var MultiBrush_1 = require("./MultiBrush");
var TimeMarker_1 = require("./TimeMarker");
var Info_1 = require("./Info");
var style_1 = require("./style");
var defaultChartAxisStyle = {
    fill: "none",
    stroke: "#C0C0C0",
    pointerEvents: "none"
};
var defaultTitleStyle = {
    fontWeight: 100,
    fontSize: 14,
    font: '"Goudy Bookletter 1911", sans-serif"',
    fill: "#C0C0C0"
};
var ShowGridPosition;
(function (ShowGridPosition) {
    ShowGridPosition["Over"] = "OVER";
    ShowGridPosition["Under"] = "UNDER";
})(ShowGridPosition = exports.ShowGridPosition || (exports.ShowGridPosition = {}));
var ChartContainer = (function (_super) {
    tslib_1.__extends(ChartContainer, _super);
    function ChartContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.handleBackgroundClick = _this.handleBackgroundClick.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleMouseOut = _this.handleMouseOut.bind(_this);
        _this.handleTimeRangeChanged = _this.handleTimeRangeChanged.bind(_this);
        _this.handleTrackerChanged = _this.handleTrackerChanged.bind(_this);
        _this.handleZoom = _this.handleZoom.bind(_this);
        return _this;
    }
    ChartContainer.prototype.handleTrackerChanged = function (t) {
        var _this = this;
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t, function (t) { return _this.timeScale(t) + _this.leftWidth; });
        }
    };
    ChartContainer.prototype.handleTimeRangeChanged = function (timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    };
    ChartContainer.prototype.handleMouseMove = function (x, y) {
        this.handleTrackerChanged(this.timeScale.invert(x));
        if (this.props.onMouseMove) {
            this.props.onMouseMove(x, y);
        }
    };
    ChartContainer.prototype.handleMouseOut = function () {
        this.handleTrackerChanged(null);
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
        var _a = this.props.padding, padding = _a === void 0 ? 0 : _a;
        var _b = this.props, _c = _b.paddingLeft, paddingLeft = _c === void 0 ? padding : _c, _d = _b.paddingRight, paddingRight = _d === void 0 ? padding : _d;
        var _e = this.props, _f = _e.paddingTop, paddingTop = _f === void 0 ? padding : _f, _g = _e.paddingBottom, paddingBottom = _g === void 0 ? padding : _g;
        var _h = this.props.titleHeight, titleHeight = _h === void 0 ? 28 : _h;
        if (_.isUndefined(this.props.title)) {
            titleHeight = 0;
        }
        var chartRows = [];
        var leftAxisWidths = [];
        var rightAxisWidths = [];
        React.Children.forEach(this.props.children, function (childRow) {
            if (react_hot_loader_1.areComponentsEqual(childRow.type, ChartRow_1.ChartRow)) {
                var countLeft_1 = 0;
                var countCharts_1 = 0;
                var align_1 = "left";
                React.Children.forEach(childRow.props.children, function (child) {
                    if (child === null)
                        return;
                    if (react_hot_loader_1.areComponentsEqual(child.type, Charts_1.Charts)) {
                        countCharts_1 += 1;
                        align_1 = "right";
                    }
                    else if (!react_hot_loader_1.areComponentsEqual(child.type, Brush_1.Brush) &&
                        !react_hot_loader_1.areComponentsEqual(child.type, MultiBrush_1.MultiBrush)) {
                        if (align_1 === "left") {
                            countLeft_1 += 1;
                        }
                    }
                });
                if (countCharts_1 !== 1) {
                    var msg = "ChartRow should have one and only one <Charts> tag within it";
                    console.error(msg);
                }
                align_1 = "left";
                var pos_1 = countLeft_1 - 1;
                React.Children.forEach(childRow.props.children, function (child) {
                    if (child === null)
                        return;
                    if (react_hot_loader_1.areComponentsEqual(child.type, Charts_1.Charts) ||
                        react_hot_loader_1.areComponentsEqual(child.type, Brush_1.Brush) ||
                        react_hot_loader_1.areComponentsEqual(child.type, MultiBrush_1.MultiBrush)) {
                        if (react_hot_loader_1.areComponentsEqual(child.type, Charts_1.Charts)) {
                            align_1 = "right";
                            pos_1 = 0;
                        }
                    }
                    else {
                        var width = Number(child.props.width) || 40;
                        var visible = !_.has(child.props, "visible") || child.props.visible;
                        if (!visible)
                            width = 0;
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
        var leftWidth = (this.leftWidth = _.reduce(leftAxisWidths, function (a, b) { return a + b; }, 0));
        var rightWidth = (this.rightWidth = _.reduce(rightAxisWidths, function (a, b) { return a + b; }, 0));
        var _j = this.props.timeAxisHeight, timeAxisHeight = _j === void 0 ? 35 : _j;
        var timeAxisWidth = this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;
        if (!this.props.timeRange) {
            throw Error("Invalid timerange passed to ChartContainer");
        }
        var timeScale = (this.timeScale =
            this.props.timezone === "Etc/UTC"
                ? d3_scale_1.scaleUtc()
                    .domain([this.props.timeRange.begin(), this.props.timeRange.end()])
                    .range([0, timeAxisWidth])
                : d3_scale_1.scaleTime()
                    .domain([this.props.timeRange.begin(), this.props.timeRange.end()])
                    .range([0, timeAxisWidth]));
        var chartsWidth = this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;
        var i = 0;
        var yPosition = 0;
        var transform = "translate(" + (leftWidth + paddingLeft) + "," + yPosition + ")";
        var titleStyle = _.merge(true, defaultTitleStyle, this.props.titleStyle ? this.props.titleStyle : {});
        var title = this.props.title ? (React.createElement("g", { transform: transform },
            React.createElement(Info_1.Label, { align: "center", label: this.props.title, style: { text: titleStyle, box: { fill: "none", stroke: "none" } }, width: chartsWidth, height: titleHeight }))) : (React.createElement("g", null));
        var chartsHeight = 0;
        React.Children.forEach(this.props.children, function (child) {
            if (react_hot_loader_1.areComponentsEqual(child.type, ChartRow_1.ChartRow)) {
                var chartRow = child;
                var rowKey = "chart-row-row-" + i;
                var firstRow = i === 0;
                var isVisible = child.props.visible;
                var props = {
                    timeScale: timeScale,
                    paddingLeft: paddingLeft,
                    paddingRight: paddingRight,
                    leftAxisWidths: leftAxisWidths,
                    rightAxisWidths: rightAxisWidths,
                    width: _this.props.width,
                    minTime: _this.props.minTime,
                    maxTime: _this.props.maxTime,
                    transition: _this.props.transition,
                    enablePanZoom: _this.props.enablePanZoom,
                    minDuration: _this.props.minDuration,
                    showGrid: _this.props.showGrid,
                    timeFormat: _this.props.timeFormat,
                    trackerShowTime: firstRow,
                    trackerTime: _this.props.trackerTime,
                    trackerTimeFormat: _this.props.timeFormat,
                    onTimeRangeChanged: function (tr) { return _this.handleTimeRangeChanged(tr); },
                    onTrackerChanged: function (t) { return _this.handleTrackerChanged(t); }
                };
                var transform_1 = "translate(" + (-leftWidth - paddingLeft) + "," + yPosition + ")";
                if (isVisible) {
                    chartRows.push(React.createElement("g", { transform: transform_1, key: rowKey }, React.cloneElement(chartRow, props)));
                    var height = parseInt(child.props.height, 10);
                    yPosition += height;
                    chartsHeight += height;
                }
            }
            i += 1;
        });
        var tracker;
        if (this.props.trackerTime) {
            if (this.props.timeRange.contains(this.props.trackerTime)) {
                tracker = (React.createElement("g", { key: "tracker-group", style: { pointerEvents: "none" }, transform: "translate(" + (leftWidth + paddingLeft) + "," + (paddingTop + titleHeight) + ")" },
                    React.createElement(TimeMarker_1.TimeMarker, { key: "marker", width: chartsWidth, height: chartsHeight, showInfoBox: false, time: this.props.trackerTime, timeScale: timeScale, timeFormat: this.props.timeFormat, info: this.props.trackerInfo, infoWidth: this.props.trackerInfoWidth, infoHeight: this.props.trackerInfoHeight })));
            }
        }
        var timeAxisStyle = _.merge(true, style_1.defaultTimeAxisStyle, this.props.timeAxisStyle ? this.props.timeAxisStyle : {});
        var chartAxisStyle = _.merge(true, defaultChartAxisStyle, this.props.chartAxisStyle ? this.props.chartAxisStyle : {});
        var gridHeight = this.props.showGrid ? chartsHeight : 0;
        var timezone = this.props.timezone === "local" ? moment.tz.guess() : this.props.timezone;
        var timeAxis = (React.createElement("g", { transform: "translate(" + (leftWidth + paddingLeft) + "," + (paddingTop + titleHeight + chartsHeight) + ")" },
            React.createElement("line", { x1: -leftWidth, y1: 0.5, x2: chartsWidth + rightWidth, y2: 0.5, style: chartAxisStyle }),
            React.createElement(react_axis_1.TimeAxis, { timezone: timezone, position: "bottom", beginTime: new Date(this.props.timeRange.begin().getTime()), endTime: new Date(this.props.timeRange.end().getTime()), width: timeAxisWidth, margin: 0, height: 50, tickExtend: gridHeight, style: timeAxisStyle, format: this.props.timeFormat, angled: this.props.timeAxisAngledLabels })));
        var rows = (React.createElement("g", { transform: "translate(" + (leftWidth + paddingLeft) + "," + (paddingTop + titleHeight) + ")" },
            React.createElement(EventHandler_1.EventHandler, { key: "event-handler", width: chartsWidth, height: chartsHeight + timeAxisHeight, scale: timeScale, enablePanZoom: this.props.enablePanZoom, enableDragZoom: this.props.enableDragZoom, minDuration: this.props.minDuration, minTime: this.props.minTime, maxTime: this.props.maxTime, onMouseOut: this.handleMouseOut, onMouseMove: function (x, y) { return _this.handleMouseMove(x, y); }, onMouseClick: this.handleBackgroundClick, onZoom: function (tr) { return _this.handleZoom(tr); } }, chartRows)));
        var svgWidth = this.props.width;
        var svgHeight = yPosition + timeAxisHeight + paddingTop + paddingBottom + titleHeight;
        var svgStyle = _.merge(true, { display: "block" }, this.props.timeAxisStyle ? this.props.timeAxisStyle : {});
        return this.props.showGridPosition.toUpperCase() === ShowGridPosition.Over ? (React.createElement("svg", { width: svgWidth, height: svgHeight, style: svgStyle, ref: function (c) {
                _this.svg = c;
            } },
            title,
            rows,
            tracker,
            timeAxis)) : (React.createElement("svg", { width: svgWidth, height: svgHeight, style: { display: "block" }, ref: function (c) {
                _this.svg = c;
            } },
            title,
            timeAxis,
            rows,
            tracker));
    };
    ChartContainer.defaultProps = {
        width: 800,
        padding: 0,
        enablePanZoom: false,
        enableDragZoom: false,
        timezone: "local",
        showGrid: false,
        showGridPosition: ShowGridPosition.Over,
        chartAxisStyle: defaultChartAxisStyle
    };
    return ChartContainer;
}(React.Component));
exports.ChartContainer = ChartContainer;
//# sourceMappingURL=ChartContainer.js.map