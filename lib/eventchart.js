"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _pondjs = require("pondjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders an event view that shows the supplied set of
 * events along a time axis.
 *
 * EXPERIMENTAL
 *
 * TODO: Convert to use Pond Events
 */
/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

exports.default = _react2.default.createClass({

    displayName: "EventChart",

    /**
     * hover state is tracked internally and a highlight shown as a result
     */
    getInitialState: function getInitialState() {
        return {
            hover: null
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            size: 30,
            spacing: 0
        };
    },


    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: _react2.default.PropTypes.instanceOf(_pondjs.TimeSeries).isRequired,

        /**
         * The height in pixels for the event bar
         */
        size: _react2.default.PropTypes.number,

        /**
         * Minimum width for an event
         */
        /**
         * The distance in pixels to inset the bar chart from its actual timerange
         */
        spacing: _react2.default.PropTypes.number,

        /**
         * A function that should return the style of the event box
         */
        style: _react2.default.PropTypes.func

    },

    /**
     * Continues a hover event on a specific bar of the bar chart.
     */
    handleMouseMove: function handleMouseMove(e, event) {
        this.setState({ hover: event });
    },


    /**
     * Handle click will call the onSelectionChange callback if one is provided
     * as a prop. It will be called with the event selected.
     */
    handleClick: function handleClick(e, event) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(event);
        }
    },
    render: function render() {
        var _this = this;

        var series = this.props.series;
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
                var beginPos = scale(begin);
                var endPos = scale(end);
                var transform = "translate(" + beginPos + ",0)";

                var isHover = _this.state.hover ? event.data() === _this.state.hover.data() : false;

                var state = undefined;

                if (isHover) {
                    state = "hover";
                } else {
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
                    if (_underscore2.default.isString(_this.props.label)) {
                        label = _this.props.label;
                    } else if (_underscore2.default.isFunction(_this.props.label)) {
                        label = _this.props.label(event);
                    }
                }

                var x = _this.props.spacing;
                var y = 0;
                var width = endPos - beginPos - 2 * _this.props.spacing;
                var height = _this.props.size;

                var text = null;
                if (isHover) {
                    text = _react2.default.createElement(
                        "g",
                        null,
                        _react2.default.createElement("rect", {
                            className: "eventchart-marker",
                            x: x, y: y, width: 5, height: height + 4,
                            style: (0, _merge2.default)(true, barNormalStyle, { pointerEvents: "none" }),
                            clipPath: _this.props.clipPathURL }),
                        _react2.default.createElement(
                            "text",
                            {
                                style: { pointerEvents: "none", fill: "#444" },
                                x: 8, y: 15 },
                            label
                        )
                    );
                }

                eventMarkers.push(_react2.default.createElement(
                    "g",
                    { transform: transform, key: i++ },
                    _react2.default.createElement("rect", {
                        className: "eventchart-marker",
                        x: x, y: y, width: width, height: height,
                        style: barStyle,
                        clipPath: _this.props.clipPathURL,
                        onClick: function onClick(e) {
                            return _this.handleClick(e, event);
                        },
                        onMouseLeave: function onMouseLeave() {
                            return _this.setState({ hover: null });
                        },
                        onMouseMove: function onMouseMove(e) {
                            return _this.handleMouseMove(e, event);
                        } }),
                    text
                ));
            };

            for (var _iterator = series.events()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

        return _react2.default.createElement(
            "g",
            null,
            eventMarkers
        );
    }
});