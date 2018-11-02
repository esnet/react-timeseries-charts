"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = (function() {
    function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"]) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    return function(arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
        } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
    };
})();

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

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

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
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/**
 * Renders a brush with the range defined in the prop `timeRange`.
 */
var Brush = (function(_React$Component) {
    _inherits(Brush, _React$Component);

    function Brush(props) {
        _classCallCheck(this, Brush);

        var _this = _possibleConstructorReturn(
            this,
            (Brush.__proto__ || Object.getPrototypeOf(Brush)).call(this, props)
        );

        _this.state = {
            isBrushing: false
        };

        _this.handleBrushMouseDown = _this.handleBrushMouseDown.bind(_this);
        _this.handleOverlayMouseDown = _this.handleOverlayMouseDown.bind(_this);
        _this.handleHandleMouseDown = _this.handleHandleMouseDown.bind(_this);
        _this.handleMouseUp = _this.handleMouseUp.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        return _this;
    }

    _createClass(Brush, [
        {
            key: "viewport",
            value: function viewport() {
                var _props = this.props,
                    width = _props.width,
                    timeScale = _props.timeScale;

                var viewBeginTime = timeScale.invert(0);
                var viewEndTime = timeScale.invert(width);
                return new _pondjs.TimeRange(viewBeginTime, viewEndTime);
            }

            //
            // Event handlers
            //
        },
        {
            key: "handleBrushMouseDown",
            value: function handleBrushMouseDown(e) {
                e.preventDefault();

                var x = e.pageX,
                    y = e.pageY;

                var xy0 = [Math.round(x), Math.round(y)];
                var begin = +this.props.timeRange.begin();
                var end = +this.props.timeRange.end();

                document.addEventListener("mouseup", this.handleMouseUp);

                this.setState({
                    isBrushing: true,
                    brushingInitializationSite: "brush",
                    initialBrushBeginTime: begin,
                    initialBrushEndTime: end,
                    initialBrushXYPosition: xy0
                });
            }
        },
        {
            key: "handleOverlayMouseDown",
            value: function handleOverlayMouseDown(e) {
                e.preventDefault();

                var offset = (0, _util.getElementOffset)(this.overlay);
                var x = e.pageX - offset.left;
                var t = this.props.timeScale.invert(x).getTime();

                document.addEventListener("mouseup", this.handleMouseUp);

                this.setState({
                    isBrushing: true,
                    brushingInitializationSite: "overlay",
                    initialBrushBeginTime: t,
                    initialBrushEndTime: t,
                    initialBrushXYPosition: null
                });
            }
        },
        {
            key: "handleHandleMouseDown",
            value: function handleHandleMouseDown(e, handle) {
                e.preventDefault();

                var x = e.pageX,
                    y = e.pageY;

                var xy0 = [Math.round(x), Math.round(y)];
                var begin = this.props.timeRange.begin().getTime();
                var end = this.props.timeRange.end().getTime();

                document.addEventListener("mouseover", this.handleMouseMove);
                document.addEventListener("mouseup", this.handleMouseUp);

                this.setState({
                    isBrushing: true,
                    brushingInitializationSite: "handle-" + handle,
                    initialBrushBeginTime: begin,
                    initialBrushEndTime: end,
                    initialBrushXYPosition: xy0
                });
            }
        },
        {
            key: "handleMouseUp",
            value: function handleMouseUp(e) {
                e.preventDefault();

                document.removeEventListener("mouseover", this.handleMouseMove);
                document.removeEventListener("mouseup", this.handleMouseUp);

                this.setState({
                    isBrushing: false,
                    brushingInitializationSite: null,
                    initialBrushBeginTime: null,
                    initialBrushEndTime: null,
                    initialBrushXYPosition: null
                });
            }

            /**
             * Handles clearing the TimeRange if the user clicks on the overlay (but
             * doesn't drag to create a new brush). This will send a null as the
             * new TimeRange. The user of this code can react to that however they
             * see fit, but the most logical response is to reset the timerange to
             * some initial value. This behavior is optional.
             */
        },
        {
            key: "handleClick",
            value: function handleClick() {
                if (this.props.allowSelectionClear && this.props.onTimeRangeChanged) {
                    this.props.onTimeRangeChanged(null);
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
                var viewport = this.viewport();

                if (this.state.isBrushing) {
                    var newBegin = void 0;
                    var newEnd = void 0;

                    var tb = this.state.initialBrushBeginTime;
                    var te = this.state.initialBrushEndTime;

                    if (this.state.brushingInitializationSite === "overlay") {
                        var offset = (0, _util.getElementOffset)(this.overlay);
                        var xx = e.pageX - offset.left;
                        var t = this.props.timeScale.invert(xx).getTime();
                        if (t < tb) {
                            newBegin = t < viewport.begin().getTime() ? viewport.begin() : t;
                            newEnd = tb > viewport.end().getTime() ? viewport.end() : tb;
                        } else {
                            newBegin = tb < viewport.begin().getTime() ? viewport.begin() : tb;
                            newEnd = t > viewport.end().getTime() ? viewport.end() : t;
                        }
                    } else {
                        var xy0 = this.state.initialBrushXYPosition;
                        var timeOffset =
                            this.props.timeScale.invert(xy0[0]).getTime() -
                            this.props.timeScale.invert(xy[0]).getTime();

                        // Constrain
                        var startOffsetConstraint = timeOffset;
                        var endOffsetConstrain = timeOffset;
                        if (tb - timeOffset < viewport.begin()) {
                            startOffsetConstraint = tb - viewport.begin().getTime();
                        }
                        if (te - timeOffset > viewport.end()) {
                            endOffsetConstrain = te - viewport.end().getTime();
                        }

                        newBegin =
                            this.state.brushingInitializationSite === "brush" ||
                            this.state.brushingInitializationSite === "handle-left"
                                ? parseInt(tb - startOffsetConstraint, 10)
                                : tb;
                        newEnd =
                            this.state.brushingInitializationSite === "brush" ||
                            this.state.brushingInitializationSite === "handle-right"
                                ? parseInt(te - endOffsetConstrain, 10)
                                : te;

                        // Swap if needed
                        if (newBegin > newEnd) {
                            var _ref = [newEnd, newBegin];
                            newBegin = _ref[0];
                            newEnd = _ref[1];
                        }
                    }

                    if (this.props.onTimeRangeChanged) {
                        this.props.onTimeRangeChanged(new _pondjs.TimeRange(newBegin, newEnd));
                    }
                }
            }

            //
            // Render
            //
        },
        {
            key: "renderOverlay",
            value: function renderOverlay() {
                var _this2 = this;

                var _props2 = this.props,
                    width = _props2.width,
                    height = _props2.height;

                var cursor = void 0;
                switch (this.state.brushingInitializationSite) {
                    case "handle-right":
                    case "handle-left":
                        cursor = "ew-resize";
                        break;
                    case "brush":
                        cursor = "move";
                        break;
                    default:
                        cursor = "crosshair";
                }

                var overlayStyle = {
                    fill: "white",
                    opacity: 0,
                    cursor: cursor
                };
                return _react2.default.createElement("rect", {
                    ref: function ref(c) {
                        _this2.overlay = c;
                    },
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    style: overlayStyle,
                    onMouseDown: this.handleOverlayMouseDown,
                    onMouseUp: this.handleMouseUp,
                    onClick: this.handleClick
                });
            }
        },
        {
            key: "renderBrush",
            value: function renderBrush() {
                var _props3 = this.props,
                    timeRange = _props3.timeRange,
                    timeScale = _props3.timeScale,
                    height = _props3.height,
                    style = _props3.style;

                if (!timeRange) {
                    return _react2.default.createElement("g", null);
                }

                var cursor = void 0;
                switch (this.state.brushingInitializationSite) {
                    case "handle-right":
                    case "handle-left":
                        cursor = "ew-resize";
                        break;
                    case "overlay":
                        cursor = "crosshair";
                        break;
                    default:
                        cursor = "move";
                }

                // Style of the brush area
                var brushDefaultStyle = {
                    fill: "#777",
                    fillOpacity: 0.3,
                    stroke: "#fff",
                    shapeRendering: "crispEdges",
                    cursor: cursor
                };
                var brushStyle = (0, _merge2.default)(true, brushDefaultStyle, style);

                if (!this.viewport().disjoint(timeRange)) {
                    var range = timeRange.intersection(this.viewport());
                    var begin = range.begin();
                    var end = range.end();
                    var _ref2 = [timeScale(begin), 0],
                        x = _ref2[0],
                        y = _ref2[1];

                    var endPos = timeScale(end);
                    var width = endPos - x;
                    if (width < 1) {
                        width = 1;
                    }

                    var bounds = { x: x, y: y, width: width, height: height };

                    return _react2.default.createElement(
                        "rect",
                        _extends({}, bounds, {
                            style: brushStyle,
                            pointerEvents: "all",
                            onMouseDown: this.handleBrushMouseDown,
                            onMouseUp: this.handleMouseUp
                        })
                    );
                }
                return _react2.default.createElement("g", null);
            }
        },
        {
            key: "renderHandles",
            value: function renderHandles() {
                var _this3 = this;

                var _props4 = this.props,
                    timeRange = _props4.timeRange,
                    timeScale = _props4.timeScale,
                    height = _props4.height;

                if (!timeRange) {
                    return _react2.default.createElement("g", null);
                }

                // Style of the handles
                var handleStyle = {
                    fill: "white",
                    opacity: 0,
                    cursor: "ew-resize"
                };

                if (!this.viewport().disjoint(timeRange)) {
                    var range = timeRange.intersection(this.viewport());

                    var _range$toJSON = range.toJSON(),
                        _range$toJSON2 = _slicedToArray(_range$toJSON, 2),
                        begin = _range$toJSON2[0],
                        end = _range$toJSON2[1];

                    var _ref3 = [timeScale(begin), 0],
                        x = _ref3[0],
                        y = _ref3[1];

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

                    return _react2.default.createElement(
                        "g",
                        null,
                        _react2.default.createElement(
                            "rect",
                            _extends({}, leftHandleBounds, {
                                style: handleStyle,
                                pointerEvents: "all",
                                onMouseDown: function onMouseDown(e) {
                                    return _this3.handleHandleMouseDown(e, "left");
                                },
                                onMouseUp: this.handleMouseUp
                            })
                        ),
                        _react2.default.createElement(
                            "rect",
                            _extends({}, rightHandleBounds, {
                                style: handleStyle,
                                pointerEvents: "all",
                                onMouseDown: function onMouseDown(e) {
                                    return _this3.handleHandleMouseDown(e, "right");
                                },
                                onMouseUp: this.handleMouseUp
                            })
                        )
                    );
                }
                return _react2.default.createElement("g", null);
            }
        },
        {
            key: "render",
            value: function render() {
                return _react2.default.createElement(
                    "g",
                    { onMouseMove: this.handleMouseMove },
                    this.renderOverlay(),
                    this.renderBrush(),
                    this.renderHandles()
                );
            }
        }
    ]);

    return Brush;
})(_react2.default.Component);

exports.default = Brush;

Brush.propTypes = {
    /**
     * The timerange for the brush. Typically you would maintain this
     * as state on the surrounding page, since it would likely control
     * another page element, such as the range of the main chart. See
     * also `onTimeRangeChanged()` for receiving notification of the
     * brush range being changed by the user.
     *
     * Takes a Pond TimeRange object.
     */
    timeRange: _propTypes2.default.instanceOf(_pondjs.TimeRange),
    /**
     * The brush is rendered as an SVG rect. You can specify the style
     * of this rect using this prop.
     */
    style: _propTypes2.default.object, //eslint-disable-line
    /**
     * The size of the invisible side handles. Defaults to 6 pixels.
     */
    handleSize: _propTypes2.default.number,
    allowSelectionClear: _propTypes2.default.bool,
    /**
     * A callback which will be called if the brush range is changed by
     * the user. It is called with a Pond TimeRange object. Note that if
     * `allowSelectionClear` is set to true, then this can also be called
     * when the user performs a simple click outside the brush area. In
     * this case it will be called with null as the TimeRange. You can
     * use this to reset the selection, perhaps to some initial range.
     */
    onTimeRangeChanged: _propTypes2.default.func,
    /**
     * [Internal] The timeScale supplied by the surrounding ChartContainer
     */
    timeScale: _propTypes2.default.func,
    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width: _propTypes2.default.number,
    /**
     * [Internal] The height supplied by the surrounding ChartContainer
     */
    height: _propTypes2.default.number
};

Brush.defaultProps = {
    handleSize: 6,
    allowSelectionClear: false
};
