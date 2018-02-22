"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pondjs_1 = require("pondjs");
var util_1 = require("./util");
var EventHandler = (function (_super) {
    __extends(EventHandler, _super);
    function EventHandler(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isPanning: false,
            initialPanBegin: null,
            initialPanEnd: null,
            initialPanPosition: null
        };
        _this.handleScrollWheel = _this.handleScrollWheel.bind(_this);
        _this.handleMouseDown = _this.handleMouseDown.bind(_this);
        _this.handleMouseUp = _this.handleMouseUp.bind(_this);
        _this.handleMouseOut = _this.handleMouseOut.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        return _this;
    }
    EventHandler.prototype.getOffsetMousePosition = function (e) {
        var offset = util_1.getElementOffset(this.eventRect);
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        return [Math.round(x), Math.round(y)];
    };
    EventHandler.prototype.handleScrollWheel = function (e) {
        if (!this.props.enablePanZoom) {
            return;
        }
        e.preventDefault();
        var SCALE_FACTOR = 0.001;
        var scale = 1 + e.deltaY * SCALE_FACTOR;
        if (scale > 3) {
            scale = 3;
        }
        if (scale < 0.1) {
            scale = 0.1;
        }
        var xy = this.getOffsetMousePosition(e);
        var d = this.props.scale.range()[0];
        var begin = this.props.scale.domain()[0].getTime();
        var end = this.props.scale.domain()[1].getTime();
        var center = this.props.scale.invert(xy[0]).getTime();
        var beginScaled = center - Math.round((center - +begin) * scale);
        var endScaled = center + Math.round((end - +center) * scale);
        var duration = (end - begin) * scale;
        if (this.props.minDuration) {
            var minDuration = Math.round(this.props.minDuration);
            if (duration < this.props.minDuration) {
                beginScaled = center - (center - begin) / (end - begin) * minDuration;
                endScaled = center + (end - center) / (end - begin) * minDuration;
            }
        }
        if (this.props.minTime && this.props.maxTime) {
            var maxDuration = this.props.maxTime.getTime() - this.props.minTime.getTime();
            if (duration > maxDuration) {
                duration = maxDuration;
            }
        }
        if (this.props.minTime && beginScaled < this.props.minTime.getTime()) {
            beginScaled = this.props.minTime.getTime();
            endScaled = beginScaled + duration;
        }
        if (this.props.maxTime && endScaled > this.props.maxTime.getTime()) {
            endScaled = this.props.maxTime.getTime();
            beginScaled = endScaled - duration;
        }
        var newBegin = new Date(beginScaled);
        var newEnd = new Date(endScaled);
        var newTimeRange = pondjs_1.timerange(newBegin, newEnd);
        if (this.props.onZoom) {
            this.props.onZoom(newTimeRange);
        }
    };
    EventHandler.prototype.handleMouseDown = function (e) {
        if (!this.props.enablePanZoom) {
            return;
        }
        e.preventDefault();
        var x = e.pageX;
        var y = e.pageY;
        var xy0 = [Math.round(x), Math.round(y)];
        var begin = this.props.scale.domain()[0].getTime();
        var end = this.props.scale.domain()[1].getTime();
        document.addEventListener("mouseover", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
            isPanning: true,
            initialPanBegin: begin,
            initialPanEnd: end,
            initialPanPosition: xy0
        });
        return false;
    };
    EventHandler.prototype.handleMouseUp = function (e) {
        if (!this.props.enablePanZoom) {
            return;
        }
        e.stopPropagation();
        document.removeEventListener("mouseover", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        var x = e.pageX;
        if (this.props.onMouseClick &&
            this.state.initialPanPosition &&
            Math.abs(x - this.state.initialPanPosition[0]) < 2) {
            this.props.onMouseClick();
        }
        this.setState({
            isPanning: false,
            initialPanBegin: null,
            initialPanEnd: null,
            initialPanPosition: null
        });
    };
    EventHandler.prototype.handleMouseOut = function (e) {
        e.preventDefault();
        if (this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    };
    EventHandler.prototype.handleMouseMove = function (e) {
        e.preventDefault();
        var x = e.pageX;
        var y = e.pageY;
        var xy = [Math.round(x), Math.round(y)];
        if (this.state.isPanning) {
            var xy0 = this.state.initialPanPosition;
            var timeOffset = this.props.scale.invert(xy[0]).getTime() -
                this.props.scale.invert(xy0[0]).getTime();
            var newBegin = Math.round(this.state.initialPanBegin - timeOffset);
            var newEnd = Math.round(this.state.initialPanEnd - timeOffset);
            var duration = Math.round(this.state.initialPanEnd - this.state.initialPanBegin);
            if (this.props.minTime && newBegin < this.props.minTime.getTime()) {
                newBegin = this.props.minTime.getTime();
                newEnd = newBegin + duration;
            }
            if (this.props.maxTime && newEnd > this.props.maxTime.getTime()) {
                newEnd = this.props.maxTime.getTime();
                newBegin = newEnd - duration;
            }
            var newTimeRange = new pondjs_1.TimeRange(newBegin, newEnd);
            if (this.props.onZoom) {
                this.props.onZoom(newTimeRange);
            }
        }
        else if (this.props.onMouseMove) {
            var trackerPosition = this.getOffsetMousePosition(e)[0];
            var time = this.props.scale.invert(trackerPosition);
            if (this.props.onMouseMove) {
                this.props.onMouseMove(time);
            }
        }
    };
    EventHandler.prototype.render = function () {
        var _this = this;
        var cursor = this.state.isPanning ? "-webkit-grabbing" : "default";
        return (React.createElement("g", { pointerEvents: "all", onWheel: function (e) { return _this.handleScrollWheel(e); }, onMouseDown: function (e) { return _this.handleMouseDown(e); }, onMouseUp: function (e) { return _this.handleMouseUp(e); }, onMouseMove: function (e) { return _this.handleMouseMove(e); }, onMouseOut: function (e) { return _this.handleMouseOut(e); } },
            React.createElement("rect", { key: "handler-hit-rect", ref: function (c) {
                    _this.eventRect = c;
                }, style: { opacity: 0.0, cursor: cursor }, x: 0, y: 0, width: this.props.width, height: this.props.height }),
            this.props.children));
    };
    EventHandler.defaultProps = {
        enablePanZoom: false
    };
    return EventHandler;
}(React.Component));
exports.EventHandler = EventHandler;
//# sourceMappingURL=EventHandler.js.map