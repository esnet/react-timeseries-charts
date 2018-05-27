"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var React = require("react");
var pondjs_1 = require("pondjs");
var util_1 = require("./util");
var MultiBrush = (function (_super) {
    tslib_1.__extends(MultiBrush, _super);
    function MultiBrush(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isBrushing: false
        };
        _this.handleBrushMouseDown = _this.handleBrushMouseDown.bind(_this);
        _this.handleOverlayMouseDown = _this.handleOverlayMouseDown.bind(_this);
        _this.handleHandleMouseDown = _this.handleHandleMouseDown.bind(_this);
        _this.handleMouseUp = _this.handleMouseUp.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        return _this;
    }
    MultiBrush.prototype.viewport = function () {
        var _a = this.props, width = _a.width, timeScale = _a.timeScale;
        var viewBeginTime = timeScale.invert(0);
        var viewEndTime = timeScale.invert(width);
        return new pondjs_1.TimeRange(viewBeginTime, viewEndTime);
    };
    MultiBrush.prototype.handleBrushMouseDown = function (e, brushIndex) {
        e.preventDefault();
        var x = e.pageX, y = e.pageY;
        var xy0 = [Math.round(x), Math.round(y)];
        var begin = +this.props.timeRanges[brushIndex].begin();
        var end = +this.props.timeRanges[brushIndex].end();
        document.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
            isBrushing: true,
            brushingInitializationSite: "brush",
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0,
            brushIndex: brushIndex
        });
    };
    MultiBrush.prototype.handleOverlayMouseDown = function (e) {
        if (this.props.allowFreeDrawing || this.hasNullBrush()) {
            e.preventDefault();
            var offset = util_1.getElementOffset(this.overlay);
            var x = e.pageX - offset.left;
            var t = this.props.timeScale.invert(x).getTime();
            document.addEventListener("mouseup", this.handleMouseUp);
            var drawingPosition = this.props.allowFreeDrawing
                ? this.props.timeRanges.length
                : this.props.timeRanges.length - 1;
            this.setState({
                isBrushing: true,
                brushingInitializationSite: "overlay",
                initialBrushBeginTime: t,
                initialBrushEndTime: t,
                initialBrushXYPosition: null,
                brushIndex: drawingPosition
            });
        }
    };
    MultiBrush.prototype.hasNullBrush = function () {
        return ((this.props.timeRanges || []).length > 0 &&
            this.props.timeRanges[this.props.timeRanges.length - 1] == null);
    };
    ;
    MultiBrush.prototype.handleMouseClick = function (e, brushIndex) {
        if (this.props.onTimeRangeClicked) {
            this.props.onTimeRangeClicked(this.state.brushIndex);
        }
    };
    ;
    MultiBrush.prototype.handleHandleMouseDown = function (e, handle, brushIndex) {
        e.preventDefault();
        var x = e.pageX, y = e.pageY;
        var xy0 = [Math.round(x), Math.round(y)];
        var begin = this.props.timeRanges[brushIndex].begin().getTime();
        var end = this.props.timeRanges[brushIndex].end().getTime();
        document.addEventListener("mouseover", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
            isBrushing: true,
            brushingInitializationSite: "handle-" + handle,
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0,
            brushIndex: brushIndex
        });
    };
    MultiBrush.prototype.handleMouseUp = function (e) {
        var _this = this;
        e.preventDefault();
        document.removeEventListener("mouseover", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        var brushingIs = this.state.brushIndex;
        this.setState({
            isBrushing: false,
            brushingInitializationSite: null,
            initialBrushBeginTime: null,
            initialBrushEndTime: null,
            initialBrushXYPosition: null,
            brushIndex: null
        }, function () {
            if (_this.props.onUserMouseUp) {
                _this.props.onUserMouseUp(brushingIs);
            }
        });
    };
    MultiBrush.prototype.handleMouseMove = function (e) {
        e.preventDefault();
        var x = e.pageX;
        var y = e.pageY;
        var xy = [Math.round(x), Math.round(y)];
        var viewport = this.viewport();
        if (this.state.isBrushing) {
            var newBegin = void 0;
            var newEnd = void 0;
            var tb = this.state.initialBrushBeginTime;
            var te = this.state.initialBrushEndTime;
            if (this.state.brushingInitializationSite === "overlay") {
                var offset = util_1.getElementOffset(this.overlay);
                var xx = e.pageX - offset.left;
                var t = this.props.timeScale.invert(xx).getTime();
                if (t < tb) {
                    newBegin = t < viewport.begin().getTime() ? +viewport.begin() : t;
                    newEnd = tb > viewport.end().getTime() ? +viewport.end() : tb;
                }
                else {
                    newBegin = tb < viewport.begin().getTime() ? +viewport.begin() : tb;
                    newEnd = t > viewport.end().getTime() ? +viewport.end() : t;
                }
            }
            else {
                var xy0 = this.state.initialBrushXYPosition;
                var timeOffset = this.props.timeScale.invert(xy0[0]).getTime() -
                    this.props.timeScale.invert(xy[0]).getTime();
                var startOffsetConstraint = timeOffset;
                var endOffsetConstrain = timeOffset;
                if (tb - timeOffset < +viewport.begin()) {
                    startOffsetConstraint = tb - viewport.begin().getTime();
                }
                if (te - timeOffset > +viewport.end()) {
                    endOffsetConstrain = te - viewport.end().getTime();
                }
                newBegin =
                    this.state.brushingInitializationSite === "brush" ||
                        this.state.brushingInitializationSite === "handle-left"
                        ? Math.round(tb - startOffsetConstraint)
                        : tb;
                newEnd =
                    this.state.brushingInitializationSite === "brush" ||
                        this.state.brushingInitializationSite === "handle-right"
                        ? Math.round(te - endOffsetConstrain)
                        : te;
                if (newBegin > newEnd) {
                    _a = [newEnd, newBegin], newBegin = _a[0], newEnd = _a[1];
                }
            }
            if (this.props.onTimeRangeChanged) {
                this.props.onTimeRangeChanged(new pondjs_1.TimeRange(newBegin, newEnd), this.state.brushIndex);
            }
        }
        var _a;
    };
    MultiBrush.prototype.renderOverlay = function () {
        var _this = this;
        var _a = this.props, width = _a.width, height = _a.height;
        var cursor;
        switch (this.state.brushingInitializationSite) {
            case "handle-right":
            case "handle-left":
                cursor = "ew-resize";
                break;
            case "brush":
                cursor = "move";
                break;
            default:
                cursor =
                    this.props.allowFreeDrawing || this.hasNullBrush() ? "crosshair" : "default";
        }
        var overlayStyle = {
            fill: "white",
            opacity: 0,
            cursor: cursor
        };
        return (React.createElement("rect", { ref: function (c) {
                _this.overlay = c;
            }, x: 0, y: 0, width: width, height: height, style: overlayStyle, onClick: function (e) { return _this.handleMouseClick; }, onMouseDown: this.handleOverlayMouseDown, onMouseUp: this.handleMouseUp }));
    };
    MultiBrush.prototype.renderBrush = function (timeRange, index) {
        var _this = this;
        var _a = this.props, timeScale = _a.timeScale, height = _a.height;
        if (!timeRange) {
            return React.createElement("g", null);
        }
        var cursor;
        switch (this.state.brushingInitializationSite) {
            case "handle-right":
            case "handle-left":
                cursor = "ew-resize";
                break;
            case "overlay":
                cursor =
                    this.props.allowFreeDrawing || this.hasNullBrush() ? "crosshair" : "default";
                break;
            default:
                cursor = "move";
        }
        var brushDefaultStyle = {
            fill: "#777",
            fillOpacity: 0.3,
            stroke: "#fff",
            shapeRendering: "crispEdges",
            cursor: cursor
        };
        var userStyle = this.props.style ? this.props.style(index) : {};
        var brushStyle = _.merge(true, brushDefaultStyle, userStyle);
        if (!this.viewport().disjoint(timeRange)) {
            var range = timeRange.intersection(this.viewport());
            var begin = range.begin();
            var end = range.end();
            var _b = [timeScale(begin), 0], x = _b[0], y = _b[1];
            var endPos = timeScale(end);
            var width = endPos - x;
            if (width < 1) {
                width = 1;
            }
            var bounds = { x: x, y: y, width: width, height: height };
            return (React.createElement("rect", tslib_1.__assign({}, bounds, { key: index + "-" + brushStyle, style: brushStyle, pointerEvents: "all", onClick: function (e) { return _this.handleMouseClick(e, index); }, onMouseDown: function (e) { return _this.handleBrushMouseDown(e, index); }, onMouseUp: this.handleMouseUp })));
        }
        return React.createElement("g", null);
    };
    MultiBrush.prototype.renderHandles = function (timeRange, index) {
        var _this = this;
        var _a = this.props, timeScale = _a.timeScale, height = _a.height;
        if (!timeRange) {
            return React.createElement("g", null);
        }
        var handleStyle = {
            fill: "white",
            opacity: 0,
            cursor: "ew-resize"
        };
        if (!this.viewport().disjoint(timeRange)) {
            var range = timeRange.intersection(this.viewport());
            var begin = range.begin().getTime();
            var end = range.end().getTime();
            var _b = [timeScale(begin), 0], x = _b[0], y = _b[1];
            var endPos = timeScale(end);
            var width = endPos - x;
            if (width < 1) {
                width = 1;
            }
            var handleSize = this.props.handleSize;
            var leftHandleBounds = { x: x - 1, y: y, width: handleSize, height: height };
            var rightHandleBounds = {
                x: x + (width - handleSize),
                y: y,
                width: handleSize + 1,
                height: height
            };
            return (React.createElement("g", null,
                React.createElement("rect", tslib_1.__assign({}, leftHandleBounds, { style: handleStyle, pointerEvents: "all", onMouseDown: function (e) { return _this.handleHandleMouseDown(e, "left", index); }, onMouseUp: this.handleMouseUp })),
                React.createElement("rect", tslib_1.__assign({}, rightHandleBounds, { style: handleStyle, pointerEvents: "all", onMouseDown: function (e) { return _this.handleHandleMouseDown(e, "right", index); }, onMouseUp: this.handleMouseUp }))));
        }
        return React.createElement("g", null);
    };
    MultiBrush.prototype.render = function () {
        var _this = this;
        return (React.createElement("g", { onMouseMove: this.handleMouseMove },
            this.renderOverlay(),
            (this.props.timeRanges || []).map(function (timeRange, index) {
                return (React.createElement("g", { key: "multibrush_" + index },
                    _this.renderBrush(timeRange, index),
                    _this.renderHandles(timeRange, index)));
            })));
    };
    MultiBrush.defaultProps = {
        handleSize: 6,
        allowFreeDrawing: true
    };
    return MultiBrush;
}(React.Component));
exports.MultiBrush = MultiBrush;
//# sourceMappingURL=MultiBrush.js.map