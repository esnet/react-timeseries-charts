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

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _pondjs = require("pondjs");

var _d3TimeFormat = require("d3-time-format");

var _Label = require("./Label");

var _Label2 = _interopRequireDefault(_Label);

var _ValueList = require("./ValueList");

var _ValueList2 = _interopRequireDefault(_ValueList);

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

var EventTime = function EventTime(_ref) {
    var time = _ref.time,
        _ref$format = _ref.format,
        format = _ref$format === undefined ? "%m/%d/%y %X" : _ref$format;

    var textStyle = {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd",
        pointerEvents: "none"
    };

    var text = void 0;
    if (_underscore2.default.isFunction(format)) {
        text = format(time);
    } else {
        var fmt = (0, _d3TimeFormat.timeFormat)(format);
        text = fmt(time);
    }

    return _react2.default.createElement(
        "text",
        { x: 0, y: 0, dy: "1.2em", style: textStyle },
        text
    );
};
EventTime.propTypes = {
    time: _propTypes2.default.instanceOf(Date),
    format: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};
EventTime.defaultProps = {
    infoTimeFormat: "%m/%d/%y %X"
};

var EventTimeRange = function EventTimeRange(_ref2) {
    var timerange = _ref2.timerange,
        _ref2$format = _ref2.format,
        format = _ref2$format === undefined ? "%m/%d/%y %X" : _ref2$format;

    var textStyle = {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd",
        pointerEvents: "none"
    };
    var d1 = timerange.begin();
    var d2 = timerange.end();

    var beginText = void 0;
    var endText = void 0;

    if (_underscore2.default.isFunction(format)) {
        beginText = format(d1);
        endText = format(d2);
    } else {
        var fmt = (0, _d3TimeFormat.timeFormat)(format);
        beginText = fmt(d1);
        endText = fmt(d2);
    }

    return _react2.default.createElement(
        "text",
        { x: 0, y: 0, dy: "1.2em", style: textStyle },
        beginText + " to " + endText
    );
};
EventTimeRange.propTypes = {
    timerange: _propTypes2.default.instanceOf(_pondjs.TimeRange),
    format: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};
EventTimeRange.defaultProps = {
    infoTimeFormat: "%m/%d/%y %X"
};

var EventIndex = function EventIndex(_ref3) {
    var index = _ref3.index,
        format = _ref3.format;

    var textStyle = {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd",
        pointerEvents: "none"
    };

    var text = void 0;
    if (_underscore2.default.isFunction(format)) {
        text = format(index);
    } else if (_underscore2.default.isString(format)) {
        var fmt = (0, _d3TimeFormat.timeFormat)(format);
        text = fmt(index.begin());
    } else {
        text = index.toString();
    }

    return _react2.default.createElement(
        "text",
        { x: 0, y: 0, dy: "1.2em", style: textStyle },
        text
    );
};
EventIndex.propTypes = {
    index: _propTypes2.default.instanceOf(_pondjs.Index),
    format: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};

/**
 * Renders a marker at a specific event on the chart.
 *
 * To explain how EventMarkers work, it's useful to explain a little
 * terminology used here. A marker has several parts:
 *
 *  * the "marker" itself which appears at the (value, time) of the event.
 *    This is a dot which whose radius is defined by markerRadius, and
 *    whose style is set with markerStyle
 *  * the "markerLabel" which is a string that will be rendered next to
 *    the marker. The label can be aligned with markerAlign and also
 *    styled with markerLabelStyle
 *  * the "info box" which is a box containing values that hovers that the
 *    top of the chart. Optionally it can show the time above the box.
 *    The values themselves are supplied as an array of objects using
 *    the `info` prop. The info box can be styled with `infoStyle`,
 *    sized with `infoWidth` and `infoHeight`, and the time formatted
 *    with `infoTimeFormat`
 *  * the "stem" which is a connector between the marker and the
 *    info box to visually link the two
 *
 * Combining these attributes, Event markers fall into two flavors, either
 * you want to omit the infoBox and mark the event with a dot and optionally
 * a label, or you want to omit the label (and perhaps marker dot) and show
 * a flag style marker with the infoBox connected to the event with the stem.
 *
 * As with other IndexedEvents or TimeRangeEvents, the marker will appear at
 * the center of the timerange represented by that event. You can, however,
 * override either the x or y position by a number of pixels.
 */

var EventMarker = (function(_React$Component) {
    _inherits(EventMarker, _React$Component);

    function EventMarker() {
        _classCallCheck(this, EventMarker);

        return _possibleConstructorReturn(
            this,
            (EventMarker.__proto__ || Object.getPrototypeOf(EventMarker)).apply(this, arguments)
        );
    }

    _createClass(EventMarker, [
        {
            key: "renderTime",
            value: function renderTime(event) {
                if (event instanceof _pondjs.TimeEvent) {
                    return _react2.default.createElement(EventTime, {
                        time: event.timestamp(),
                        format: this.props.infoTimeFormat
                    });
                } else if (event instanceof _pondjs.IndexedEvent) {
                    return _react2.default.createElement(EventIndex, {
                        index: event.index(),
                        format: this.props.infoTimeFormat
                    });
                } else if (event instanceof _pondjs.TimeRangeEvent) {
                    return _react2.default.createElement(EventTimeRange, {
                        timerange: event.timerange(),
                        format: this.props.infoTimeFormat
                    });
                }
                return _react2.default.createElement("g", null);
            }
        },
        {
            key: "renderMarker",
            value: function renderMarker(event, column, info) {
                var t = void 0;
                if (event instanceof _pondjs.TimeEvent) {
                    t = event.timestamp();
                } else {
                    t = new Date(
                        event.begin().getTime() +
                            (event.end().getTime() - event.begin().getTime()) / 2
                    );
                }

                var value = void 0;
                if (this.props.yValueFunc) {
                    value = this.props.yValueFunc(event, column);
                } else {
                    value = event.get(column);
                }

                // Allow overrides on the x and y position. This is useful for the barchart
                // tracker because bars maybe be offset from their actual event position in
                // order to display them side by side.
                var posx = this.props.timeScale(t) + this.props.offsetX;
                var posy = this.props.yScale(value) - this.props.offsetY;

                var infoBoxProps = {
                    align: "left",
                    style: this.props.infoStyle,
                    width: this.props.infoWidth,
                    height: this.props.infoHeight
                };

                var w = this.props.infoWidth;
                var lineBottom = posy - 10;

                var verticalStem = void 0;
                var horizontalStem = void 0;
                var dot = void 0;
                var infoBox = void 0;
                var transform = void 0;
                var label = void 0;

                if (info) {
                    if (_underscore2.default.isString(this.props.info)) {
                        infoBox = _react2.default.createElement(
                            _Label2.default,
                            _extends({}, infoBoxProps, { label: info })
                        );
                    } else {
                        infoBox = _react2.default.createElement(
                            _ValueList2.default,
                            _extends({}, infoBoxProps, { values: info })
                        );
                    }
                }

                //
                // Marker on right of event
                //

                if (this.props.type === "point") {
                    var textDefaultStyle = {
                        fontSize: 11,
                        pointerEvents: "none",
                        paintOrder: "stroke",
                        fill: "#b0b0b0",
                        strokeWidth: 2,
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        fontWeight: 800
                    };

                    var dx = 0;
                    var dy = 0;
                    switch (this.props.markerLabelAlign) {
                        case "left":
                            dx = 5;
                            textDefaultStyle.textAnchor = "start";
                            textDefaultStyle.alignmentBaseline = "central";
                            break;
                        case "right":
                            dx = -5;
                            textDefaultStyle.textAnchor = "end";
                            textDefaultStyle.alignmentBaseline = "central";
                            break;
                        case "top":
                            dy = -5;
                            textDefaultStyle.textAnchor = "middle";
                            textDefaultStyle.alignmentBaseline = "bottom";
                            break;
                        case "bottom":
                            dy = 5;
                            textDefaultStyle.textAnchor = "middle";
                            textDefaultStyle.alignmentBaseline = "hanging";
                            break;
                        default:
                        //pass
                    }

                    var tstyle = (0, _merge2.default)(
                        true,
                        textDefaultStyle,
                        this.props.markerLabelStyle
                    );

                    dot = _react2.default.createElement("circle", {
                        cx: posx,
                        cy: posy,
                        r: this.props.markerRadius,
                        pointerEvents: "none",
                        style: this.props.markerStyle
                    });
                    label = _react2.default.createElement(
                        "text",
                        { x: posx, y: posy, dx: dx, dy: dy, style: tstyle },
                        this.props.markerLabel
                    );

                    return _react2.default.createElement("g", null, dot, label);
                } else {
                    if (posx + 10 + w < (this.props.width * 3) / 4) {
                        if (info) {
                            verticalStem = _react2.default.createElement("line", {
                                pointerEvents: "none",
                                style: this.props.stemStyle,
                                x1: -10,
                                y1: lineBottom,
                                x2: -10,
                                y2: 20
                            });
                            horizontalStem = _react2.default.createElement("line", {
                                pointerEvents: "none",
                                style: this.props.stemStyle,
                                x1: -10,
                                y1: 20,
                                x2: -2,
                                y2: 20
                            });
                        }
                        dot = _react2.default.createElement("circle", {
                            cx: -10,
                            cy: lineBottom,
                            r: this.props.markerRadius,
                            pointerEvents: "none",
                            style: this.props.markerStyle
                        });
                        transform = "translate(" + (posx + 10) + "," + 10 + ")";
                    } else {
                        if (info) {
                            verticalStem = _react2.default.createElement("line", {
                                pointerEvents: "none",
                                style: this.props.stemStyle,
                                x1: w + 10,
                                y1: lineBottom,
                                x2: w + 10,
                                y2: 20
                            });
                            horizontalStem = _react2.default.createElement("line", {
                                pointerEvents: "none",
                                style: this.props.stemStyle,
                                x1: w + 10,
                                y1: 20,
                                x2: w + 2,
                                y2: 20
                            });
                        }
                        dot = _react2.default.createElement("circle", {
                            cx: w + 10,
                            cy: lineBottom,
                            r: this.props.markerRadius,
                            pointerEvents: "none",
                            style: this.props.markerStyle
                        });
                        transform = "translate(" + (posx - w - 10) + "," + 10 + ")";
                    }

                    return _react2.default.createElement(
                        "g",
                        { transform: transform },
                        verticalStem,
                        horizontalStem,
                        dot,
                        this.renderTime(event),
                        _react2.default.createElement(
                            "g",
                            { transform: "translate(0," + 20 + ")" },
                            infoBox
                        )
                    );
                }
            }
        },
        {
            key: "render",
            value: function render() {
                var _props = this.props,
                    event = _props.event,
                    column = _props.column,
                    info = _props.info;

                if (!event) {
                    return _react2.default.createElement("g", null);
                }
                return _react2.default.createElement(
                    "g",
                    null,
                    this.renderMarker(event, column, info)
                );
            }
        }
    ]);

    return EventMarker;
})(_react2.default.Component);

exports.default = EventMarker;

EventMarker.propTypes = {
    type: _propTypes2.default.oneOf(["point", "flag"]),

    /**
     * What [Pond Event](https://esnet-pondjs.appspot.com/#/event) to mark
     */
    event: _propTypes2.default.oneOfType([
        _propTypes2.default.instanceOf(_pondjs.TimeEvent),
        _propTypes2.default.instanceOf(_pondjs.IndexedEvent),
        _propTypes2.default.instanceOf(_pondjs.TimeRangeEvent)
    ]),

    /**
     * Which column in the Event to use
     *
     * NOTE : Columns can't have periods because periods
     * represent a path to deep data in the underlying events
     * (i.e. reference into nested data structures)
     */
    column: _propTypes2.default.string,

    /**
     * The values to show in the info box. This is either an array of
     * objects, with each object specifying the label and value
     * to be shown in the info box, or a simple string label. If this
     * prop is not supplied, no infoBox will be displayed.
     */
    info: _propTypes2.default.oneOfType([
        _propTypes2.default.string,
        _propTypes2.default.arrayOf(
            _propTypes2.default.shape({
                label: _propTypes2.default.string, // eslint-disable-line
                value: _propTypes2.default.string // eslint-disable-line
            })
        )
    ]),

    /**
     * The style of the info box itself. Typically you'd want to
     * specify a fill color, and stroke color/width here.
     */
    infoStyle: _propTypes2.default.object,

    /**
     * The width of the info box
     */
    infoWidth: _propTypes2.default.number,

    /**
     * The height of the info box
     */
    infoHeight: _propTypes2.default.number,

    /**
     * Alter the format of the timestamp shown on the info box.
     * This may be either a function or a string. If you provide a function
     * that will be passed an Index and should return a string. For example:
     * ```
     *     index => moment(index.begin()).format("Do MMM 'YY")
     * ```
     * Alternatively you can pass in a d3 format string. That will be applied
     * to the begin time of the Index range.
     */
    infoTimeFormat: _propTypes2.default.oneOfType([
        _propTypes2.default.func,
        _propTypes2.default.string
    ]),

    /**
     * Show a label to the left or right of the marker
     */
    markerLabelAlign: _propTypes2.default.oneOf(["left", "right", "top", "bottom"]),

    /**
     * The radius of the dot at the end of the marker
     */
    markerRadius: _propTypes2.default.number,

    /**
     * The style of the event marker dot
     */
    markerStyle: _propTypes2.default.object,

    /**
     * The y value is calculated by the column and event, but if
     * this prop is provided this will be used instead.
     */
    yValueFunc: _propTypes2.default.func,

    /**
     * Offset the marker position in the x direction.
     */
    offsetX: _propTypes2.default.number,

    /**
     * Offset the marker position in the y direction
     */
    offsetY: _propTypes2.default.number,

    /**
     * [Internal] The timeScale supplied by the surrounding ChartContainer
     */
    timeScale: _propTypes2.default.func,

    /**
     * [Internal] The yScale supplied by the associated YAxis
     */
    yScale: _propTypes2.default.func,

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width: _propTypes2.default.number
};

EventMarker.defaultProps = {
    type: "flag",
    column: "value",
    infoWidth: 90,
    infoHeight: 25,
    infoStyle: {
        fill: "white",
        opacity: 0.9,
        stroke: "#999",
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
    markerRadius: 2,
    markerLabelAlign: "left",
    markerLabelStyle: {
        fill: "#999"
    },
    offsetX: 0,
    offsetY: 0
};
