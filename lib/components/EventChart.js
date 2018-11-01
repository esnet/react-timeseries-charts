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

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _pondjs = require("pondjs");

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

/**
 * Renders an event view that shows the supplied set of events along a time axis.
 * The events should be supplied as a Pond TimeSeries.
 * That series may contain regular TimeEvents, TimeRangeEvents
 * or IndexedEvents.
 */
var EventChart = (function(_React$Component) {
    _inherits(EventChart, _React$Component);

    function EventChart(props) {
        _classCallCheck(this, EventChart);

        var _this = _possibleConstructorReturn(
            this,
            (EventChart.__proto__ || Object.getPrototypeOf(EventChart)).call(this, props)
        );

        _this.state = {
            hover: null
        };
        return _this;
    }

    /**
     * Continues a hover event on a specific bar of the bar chart.
     */

    _createClass(EventChart, [
        {
            key: "onMouseOver",
            value: function onMouseOver(e, event) {
                if (this.props.onMouseOver) {
                    this.props.onMouseOver(event);
                }
                this.setState({ hover: event });
            }

            /**
             * Handle mouse leave and calls onMouseLeave callback if one is provided
             */
        },
        {
            key: "onMouseLeave",
            value: function onMouseLeave() {
                if (this.props.onMouseLeave) {
                    this.props.onMouseLeave(this.state.hover);
                }
                this.setState({ hover: null });
            }

            /**
             * Handle click will call the onSelectionChange callback if one is provided
             * as a prop. It will be called with the event selected.
             */
        },
        {
            key: "handleClick",
            value: function handleClick(e, event) {
                e.stopPropagation();
                if (this.props.onSelectionChange) {
                    this.props.onSelectionChange(event);
                }
            }
        },
        {
            key: "render",
            value: function render() {
                var _this2 = this;

                var _props = this.props,
                    series = _props.series,
                    textOffsetX = _props.textOffsetX,
                    textOffsetY = _props.textOffsetY,
                    hoverMarkerWidth = _props.hoverMarkerWidth;

                var scale = this.props.timeScale;
                var eventMarkers = [];

                // Create and array of markers, one for each event
                var i = 0;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    var _loop = function _loop() {
                        var event = _step.value;

                        var begin = event.begin();
                        var end = event.end();
                        var beginPos = scale(begin) >= 0 ? scale(begin) : 0;
                        var endPos =
                            scale(end) <= _this2.props.width ? scale(end) : _this2.props.width;

                        var transform = "translate(" + beginPos + ",0)";
                        var isHover = _this2.state.hover
                            ? _pondjs.Event.is(event, _this2.state.hover)
                            : false;

                        var state = void 0;
                        if (isHover) {
                            state = "hover";
                        } else {
                            state = "normal";
                        }

                        var barNormalStyle = {};
                        var barStyle = {};
                        if (_this2.props.style) {
                            barNormalStyle = _this2.props.style(event, "normal");
                            barStyle = _this2.props.style(event, state);
                        }

                        var label = "";
                        if (_this2.props.label) {
                            if (_underscore2.default.isString(_this2.props.label)) {
                                label = _this2.props.label;
                            } else if (_underscore2.default.isFunction(_this2.props.label)) {
                                label = _this2.props.label(event);
                            }
                        }

                        var x = _this2.props.spacing;
                        var y = 0;
                        var width = endPos - beginPos - 2 * _this2.props.spacing;
                        width = width < 0 ? 0 : width;
                        var height = _this2.props.size;

                        var eventLabelStyle = {
                            fontWeight: 100,
                            fontSize: 11
                        };

                        var text = null;
                        if (isHover) {
                            text = _react2.default.createElement(
                                "g",
                                null,
                                _react2.default.createElement("rect", {
                                    className: "eventchart-marker",
                                    x: x,
                                    y: y,
                                    width: hoverMarkerWidth,
                                    height: height + 4,
                                    style: (0, _merge2.default)(true, barNormalStyle, {
                                        pointerEvents: "none"
                                    })
                                }),
                                _react2.default.createElement(
                                    "text",
                                    {
                                        style: _extends(
                                            {
                                                pointerEvents: "none",
                                                fill: "#444"
                                            },
                                            eventLabelStyle
                                        ),
                                        x: 8 + textOffsetX,
                                        y: 15 + textOffsetY
                                    },
                                    label
                                )
                            );
                        }

                        eventMarkers.push(
                            _react2.default.createElement(
                                "g",
                                { transform: transform, key: i },
                                _react2.default.createElement("rect", {
                                    className: "eventchart-marker",
                                    x: x,
                                    y: y,
                                    width: width,
                                    height: height,
                                    style: barStyle,
                                    onClick: function onClick(e) {
                                        return _this2.handleClick(e, event);
                                    },
                                    onMouseLeave: function onMouseLeave() {
                                        return _this2.onMouseLeave();
                                    },
                                    onMouseOver: function onMouseOver(e) {
                                        return _this2.onMouseOver(e, event);
                                    }
                                }),
                                text
                            )
                        );

                        i += 1;
                    };

                    for (
                        var _iterator = series.events()[Symbol.iterator](), _step;
                        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                        _iteratorNormalCompletion = true
                    ) {
                        _loop();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return _react2.default.createElement("g", null, eventMarkers);
            }
        }
    ]);

    return EventChart;
})(_react2.default.Component);

exports.default = EventChart;

EventChart.defaultProps = {
    visible: true,
    size: 30,
    spacing: 0,
    textOffsetX: 0,
    textOffsetY: 0,
    hoverMarkerWidth: 5
};

EventChart.propTypes = {
    /**
     * Show or hide this chart
     */
    visible: _propTypes2.default.bool,

    /**
     * What [Pond TimeSeries](https://esnet-pondjs.appspot.com/#/timeseries) data to visualize
     */
    series: _propTypes2.default.instanceOf(_pondjs.TimeSeries).isRequired,

    /**
     * Set hover label text
     * When label is function callback it will be called with current event.
     */
    label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),

    /**
     * The height in pixels for the event bar
     */
    size: _propTypes2.default.number,

    /**
     * The distance in pixels to inset the event bar from its actual timerange
     */
    spacing: _propTypes2.default.number,

    /**
     * Marker width on hover
     */
    hoverMarkerWidth: _propTypes2.default.number,

    /**
     * Hover text offset position X
     */
    textOffsetX: _propTypes2.default.number,

    /**
     * Hover text offset position Y
     */
    textOffsetY: _propTypes2.default.number,

    /**
     * A function that should return the style of the event box
     */
    style: _propTypes2.default.func,

    /**
     * Event selection on click. Will be called with selected event.
     */
    onSelectionChange: _propTypes2.default.func,

    /**
     * Mouse leave at end of hover event
     */
    onMouseLeave: _propTypes2.default.func,

    /**
     * Mouse over event callback
     */
    onMouseOver: _propTypes2.default.func,

    /**
     * [Internal] The timeScale supplied by the surrounding ChartContainer
     */
    timeScale: _propTypes2.default.func,

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width: _propTypes2.default.number
};
