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

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _pondjs = require("pondjs");

var _EventMarker = require("./EventMarker");

var _EventMarker2 = _interopRequireDefault(_EventMarker);

var _util = require("../js/util");

var _styler = require("../js/styler");

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

var defaultStyle = {
    normal: { fill: "steelblue", opacity: 0.8 },
    highlighted: { fill: "steelblue", opacity: 1.0 },
    selected: { fill: "steelblue", opacity: 1.0 },
    muted: { fill: "steelblue", opacity: 0.4 }
};

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
 *             <ScatterChart
 *               axis="wind"
 *               series={series}
 *               style={{color: "steelblue", opacity: 0.5}} />
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

var ScatterChart = (function(_React$Component) {
    _inherits(ScatterChart, _React$Component);

    function ScatterChart(props) {
        _classCallCheck(this, ScatterChart);

        var _this = _possibleConstructorReturn(
            this,
            (ScatterChart.__proto__ || Object.getPrototypeOf(ScatterChart)).call(this, props)
        );

        _this.handleHover = _this.handleHover.bind(_this);
        _this.handleHoverLeave = _this.handleHoverLeave.bind(_this);
        return _this;
    }

    // get the event mouse position relative to the event rect

    _createClass(ScatterChart, [
        {
            key: "getOffsetMousePosition",
            value: function getOffsetMousePosition(e) {
                var offset = (0, _util.getElementOffset)(this.eventrect);
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                return [Math.round(x), Math.round(y)];
            }

            //
            // Event handlers
            //
        },
        {
            key: "handleClick",
            value: function handleClick(e, event, column) {
                var point = { event: event, column: column };
                if (this.props.onSelectionChange) {
                    this.props.onSelectionChange(point);
                }
            }
        },
        {
            key: "handleHover",
            value: function handleHover(e) {
                var _getOffsetMousePositi = this.getOffsetMousePosition(e),
                    _getOffsetMousePositi2 = _slicedToArray(_getOffsetMousePositi, 2),
                    x = _getOffsetMousePositi2[0],
                    y = _getOffsetMousePositi2[1];

                var point = void 0;
                var minDistance = Infinity;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (
                        var _iterator = this.props.columns[Symbol.iterator](), _step;
                        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                        _iteratorNormalCompletion = true
                    ) {
                        var column = _step.value;
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (
                                var _iterator2 = this.props.series.events()[Symbol.iterator](),
                                    _step2;
                                !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
                                _iteratorNormalCompletion2 = true
                            ) {
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
            }
        },
        {
            key: "handleHoverLeave",
            value: function handleHoverLeave() {
                if (this.props.onMouseNear) {
                    this.props.onMouseNear(null);
                }
            }

            //
            // Internal methods
            //
        },
        {
            key: "providedStyleMap",
            value: function providedStyleMap(column, event) {
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
            }

            /**
             * Returns the style used for drawing the path
             */
        },
        {
            key: "style",
            value: function style(column, event) {
                var style = void 0;

                var styleMap = this.providedStyleMap(column, event);

                var isHighlighted =
                    this.props.highlight &&
                    column === this.props.highlight.column &&
                    _pondjs.Event.is(this.props.highlight.event, event);
                var isSelected =
                    this.props.selected &&
                    column === this.props.selected.column &&
                    _pondjs.Event.is(this.props.selected.event, event);

                if (this.props.selected) {
                    if (isSelected) {
                        style = (0, _merge2.default)(
                            true,
                            defaultStyle.selected,
                            styleMap.selected ? styleMap.selected : {}
                        );
                    } else if (isHighlighted) {
                        style = (0, _merge2.default)(
                            true,
                            defaultStyle.highlighted,
                            styleMap.highlighted ? styleMap.highlighted : {}
                        );
                    } else {
                        style = (0, _merge2.default)(
                            true,
                            defaultStyle.muted,
                            styleMap.muted ? styleMap.muted : {}
                        );
                    }
                } else if (isHighlighted) {
                    style = (0, _merge2.default)(
                        true,
                        defaultStyle.highlighted,
                        styleMap.highlighted ? styleMap.highlighted : {}
                    );
                } else {
                    style = (0, _merge2.default)(
                        true,
                        defaultStyle.normal,
                        styleMap.normal ? styleMap.normal : {}
                    );
                }

                return style;
            }

            //
            // Render
            //
        },
        {
            key: "renderScatter",
            value: function renderScatter() {
                var _this2 = this;

                var _props = this.props,
                    series = _props.series,
                    timeScale = _props.timeScale,
                    yScale = _props.yScale;

                var points = [];
                var hoverOverlay = void 0;

                // if selectionChange is enabled, pointerEvents should be enabled as well
                var pointerEvents = this.props.onSelectionChange ? "auto" : "none";

                this.props.columns.forEach(function(column) {
                    var key = 1;
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        var _loop = function _loop() {
                            var event = _step3.value;

                            var t = new Date(
                                event.begin().getTime() +
                                    (event.end().getTime() - event.begin().getTime()) / 2
                            );
                            var value = event.get(column);
                            var badPoint =
                                _underscore2.default.isNull(value) ||
                                _underscore2.default.isNaN(value) ||
                                _underscore2.default.isUndefined(value);
                            var style = _this2.style(column, event);

                            if (!badPoint) {
                                var x = timeScale(t);
                                var y = yScale(value);

                                var radius = _underscore2.default.isFunction(_this2.props.radius)
                                    ? _this2.props.radius(event, column)
                                    : +_this2.props.radius;

                                var isHighlighted =
                                    _this2.props.highlight &&
                                    _pondjs.Event.is(_this2.props.highlight.event, event) &&
                                    column === _this2.props.highlight.column;

                                // Hover info. Note that we just pass all of our props down
                                // into the EventMarker here, but the interesting ones are:
                                // * the info values themselves
                                // * the infoStyle
                                // * infoWidth and infoHeight
                                if (isHighlighted && _this2.props.info) {
                                    hoverOverlay = _react2.default.createElement(
                                        _EventMarker2.default,
                                        _extends({}, _this2.props, {
                                            event: event,
                                            column: column,
                                            marker: "circle",
                                            markerRadius: 0
                                        })
                                    );
                                }

                                points.push(
                                    _react2.default.createElement("circle", {
                                        key: column + "-" + key,
                                        cx: x,
                                        cy: y,
                                        r: radius,
                                        style: style,
                                        pointerEvents: pointerEvents,
                                        onMouseMove: _this2.handleHover,
                                        onClick: function onClick(e) {
                                            return _this2.handleClick(e, event, column);
                                        }
                                    })
                                );

                                key += 1;
                            }
                        };

                        for (
                            var _iterator3 = series.events()[Symbol.iterator](), _step3;
                            !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
                            _iteratorNormalCompletion3 = true
                        ) {
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

                return _react2.default.createElement("g", null, points, hoverOverlay);
            }
        },
        {
            key: "render",
            value: function render() {
                var _this3 = this;

                return _react2.default.createElement(
                    "g",
                    null,
                    _react2.default.createElement("rect", {
                        key: "scatter-hit-rect",
                        ref: function ref(c) {
                            _this3.eventrect = c;
                        },
                        style: { opacity: 0.0 },
                        x: 0,
                        y: 0,
                        width: this.props.width,
                        height: this.props.height,
                        onMouseMove: this.handleHover,
                        onMouseLeave: this.handleHoverLeave
                    }),
                    this.renderScatter()
                );
            }
        }
    ]);

    return ScatterChart;
})(_react2.default.Component);

exports.default = ScatterChart;

ScatterChart.propTypes = {
    /**
     * Show or hide this chart
     */
    visible: _propTypes2.default.bool,

    /**
     * What [Pond TimeSeries](https://esnet-pondjs.appspot.com/#/timeseries) data to visualize
     */
    series: _propTypes2.default.instanceOf(_pondjs.TimeSeries).isRequired,

    /**
     * Which columns of the series to render
     *
     * NOTE : Columns can't have periods because periods
     * represent a path to deep data in the underlying events
     * (i.e. reference into nested data structures)
     */
    columns: _propTypes2.default.arrayOf(_propTypes2.default.string),

    /**
     * Reference to the axis which provides the vertical scale for drawing. e.g.
     * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
     */
    axis: _propTypes2.default.string.isRequired, // eslint-disable-line

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
    radius: _propTypes2.default.oneOfType([
        _propTypes2.default.number,
        _propTypes2.default.func,
        _propTypes2.default.instanceOf(_styler.Styler)
    ]),

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
    style: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func]),

    /**
     * The style of the info box and connecting lines. The style should
     * be an object of the form { line, box }. Line and box are both objects
     * containing the inline CSS for those elements of the info tracker.
     */
    infoStyle: _propTypes2.default.shape({
        line: _propTypes2.default.object, // eslint-disable-line
        box: _propTypes2.default.object // eslint-disable-line
    }),

    /**
     * The width of the hover info box
     */
    infoWidth: _propTypes2.default.number, // eslint-disable-line

    /**
     * The height of the hover info box
     */
    infoHeight: _propTypes2.default.number, // eslint-disable-line

    /**
     * The values to show in the info box. This is an array of
     * objects, with each object specifying the label and value
     * to be shown in the info box.
     */
    info: _propTypes2.default.arrayOf(
        _propTypes2.default.shape({
            label: _propTypes2.default.string, // eslint-disable-line
            value: _propTypes2.default.string // eslint-disable-line
        })
    ),

    /**
     * The selected dot, which will be rendered in the "selected" style.
     * If a dot is selected, all other dots will be rendered in the "muted" style.
     *
     * See also `onSelectionChange`
     */
    selected: _propTypes2.default.arrayOf(
        _propTypes2.default.shape({
            event: _propTypes2.default.instanceOf(_pondjs.Event),
            column: _propTypes2.default.string
        })
    ),

    /**
     * A callback that will be called when the selection changes. It will be called
     * with an object containing the event and column.
     */
    onSelectionChange: _propTypes2.default.func,

    /**
     * The highlighted dot, as an object containing the { event, column },
     * which will be rendered in the "highlighted" style.
     *
     * See also the prop `onMouseNear`.
     */
    highlight: _propTypes2.default.shape({
        event: _propTypes2.default.instanceOf(_pondjs.Event),
        column: _propTypes2.default.string
    }),

    /**
     * Will be called with the nearest point to the cursor. The callback
     * will contain the point, which is a map of { event, column }.
     */
    onMouseNear: _propTypes2.default.func,

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
    width: _propTypes2.default.number,

    /**
     * [Internal] The height supplied by the surrounding ChartContainer
     */
    height: _propTypes2.default.number
};

ScatterChart.defaultProps = {
    visible: true,
    columns: ["value"],
    radius: 2.0,
    infoStyle: {
        stroke: "#999",
        fill: "white",
        opacity: 0.9,
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
    infoWidth: 90,
    infoHeight: 30
};
