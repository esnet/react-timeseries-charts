"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var React = require("react");
var pondjs_1 = require("pondjs");
var EventChart = (function (_super) {
    tslib_1.__extends(EventChart, _super);
    function EventChart(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            hover: null
        };
        return _this;
    }
    EventChart.prototype.onMouseOver = function (e, event) {
        if (this.props.onMouseOver) {
            this.props.onMouseOver(event);
        }
        this.setState({ hover: event });
    };
    EventChart.prototype.onMouseLeave = function () {
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave(this.state.hover);
        }
        this.setState({ hover: null });
    };
    EventChart.prototype.handleClick = function (e, event) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(event);
        }
    };
    EventChart.prototype.render = function () {
        var _this = this;
        var _a = this.props, series = _a.series, textOffsetX = _a.textOffsetX, textOffsetY = _a.textOffsetY, hoverMarkerWidth = _a.hoverMarkerWidth;
        var scale = this.props.timeScale;
        var eventMarkers = [];
        var i = 0;
        series
            .collection()
            .eventList()
            .forEach(function (event) {
            var begin = event.begin();
            var end = event.end();
            var beginPos = scale(begin) >= 0 ? scale(begin) : 0;
            var endPos = scale(end) <= _this.props.width ? scale(end) : _this.props.width;
            var transform = "translate(" + beginPos + ",0)";
            var isHover = _this.state.hover ? pondjs_1.Event.is(event, _this.state.hover) : false;
            var state;
            if (isHover) {
                state = "hover";
            }
            else {
                state = "normal";
            }
            var barNormalStyle = {};
            var barStyle = {};
            if (_this.props.style) {
                barNormalStyle = _this.props.style(event, "normal");
                barStyle = _this.props.style(event, state);
            }
            var label = "";
            if (_this.props.label) {
                if (_.isString(_this.props.label)) {
                    label = _this.props.label;
                }
                else if (_.isFunction(_this.props.label)) {
                    label = _this.props.label(event);
                }
            }
            var x = _this.props.spacing;
            var y = 0;
            var width = endPos - beginPos - 2 * _this.props.spacing;
            width = width < 0 ? 0 : width;
            var height = _this.props.size;
            var text = null;
            var textStyle = {
                fontSize: 11,
                fontWeight: 100,
                pointerEvents: "none",
                fill: "#444"
            };
            if (isHover) {
                text = (React.createElement("g", null,
                    React.createElement("rect", { className: "eventchart-marker", x: x, y: y, width: hoverMarkerWidth, height: height + 4, style: _.merge(barNormalStyle, { pointerEvents: "none" }) }),
                    React.createElement("text", { style: textStyle, x: 8 + textOffsetX, y: 15 + textOffsetY }, label)));
            }
            var marker = (React.createElement("g", { transform: transform, key: i },
                React.createElement("rect", { className: "eventchart-marker", x: x, y: y, width: width, height: height, style: barStyle, onClick: function (e) { return _this.handleClick(e, event); }, onMouseLeave: function () { return _this.onMouseLeave(); }, onMouseOver: function (e) { return _this.onMouseOver(e, event); } }),
                text));
            eventMarkers.push(marker);
            i += 1;
        });
        return React.createElement("g", null, eventMarkers);
    };
    EventChart.defaultProps = {
        size: 30,
        spacing: 0,
        textOffsetX: 0,
        textOffsetY: 0,
        hoverMarkerWidth: 5
    };
    return EventChart;
}(React.Component));
exports.EventChart = EventChart;
//# sourceMappingURL=EventChart.js.map