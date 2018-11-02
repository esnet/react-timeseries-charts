"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends =
    Object.assign ||
    function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _pondjs = require("pondjs");

var _util = require("../js/util");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
            "Super expression must either be null or a function, not " + typeof superClass
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
    });
    if (superClass)
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
}
/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

// eslint-disable-line

/**
 * Internal component which provides the top level event catcher for the charts.
 * This is a higher order component. It wraps a tree of SVG elements below it,
 * passed in as this.props.children, and catches events that they do not handle.
 *
 * The EventHandler is responsible for pan and zoom events as well as other click
 * and hover actions.
 */
var EventHandler = (function(_React$Component) {
    _inherits(EventHandler, _React$Component);

    function EventHandler(props) {
        _classCallCheck(this, EventHandler);

        var _this = _possibleConstructorReturn(
            this,
            (EventHandler.__proto__ || Object.getPrototypeOf(EventHandler)).call(this, props)
        );

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

    // get the event mouse position relative to the event rect

    _createClass(EventHandler, [
        {
            key: "getOffsetMousePosition",
            value: function getOffsetMousePosition(e) {
                var offset = (0, _util.getElementOffset)(this.eventRect);
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                return [Math.round(x), Math.round(y)];
            }

            //
            // Event handlers
            //
        },
        {
            key: "handleScrollWheel",
            value: function handleScrollWheel(e) {
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

                var begin = this.props.scale.domain()[0].getTime();
                var end = this.props.scale.domain()[1].getTime();
                var center = this.props.scale.invert(xy[0]).getTime();

                var beginScaled = center - parseInt((center - begin) * scale, 10);
                var endScaled = center + parseInt((end - center) * scale, 10);

                // Duration constraint
                var duration = (end - begin) * scale;

                if (this.props.minDuration) {
                    var minDuration = parseInt(this.props.minDuration, 10);
                    if (duration < this.props.minDuration) {
                        beginScaled = center - ((center - begin) / (end - begin)) * minDuration;
                        endScaled = center + ((end - center) / (end - begin)) * minDuration;
                    }
                }

                if (this.props.minTime && this.props.maxTime) {
                    var maxDuration = this.props.maxTime.getTime() - this.props.minTime.getTime();
                    if (duration > maxDuration) {
                        duration = maxDuration;
                    }
                }

                // Range constraint
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

                var newTimeRange = new _pondjs.TimeRange(newBegin, newEnd);

                if (this.props.onZoom) {
                    this.props.onZoom(newTimeRange);
                }
            }
        },
        {
            key: "handleMouseDown",
            value: function handleMouseDown(e) {
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
            }
        },
        {
            key: "handleMouseUp",
            value: function handleMouseUp(e) {
                if (
                    !this.props.onMouseClick &&
                    !this.props.enablePanZoom &&
                    !this.props.enableDragZoom
                ) {
                    return;
                }

                e.stopPropagation();

                document.removeEventListener("mouseover", this.handleMouseMove);
                document.removeEventListener("mouseup", this.handleMouseUp);

                var offsetxy = this.getOffsetMousePosition(e);

                var x = e.pageX;
                var isPanning =
                    this.state.initialPanPosition &&
                    Math.abs(x - this.state.initialPanPosition[0]) > 2;
                var isDragging =
                    this.state.initialDragZoom &&
                    Math.abs(offsetxy[0] - this.state.initialDragZoom) > 2;

                if (this.props.onMouseClick && !isPanning && !isDragging) {
                    this.props.onMouseClick(offsetxy[0], offsetxy[1]);
                }

                if (this.props.enableDragZoom) {
                    if (isDragging) {
                        var start = this.props.scale.invert(this.state.initialDragZoom).getTime();
                        var end = this.props.scale.invert(this.state.currentDragZoom).getTime();

                        var newBegin = parseInt(start, 10);
                        var newEnd = parseInt(end, 10);

                        if (this.props.minTime && newBegin < this.props.minTime.getTime()) {
                            newBegin = this.props.minTime.getTime();
                        }

                        if (this.props.maxTime && newEnd > this.props.maxTime.getTime()) {
                            newEnd = this.props.maxTime.getTime();
                        }

                        var newTimeRange = new _pondjs.TimeRange([newBegin, newEnd].sort());
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
            }
        },
        {
            key: "handleMouseOut",
            value: function handleMouseOut(e) {
                e.preventDefault();

                if (this.props.onMouseOut) {
                    this.props.onMouseOut();
                }
            }
        },
        {
            key: "handleMouseMove",
            value: function handleMouseMove(e) {
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
                    var timeOffset =
                        this.props.scale.invert(xy[0]).getTime() -
                        this.props.scale.invert(xy0[0]).getTime();

                    var newBegin = parseInt(this.state.initialPanBegin - timeOffset, 10);
                    var newEnd = parseInt(this.state.initialPanEnd - timeOffset, 10);
                    var duration = parseInt(
                        this.state.initialPanEnd - this.state.initialPanBegin,
                        10
                    );

                    if (this.props.minTime && newBegin < this.props.minTime.getTime()) {
                        newBegin = this.props.minTime.getTime();
                        newEnd = newBegin + duration;
                    }

                    if (this.props.maxTime && newEnd > this.props.maxTime.getTime()) {
                        newEnd = this.props.maxTime.getTime();
                        newBegin = newEnd - duration;
                    }

                    var newTimeRange = new _pondjs.TimeRange(newBegin, newEnd);
                    if (this.props.onZoom) {
                        this.props.onZoom(newTimeRange);
                    }
                } else if (this.props.onMouseMove) {
                    var mousePosition = this.getOffsetMousePosition(e);
                    if (this.props.onMouseMove) {
                        this.props.onMouseMove(mousePosition[0], mousePosition[1]);
                    }
                }
            }

            //
            // Render
            //
        },
        {
            key: "render",
            value: function render() {
                var _this2 = this;

                var cursor = this.state.isPanning ? "-webkit-grabbing" : "default";
                var handlers = {
                    onWheel: this.handleScrollWheel,
                    onMouseDown: this.handleMouseDown,
                    onMouseMove: this.handleMouseMove,
                    onMouseOut: this.handleMouseOut,
                    onMouseUp: this.handleMouseUp
                };
                return _react2.default.createElement(
                    "g",
                    _extends({ pointerEvents: "all" }, handlers),
                    _react2.default.createElement("rect", {
                        key: "handler-hit-rect",
                        ref: function ref(c) {
                            _this2.eventRect = c;
                        },
                        style: { fill: "#000", opacity: 0.0, cursor: cursor },
                        x: 0,
                        y: 0,
                        width: this.props.width,
                        height: this.props.height
                    }),
                    this.props.children,
                    this.state.isDragging &&
                        _react2.default.createElement("rect", {
                            style: { opacity: 0.3, fill: "grey" },
                            x: Math.min(this.state.currentDragZoom, this.state.initialDragZoom),
                            y: 0,
                            width: Math.abs(
                                this.state.currentDragZoom - this.state.initialDragZoom
                            ),
                            height: this.props.height
                        })
                );
            }
        }
    ]);

    return EventHandler;
})(_react2.default.Component);

exports.default = EventHandler;

EventHandler.propTypes = {
    children: _propTypes2.default.oneOfType([
        _propTypes2.default.arrayOf(_propTypes2.default.node),
        _propTypes2.default.node
    ]),
    enablePanZoom: _propTypes2.default.bool,
    enableDragZoom: _propTypes2.default.bool,
    scale: _propTypes2.default.func.isRequired,
    width: _propTypes2.default.number.isRequired,
    height: _propTypes2.default.number.isRequired,
    maxTime: _propTypes2.default.instanceOf(Date),
    minTime: _propTypes2.default.instanceOf(Date),
    minDuration: _propTypes2.default.number,
    onZoom: _propTypes2.default.func,
    onMouseMove: _propTypes2.default.func,
    onMouseOut: _propTypes2.default.func,
    onMouseClick: _propTypes2.default.func
};

EventHandler.defaultProps = {
    enablePanZoom: false,
    enableDragZoom: false
};
