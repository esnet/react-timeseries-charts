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
import * as Immutable from "immutable";
import * as React from "react";
import { Event, indexedEvent, max, median, min, percentile, TimeSeries, duration, window } from "pondjs";
import { EventMarker } from "./EventMarker";
import { Styler } from "./styler";
import { scaleAsString } from "./util";
import { defaultBoxChartStyle as defaultStyle } from "./style";
var defaultAggregation = {
    size: window(duration("5m")),
    reducers: {
        outer: [min(), max()],
        inner: [percentile(25), percentile(75)],
        center: median()
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
        switch (v.length) {
            case 1:
                d.center = v[0];
                break;
            case 2:
                d.innerMin = v[0];
                d.innerMax = v[1];
                break;
            case 3:
                d.innerMin = v[0];
                d.center = v[1];
                d.innerMax = v[2];
                break;
            case 4:
                d.outerMin = v[0];
                d.innerMin = v[1];
                d.innerMax = v[2];
                d.outerMax = v[3];
                break;
            case 5:
                d.outerMin = v[0];
                d.innerMin = v[1];
                d.center = v[2];
                d.innerMax = v[3];
                d.outerMax = v[4];
                break;
            default:
                console.error("Tried to make boxchart from invalid array");
        }
        return indexedEvent(e.index(), Immutable.Map(d));
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
var BoxChart = (function (_super) {
    __extends(BoxChart, _super);
    function BoxChart(props) {
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
    BoxChart.prototype.componentWillReceiveProps = function (nextProps) {
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
    BoxChart.prototype.shouldComponentUpdate = function (nextProps) {
        var newSeries = nextProps.series;
        var oldSeries = this.props.series;
        var width = nextProps.width;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var column = nextProps.column;
        var style = nextProps.style;
        var aggregation = nextProps.aggregation;
        var highlighted = nextProps.highlighted;
        var selected = nextProps.selected;
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
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
            seriesChanged = !TimeSeries.is(oldSeries, newSeries);
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
    BoxChart.prototype.handleHover = function (e, event) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(event);
        }
    };
    BoxChart.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    BoxChart.prototype.handleClick = function (e, event) {
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(event);
        }
        e.stopPropagation();
    };
    BoxChart.prototype.providedStyleArray = function (column) {
        var levelStyles = defaultStyle;
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
                levelStyles = this.props.style.boxChartStyle()[column];
            }
            else if (_.isFunction(this.props.style)) {
                levelStyles = this.props.style(column);
            }
            else if (_.isObject(this.props.style)) {
                levelStyles = this.props.style[column];
            }
        }
        return levelStyles;
    };
    BoxChart.prototype.style = function (column, event, level) {
        var style;
        if (!this.providedStyle) {
            this.providedStyle = this.providedStyleArray(this.props.column);
        }
        if (!_.isNull(this.providedStyle) &&
            (!_.isArray(this.providedStyle) || this.providedStyle.length !== 3)) {
            console.warn("Provided style to BoxChart should be an array of 3 objects");
            return defaultStyle[level];
        }
        var isHighlighted = this.props.highlighted && Event.is(this.props.highlighted, event);
        var isSelected = this.props.selected && Event.is(this.props.selected, event);
        if (this.props.selected) {
            if (isSelected) {
                if (!this.selectedStyle || !this.selectedStyle[level]) {
                    if (!this.selectedStyle) {
                        this.selectedStyle = [];
                    }
                    this.selectedStyle[level] = _.merge(defaultStyle[level].selected, this.providedStyle[level].selected ? this.providedStyle[level].selected : {});
                }
                style = this.selectedStyle[level];
            }
            else if (isHighlighted) {
                if (!this.highlightedStyle || !this.highlightedStyle[level]) {
                    if (!this.highlightedStyle) {
                        this.highlightedStyle = [];
                    }
                    this.highlightedStyle[level] = _.merge(defaultStyle[level].highlighted, this.providedStyle[level].highlighted
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
                    this.mutedStyle[level] = _.merge(defaultStyle[level].muted, this.providedStyle[level].muted ? this.providedStyle[level].muted : {});
                }
                style = this.mutedStyle[level];
            }
        }
        else if (isHighlighted) {
            style = _.merge(defaultStyle[level].highlighted, this.providedStyle[level].highlighted ? this.providedStyle[level].highlighted : {});
        }
        else {
            if (!this.normalStyle) {
                this.normalStyle = [];
            }
            if (!this.normalStyle[level]) {
                this.normalStyle[level] = _.merge(defaultStyle[level].normal, this.providedStyle[level].normal ? this.providedStyle[level].normal : {});
            }
            style = this.normalStyle[level];
        }
        return style;
    };
    BoxChart.prototype.renderBars = function () {
        var _this = this;
        var _a = this.props, timeScale = _a.timeScale, yScale = _a.yScale, column = _a.column;
        var innerSpacing = +this.props.innerSpacing;
        var outerSpacing = +this.props.outerSpacing;
        var innerSize = +this.props.innerSize;
        var outerSize = +this.props.outerSize;
        var bars = [];
        var eventMarker;
        var events = this.series.collection().eventList();
        events.forEach(function (event) {
            var index = event.index();
            var begin = event.begin();
            var end = event.end();
            var d = event.getData();
            var beginPosInner = timeScale(begin) + innerSpacing;
            var endPosInner = timeScale(end) - innerSpacing;
            var beginPosOuter = timeScale(begin) + outerSpacing;
            var endPosOuter = timeScale(end) - outerSpacing;
            var innerWidth = innerSize || endPosInner - beginPosInner;
            if (innerWidth < 1) {
                innerWidth = 1;
            }
            var outerWidth = outerSize || endPosOuter - beginPosOuter;
            if (outerWidth < 1) {
                outerWidth = 1;
            }
            var c = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;
            var xInner = timeScale(begin) + innerSpacing;
            if (innerSize) {
                xInner = c - innerSize / 2;
            }
            var xOuter = timeScale(begin) + outerSpacing;
            if (outerSize) {
                xOuter = c - outerSize / 2;
            }
            var styles = [];
            styles[0] = _this.style(column, event, 0);
            styles[1] = _this.style(column, event, 1);
            styles[2] = _this.style(column, event, 2);
            var innerMin = d.has("innerMin") ? yScale(event.get("innerMin")) : null;
            var innerMax = d.has("innerMax") ? yScale(event.get("innerMax")) : null;
            var outerMin = d.has("outerMin") ? yScale(event.get("outerMin")) : null;
            var outerMax = d.has("outerMax") ? yScale(event.get("outerMax")) : null;
            var center = d.has("center") ? yScale(event.get("center")) : null;
            var hasInner = true;
            var hasOuter = true;
            var hasCenter = true;
            if (_.isNull(innerMin) || _.isNull(innerMax)) {
                hasInner = false;
            }
            if (_.isNull(outerMin) || _.isNull(outerMax)) {
                hasOuter = false;
            }
            if (_.isNull(center)) {
                hasCenter = false;
            }
            var ymax = null;
            if (hasOuter) {
                var level = 0;
                if (!hasInner) {
                    level += 1;
                }
                if (!hasCenter) {
                    level += 1;
                }
                var keyOuter = _this.series.name() + "-" + index + "-outer";
                var boxOuter = {
                    x: xOuter,
                    y: outerMax,
                    width: outerWidth,
                    height: outerMin - outerMax,
                    rx: 2,
                    ry: 2
                };
                var barOuterProps = __assign({ key: keyOuter, style: styles[level] }, boxOuter);
                if (_this.props.onSelectionChange) {
                    barOuterProps.onClick = function (e) {
                        return _this.handleClick(e, event);
                    };
                }
                if (_this.props.onHighlightChange) {
                    barOuterProps.onMouseMove = function (e) {
                        return _this.handleHover(e, event);
                    };
                    barOuterProps.onMouseLeave = function () { return _this.handleHoverLeave(); };
                }
                bars.push(React.createElement("rect", __assign({}, barOuterProps)));
                ymax = "outerMax";
            }
            if (hasInner) {
                var level = 1;
                if (!hasCenter) {
                    level += 1;
                }
                var keyInner = _this.series.name() + "-" + index + "-inner";
                var boxInner = {
                    x: xInner,
                    y: innerMax,
                    width: innerWidth,
                    height: innerMin - innerMax,
                    rx: 1,
                    ry: 1
                };
                var barInnerProps = __assign({ key: keyInner }, boxInner, { style: styles[level] });
                if (_this.props.onSelectionChange) {
                    barInnerProps.onClick = function (e) {
                        return _this.handleClick(e, event);
                    };
                }
                if (_this.props.onHighlightChange) {
                    barInnerProps.onMouseMove = function (e) {
                        return _this.handleHover(e, event);
                    };
                    barInnerProps.onMouseLeave = function () { return _this.handleHoverLeave(); };
                }
                bars.push(React.createElement("rect", __assign({}, barInnerProps)));
                ymax = ymax || "innerMax";
            }
            if (hasCenter) {
                var level = 2;
                var keyCenter = _this.series.name() + "-" + index + "-center";
                var boxCenter = {
                    x: xInner,
                    y: center,
                    width: innerWidth,
                    height: 1
                };
                var barCenterProps = __assign({ key: keyCenter }, boxCenter, { style: styles[level] });
                if (_this.props.onSelectionChange) {
                    barCenterProps.onClick = function (e) {
                        return _this.handleClick(e, event);
                    };
                }
                if (_this.props.onHighlightChange) {
                    barCenterProps.onMouseMove = function (e) {
                        return _this.handleHover(e, event);
                    };
                    barCenterProps.onMouseLeave = function () { return _this.handleHoverLeave(); };
                }
                bars.push(React.createElement("rect", __assign({}, barCenterProps)));
                ymax = ymax || "center";
            }
            var isHighlighted = _this.props.highlighted && Event.is(_this.props.highlighted, event);
            if (isHighlighted && _this.props.info) {
                var eventMarkerProps = {
                    key: "marker-" + index,
                    event: event,
                    column: column,
                    type: "point",
                    info: _this.props.info,
                    style: _this.props.infoStyle,
                    yValueFunc: function (e) { return e.get(ymax); },
                    width: _this.props.width,
                    height: _this.props.height,
                    infoWidth: _this.props.infoWidth,
                    infoHeight: _this.props.infoWidth,
                    infoTimeFormat: _this.props.infoTimeFormat,
                    markerRadius: _this.props.infoMarkerRadius
                };
                eventMarker = React.createElement(EventMarker, __assign({}, eventMarkerProps));
            }
        });
        return (React.createElement("g", null,
            bars,
            eventMarker));
    };
    BoxChart.prototype.render = function () {
        return React.createElement("g", null, this.renderBars());
    };
    BoxChart.defaultProps = {
        column: "value",
        innerSpacing: 1.0,
        outerSpacing: 2.0,
        infoStyle: {
            stroke: "#999",
            fill: "white",
            opacity: 0.9,
            pointerEvents: "none"
        },
        stemStyle: {
            stroke: "#999",
            cursor: "crosshair",
            pointerEvents: "none"
        },
        markerStyle: {
            fill: "#999"
        },
        infoMarkerRadius: 2,
        infoWidth: 90,
        infoHeight: 30
    };
    return BoxChart;
}(React.Component));
export { BoxChart };
//# sourceMappingURL=BoxChart.js.map