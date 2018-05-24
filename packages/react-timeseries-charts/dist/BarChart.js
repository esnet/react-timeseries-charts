"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var React = require("react");
var pondjs_1 = require("pondjs");
var EventMarker_1 = require("./EventMarker");
var styler_1 = require("./styler");
var style_1 = require("./style");
var BarChart = (function (_super) {
    tslib_1.__extends(BarChart, _super);
    function BarChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarChart.prototype.handleHover = function (e, event, column) {
        var bar = { event: event, column: column };
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(bar);
        }
    };
    BarChart.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    BarChart.prototype.handleClick = function (e, event, column) {
        var bar = { event: event, column: column };
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(bar);
        }
        e.stopPropagation();
    };
    BarChart.prototype.providedBarStyleMap = function (column) {
        var style = style_1.defaultBarChartChannelStyle;
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                style = this.props.style.barChartStyle()[column];
            }
            else if (_.isObject(this.props.style)) {
                style = this.props.style[column];
            }
            else if (_.isFunction(this.props.style)) {
                style = this.props.style(column);
            }
        }
        return style;
    };
    BarChart.prototype.style = function (element, column, event) {
        var style;
        var styleMap = this.providedBarStyleMap(column);
        var d = style_1.defaultBarChartChannelStyle.bar;
        var s = styleMap[element] ? styleMap[element] : styleMap;
        var isHighlighted = this.props.highlighted &&
            column === this.props.highlighted.column &&
            pondjs_1.Event.is(this.props.highlighted.event, event);
        var isSelected = this.props.selected &&
            column === this.props.selected.column &&
            pondjs_1.Event.is(this.props.selected.event, event);
        if (this.props.selected) {
            if (isSelected) {
                style = _.merge(true, d.selected, s.selected ? s.selected : {});
            }
            else if (isHighlighted) {
                style = _.merge(true, d.highlighted, s.highlighted ? s.highlighted : {});
            }
            else {
                style = _.merge(true, d.muted, s.muted ? s.muted : {});
            }
        }
        else if (isHighlighted) {
            style = _.merge(true, d.highlighted, s.highlighted ? s.highlighted : {});
        }
        else {
            style = _.merge(true, d.normal, s.normal ? s.normal : {});
        }
        return style;
    };
    BarChart.prototype.renderBars = function () {
        var _this = this;
        var spacing = +this.props.spacing;
        var offset = +this.props.offset;
        var minBarHeight = this.props.minBarHeight;
        var series = this.props.series;
        var timeScale = this.props.timeScale;
        var yScale = this.props.yScale;
        var columns = this.props.columns || ["value"];
        var bars = [];
        var eventMarker;
        series
            .collection()
            .eventList()
            .forEach(function (event) {
            var begin = event.begin();
            var end = event.end();
            var beginPos = timeScale(begin) + spacing;
            var endPos = timeScale(end) - spacing;
            var width;
            if (_this.props.size) {
                width = _this.props.size;
            }
            else {
                width = endPos - beginPos;
            }
            if (width < 1) {
                width = 1;
            }
            var x;
            if (_this.props.size) {
                var center = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;
                x = center - _this.props.size / 2 + offset;
            }
            else {
                x = timeScale(begin) + spacing + offset;
            }
            var yBase = yScale(0);
            var yposPositive = yBase;
            var yposNegative = yBase;
            if (columns) {
                var _loop_1 = function (column) {
                    var index = event.indexAsString();
                    var key = series.name() + "-" + index + "-" + column;
                    var value = event.get(column);
                    var style = _this.style("bar", column, event);
                    var height = yScale(0) - yScale(value);
                    var positiveBar = height >= 0;
                    height = Math.max(Math.abs(height), minBarHeight);
                    var y = positiveBar ? yposPositive - height : yposNegative;
                    var isHighlighted = _this.props.highlighted &&
                        column === _this.props.highlighted.column &&
                        pondjs_1.Event.is(_this.props.highlighted.event, event);
                    if (isHighlighted && _this.props.info) {
                        var eventMarkerProps = {
                            key: key,
                            event: event,
                            column: column,
                            type: "flag",
                            info: _this.props.info,
                            style: _this.props.infoStyle,
                            width: _this.props.width,
                            height: _this.props.height,
                            infoWidth: _this.props.infoWidth,
                            infoHeight: _this.props.infoWidth,
                            infoTimeFormat: _this.props.infoTimeFormat,
                            markerRadius: _this.props.markerRadius,
                            offsetX: offset,
                            offsetY: yBase - (positiveBar ? yposPositive : yposNegative),
                            timeScale: _this.props.timeScale,
                            yScale: _this.props.yScale
                        };
                        eventMarker = React.createElement(EventMarker_1.EventMarker, tslib_1.__assign({}, eventMarkerProps));
                    }
                    var barProps = {
                        key: key,
                        style: style,
                        x: x,
                        y: y,
                        width: width,
                        height: height
                    };
                    if (_this.props.onSelectionChange) {
                        barProps.onClick = function (e) { return _this.handleClick(e, event, column); };
                    }
                    if (_this.props.onHighlightChange) {
                        barProps.onMouseMove = function (e) { return _this.handleHover(e, event, column); };
                        barProps.onMouseLeave = function () { return _this.handleHoverLeave(); };
                    }
                    bars.push(React.createElement("rect", tslib_1.__assign({}, barProps)));
                    if (positiveBar) {
                        yposPositive -= height;
                    }
                    else {
                        yposNegative += height;
                    }
                };
                for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                    var column = columns_1[_i];
                    _loop_1(column);
                }
            }
        });
        return (React.createElement("g", null,
            bars,
            eventMarker));
    };
    BarChart.prototype.render = function () {
        return React.createElement("g", null, this.renderBars());
    };
    BarChart.defaultProps = {
        visible: true,
        columns: ["value"],
        spacing: 1.0,
        offset: 0,
        minBarHeight: 1,
        markerRadius: 2,
        infoWidth: 90,
        infoHeight: 30
    };
    return BarChart;
}(React.Component));
exports.BarChart = BarChart;
//# sourceMappingURL=BarChart.js.map