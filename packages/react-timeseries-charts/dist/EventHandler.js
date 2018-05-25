"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var pondjs_1 = require("pondjs");
var util_1 = require("./util");
var EventHandler = (function (_super) {
    tslib_1.__extends(EventHandler, _super);
    function EventHandler(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isDragging: false,
            isPanning: false,
            initialPanBegin: null,
            initialPanEnd: null,
            initialPanPosition: null,
            initialDragZoom: null,
            currentDragZoom: null
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
        if (!this.props.enablePanZoom && !this.props.enableDragZoom) {
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
        if (!this.props.enablePanZoom && !this.props.enableDragZoom) {
            return;
        }
        e.preventDefault();
        document.addEventListener("mouseover", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
        if (this.props.enableDragZoom) {
            var offsetxy = this.getOffsetMousePosition(e);
            this.setState({
                isDragging: true,
                initialDragZoom: offsetxy[0],
                currentDragZoom: offsetxy[0]
            });
        }
        if (this.props.enablePanZoom) {
            var x = e.pageX;
            var y = e.pageY;
            var xy0 = [Math.round(x), Math.round(y)];
            var begin = this.props.scale.domain()[0].getTime();
            var end = this.props.scale.domain()[1].getTime();
            this.setState({
                isPanning: true,
                initialPanBegin: begin,
                initialPanEnd: end,
                initialPanPosition: xy0
            });
        }
        return false;
    };
    EventHandler.prototype.handleMouseUp = function (e) {
        if (!this.props.onMouseClick && !this.props.enablePanZoom && !this.props.enableDragZoom) {
            return;
        }
        e.stopPropagation();
        document.removeEventListener("mouseover", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        var offsetxy = this.getOffsetMousePosition(e);
        var x = e.pageX;
        var isPanning = this.state.initialPanPosition && Math.abs(x - this.state.initialPanPosition[0]) > 2;
        var isDragging = this.state.initialDragZoom && Math.abs(offsetxy[0] - this.state.initialDragZoom) > 2;
        if (this.props.onMouseClick && !isPanning && !isDragging) {
            this.props.onMouseClick();
        }
        if (this.props.enableDragZoom) {
            if (isDragging) {
                var start = this.props.scale.invert(this.state.initialDragZoom).getTime();
                var end = this.props.scale.invert(this.state.currentDragZoom).getTime();
                var newBegin = Math.round(start);
                var newEnd = Math.round(end);
                if (this.props.minTime && newBegin < this.props.minTime.getTime()) {
                    newBegin = this.props.minTime.getTime();
                }
                if (this.props.maxTime && newEnd > this.props.maxTime.getTime()) {
                    newEnd = this.props.maxTime.getTime();
                }
                var newTimeRange = pondjs_1.timerange([newBegin, newEnd].sort());
                if (this.props.onZoom) {
                    this.props.onZoom(newTimeRange);
                }
            }
            this.setState({
                isDragging: false,
                initialDragZoom: null,
                initialPanEnd: null,
                currentDragZoom: null
            });
        }
        if (this.props.enablePanZoom) {
            this.setState({
                isPanning: false,
                initialPanBegin: null,
                initialPanEnd: null,
                initialPanPosition: null
            });
        }
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
        var offsetxy = this.getOffsetMousePosition(e);
        if (this.state.isDragging) {
            this.setState({
                currentDragZoom: offsetxy[0]
            });
        }
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
            var newTimeRange = pondjs_1.timerange(newBegin, newEnd);
            if (this.props.onZoom) {
                this.props.onZoom(newTimeRange);
            }
        }
        else if (this.props.onMouseMove) {
            var mousePosition = this.getOffsetMousePosition(e)[0];
            if (this.props.onMouseMove) {
                this.props.onMouseMove(mousePosition[0], mousePosition[1]);
            }
        }
    };
    EventHandler.prototype.render = function () {
        var _this = this;
        var cursor = this.state.isPanning ? "-webkit-grabbing" : "default";
        var handlers = {
            onWheel: this.handleScrollWheel,
            onMouseDown: this.handleMouseDown,
            onMouseMove: this.handleMouseMove,
            onMouseOut: this.handleMouseOut,
            onMouseUp: this.handleMouseUp
        };
        return (React.createElement("g", { pointerEvents: "all", onWheel: function (e) { return _this.handleScrollWheel(e); }, onMouseDown: function (e) { return _this.handleMouseDown(e); }, onMouseUp: function (e) { return _this.handleMouseUp(e); }, onMouseMove: function (e) { return _this.handleMouseMove(e); }, onMouseOut: function (e) { return _this.handleMouseOut(e); } },
            React.createElement("rect", { key: "handler-hit-rect", ref: function (c) {
                    _this.eventRect = c;
                }, style: { fill: "#000", opacity: 0.0, cursor: cursor }, x: 0, y: 0, width: this.props.width, height: this.props.height }),
            this.props.children,
            this.state.isDragging && (React.createElement("rect", { style: { opacity: 0.3, fill: "grey" }, x: Math.min(this.state.currentDragZoom, this.state.initialDragZoom), y: 0, width: Math.abs(this.state.currentDragZoom - this.state.initialDragZoom), height: this.props.height }))));
    };
    EventHandler.defaultProps = {
        enablePanZoom: false,
        enableDragZoom: false
    };
    return EventHandler;
}(React.Component));
exports.EventHandler = EventHandler;
//# sourceMappingURL=EventHandler.js.map