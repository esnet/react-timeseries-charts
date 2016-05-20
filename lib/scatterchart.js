"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _d3TimeFormat = require("d3-time-format");

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _pondjs = require("pondjs");

var _valuelist = require("./valuelist");

var _valuelist2 = _interopRequireDefault(_valuelist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var defaultStyle = {
    normal: { fill: "steelblue" },
    highlight: { fill: "#5a98cb" },
    selected: { fill: "yellow" },
    text: { fill: "#333", stroke: "none" }
};

/**
 * The `<ScatterChart >` widget is able to display a single series
 * scattered across a time axis.
 *
 * The ScatterChart should be used within `<ChartContainer>` etc.,
 * as this will construct the horizontal and vertical axis, and
 * manage other elements.
 *
 *
 * ```
 * <ChartContainer timeRange={series.timerange()}>
 *     <ChartRow height="150">
 *         <YAxis id="wind" label="Wind gust (mph)" labelOffset={-5}
 *                min={0} max={series.max()} width="100" type="linear" format=",.1f"/>
 *         <Charts>
 *             <ScatterChart axis="wind" series={series} style={{color: "steelblue", opacity: 0.5}} />
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
exports.default = _react2.default.createClass({

    displayName: "ScatterChart",

    getDefaultProps: function getDefaultProps() {
        return {
            radius: 2.0,

            style: {
                color: "steelblue",
                opacity: 1
            },

            hintStyle: {
                line: {
                    stroke: "#AAA",
                    cursor: "crosshair"
                },
                box: {
                    fill: "white",
                    opacity: 0.90,
                    stroke: "#AAA"
                }
            },

            hintWidth: 90,
            hintHeight: 30
        };
    },


    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: _react2.default.PropTypes.instanceOf(_pondjs.TimeSeries).isRequired,

        /**
         * Reference to the axis which provides the vertical scale for drawing. e.g.
         * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
         */
        axis: _react2.default.PropTypes.string.isRequired,

        /**
         * The radius of each point if a radius is not present in the series.
         */
        radius: _react2.default.PropTypes.number,

        /**
         * The style of the scatter chart drawing (using SVG CSS properties). For example:
         * ```
         * style = {
         *     color: "steelblue",
         *     opacity: 0.5
         * }
         * ```
         */
        style: _react2.default.PropTypes.shape({
            color: _react2.default.PropTypes.string,
            opacity: _react2.default.PropTypes.number
        }),

        /**
         * The width of the hover hint box
         */
        hintWidth: _react2.default.PropTypes.number,

        /**
         * The height of the hover hint box
         */
        hintHeight: _react2.default.PropTypes.number,

        /**
         * The values to show in the hint box. This is an array of
         * objects, with each object specifying the label and value
         * to be shown in the hint box.
         */
        hintValues: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
            label: _react2.default.PropTypes.string,
            value: _react2.default.PropTypes.string
        }))
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
    handleMouseMove: function handleMouseMove(e, event) {
        this.setState({ hover: event });
        if (this.props.onMouseMove) {
            this.props.onMouseMove(event);
        }
    },
    handleMouseLeave: function handleMouseLeave() {
        this.setState({ hover: null });
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave(null);
        }
    },
    handleClick: function handleClick(e, event) {
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(event);
        }
    },
    renderTrackerTime: function renderTrackerTime(d) {
        var textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd"
        };
        var format = (0, _d3TimeFormat.timeFormat)("%X");
        var dateStr = format(d);

        return _react2.default.createElement(
            "text",
            { x: 0, y: 0, dy: "1.2em", style: textStyle },
            dateStr
        );
    },
    renderHint: function renderHint(time, posx, posy, valueList) {
        var w = this.props.hintWidth;

        var horizontalMark = _react2.default.createElement("line", {
            style: this.props.hintStyle.line,
            x1: -10, y1: posy - 10,
            x2: 0, y2: posy - 10 });

        if (valueList) {
            if (posx + 10 + w < this.props.width - 300) {
                var verticalConnector = _react2.default.createElement("line", {
                    style: this.props.hintStyle.line,
                    x1: 0, y1: posy - 10,
                    x2: 0, y2: 20 });
                return _react2.default.createElement(
                    "g",
                    { transform: "translate(" + (posx + 10) + "," + 10 + ")" },
                    horizontalMark,
                    verticalConnector,
                    this.renderTrackerTime(time),
                    _react2.default.createElement(
                        "g",
                        { transform: "translate(0," + 20 + ")" },
                        _react2.default.createElement(_valuelist2.default, {
                            align: "left",
                            values: valueList,
                            style: this.props.hintStyle.box,
                            width: this.props.hintWidth,
                            height: this.props.hintHeight })
                    )
                );
            } else {
                var _verticalConnector = _react2.default.createElement("line", {
                    style: this.props.hintStyle.line,
                    x1: 0, y1: posy - 10,
                    x2: 0, y2: 20 });
                return _react2.default.createElement(
                    "g",
                    { transform: "translate(" + (posx - w - 10) + "," + 10 + ")" },
                    horizontalMark,
                    _verticalConnector,
                    this.renderTrackerTime(time),
                    _react2.default.createElement(
                        "g",
                        { transform: "translate(0," + 20 + ")" },
                        _react2.default.createElement(_valuelist2.default, {
                            align: "left",
                            values: valueList,
                            style: this.props.hintStyle.box,
                            width: this.props.hintWidth,
                            height: this.props.hintHeight })
                    )
                );
            }
        } else {
            return _react2.default.createElement("g", null);
        }
    },
    renderScatter: function renderScatter() {
        var _this = this;

        var series = this.props.series;
        var timeScale = this.props.timeScale;
        var yScale = this.props.yScale;

        var points = [];
        var hover = void 0;

        var key = 1;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            var _loop = function _loop() {
                var event = _step.value;

                var t = event.timestamp();
                var value = event.get(_this.props.column);
                var x = timeScale(t);
                var y = yScale(value);
                var radius = _underscore2.default.isFunction(_this.props.radius) ? _this.props.radius(event) : _this.props.radius;

                var isHighlighted = _this.state.hover && _pondjs.Event.is(_this.state.hover, event) || _this.props.highlight && _pondjs.Event.is(_this.props.highlight, event);

                var isSelected = _this.props.selection && _pondjs.Event.is(_this.props.selection, event);

                var providedStyle = _this.props.style ? _this.props.style : {};
                var styleMap = _underscore2.default.isFunction(_this.props.style) ? _this.props.style(event) : (0, _merge2.default)(true, defaultStyle, providedStyle);

                var style = styleMap.normal;
                if (isSelected) {
                    style = styleMap.selected;
                } else if (isHighlighted) {
                    style = styleMap.hover;
                }

                // Hover hint
                if (isHighlighted && _this.props.hintValues) {
                    hover = _this.renderHint(t, x, y, _this.props.hintValues);
                }

                points.push(_react2.default.createElement("circle", {
                    key: key,
                    cx: x,
                    cy: y,
                    r: radius,
                    style: style,
                    pointerEvents: "none",
                    clipPath: _this.props.clipPathURL,
                    onClick: function onClick(e) {
                        return _this.handleClick(e, event);
                    },
                    onMouseLeave: function onMouseLeave() {
                        return _this.handleMouseLeave();
                    },
                    onMouseMove: function onMouseMove(e) {
                        return _this.handleMouseMove(e, event);
                    } }));

                key++;
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
            points,
            hover
        );
    },
    render: function render() {
        return _react2.default.createElement(
            "g",
            null,
            this.renderScatter()
        );
    }
});