"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("array.prototype.fill");
var _ = require("lodash");
var React = require("react");
var d3_shape_1 = require("d3-shape");
var pondjs_1 = require("pondjs");
var style_1 = require("./style");
var types_1 = require("./types");
var util_1 = require("./util");
var styler_1 = require("./styler");
var curve_1 = require("./curve");
var StyleType;
(function (StyleType) {
    StyleType["Line"] = "line";
    StyleType["Area"] = "area";
})(StyleType = exports.StyleType || (exports.StyleType = {}));
var AreaChart = (function (_super) {
    tslib_1.__extends(AreaChart, _super);
    function AreaChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AreaChart.prototype.shouldComponentUpdate = function (nextProps) {
        var newSeries = nextProps.series;
        var oldSeries = this.props.series;
        var width = nextProps.width;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var interpolation = nextProps.interpolation;
        var columns = nextProps.columns;
        var style = nextProps.style;
        var highlight = nextProps.highlight;
        var selection = nextProps.selection;
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = util_1.scaleAsString(this.props.timeScale) !== util_1.scaleAsString(timeScale);
        var yAxisScaleChanged = this.props.yScale !== yScale;
        var interpolationChanged = this.props.interpolation !== interpolation;
        var columnsChanged = JSON.stringify(this.props.columns) !== JSON.stringify(columns);
        var styleChanged = JSON.stringify(this.props.style) !== JSON.stringify(style);
        var highlightChanged = this.props.highlight !== highlight;
        var selectionChanged = this.props.selection !== selection;
        var seriesChanged = false;
        if (oldSeries.size() !== newSeries.size()) {
            seriesChanged = true;
        }
        else {
            seriesChanged = !pondjs_1.TimeSeries.is(oldSeries, newSeries);
        }
        return (seriesChanged ||
            timeScaleChanged ||
            widthChanged ||
            interpolationChanged ||
            columnsChanged ||
            styleChanged ||
            yAxisScaleChanged ||
            highlightChanged ||
            selectionChanged);
    };
    AreaChart.prototype.handleHover = function (e, column) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(column);
        }
    };
    AreaChart.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    AreaChart.prototype.handleClick = function (e, column) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(column);
        }
    };
    AreaChart.prototype.providedAreaStyleMap = function (column) {
        var style = style_1.defaultAreaChartStyle;
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                style = this.props.style.areaChartStyle()[column];
            }
            else if (_.isObject(this.props.style)) {
                style = this.props.style[column];
            }
            else if (_.isFunction(this.props.style)) {
                style = this.props.style[column];
            }
        }
        return style;
    };
    AreaChart.prototype.style = function (column, type) {
        var style;
        var styleMap = this.providedAreaStyleMap(column);
        var isHighlighted = this.props.highlight && column === this.props.highlight;
        var isSelected = this.props.selection && column === this.props.selection;
        if (!_.has(styleMap, StyleType.Line)) {
            console.error("Provided style for AreaChart does not define a style for the outline:", styleMap, column);
        }
        if (!_.has(styleMap, StyleType.Area)) {
            console.error("Provided style for AreaChart does not define a style for the area:", styleMap);
        }
        if (this.props.selection) {
            if (isSelected) {
                style = _.merge({}, style_1.defaultAreaChartStyle[type].selected, styleMap[type].selected ? styleMap[type].selected : {});
            }
            else if (isHighlighted) {
                style = _.merge({}, style_1.defaultAreaChartStyle[type].highlighted, styleMap[type].highlighted ? styleMap[type].highlighted : {});
            }
            else {
                style = _.merge({}, style_1.defaultAreaChartStyle[type].muted, styleMap[type].muted ? styleMap[type].muted : {});
            }
        }
        else if (isHighlighted) {
            style = _.merge({}, style_1.defaultAreaChartStyle[type].highlighted, styleMap[type].highlighted ? styleMap[type].highlighted : {});
        }
        else {
            style = _.merge({}, style_1.defaultAreaChartStyle[type].normal, styleMap[type].normal ? styleMap[type].normal : {});
        }
        return style;
    };
    AreaChart.prototype.pathStyle = function (column) {
        return this.style(column, StyleType.Line);
    };
    AreaChart.prototype.areaStyle = function (column) {
        return this.style(column, StyleType.Area);
    };
    AreaChart.prototype.renderPaths = function (columnList, direction) {
        var _this = this;
        var dir = direction === "up" ? 1 : -1;
        var size = this.props.series.size();
        var offsets = new Array(size).fill(0);
        return columnList.map(function (column, i) {
            var style = _this.areaStyle(column);
            var pathStyle = _this.pathStyle(column);
            var data = [];
            for (var j = 0; j < _this.props.series.size(); j += 1) {
                var seriesPoint = _this.props.series.at(j);
                data.push({
                    x0: _this.props.timeScale(seriesPoint.timestamp()),
                    y0: _this.props.yScale(offsets[j]),
                    y1: _this.props.yScale(offsets[j] + dir * seriesPoint.get(column))
                });
                if (_this.props.stack) {
                    offsets[j] += dir * seriesPoint.get(column);
                }
            }
            var areaGenerator = d3_shape_1.area()
                .curve(curve_1.default[_this.props.interpolation])
                .x(function (d) { return d.x0; })
                .y0(function (d) { return d.y0; })
                .y1(function (d) { return d.y1; });
            var areaPath = areaGenerator(data);
            var lineGenerator = d3_shape_1.line()
                .curve(curve_1.default[_this.props.interpolation])
                .x(function (d) { return d.x0; })
                .y(function (d) { return d.y1; });
            var outlinePath = lineGenerator(data);
            return (React.createElement("g", { key: "area-" + i },
                React.createElement("path", { d: areaPath, style: style, onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } }),
                React.createElement("path", { d: outlinePath, style: pathStyle, onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } })));
        });
    };
    AreaChart.prototype.renderAreas = function () {
        var up = this.props.columns.up || [];
        var down = this.props.columns.down || [];
        return (React.createElement("g", null,
            this.renderPaths(up, "up"),
            this.renderPaths(down, "down")));
    };
    AreaChart.prototype.render = function () {
        return React.createElement("g", null, this.renderAreas());
    };
    AreaChart.defaultProps = {
        interpolation: types_1.CurveInterpolation.curveLinear,
        columns: {
            up: [],
            down: []
        },
        stack: true
    };
    return AreaChart;
}(React.Component));
exports.AreaChart = AreaChart;
//# sourceMappingURL=AreaChart.js.map