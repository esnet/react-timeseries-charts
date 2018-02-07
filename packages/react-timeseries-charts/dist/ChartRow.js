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
import * as React from "react";
import { easeSinOut } from "d3-ease";
import { scaleLinear, scaleLog, scalePow } from "d3-scale";
import { Brush } from "./Brush";
import { Charts, ScaleType } from "./Charts";
import { TimeMarker } from "./TimeMarker";
import { YAxis } from "./YAxis";
import ScaleInterpolator from "./interpolators";
import "@types/d3-scale";
import "@types/underscore";
var AXIS_MARGIN = 5;
function createScale(yaxis, type, min, max, y0, y1) {
    if (_.isUndefined(min) || _.isUndefined(max)) {
        return null;
    }
    switch (type) {
        case ScaleType.Linear:
            return scaleLinear()
                .domain([min, max])
                .range([y0, y1])
                .nice();
        case ScaleType.Log:
            var base = yaxis.props.logBase || 10;
            return scaleLog()
                .base(base)
                .domain([min, max])
                .range([y0, y1]);
        case ScaleType.Power:
            var power = yaxis.props.powerExponent || 2;
            return scalePow()
                .exponent(power)
                .domain([min, max])
                .range([y0, y1]);
    }
}
var ChartRow = (function (_super) {
    __extends(ChartRow, _super);
    function ChartRow(props) {
        var _this = _super.call(this, props) || this;
        var clipId = _.uniqueId("clip_");
        var clipPathURL = "url(#" + clipId + ")";
        _this.state = {
            clipId: clipId,
            clipPathURL: clipPathURL
        };
        _this.scaleInterpolatorMap = {};
        return _this;
    }
    ChartRow.prototype.componentWillMount = function () {
        var _this = this;
        this.scaleInterpolatorMap = {};
        var innerHeight = +this.props.height - AXIS_MARGIN * 2;
        var rangeTop = AXIS_MARGIN;
        var rangeBottom = innerHeight - AXIS_MARGIN;
        React.Children.forEach(this.props.children, function (child) {
            if ((child.type === YAxis || _.has(child.props, "min")) && _.has(child.props, "max")) {
                var _a = child.props, id_1 = _a.id, max = _a.max, min = _a.min, _b = _a.transition, transition = _b === void 0 ? 0 : _b, _c = _a.type, type = _c === void 0 ? ScaleType.Linear : _c;
                var initialScale = createScale(child, type, min, max, rangeBottom, rangeTop);
                _this.scaleInterpolatorMap[id_1] = new ScaleInterpolator(transition, easeSinOut, function (s) {
                    var yAxisScalerMap = _this.state.yAxisScalerMap;
                    yAxisScalerMap[id_1] = s;
                    _this.setState(yAxisScalerMap);
                });
                var cacheKey = type + "-" + min + "-" + max + "-" + rangeBottom + "-" + rangeTop;
                _this.scaleInterpolatorMap[id_1].setScale(cacheKey, initialScale);
            }
        });
        var scalerMap = {};
        _.forEach(this.scaleInterpolatorMap, function (interpolator, id) {
            scalerMap[id] = interpolator.scaler();
        });
        this.setState({ yAxisScalerMap: scalerMap });
    };
    ChartRow.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        var innerHeight = +nextProps.height - AXIS_MARGIN * 2;
        var rangeTop = AXIS_MARGIN;
        var rangeBottom = innerHeight - AXIS_MARGIN;
        React.Children.forEach(nextProps.children, function (child) {
            if ((child.type === YAxis || _.has(child.props, "min")) && _.has(child.props, "max")) {
                var _a = child.props, id_2 = _a.id, max = _a.max, min = _a.min, _b = _a.transition, transition = _b === void 0 ? 0 : _b, _c = _a.type, type = _c === void 0 ? "linear" : _c;
                var scale = createScale(child, type, min, max, rangeBottom, rangeTop);
                if (!_.has(_this.scaleInterpolatorMap, id_2)) {
                    _this.scaleInterpolatorMap[id_2] = new ScaleInterpolator(transition, easeSinOut, function (s) {
                        var yAxisScalerMap = _this.state.yAxisScalerMap;
                        yAxisScalerMap[id_2] = s;
                        _this.setState(yAxisScalerMap);
                    });
                }
                var cacheKey = type + "-" + min + "-" + max + "-" + rangeBottom + "-" + rangeTop;
                _this.scaleInterpolatorMap[id_2].setScale(cacheKey, scale);
            }
        });
        var scalerMap = {};
        _.forEach(this.scaleInterpolatorMap, function (interpolator, id) {
            scalerMap[id] = interpolator.scaler();
        });
        this.setState({ yAxisScalerMap: scalerMap });
    };
    ChartRow.prototype.render = function () {
        var _this = this;
        var axes = [];
        var chartList = [];
        var innerHeight = +this.props.height - AXIS_MARGIN * 2;
        var yAxisMap = {};
        var leftAxisList = [];
        var rightAxisList = [];
        var alignLeft = true;
        React.Children.forEach(this.props.children, function (child) {
            if (child.type === Charts) {
                alignLeft = false;
            }
            else {
                var id_3 = child.props.id;
                if ((child.type === YAxis || _.has(child.props, "min")) &&
                    _.has(child.props, "max")) {
                    var yaxis = child;
                    if (yaxis.props.id) {
                        yAxisMap[yaxis.props.id] = yaxis;
                    }
                    if (alignLeft) {
                        leftAxisList.push(id_3);
                    }
                    else {
                        rightAxisList.push(id_3);
                    }
                }
            }
        });
        leftAxisList.reverse();
        var transform;
        var id;
        var props;
        var axis;
        var posx = 0;
        var leftWidth = _.reduce(this.props.leftAxisWidths, function (a, b) { return a + b; }, 0);
        var rightWidth = _.reduce(this.props.rightAxisWidths, function (a, b) { return a + b; }, 0);
        posx = leftWidth;
        for (var leftColumnIndex = 0; leftColumnIndex < this.props.leftAxisWidths.length; leftColumnIndex += 1) {
            var colWidth = this.props.leftAxisWidths[leftColumnIndex];
            posx -= colWidth;
            if (leftColumnIndex < leftAxisList.length) {
                id = leftAxisList[leftColumnIndex];
                transform = "translate(" + posx + ",0)";
                props = {
                    width: colWidth,
                    height: innerHeight,
                    align: "left",
                    scale: this.scaleInterpolatorMap[id].latestScale()
                };
                axis = React.cloneElement(yAxisMap[id], props);
                axes.push(React.createElement("g", { key: "y-axis-left-" + leftColumnIndex, transform: transform }, axis));
            }
        }
        posx = this.props.width - rightWidth;
        for (var rightColumnIndex = 0; rightColumnIndex < this.props.rightAxisWidths.length; rightColumnIndex += 1) {
            var colWidth = this.props.rightAxisWidths[rightColumnIndex];
            if (rightColumnIndex < rightAxisList.length) {
                id = rightAxisList[rightColumnIndex];
                transform = "translate(" + posx + ",0)";
                props = {
                    width: colWidth,
                    height: innerHeight,
                    align: "right",
                    scale: this.scaleInterpolatorMap[id].latestScale()
                };
                axis = React.cloneElement(yAxisMap[id], props);
                axes.push(React.createElement("g", { key: "y-axis-right-" + rightColumnIndex, transform: transform }, axis));
            }
            posx += colWidth;
        }
        var chartWidth = this.props.width - leftWidth - rightWidth;
        var chartTransform = "translate(" + leftWidth + ",0)";
        var k = 0;
        React.Children.forEach(this.props.children, function (child) {
            if (child.type === Charts) {
                var charts_1 = child;
                React.Children.forEach(charts_1.props.children, function (chart) {
                    var scale = null;
                    if (_.has(_this.state.yAxisScalerMap, chart.props.axis)) {
                        scale = _this.state.yAxisScalerMap[chart.props.axis];
                    }
                    var chartProps = {
                        key: k,
                        width: chartWidth,
                        height: innerHeight,
                        timeScale: _this.props.timeScale,
                        timeFormat: _this.props.timeFormat
                    };
                    if (scale) {
                        chartProps.yScale = scale;
                    }
                    chartList.push(React.cloneElement(chart, chartProps));
                    k += 1;
                });
            }
        });
        var brushList = [];
        k = 0;
        React.Children.forEach(this.props.children, function (child) {
            if (child.type === Brush) {
                var brushProps = {
                    key: "brush-" + k,
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: _this.props.timeScale
                };
                var brush = React.cloneElement(child, brushProps);
                brushList.push(brush);
            }
            k += 1;
        });
        var charts = (React.createElement("g", { transform: chartTransform, key: "event-rect-group" },
            React.createElement("g", { key: "charts", clipPath: this.state.clipPathURL }, chartList)));
        var clipper = (React.createElement("defs", null,
            React.createElement("clipPath", { id: this.state.clipId },
                React.createElement("rect", { x: "0", y: "0", width: chartWidth, height: innerHeight }))));
        var brushes = (React.createElement("g", { transform: chartTransform, key: "brush-group" }, brushList));
        var tracker;
        if (this.props.trackerTime) {
            var timeFormat = this.props.trackerTimeFormat || this.props.timeFormat;
            var timeMarkerProps = {
                key: "tracker",
                timeFormat: timeFormat,
                showLine: false,
                showTime: this.props.trackerShowTime,
                time: this.props.trackerTime,
                timeScale: this.props.timeScale,
                height: this.props.height,
                width: chartWidth
            };
            if (this.props.trackerInfoValues) {
                timeMarkerProps.infoWidth = this.props.trackerInfoWidth;
                timeMarkerProps.infoHeight = this.props.trackerInfoHeight;
                timeMarkerProps.info = this.props.trackerInfoValues;
                timeMarkerProps.timeFormat = this.props.trackerTimeFormat;
            }
            var trackerStyle = {
                pointerEvents: "none"
            };
            var trackerTransform = "translate(" + leftWidth + ",0)";
            tracker = (React.createElement("g", { key: "tracker-group", style: trackerStyle, transform: trackerTransform },
                React.createElement(TimeMarker, __assign({}, timeMarkerProps))));
        }
        return (React.createElement("g", null,
            clipper,
            axes,
            charts,
            brushes,
            tracker));
    };
    ChartRow.defaultProps = {
        trackerTimeFormat: "%b %d %Y %X",
        height: 100
    };
    return ChartRow;
}(React.Component));
export { ChartRow };
//# sourceMappingURL=ChartRow.js.map