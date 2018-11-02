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

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3TimeFormat = require("d3-time-format");

require("moment-duration-format");

var _ValueList = require("./ValueList");

var _ValueList2 = _interopRequireDefault(_ValueList);

var _Label = require("./Label");

var _Label2 = _interopRequireDefault(_Label);

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

var TimeMarker = (function(_React$Component) {
    _inherits(TimeMarker, _React$Component);

    function TimeMarker() {
        _classCallCheck(this, TimeMarker);

        return _possibleConstructorReturn(
            this,
            (TimeMarker.__proto__ || Object.getPrototypeOf(TimeMarker)).apply(this, arguments)
        );
    }

    _createClass(TimeMarker, [
        {
            key: "renderLine",
            value: function renderLine(posx) {
                return _react2.default.createElement("line", {
                    style: this.props.infoStyle.line,
                    x1: posx,
                    y1: 0,
                    x2: posx,
                    y2: this.props.height
                });
            }
        },
        {
            key: "renderTimeMarker",
            value: function renderTimeMarker(d) {
                var textStyle = {
                    fontSize: 11,
                    textAnchor: "left",
                    fill: "#bdbdbd"
                };

                var dateStr = "" + d;
                if (this.props.timeFormat === "day") {
                    var formatter = (0, _d3TimeFormat.timeFormat)("%d");
                    dateStr = formatter(d);
                } else if (this.props.timeFormat === "month") {
                    var _formatter = (0, _d3TimeFormat.timeFormat)("%B");
                    dateStr = _formatter(d);
                } else if (this.props.timeFormat === "year") {
                    var _formatter2 = (0, _d3TimeFormat.timeFormat)("%Y");
                    dateStr = _formatter2(d);
                } else if (this.props.timeFormat === "relative") {
                    dateStr = _moment2.default.duration(+d).format();
                } else if (_underscore2.default.isString(this.props.timeFormat)) {
                    var _formatter3 = (0, _d3TimeFormat.timeFormat)(this.props.timeFormat);
                    dateStr = _formatter3(d);
                } else if (_underscore2.default.isFunction(this.props.timeFormat)) {
                    dateStr = this.props.timeFormat(d);
                }

                return _react2.default.createElement(
                    "text",
                    { x: 0, y: 0, dy: "1.2em", style: textStyle },
                    dateStr
                );
            }
        },
        {
            key: "renderInfoBox",
            value: function renderInfoBox(posx) {
                var w = this.props.infoWidth;

                var infoBoxProps = {
                    align: "left",
                    style: this.props.infoStyle.box,
                    width: this.props.infoWidth,
                    height: this.props.infoHeight
                };

                if (this.props.infoValues) {
                    var infoBox = _underscore2.default.isString(this.props.infoValues)
                        ? _react2.default.createElement(
                              _Label2.default,
                              _extends({}, infoBoxProps, { label: this.props.infoValues })
                          )
                        : _react2.default.createElement(
                              _ValueList2.default,
                              _extends({}, infoBoxProps, { values: this.props.infoValues })
                          );

                    if (posx + 10 + w < this.props.width - 50) {
                        return _react2.default.createElement(
                            "g",
                            { transform: "translate(" + (posx + 10) + "," + 5 + ")" },
                            this.props.showTime ? this.renderTimeMarker(this.props.time) : null,
                            _react2.default.createElement(
                                "g",
                                {
                                    transform: "translate(0," + (this.props.showTime ? 20 : 0) + ")"
                                },
                                infoBox
                            )
                        );
                    }
                    return _react2.default.createElement(
                        "g",
                        { transform: "translate(" + (posx - w - 10) + "," + 5 + ")" },
                        this.props.showTime ? this.renderTimeMarker(this.props.time) : null,
                        _react2.default.createElement(
                            "g",
                            { transform: "translate(0," + (this.props.showTime ? 20 : 0) + ")" },
                            infoBox
                        )
                    );
                }
                return _react2.default.createElement("g", null);
            }
        },
        {
            key: "render",
            value: function render() {
                var posx = this.props.timeScale(this.props.time);
                if (posx) {
                    return _react2.default.createElement(
                        "g",
                        null,
                        this.props.showLine ? this.renderLine(posx) : null,
                        this.props.showInfoBox ? this.renderInfoBox(posx) : null
                    );
                }
                return null;
            }
        }
    ]);

    return TimeMarker;
})(_react2.default.Component);

exports.default = TimeMarker;

TimeMarker.propTypes = {
    /**
     * Show or hide this chart
     */
    visible: _propTypes2.default.bool,

    /**
     * The time, expressed as a Javascript `Date` object, to display the marker
     */
    time: _propTypes2.default.instanceOf(Date),

    /**
     * The values to show in the info box. This is either an array of
     * objects, with each object specifying the label and value
     * to be shown in the info box, or a simple string label
     */
    infoValues: _propTypes2.default.oneOfType([
        _propTypes2.default.string,
        _propTypes2.default.arrayOf(
            _propTypes2.default.shape({
                label: _propTypes2.default.string, // eslint-disable-line
                value: _propTypes2.default.string // eslint-disable-line
            })
        )
    ]),

    /**
     * The style of the info box and connecting lines. This is an
     * object of the form { line, box, dot }. Line, box and dot
     * are themselves objects representing inline CSS for each of
     * the pieces of the info marker.
     */
    infoStyle: _propTypes2.default.shape({
        line: _propTypes2.default.object, // eslint-disable-line
        box: _propTypes2.default.object, // eslint-disable-line
        dot: _propTypes2.default.object // eslint-disable-line
    }),

    /**
     * The width of the hover info box
     */
    infoWidth: _propTypes2.default.number,

    /**
     * The height of the hover info box
     */
    infoHeight: _propTypes2.default.number,

    /**
     * Display the info box at all. If you don't have any values to show and just
     * want a line and a time (for example), you can set this to false.
     */
    showInfoBox: _propTypes2.default.bool,

    /**
     * You can show the info box without the corresponding time marker. Why would
     * you do this? I don't know. Actually, I do. You might use the ChartContainer
     * tracker mechanism to show the line across multiple rows, then add a TimeMarker
     * selectively to each row.
     */
    showLine: _propTypes2.default.bool,

    /**
     * You can hide the time displayed above the info box. You might do this because
     * it is already displayed elsewhere in your UI. Or maybe you just don't like it.
     */
    showTime: _propTypes2.default.bool,

    /**
     * The time format used for display of the time above the info box.
     */
    timeFormat: _propTypes2.default.oneOfType([
        _propTypes2.default.string,
        _propTypes2.default.func
    ]),

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

TimeMarker.defaultProps = {
    visible: true,
    showInfoBox: true,
    showLine: true,
    showTime: true,
    infoStyle: {
        line: {
            stroke: "#999",
            cursor: "crosshair",
            pointerEvents: "none"
        },
        box: {
            fill: "white",
            opacity: 0.9,
            stroke: "#999",
            pointerEvents: "none"
        },
        dot: {
            fill: "#999"
        }
    },
    infoWidth: 90,
    infoHeight: 25
};
