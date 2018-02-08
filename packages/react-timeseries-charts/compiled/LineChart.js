"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var d3_shape_1 = require("d3-shape");
var React = require("react");
var pondjs_1 = require("pondjs");
var styler_1 = require("./styler");
var util_1 = require("./util");
var curve_1 = require("./curve");
var types_1 = require("./types");
var style_1 = require("./style");
var LineChart = (function (_super) {
    tslib_1.__extends(LineChart, _super);
    function LineChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineChart.prototype.shouldComponentUpdate = function (nextProps) {
        var newSeries = nextProps.series;
        var oldSeries = this.props.series;
        var width = nextProps.width;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var interpolation = nextProps.interpolation;
        var highlight = nextProps.highlight;
        var selection = nextProps.selection;
        var columns = nextProps.columns;
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = util_1.scaleAsString(this.props.timeScale) !== util_1.scaleAsString(timeScale);
        var yAxisScaleChanged = this.props.yScale !== yScale;
        var interpolationChanged = this.props.interpolation !== interpolation;
        var highlightChanged = this.props.highlight !== highlight;
        var selectionChanged = this.props.selection !== selection;
        var columnsChanged = this.props.columns !== columns;
        var seriesChanged = false;
        if (oldSeries.length !== newSeries.length) {
            seriesChanged = true;
        }
        else {
            seriesChanged = !pondjs_1.TimeSeries.is(oldSeries, newSeries);
        }
        return (widthChanged ||
            seriesChanged ||
            timeScaleChanged ||
            yAxisScaleChanged ||
            interpolationChanged ||
            highlightChanged ||
            selectionChanged ||
            columnsChanged);
    };
    LineChart.prototype.handleHover = function (e, column) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(column);
        }
    };
    LineChart.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    LineChart.prototype.handleClick = function (e, column) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(column);
        }
    };
    LineChart.prototype.providedPathStyleMap = function (column) {
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                return this.props.style.lineChartStyle()[column];
            }
            else if (_.isObject(this.props.style)) {
                var s = this.props.style;
                return s[column];
            }
            else {
                var fn = this.props.style;
                return fn(column);
            }
        }
    };
    LineChart.prototype.pathStyle = function (column) {
        var style;
        var isHighlighted = this.props.highlight && column === this.props.highlight;
        var isSelected = this.props.selection && column === this.props.selection;
        var s = this.providedPathStyleMap(column).line;
        var d = style_1.defaultLineChartChannelStyle.line;
        if (this.props.selection) {
            if (isSelected) {
                style = _.merge(d.selected, s.selected ? s.selected : {});
            }
            else if (isHighlighted) {
                style = _.merge(d.highlighted, s.highlighted ? s.highlighted : {});
            }
            else {
                style = _.merge(d.muted, s.muted ? s.muted : {});
            }
        }
        else if (isHighlighted) {
            style = _.merge(true, d.highlighted, s.highlighted ? s.highlighted : {});
        }
        else {
            style = _.merge(true, d.normal, s.normal);
        }
        style.pointerEvents = "none";
        return style;
    };
    LineChart.prototype.renderPath = function (data, column, key) {
        var _this = this;
        var hitStyle = {
            stroke: "white",
            fill: "none",
            opacity: 0.0,
            strokeWidth: 7,
            cursor: "crosshair",
            pointerEvents: "stroke"
        };
        var path = d3_shape_1.line()
            .x(function (d) { return _this.props.timeScale(d.x); })
            .curve(curve_1.default[this.props.interpolation])
            .y(function (d) { return _this.props.yScale(d.y); })(data);
        return (React.createElement("g", { key: key },
            React.createElement("path", { d: path, style: this.pathStyle(column) }),
            React.createElement("path", { d: path, style: hitStyle, onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } })));
    };
    LineChart.prototype.renderLines = function () {
        var _this = this;
        return _.map(this.props.columns, function (column) { return _this.renderLine(column); });
    };
    LineChart.prototype.renderLine = function (column) {
        var pathLines = [];
        var count = 1;
        if (this.props.breakLine) {
            var currentPoints = null;
            for (var _i = 0, _a = this.props.series.collection().eventList(); _i < _a.length; _i++) {
                var d = _a[_i];
                var timestamp = new Date(d.begin().getTime() + (d.end().getTime() - d.begin().getTime()) / 2);
                var value = d.get(column);
                var badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                if (!badPoint) {
                    if (!currentPoints)
                        currentPoints = [];
                    currentPoints.push({ x: timestamp, y: value });
                }
                else if (currentPoints) {
                    if (currentPoints.length > 1) {
                        pathLines.push(this.renderPath(currentPoints, column, count));
                        count += 1;
                    }
                    currentPoints = null;
                }
            }
            if (currentPoints && currentPoints.length > 1) {
                pathLines.push(this.renderPath(currentPoints, column, count));
                count += 1;
            }
        }
        else {
            var cleanedPoints = [];
            for (var _b = 0, _c = this.props.series.collection().eventList(); _b < _c.length; _b++) {
                var d = _c[_b];
                var timestamp = new Date(d.begin().getTime() + (d.end().getTime() - d.begin().getTime()) / 2);
                var value = d.get(column);
                var badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                if (!badPoint) {
                    cleanedPoints.push({ x: timestamp, y: value });
                }
            }
            pathLines.push(this.renderPath(cleanedPoints, column, count));
            count += 1;
        }
        return React.createElement("g", { key: column }, pathLines);
    };
    LineChart.prototype.render = function () {
        return React.createElement("g", null, this.renderLines());
    };
    LineChart.defaultProps = {
        columns: ["value"],
        interpolation: types_1.CurveInterpolation.curveLinear,
        breakLine: true
    };
    return LineChart;
}(React.Component));
exports.LineChart = LineChart;
//# sourceMappingURL=LineChart.js.map