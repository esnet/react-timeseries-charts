"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  Copyright (c) 2015, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _pondjs = require("pondjs");

var _EventMarker = require("./EventMarker");

var _EventMarker2 = _interopRequireDefault(_EventMarker);

var _styler = require("../js/styler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultStyle = {
    normal: { fill: "steelblue", opacity: 0.8 },
    highlighted: { fill: "steelblue", opacity: 1.0 },
    selected: { fill: "steelblue", opacity: 1.0 },
    muted: { fill: "steelblue", opacity: 0.4 }
};

// http://stackoverflow.com/a/28857255
function getElementOffset(element) {
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top + window.pageYOffset - de.clientTop;
    var left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
}

/**
 * The `<ScatterChart >` widget is able to display multiple columns of a series
 * scattered across a time axis.
 *
 * The ScatterChart should be used within `<ChartContainer>` etc.,
 * as this will construct the horizontal and vertical axis, and
 * manage other elements. As with other charts, this lets them be stacked or
 * overlaid on top of each other.
 *
 * A custom info overlay lets you hover over the data and examine points. Points
 * can be selected or highlighted.
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
 *
 * ### Styling
 *
 * A scatter chart supports per-column or per-event styling. Styles can be set for
 * each of the four states that are possible for each event: normal, highlighted,
 * selected or muted. To style per-column, supply an object. For per-event styling
 * supply a function: `(event, column) => {}` The functon will return a style object.
 * See the `style` prop in the API documentation for more information.
 *
 * Separately the size of the dots can be controlled with the `radius` prop. This
 * can either be a fixed value (e.g. 2.0), or a function. If a function is supplied
 * it will be called as `(event, column) => {}` and should return the size.
 *
 * The hover info for each point is also able to be styled using the info style.
 * This enables you to control the drawing of the box and connecting lines. Using
 * the `infoWidth` and `infoHeight` props you can control the size of the box, which
 * is fixed.
 */
exports.default = _react2.default.createClass({

    displayName: "ScatterChart",

    getDefaultProps: function getDefaultProps() {
        return {
            columns: ["value"],
            radius: 2.0,
            infoStyle: {
                line: {
                    stroke: "#999",
                    cursor: "crosshair",
                    pointerEvents: "none"
                },
                box: {
                    fill: "white",
                    opacity: 0.90,
                    stroke: "#999",
                    pointerEvents: "none"
                }
            },
            infoWidth: 90,
            infoHeight: 30
        };
    },


    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: _react2.default.PropTypes.instanceOf(_pondjs.TimeSeries).isRequired,

        /**
         * Which columns of the series to render
         */
        columns: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string),

        /**
         * Reference to the axis which provides the vertical scale for drawing. e.g.
         * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
         */
        axis: _react2.default.PropTypes.string.isRequired,

        /**
         * The radius of the points in the scatter chart.
         *
         * If this is a number it will be used as the radius for every point.
         * If this is a function it will be called for each event.
         *
         * The function is called with the event and the column name and must return a number.
         *
         * For example this function will use the radius column of the event:
         *
         * ```
         * const radius = (event, column) => {
         *    return event.get("radius");
         * }
         * ```
         */
        radius: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.func, _react2.default.PropTypes.instanceOf(_styler.Styler)]),

        /**
         * The style of the scatter chart drawing (using SVG CSS properties).
         * This is an object with a key for each column which is being plotted,
         * per the `columns` prop. Each of those keys has an object as its
         * value which has keys which are style properties for an SVG <Circle> and
         * the value to use.
         *
         * For example:
         * ```
         * style = {
         *     columnName: {
         *         normal: {
         *             fill: "steelblue",
         *             opacity: 0.8,
         *         },
         *         highlighted: {
         *             fill: "#a7c4dd",
         *             opacity: 1.0,
         *         },
         *         selected: {
         *             fill: "orange",
         *             opacity: 1.0,
         *         },
         *         muted: {
         *             fill: "grey",
         *             opacity: 0.5
         *         }
         *     }
         * }
         * ```
         *
         * You can also supply a function, which will be called with an event
         * and column. The function should return an object containing the
         * 4 states (normal, highlighted, selected and muted) and the corresponding
         * CSS properties.
         */
        style: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.func]),

        /**
         * The style of the info box and connecting lines
         */
        infoStyle: _react2.default.PropTypes.object,

        /**
         * The width of the hover info box
         */
        infoWidth: _react2.default.PropTypes.number,

        /**
         * The height of the hover info box
         */
        infoHeight: _react2.default.PropTypes.number,

        /**
         * The values to show in the info box. This is an array of
         * objects, with each object specifying the label and value
         * to be shown in the info box.
         */
        info: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
            label: _react2.default.PropTypes.string,
            value: _react2.default.PropTypes.string
        })),

        /**
         * The selected dot, which will be rendered in the "selected" style.
         * If a dot is selected, all other dots will be rendered in the "muted" style.
         *
         * See also `onSelectionChange`
         */
        selected: _react2.default.PropTypes.object,

        /**
         * A callback that will be called when the selection changes. It will be called
         * with an object containing the event and column.
         */
        onSelectionChange: _react2.default.PropTypes.func,

        /**
         * The highlighted dot, as an object containing the event and
         * column, which will be rendered in the "highlighted" style.
         *
         * See also `onHighlightChanged`
         */
        highlighted: _react2.default.PropTypes.object,

        /**
         * A callback that will be called when the hovered over dot changes.
         * It will be called with an object containing the event and column.
         */
        onHighlightChanged: _react2.default.PropTypes.func
    },

    handleClick: function handleClick(e, event, column) {
        var point = { event: event, column: column };
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(point);
        }
    },


    // get the event mouse position relative to the event rect
    getOffsetMousePosition: function getOffsetMousePosition(e) {
        var trackerRect = _reactDom2.default.findDOMNode(this.refs.eventrect);
        var offset = getElementOffset(trackerRect);
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        return [Math.round(x), Math.round(y)];
    },
    handleHover: function handleHover(e) {
        var _getOffsetMousePositi = this.getOffsetMousePosition(e);

        var _getOffsetMousePositi2 = _slicedToArray(_getOffsetMousePositi, 2);

        var x = _getOffsetMousePositi2[0];
        var y = _getOffsetMousePositi2[1];


        var point = void 0;
        var minDistance = Infinity;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.props.columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var column = _step.value;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.props.series.events()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var event = _step2.value;

                        var t = event.timestamp();
                        var value = event.get(column);
                        var px = this.props.timeScale(t);
                        var py = this.props.yScale(value);
                        var distance = Math.sqrt((px - x) * (px - x) + (py - y) * (py - y));
                        if (distance < minDistance) {
                            point = { event: event, column: column };
                            minDistance = distance;
                        }
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

        if (this.props.onMouseNear) {
            this.props.onMouseNear(point);
        }
    },
    handleHoverLeave: function handleHoverLeave() {
        if (this.props.onMouseNear) {
            this.props.onMouseNear(null);
        }
    },
    providedStyleMap: function providedStyleMap(column, event) {
        var style = {};
        if (this.props.style) {
            if (this.props.style instanceof _styler.Styler) {
                style = this.props.style.scatterChartStyle()[column];
            } else if (_underscore2.default.isFunction(this.props.style)) {
                style = this.props.style(column, event);
            } else if (_underscore2.default.isObject(this.props.style)) {
                style = this.props.style ? this.props.style[column] : defaultStyle;
            }
        }
        return style;
    },


    /**
     * Returns the style used for drawing the path
     */
    style: function style(column, event) {
        var style = void 0;

        var styleMap = this.providedStyleMap(column, event);

        var isHighlighted = this.props.highlighted && column === this.props.highlighted.column && _pondjs.Event.is(this.props.highlighted.event, event);
        var isSelected = this.props.selected && column === this.props.selected.column && _pondjs.Event.is(this.props.selected.event, event);

        if (this.props.selected) {
            if (isSelected) {
                style = (0, _merge2.default)(true, defaultStyle.selected, styleMap.selected ? styleMap.selected : {});
            } else if (isHighlighted) {
                style = (0, _merge2.default)(true, defaultStyle.highlighted, styleMap.highlighted ? styleMap.highlighted : {});
            } else {
                style = (0, _merge2.default)(true, defaultStyle.muted, styleMap.muted ? styleMap.muted : {});
            }
        } else if (isHighlighted) {
            style = (0, _merge2.default)(true, defaultStyle.highlighted, styleMap.highlighted ? styleMap.highlighted : {});
        } else {
            style = (0, _merge2.default)(true, defaultStyle.normal, styleMap.normal ? styleMap.normal : {});
        }

        return style;
    },
    renderScatter: function renderScatter() {
        var _this = this;

        var _props = this.props;
        var series = _props.series;
        var timeScale = _props.timeScale;
        var yScale = _props.yScale;

        var points = [];
        var hoverOverlay = void 0;

        this.props.columns.forEach(function (column) {
            var key = 1;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                var _loop = function _loop() {
                    var event = _step3.value;

                    var t = event.timestamp();
                    var value = event.get(column);
                    var style = _this.style(column, event);

                    var x = timeScale(t);
                    var y = yScale(value);

                    var radius = _underscore2.default.isFunction(_this.props.radius) ? _this.props.radius(event, column) : +_this.props.radius;

                    var isHighlighted = _this.props.highlight && _pondjs.Event.is(_this.props.highlight.event, event) && column === _this.props.highlight.column;

                    // Hover info
                    if (isHighlighted && _this.props.info) {
                        hoverOverlay = _react2.default.createElement(_EventMarker2.default, _extends({}, _this.props, {
                            event: event,
                            column: column,
                            marker: "circle",
                            markerRadius: "0" }));
                    }

                    points.push(_react2.default.createElement("circle", {
                        key: column + "-" + key,
                        cx: x,
                        cy: y,
                        r: radius,
                        style: style,
                        pointerEvents: "none",
                        onMouseMove: _this.handleHover,
                        onClick: function onClick(e) {
                            return _this.handleClick(e, event, column);
                        } }));

                    key++;
                };

                for (var _iterator3 = series.events()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    _loop();
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        });

        return _react2.default.createElement(
            "g",
            null,
            points,
            hoverOverlay
        );
    },
    render: function render() {
        return _react2.default.createElement(
            "g",
            null,
            _react2.default.createElement("rect", {
                key: "scatter-hit-rect",
                ref: "eventrect",
                style: { opacity: 0.0 },
                x: 0, y: 0,
                width: this.props.width,
                height: this.props.height,
                onMouseMove: this.handleHover,
                onMouseLeave: this.handleHoverLeave }),
            this.renderScatter()
        );
    }
});