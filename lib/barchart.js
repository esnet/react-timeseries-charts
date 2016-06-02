"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Format = require("d3-format");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _pondjs = require("pondjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultStyle = {
    normal: { fill: "steelblue" },
    highlight: { fill: "#5a98cb" },
    selected: { fill: "yellow" },
    text: { fill: "#333", stroke: "none" }
};

/**
 * Renders a barchart based on IndexedEvents within a TimeSeries.
 *
 * This BarChart implementation is a little different in that it will render
 * onto a time axis, rather than rendering to specific values. As a result,
 * an Aug 2014 bar will render between the Aug 2014 tick mark and the Sept 2014
 * tickmark.
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

    displayName: "BarChart",

    getDefaultProps: function getDefaultProps() {
        return {
            spacing: 1,
            offset: 0,
            style: { value: defaultStyle },
            columns: ["value"]
        };
    },


    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: _react2.default.PropTypes.instanceOf(_pondjs.TimeSeries).isRequired,

        /**
         * The distance in pixels to inset the bar chart from its actual timerange
         */
        spacing: _react2.default.PropTypes.number,

        /**
         * The distance in pixels to offset the bar from its center position within the timerange
         * it represents
         */
        offset: _react2.default.PropTypes.number,

        /**
         * A list of columns within the series that will be stacked on top of each other
         */
        columns: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string),

        /**
         * The style provides the coloring, relating each column to styles for normal, highlight (hover) and selected:
         * ```
         * const style = {
         *     "in": {
         *         normal: {fill: "#619F3A"},
         *         highlight: {fill: "rgb(113, 187, 67)"},
         *         selected: {fill: "#436D28"}
         *     }
         * };
         * ```
         */
        style: _react2.default.PropTypes.object,

        /**
         * The format is used to format the hover text for the bar. It can be specified as a d3
         * format string (such as ".2f") or a function. The function will be called with the value
         * and should return a string.
         */
        format: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string]),

        /**
         * If size is specified, then the bar will be this number of pixels wide. This
         * prop takes priority of "spacing".
         */
        size: _react2.default.PropTypes.number,

        /**
         * A callback that will be called when the selection changes. It will be called
         * with the key, which is $series.name-$index-$column, the value of that event,
         * along with the context. The context provides the series (a Pond TimeSeries),
         * the column (a string) and the index (a Pond Index).
         */
        onSelectionChange: _react2.default.PropTypes.func
    },

    /**
     * hover state is tracked internally and a highlight shown as a result
     */
    getInitialState: function getInitialState() {
        return {
            hover: null
        };
    },


    /**
     * Continues a hover event on a specific bar of the bar chart.
     */
    handleMouseMove: function handleMouseMove(e, key) {
        this.setState({ hover: key });
    },


    /**
     * Handle click will call the onSelectionChange callback if one is provided
     * as a prop. It will be called with the key, which is
     * $series.name-$index-$column, the value of that event, along with the
     * context. The context provides the series (a TimeSeries), the column (a
     * string) and the index (an Index).
     */
    handleClick: function handleClick(e, key, value, series, column, index) {
        e.stopPropagation();
        var context = { series: series, column: column, index: index };
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(key, value, context);
        }
    },
    renderBars: function renderBars() {
        var _this = this;

        var spacing = +this.props.spacing;
        var offset = +this.props.offset;
        var series = this.props.series;
        var timeScale = this.props.timeScale;
        var yScale = this.props.yScale;
        var columns = this.props.columns || series._columns;

        var rects = [];
        var hover = [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = series.events()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var event = _step.value;

                var begin = event.begin();
                var end = event.end();
                var beginPos = timeScale(begin) + spacing;
                var endPos = timeScale(end) - spacing;

                var width = void 0;
                if (this.props.size) {
                    width = this.props.size;
                } else {
                    width = endPos - beginPos;
                }

                if (width < 1) {
                    width = 1;
                }

                var x = void 0;
                if (this.props.size) {
                    var center = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;
                    x = center - this.props.size / 2 + offset;
                } else {
                    x = timeScale(begin) + spacing + offset;
                }

                var ypos = yScale(0);
                if (columns) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        var _loop = function _loop() {
                            var column = _step2.value;

                            var index = event.index();
                            var key = series.name() + "-" + index + "-" + column;
                            var value = event.get(column);

                            var height = yScale(0) - yScale(value);
                            if (height < 1) {
                                height = 1;
                            }

                            var y = ypos - height;

                            var barStyle = void 0;
                            var hoverText = null;

                            var providedColumnStyle = _underscore2.default.has(_this.props.style, column) ? _this.props.style[column] : {};

                            var columnStyle = (0, _merge2.default)(true, defaultStyle, providedColumnStyle);

                            if (key === _this.props.selection) {
                                barStyle = columnStyle.selected;
                            } else if (key === _this.state.hover) {
                                barStyle = columnStyle.highlight;
                            } else {
                                barStyle = columnStyle.normal;
                            }

                            // Hover text
                            var text = "" + value;
                            if (_this.props.format && (key === _this.state.hover || key === _this.props.selection)) {
                                if (_this.props.format && _underscore2.default.isString(_this.props.format)) {
                                    var formatter = (0, _d3Format.format)(_this.props.format);
                                    text = formatter(value);
                                } else if (_underscore2.default.isFunction(_this.props.format)) {
                                    text = _this.props.format(value);
                                }

                                var barTextStyle = _this.props.style[column].text || { stroke: "steelblue" };
                                hoverText = _react2.default.createElement(
                                    "text",
                                    {
                                        key: key + "-text",
                                        style: barTextStyle,
                                        x: x + width / 2,
                                        y: y - 2,
                                        fontFamily: "Verdana",
                                        textAnchor: "middle",
                                        fontSize: "12" },
                                    text
                                );
                            }

                            if (hoverText) {
                                hover.push(hoverText);
                            }

                            rects.push(_react2.default.createElement("rect", {
                                key: key,
                                x: x,
                                y: y,
                                width: width,
                                height: height,
                                pointerEvents: "none",
                                style: barStyle,
                                clipPath: _this.props.clipPathURL,
                                onClick: function onClick(e) {
                                    return _this.handleClick(e, key, value, series, column, index);
                                },
                                onMouseLeave: function onMouseLeave() {
                                    return _this.setState({ hover: null });
                                },
                                onMouseMove: function onMouseMove(e) {
                                    return _this.handleMouseMove(e, key);
                                } }));

                            ypos -= height;
                        };

                        for (var _iterator2 = columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            _loop();
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
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
            rects,
            hover
        );
    },
    render: function render() {
        return _react2.default.createElement(
            "g",
            null,
            this.renderBars()
        );
    }
});