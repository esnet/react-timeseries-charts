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
import "array.prototype.fill";
import * as _ from "lodash";
import * as React from "react";
import { area, line } from "d3-shape";
import { TimeSeries } from "pondjs";
import { defaultAreaChartStyle as defaultStyle } from "./style";
import { CurveInterpolation } from "./types";
import { scaleAsString } from "./util";
import { Styler } from "./styler";
import curves from "./curve";
import "@types/d3-shape";
export var StyleType;
(function (StyleType) {
    StyleType["Line"] = "line";
    StyleType["Area"] = "area";
})(StyleType || (StyleType = {}));
var AreaChart = (function (_super) {
    __extends(AreaChart, _super);
    function AreaChart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultProps = {
            interpolation: CurveInterpolation.curveLinear,
            columns: {
                up: [],
                down: []
            },
            stack: true
        };
        return _this;
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
        var timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
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
            seriesChanged = !TimeSeries.is(oldSeries, newSeries);
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
        var style = defaultStyle;
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
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
                style = _.merge(defaultStyle[type].selected, styleMap[type].selected ? styleMap[type].selected : {});
            }
            else if (isHighlighted) {
                style = _.merge(defaultStyle[type].highlighted, styleMap[type].highlighted ? styleMap[type].highlighted : {});
            }
            else {
                style = _.merge(defaultStyle[type].muted, styleMap[type].muted ? styleMap[type].muted : {});
            }
        }
        else if (isHighlighted) {
            style = _.merge(defaultStyle[type].highlighted, styleMap[type].highlighted ? styleMap[type].highlighted : {});
        }
        else {
            style = _.merge(defaultStyle[type].normal, styleMap[type].normal ? styleMap[type].normal : {});
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
            var areaGenerator = area()
                .curve(curves[_this.props.interpolation])
                .x(function (d) { return d.x0; })
                .y0(function (d) { return d.y0; })
                .y1(function (d) { return d.y1; });
            var areaPath = areaGenerator(data);
            var lineGenerator = line()
                .curve(curves[_this.props.interpolation])
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
    return AreaChart;
}(React.Component));
export { AreaChart };
//# sourceMappingURL=AreaChart.js.map