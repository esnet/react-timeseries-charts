"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var Immutable = require("immutable");
var React = require("react");
var d3_shape_1 = require("d3-shape");
var pondjs_1 = require("pondjs");
var curve_1 = require("./curve");
var styler_1 = require("./styler");
var util_1 = require("./util");
var style_1 = require("./style");
var defaultAggregation = {
    size: pondjs_1.window(pondjs_1.duration("5m")),
    reducers: {
        outer: [pondjs_1.min(), pondjs_1.max()],
        inner: [pondjs_1.percentile(25), pondjs_1.percentile(75)],
        center: pondjs_1.median()
    }
};
function getSeries(series, column) {
    return series.map(function (e) {
        var v = e.get(column);
        var d = {
            center: null,
            innerMin: null,
            innerMax: null,
            outerMin: null,
            outerMax: null
        };
        switch (v.size) {
            case 1:
                d.center = v.get(0);
                break;
            case 2:
                d.innerMin = v.get(0);
                d.innerMax = v.get(1);
                break;
            case 3:
                d.innerMin = v.get(0);
                d.center = v.get(1);
                d.innerMax = v.get(2);
                break;
            case 4:
                d.outerMin = v.get(0);
                d.innerMin = v.get(1);
                d.innerMax = v.get(2);
                d.outerMax = v.get(3);
                break;
            case 5:
                d.outerMin = v.get(0);
                d.innerMin = v.get(1);
                d.center = v.get(2);
                d.innerMax = v.get(3);
                d.outerMax = v.get(4);
                break;
            default:
                console.error("Tried to make bandchart from invalid array");
        }
        var ee = new pondjs_1.Event(pondjs_1.index(e.indexAsString()), Immutable.Map(d));
        return ee;
    });
}
function getAggregatedSeries(series, column, aggregation) {
    if (aggregation === void 0) { aggregation = defaultAggregation; }
    var size = aggregation.size, reducers = aggregation.reducers;
    var inner = reducers.inner, outer = reducers.outer, center = reducers.center;
    var d = {};
    if (inner) {
        d.innerMin = [column, inner[0]];
        d.innerMax = [column, inner[1]];
    }
    if (outer) {
        d.outerMin = [column, outer[0]];
        d.outerMax = [column, outer[1]];
    }
    if (center) {
        d.center = [column, center];
    }
    return series.fixedWindowRollup({
        window: size,
        aggregation: d
    });
}
var BandChart = (function (_super) {
    tslib_1.__extends(BandChart, _super);
    function BandChart(props) {
        var _this = _super.call(this, props) || this;
        _this.series = null;
        if (props.series.size() > 0) {
            if (props.series.atFirst().keyType() === "time") {
                var input = props.series;
                _this.series = getAggregatedSeries(input, props.column, props.aggregation);
            }
            else {
                var input = props.series;
                _this.series = getSeries(input, props.column);
            }
        }
        return _this;
    }
    BandChart.prototype.componentWillReceiveProps = function (nextProps) {
        var aggregation = nextProps.aggregation;
        var aggregationChanged = false;
        if (_.isUndefined(aggregation) !== _.isUndefined(this.props.aggregation)) {
            aggregationChanged = true;
        }
        if (aggregation && this.props.aggregation) {
            if (aggregation.size !== this.props.aggregation.size) {
                aggregationChanged = true;
            }
        }
        if (aggregationChanged) {
            this.series = getAggregatedSeries(nextProps.series, nextProps.column, nextProps.aggregation);
        }
    };
    BandChart.prototype.shouldComponentUpdate = function (nextProps) {
        var newSeries = nextProps.series;
        var width = nextProps.width;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var column = nextProps.column;
        var style = nextProps.style;
        var aggregation = nextProps.aggregation;
        var highlighted = nextProps.highlighted;
        var selected = nextProps.selected;
        var oldSeries = this.props.series;
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = util_1.scaleAsString(this.props.timeScale) !== util_1.scaleAsString(timeScale);
        var yAxisScaleChanged = this.props.yScale !== yScale;
        var columnChanged = this.props.column !== column;
        var styleChanged = JSON.stringify(this.props.style) !== JSON.stringify(style);
        var highlightedChanged = this.props.highlighted !== highlighted;
        var selectedChanged = this.props.selected !== selected;
        var aggregationChanged = false;
        if (_.isUndefined(aggregation) !== _.isUndefined(this.props.aggregation)) {
            aggregationChanged = true;
        }
        if (aggregation && this.props.aggregation) {
            if (aggregation.size !== this.props.aggregation.size) {
                aggregationChanged = true;
            }
        }
        var seriesChanged = false;
        if (oldSeries.size() !== newSeries.size()) {
            seriesChanged = true;
        }
        else {
            seriesChanged = !pondjs_1.TimeSeries.is(oldSeries, newSeries);
        }
        if (seriesChanged) {
            if (nextProps.series.size() > 0) {
                if (nextProps.series.atFirst().keyType() === "time") {
                    var input = nextProps.series;
                    this.series = getAggregatedSeries(input, nextProps.column, nextProps.aggregation);
                }
                else {
                    var input = nextProps.series;
                    this.series = getSeries(nextProps.series, nextProps.column);
                }
            }
        }
        return (seriesChanged ||
            timeScaleChanged ||
            widthChanged ||
            columnChanged ||
            styleChanged ||
            yAxisScaleChanged ||
            aggregationChanged ||
            highlightedChanged ||
            selectedChanged);
    };
    BandChart.prototype.handleHover = function (e, column) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(column);
        }
    };
    BandChart.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    BandChart.prototype.handleClick = function (e, column) {
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(column);
        }
        e.stopPropagation();
    };
    BandChart.prototype.providedStyleArray = function (column) {
        var style = style_1.defaultBandChartStyle;
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                style = this.props.style.bandChartStyle()[column];
            }
            else if (_.isFunction(this.props.style)) {
                style = this.props.style(column);
            }
            else if (_.isObject(this.props.style)) {
                style = this.props.style[column];
            }
        }
        return style;
    };
    BandChart.prototype.style = function (column, event, level) {
        var style;
        if (!this.providedStyle) {
            this.providedStyle = this.providedStyleArray(this.props.column);
        }
        if (!_.isNull(this.providedStyle) &&
            (!_.isArray(this.providedStyle) || this.providedStyle.length !== 3)) {
            console.warn("Provided style to BandChart should be an array of 3 objects");
            return style_1.defaultBandChartStyle[level];
        }
        var isHighlighted = this.props.highlighted && pondjs_1.Event.is(this.props.highlighted, event);
        var isSelected = this.props.selected && pondjs_1.Event.is(this.props.selected, event);
        if (this.props.selected) {
            if (isSelected) {
                if (!this.selectedStyle || !this.selectedStyle[level]) {
                    if (!this.selectedStyle) {
                        this.selectedStyle = [];
                    }
                    this.selectedStyle[level] = _.merge(style_1.defaultBandChartStyle[level].selected, this.providedStyle[level].selected ? this.providedStyle[level].selected : {});
                }
                style = this.selectedStyle[level];
            }
            else if (isHighlighted) {
                if (!this.highlightedStyle || !this.highlightedStyle[level]) {
                    if (!this.highlightedStyle) {
                        this.highlightedStyle = [];
                    }
                    this.highlightedStyle[level] = _.merge(style_1.defaultBandChartStyle[level].highlighted, this.providedStyle[level].highlighted
                        ? this.providedStyle[level].highlighted
                        : {});
                }
                style = this.highlightedStyle[level];
            }
            else {
                if (!this.mutedStyle) {
                    this.mutedStyle = [];
                }
                if (!this.mutedStyle[level]) {
                    this.mutedStyle[level] = _.merge(style_1.defaultBandChartStyle[level].muted, this.providedStyle[level].muted ? this.providedStyle[level].muted : {});
                }
                style = this.mutedStyle[level];
            }
        }
        else if (isHighlighted) {
            if (!this.highlightedStyle || !this.highlightedStyle[level]) {
                if (!this.highlightedStyle) {
                    this.highlightedStyle = [];
                }
                this.highlightedStyle[level] = _.merge(style_1.defaultBandChartStyle[level].highlighted, this.providedStyle[level].highlighted
                    ? this.providedStyle[level].highlighted
                    : {});
            }
            style = this.highlightedStyle[level];
        }
        else {
            if (!this.normalStyle) {
                this.normalStyle = [];
            }
            if (!this.normalStyle[level]) {
                this.normalStyle[level] = _.merge(style_1.defaultBandChartStyle[level].normal, this.providedStyle[level].normal ? this.providedStyle[level].normal : {});
            }
            style = this.normalStyle[level];
        }
        return style;
    };
    BandChart.prototype.renderAreas = function () {
        var _this = this;
        var column = this.props.column;
        var areas = [];
        var styles = [];
        var event = this.series.eventList().first();
        styles[0] = this.style(column, event, 0);
        styles[1] = this.style(column, event, 1);
        styles[2] = this.style(column, event, 2);
        var areaGenerator = d3_shape_1.area()
            .curve(curve_1.default[this.props.interpolation])
            .x(function (d) { return d.x0; })
            .y0(function (d) { return d.y0; })
            .y1(function (d) { return d.y1; });
        var columns = this.series.columns();
        var hasInner = true;
        var hasOuter = true;
        var hasCenter = true;
        if (_.has(columns, "innerMin") || _.has(columns, "innerMax")) {
            hasInner = false;
        }
        if (_.has(columns, "outerMin") || _.has(columns, "outerMax")) {
            hasOuter = false;
        }
        if (hasOuter) {
            var level = 0;
            if (!hasInner) {
                level += 1;
            }
            var outerData = [];
            for (var j = 0; j < this.series.size(); j += 1) {
                var e = this.series.at(j);
                var timestamp = new Date(e.begin().getTime() + (e.end().getTime() - e.begin().getTime()) / 2);
                outerData.push({
                    x0: this.props.timeScale(timestamp),
                    y0: this.props.yScale(e.get("outerMin")),
                    y1: this.props.yScale(e.get("outerMax"))
                });
            }
            var outerAreaPath = areaGenerator(outerData);
            areas.push(React.createElement("g", { key: "area-outer" },
                React.createElement("path", { d: outerAreaPath, style: styles[level], onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } })));
        }
        if (hasInner) {
            var level = 0;
            if (!hasInner) {
                level += 1;
            }
            var innerData = [];
            for (var j = 0; j < this.series.size(); j += 1) {
                var e = this.series.at(j);
                var timestamp = new Date(e.begin().getTime() + (e.end().getTime() - e.begin().getTime()) / 2);
                innerData.push({
                    x0: this.props.timeScale(timestamp),
                    y0: this.props.yScale(e.get("innerMin")),
                    y1: this.props.yScale(e.get("innerMax"))
                });
            }
            var innerAreaPath = areaGenerator(innerData);
            areas.push(React.createElement("g", { key: "area-inner" },
                React.createElement("path", { d: innerAreaPath, style: styles[level], onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } })));
        }
        return React.createElement("g", null, areas);
    };
    BandChart.prototype.render = function () {
        return React.createElement("g", null, this.renderAreas());
    };
    BandChart.defaultProps = {
        column: "value",
        innerSpacing: 1.0,
        outerSpacing: 2.0,
        infoMarkerRadius: 2,
        infoWidth: 90,
        infoHeight: 30
    };
    return BandChart;
}(React.Component));
exports.BandChart = BandChart;
//# sourceMappingURL=BandChart.js.map