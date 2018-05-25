"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var React = require("react");
var d3_ease_1 = require("d3-ease");
var d3_scale_1 = require("d3-scale");
var react_hot_loader_1 = require("react-hot-loader");
var Brush_1 = require("./Brush");
var MultiBrush_1 = require("./MultiBrush");
var Charts_1 = require("./Charts");
var TimeMarker_1 = require("./TimeMarker");
var YAxis_1 = require("./YAxis");
var interpolators_1 = require("./interpolators");
var AXIS_MARGIN = 5;
function createScale(yaxis, type, min, max, y0, y1) {
    if (_.isUndefined(min) || _.isUndefined(max)) {
        return null;
    }
    switch (type.toUpperCase()) {
        case Charts_1.ScaleType.Linear:
            return d3_scale_1.scaleLinear()
                .domain([min, max])
                .range([y0, y1])
                .nice();
        case Charts_1.ScaleType.Log:
            var base = yaxis.props.logBase || 10;
            return d3_scale_1.scaleLog()
                .base(base)
                .domain([min, max])
                .range([y0, y1]);
        case Charts_1.ScaleType.Power:
            var power = yaxis.props.powerExponent || 2;
            return d3_scale_1.scalePow()
                .exponent(power)
                .domain([min, max])
                .range([y0, y1]);
    }
}
var ChartRow = (function (_super) {
    tslib_1.__extends(ChartRow, _super);
    function ChartRow(props) {
        var _this = _super.call(this, props) || this;
        _this.isChildYAxis = function (child) {
            return react_hot_loader_1.areComponentsEqual(child.type, YAxis_1.YAxis) ||
                (_.has(child.props, "min") && _.has(child.props, "max"));
        };
        var clipId = _.uniqueId("clip_");
        var clipPathURL = "url(#" + clipId + ")";
        _this.state = {
            clipId: clipId,
            clipPathURL: clipPathURL
        };
        return _this;
    }
    ChartRow.prototype.updateScales = function (props) {
        var _this = this;
        var innerHeight = +props.height - AXIS_MARGIN * 2;
        var rangeTop = AXIS_MARGIN;
        var rangeBottom = innerHeight - AXIS_MARGIN;
        React.Children.forEach(props.children, function (child) {
            if (child === null)
                return;
            if (_this.isChildYAxis(child)) {
                var _a = child.props, id_1 = _a.id, max = _a.max, min = _a.min, _b = _a.transition, transition = _b === void 0 ? 0 : _b, _c = _a.type, type = _c === void 0 ? Charts_1.ScaleType.Linear : _c;
                if (!_.has(_this.scaleInterpolatorMap, id_1)) {
                    _this.scaleInterpolatorMap[id_1] = new interpolators_1.default(transition, d3_ease_1.easeSinOut, function (s) {
                        var yAxisScalerMap = _this.state.yAxisScalerMap;
                        yAxisScalerMap[id_1] = s;
                        _this.setState(yAxisScalerMap);
                    });
                }
                var scale = void 0;
                if (_.has(child.props, "yScale")) {
                    scale = child.props.yScale;
                }
                else {
                    scale = createScale(child, type, min, max, rangeBottom, rangeTop);
                }
                var cacheKey = type + "-" + min + "-" + max + "-" + rangeBottom + "-" + rangeTop;
                _this.scaleInterpolatorMap[id_1].setScale(cacheKey, scale);
            }
        });
        var scalerMap = {};
        _.forEach(this.scaleInterpolatorMap, function (interpolator, id) {
            scalerMap[id] = interpolator.scaler();
        });
        this.setState({ yAxisScalerMap: scalerMap });
    };
    ChartRow.prototype.componentWillMount = function () {
        this.scaleInterpolatorMap = {};
        this.updateScales(this.props);
    };
    ChartRow.prototype.componentWillReceiveProps = function (nextProps) {
        this.updateScales(nextProps);
    };
    ChartRow.prototype.render = function () {
        var _this = this;
        var _a = this.props, paddingLeft = _a.paddingLeft, paddingRight = _a.paddingRight;
        var axes = [];
        var chartList = [];
        var innerHeight = +this.props.height - AXIS_MARGIN * 2;
        var yAxisMap = {};
        var leftAxisList = [];
        var rightAxisList = [];
        var alignLeft = true;
        React.Children.forEach(this.props.children, function (child) {
            if (child === null)
                return;
            if (react_hot_loader_1.areComponentsEqual(child.type, Charts_1.Charts)) {
                alignLeft = false;
            }
            else {
                var id_2 = child.props.id;
                if (_this.isChildYAxis(child)) {
                    var yaxis = child;
                    if (yaxis.props.id && yaxis.props.visible !== false) {
                        yAxisMap[yaxis.props.id] = yaxis;
                    }
                    if (alignLeft) {
                        leftAxisList.push(id_2);
                    }
                    else {
                        rightAxisList.push(id_2);
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
        var chartWidth = this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;
        posx = leftWidth;
        for (var leftColumnIndex = 0; leftColumnIndex < this.props.leftAxisWidths.length; leftColumnIndex += 1) {
            var colWidth = this.props.leftAxisWidths[leftColumnIndex];
            posx -= colWidth;
            if (colWidth > 0 && leftColumnIndex < leftAxisList.length) {
                id = leftAxisList[leftColumnIndex];
                if (_.has(yAxisMap, id)) {
                    transform = "translate(" + (posx + paddingLeft) + ",0)";
                    props = {
                        width: colWidth,
                        height: innerHeight,
                        chartExtent: chartWidth,
                        isInnerAxis: leftColumnIndex === 0,
                        align: "left",
                        scale: this.scaleInterpolatorMap[id].latestScale()
                    };
                    axis = React.cloneElement(yAxisMap[id], props);
                    axes.push(React.createElement("g", { key: "y-axis-left-" + leftColumnIndex, transform: transform }, axis));
                }
            }
        }
        posx = this.props.width - rightWidth;
        for (var rightColumnIndex = 0; rightColumnIndex < this.props.rightAxisWidths.length; rightColumnIndex += 1) {
            var colWidth = this.props.rightAxisWidths[rightColumnIndex];
            if (colWidth > 0 && rightColumnIndex < rightAxisList.length) {
                id = rightAxisList[rightColumnIndex];
                if (_.has(yAxisMap, id)) {
                    transform = "translate(" + (posx + paddingLeft) + ",0)";
                    props = {
                        width: colWidth,
                        height: innerHeight,
                        chartExtent: chartWidth,
                        isInnerAxis: rightColumnIndex === 0,
                        align: "right",
                        scale: this.scaleInterpolatorMap[id].latestScale()
                    };
                    axis = React.cloneElement(yAxisMap[id], props);
                    axes.push(React.createElement("g", { key: "y-axis-right-" + rightColumnIndex, transform: transform }, axis));
                }
            }
            posx += colWidth;
        }
        var chartTransform = "translate(" + (leftWidth + paddingLeft) + ",0)";
        var k = 0;
        React.Children.forEach(this.props.children, function (child) {
            if (child === null)
                return;
            if (react_hot_loader_1.areComponentsEqual(child.type, Charts_1.Charts)) {
                var charts_1 = child;
                React.Children.forEach(charts_1.props.children, function (chart) {
                    var scale = null;
                    if (_.has(_this.state.yAxisScalerMap, chart.props.axis)) {
                        scale = _this.state.yAxisScalerMap[chart.props.axis];
                    }
                    var ytransition = null;
                    if (_.has(_this.scaleInterpolatorMap, chart.props.axis)) {
                        ytransition = _this.scaleInterpolatorMap[chart.props.axis];
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
                    if (ytransition) {
                        chartProps.transition = ytransition;
                    }
                    chartList.push(React.cloneElement(chart, chartProps));
                    k += 1;
                });
            }
        });
        var brushList = [];
        var multiBrushList = [];
        k = 0;
        React.Children.forEach(this.props.children, function (child) {
            if (child === null)
                return;
            if (react_hot_loader_1.areComponentsEqual(child.type, Brush_1.Brush) ||
                react_hot_loader_1.areComponentsEqual(child.type, MultiBrush_1.MultiBrush)) {
                var brushProps = {
                    key: "brush-" + k,
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: _this.props.timeScale
                };
                if (react_hot_loader_1.areComponentsEqual(child.type, Brush_1.Brush)) {
                    brushList.push(React.cloneElement(child, brushProps));
                }
                else {
                    multiBrushList.push(React.cloneElement(child, brushProps));
                }
            }
            k += 1;
        });
        var charts = (React.createElement("g", { transform: chartTransform, key: "event-rect-group" },
            React.createElement("g", { key: "charts", clipPath: this.state.clipPathURL }, chartList)));
        var clipper = (React.createElement("defs", null,
            React.createElement("clipPath", { id: this.state.clipId },
                React.createElement("rect", { x: "0", y: "0", style: { strokeOpacity: 0.0 }, width: chartWidth, height: innerHeight }))));
        var brushes = (React.createElement("g", { transform: chartTransform, key: "brush-group" }, brushList));
        var multiBrushes = (React.createElement("g", { transform: chartTransform, key: "multi-brush-group" }, multiBrushList));
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
            var trackerTransform = "translate(" + (leftWidth + paddingLeft) + ",0)";
            tracker = (React.createElement("g", { key: "tracker-group", style: trackerStyle, transform: trackerTransform },
                React.createElement(TimeMarker_1.TimeMarker, tslib_1.__assign({}, timeMarkerProps))));
        }
        return (React.createElement("g", null,
            clipper,
            axes,
            charts,
            brushes,
            multiBrushes,
            tracker));
    };
    ChartRow.defaultProps = {
        trackerTimeFormat: "%b %d %Y %X",
        enablePanZoom: false,
        height: 100,
        visible: true
    };
    return ChartRow;
}(React.Component));
exports.ChartRow = ChartRow;
//# sourceMappingURL=ChartRow.js.map