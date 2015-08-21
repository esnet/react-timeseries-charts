/*
 * ESnet React Charts, Copyright (c) 2015, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
 *
 * If you have questions about your rights to use or distribute this
 * software, please contact Berkeley Lab's Technology Transfer
 * Department at TTD@lbl.gov.
 *
 * NOTICE.  This software is owned by the U.S. Department of Energy.
 * As such, the U.S. Government has been granted for itself and others
 * acting on its behalf a paid-up, nonexclusive, irrevocable,
 * worldwide license in the Software to reproduce, prepare derivative
 * works, and perform publicly and display publicly.  Beginning five
 * (5) years after the date permission to assert copyright is obtained
 * from the U.S. Department of Energy, and subject to any subsequent
 * five (5) year renewals, the U.S. Government is granted for itself
 * and others acting on its behalf a paid-up, nonexclusive,
 * irrevocable, worldwide license in the Software to reproduce,
 * prepare derivative works, distribute copies to the public, perform
 * publicly and display publicly, and to permit others to do so.
 *
 * This code is distributed under a BSD style license, see the LICENSE
 * file for complete information.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _reactAddons = require("react/addons");

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _pond = require("pond");

/**
 * Renders a barchart based on IndexedEvents within a TimeSeries.
 *
 * This BarChart implementation is a little different in that it will render onto a time axis,
 * rather than rendering to specific values. As a result, an Aug 2014 bar will render between the
 * Aug 2014 tick mark and the Sept 2014 tickmark.
 */
exports["default"] = _reactAddons2["default"].createClass({
    displayName: "barchart",

    propTypes: {
        series: _reactAddons2["default"].PropTypes.instanceOf(_pond.TimeSeries).isRequired,
        clipPathURL: _reactAddons2["default"].PropTypes.string.isRequired,
        timeScale: _reactAddons2["default"].PropTypes.object.isRequired,
        yScale: _reactAddons2["default"].PropTypes.object.isRequired,
        spacing: _reactAddons2["default"].PropTypes.number,
        offset: _reactAddons2["default"].PropTypes.number,
        columns: _reactAddons2["default"].PropTypes.array,
        style: _reactAddons2["default"].PropTypes.object,
        size: _reactAddons2["default"].PropTypes.number,
        onSelectionChange: _reactAddons2["default"].PropTypes.func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            spacing: 1,
            offset: 0,
            style: { "value": { fill: "#619F3A" } }
        };
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
     * Handle click will call the onSelectionChange callback if one is provided as a prop.
     * It will be called with the key, which is $series.name-$index-$column, the value of
     * that event, along with the context. The context provides the series (a TimeSeries), the
     * column (a string) and the index (an Index).
     */
    handleClick: function handleClick(e, key, value, series, column, index) {
        e.stopPropagation();
        var context = { series: series, column: column, index: index };
        this.props.onSelectionChange && this.props.onSelectionChange(key, value, context);
    },

    renderBars: function renderBars() {
        var _this = this;

        var spacing = Number(this.props.spacing);
        var offset = Number(this.props.offset);
        var series = this.props.series;
        var timeScale = this.props.timeScale;
        var yScale = this.props.yScale;
        var columns = this.props.columns || series._columns;

        var rects = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = series.events()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                event = _step.value;

                var begin = event.begin();
                var end = event.end();
                var beginPos = timeScale(begin) + spacing;
                var endPos = timeScale(end) - spacing;

                var width = undefined;
                if (this.props.size) {
                    width = this.props.size;
                } else {
                    width = endPos - beginPos;
                }

                if (width < 1) {
                    width = 1;
                }

                var x = undefined;
                if (this.props.size) {
                    var center = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;
                    x = center - this.props.size / 2 + offset;
                } else {
                    x = timeScale(begin) + spacing + offset;
                }

                var ypos = yScale(0);
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    var _loop = function () {
                        var column = _step2.value;

                        var index = event.index();
                        var key = series.name() + "-" + index + "-" + column;
                        var value = event.get(column);

                        var height = yScale(0) - yScale(value);
                        if (height < 1) {
                            height = 1;
                        }

                        var y = ypos - height;
                        var barStyle = undefined;

                        if (key === _this.props.selection) {
                            if (_this.props.style && _this.props.style[column].selected) {
                                barStyle = _this.props.style[column].selected;
                            } else {
                                barStyle = { fill: "rgb(0, 144, 199)" };
                            }
                        } else if (key === _this.state.hover) {
                            if (_this.props.style && _this.props.style[column].highlight) {
                                barStyle = _this.props.style[column].highlight;
                            } else {
                                barStyle = { fill: "rgb(78, 144, 199)" };
                            }
                        } else {
                            if (_this.props.style && _this.props.style[column].normal) {
                                barStyle = _this.props.style[column].normal;
                            } else {
                                barStyle = { fill: "steelblue" };
                            }
                        }

                        rects.push(_reactAddons2["default"].createElement("rect", { key: key,
                            "data-tip": key === _this.state.hover ? "React-tooltip" : "",
                            x: x, y: y, width: width, height: height,
                            pointerEvents: "none",
                            style: barStyle,
                            clipPath: _this.props.clipPathURL,
                            onClick: function (e) {
                                _this.handleClick(e, key, value, series, column, index);
                            },
                            onMouseLeave: function (e) {
                                _this.setState({ hover: null });
                            },
                            onMouseMove: function (e) {
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
                        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                            _iterator2["return"]();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return rects;
    },

    render: function render() {
        return _reactAddons2["default"].createElement(
            "g",
            null,
            this.renderBars()
        );
    }
});
module.exports = exports["default"];