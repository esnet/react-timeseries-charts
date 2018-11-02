"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _pondjs = require("pondjs");

var _EventMarker = require("./EventMarker");

var _EventMarker2 = _interopRequireDefault(_EventMarker);

var _styler = require("../js/styler");

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

var defaultFillStyle = {
    fill: "steelblue",
    stroke: "none"
};

var defaultMutedStyle = {
    fill: "grey",
    stroke: "none"
};

var defaultStyle = [
    {
        normal: _extends({}, defaultFillStyle, { opacity: 0.2 }),
        highlighted: _extends({}, defaultFillStyle, { opacity: 0.3 }),
        selected: _extends({}, defaultFillStyle, { opacity: 0.3 }),
        muted: _extends({}, defaultMutedStyle, { opacity: 0.1 })
    },
    {
        normal: _extends({}, defaultFillStyle, { opacity: 0.5 }),
        highlighted: _extends({}, defaultFillStyle, { opacity: 0.6 }),
        selected: _extends({}, defaultFillStyle, { opacity: 0.6 }),
        muted: _extends({}, defaultMutedStyle, { opacity: 0.2 })
    },
    {
        normal: _extends({}, defaultFillStyle, { opacity: 0.9 }),
        highlighted: _extends({}, defaultFillStyle, { opacity: 1.0 }),
        selected: _extends({}, defaultFillStyle, { opacity: 1.0 }),
        muted: _extends({}, defaultMutedStyle, { opacity: 0.2 })
    }
];

var defaultAggregation = {
    size: "5m",
    reducers: {
        outer: [(0, _pondjs.min)(), (0, _pondjs.max)()],
        inner: [(0, _pondjs.percentile)(25), (0, _pondjs.percentile)(75)],
        center: (0, _pondjs.median)()
    }
};

function getSeries(series, column) {
    return series.map(function(e) {
        var v = e.get(column);
        var d = {};
        switch (v.length) {
            case 1:
                d.center = v[0];
                break;
            case 2:
                d.innerMin = v[0];
                d.innerMax = v[1];
                break;
            case 3:
                d.innerMin = v[0];
                d.center = v[1];
                d.innerMax = v[2];
                break;
            case 4:
                d.outerMin = v[0];
                d.innerMin = v[1];
                d.innerMax = v[2];
                d.outerMax = v[3];
                break;
            case 5:
                d.outerMin = v[0];
                d.innerMin = v[1];
                d.center = v[2];
                d.innerMax = v[3];
                d.outerMax = v[4];
                break;
            default:
                console.error("Tried to make boxchart from invalid array");
        }
        var ee = new _pondjs.IndexedEvent(e.index(), d);
        return ee;
    });
}

function getAggregatedSeries(series, column) {
    var aggregation =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultAggregation;
    var size = aggregation.size,
        reducers = aggregation.reducers;
    var inner = reducers.inner,
        outer = reducers.outer,
        center = reducers.center;

    function mapColumn(c, r) {
        var obj = {};
        obj[c] = r;
        return obj;
    }

    var fixedWindowAggregation = {};

    if (inner) {
        fixedWindowAggregation.innerMin = mapColumn(column, inner[0]);
        fixedWindowAggregation.innerMax = mapColumn(column, inner[1]);
    }

    if (outer) {
        fixedWindowAggregation.outerMin = mapColumn(column, outer[0]);
        fixedWindowAggregation.outerMax = mapColumn(column, outer[1]);
    }

    if (center) {
        fixedWindowAggregation.center = mapColumn(column, center);
    }

    var aggregatedSeries = series.fixedWindowRollup({
        windowSize: size,
        aggregation: fixedWindowAggregation
    });

    return aggregatedSeries;
}

/**
 * Renders a boxplot chart.
 *
 * The TimeSeries supplied to the boxplot, as the `series` prop can be one of two types:
 *
 *  1) It can be a TimeSeries containing IndexedEvents or TimeRangeEvents.
 *     In this case a `column` prop should be supplied to specify the
 *     data column containing the dimensions of the boxes. This props
 *     should be an array of size 1 to 5 elements. e.g. [12, 18, 22, 28]. The
 *     numbers should be ordered, lowest to greatest.
 *
 *  2) A TimeSeries containing timestamp based Events. In this case the
 *     boxplot will be aggregated for you. To control the aggregation you can supply
 *     an `aggregation` prop: a structure to specify the window size and
 *     reducers used to determine the boxes.
 *
 * In both cases you are generating up to two ranges and a center marker. In the
 * first case you are defining this based on the array of numbers. The outer numbers
 * specify the outerRange, the inner numbers specify the innerRange and the middle
 * number specifies the center marker. In the second case you are building those ranges
 * from denser data, specifying a window and aggregation functions to build each
 * of the ranges and center maker.
 *
 * In both cases you do not need to supply all the values. For example if you
 * provide an array of 2 elements, that would define a single range, with no outer range
 * and no center marker. The BoxChart is pretty flexible in that way, so you
 * can use it in many situations.
 *
 * Here is an example of using it to display temperature ranges. The series
 * passed to this code would be a TimeSeries containing IndexedEvents. For
 * each event, the column `temp` contains an array of values used for the
 * box plot ranges:
 *
 * ```
 *     <BoxChart
 *       axis="temperatureAxis"
 *       style={style}
 *       column="temp"
 *       series={series} />
 * ```
 *
 * While here is an example with a dense TimeSeries of Events supplied,
 * along with an aggregation specification. This code would produce an
 * outer range from the 5th percentile to the 95th, along with an inner
 * range for the interquantile, and a center marker at the median:
 *
 * ```
 *    <BoxChart
 *      axis="speedaxis"
 *      series={speed}
 *      column="speed"
 *      style={style}
 *      aggregation={{
 *        size: this.state.rollup,
 *        reducers: {
 *          outer: [percentile(5), percentile(95)],
 *          inner: [percentile(25), percentile(75)],
 *          center: median(),
 *        },
 *      }}
 *    />
 * ```
 *
 * The BoxChart supports Info boxes, highlighting and selection.
 *
 * Note: selection and highlighting is on the whole event, not individual ranges.
 * Also note that since the box chart builds an internal TimeSeries for performance
 * reasons, selection will give you and IndexedEvent, but it won't be the same
 * IndexedEvent in your `series`. Similarly if you are using the aggregation
 * specification you will get events for the rollup, not your original data.
 */

var BoxChart = (function(_React$Component) {
    _inherits(BoxChart, _React$Component);

    function BoxChart(props) {
        _classCallCheck(this, BoxChart);

        var _this = _possibleConstructorReturn(
            this,
            (BoxChart.__proto__ || Object.getPrototypeOf(BoxChart)).call(this, props)
        );

        if (
            props.series._collection._type === _pondjs.TimeEvent // eslint-disable-line
        ) {
            _this.series = getAggregatedSeries(props.series, props.column, props.aggregation);
        } else {
            _this.series = getSeries(props.series, props.column);
        }
        return _this;
    }

    _createClass(BoxChart, [
        {
            key: "componentWillReceiveProps",
            value: function componentWillReceiveProps(nextProps) {
                var aggregation = nextProps.aggregation;

                var aggregationChanged = false;
                if (
                    _underscore2.default.isUndefined(aggregation) !==
                    _underscore2.default.isUndefined(this.props.aggregation)
                ) {
                    aggregationChanged = true;
                }

                if (aggregation && this.props.aggregation) {
                    if (aggregation.size !== this.props.aggregation.size) {
                        aggregationChanged = true;
                    }
                }

                if (aggregationChanged) {
                    this.series = getAggregatedSeries(
                        nextProps.series,
                        nextProps.column,
                        nextProps.aggregation
                    );
                }
            }
        },
        {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate(nextProps) {
                var newSeries = nextProps.series;
                var oldSeries = this.props.series;
                var width = nextProps.width;
                var timeScale = nextProps.timeScale;
                var yScale = nextProps.yScale;
                var column = nextProps.column;
                var style = nextProps.style;
                var aggregation = nextProps.aggregation;
                var highlighted = nextProps.highlighted;
                var selected = nextProps.selected;

                var widthChanged = this.props.width !== width;
                var timeScaleChanged =
                    (0, _util.scaleAsString)(this.props.timeScale) !==
                    (0, _util.scaleAsString)(timeScale);
                var yAxisScaleChanged = this.props.yScale !== yScale;
                var columnChanged = this.props.column !== column;
                var styleChanged = JSON.stringify(this.props.style) !== JSON.stringify(style);
                var highlightedChanged = this.props.highlighted !== highlighted;
                var selectedChanged = this.props.selected !== selected;

                var aggregationChanged = false;
                if (
                    _underscore2.default.isUndefined(aggregation) !==
                    _underscore2.default.isUndefined(this.props.aggregation)
                ) {
                    aggregationChanged = true;
                }

                if (aggregation && this.props.aggregation) {
                    if (aggregation.size !== this.props.aggregation.size) {
                        aggregationChanged = true;
                    }
                }

                var seriesChanged = false;
                if (oldSeries.size() !== newSeries.size()) {
                    seriesChanged = true;
                } else {
                    seriesChanged = !_pondjs.TimeSeries.is(oldSeries, newSeries);
                }

                // If the series changes we need to rebuild this.series with
                // the incoming props
                if (seriesChanged) {
                    if (
                        nextProps.series._collection._type === _pondjs.TimeEvent // eslint-disable-line
                    ) {
                        this.series = getAggregatedSeries(
                            nextProps.series,
                            nextProps.column,
                            nextProps.aggregation
                        );
                    } else {
                        this.series = getSeries(nextProps.series, nextProps.column);
                    }
                }

                return (
                    seriesChanged ||
                    timeScaleChanged ||
                    widthChanged ||
                    columnChanged ||
                    styleChanged ||
                    yAxisScaleChanged ||
                    aggregationChanged ||
                    highlightedChanged ||
                    selectedChanged
                );
            }
        },
        {
            key: "handleHover",
            value: function handleHover(e, event) {
                if (this.props.onHighlightChange) {
                    this.props.onHighlightChange(event);
                }
            }
        },
        {
            key: "handleHoverLeave",
            value: function handleHoverLeave() {
                if (this.props.onHighlightChange) {
                    this.props.onHighlightChange(null);
                }
            }
        },
        {
            key: "handleClick",
            value: function handleClick(e, event) {
                if (this.props.onSelectionChange) {
                    this.props.onSelectionChange(event);
                }
                e.stopPropagation();
            }
        },
        {
            key: "providedStyleArray",
            value: function providedStyleArray(column) {
                var style = {};
                if (this.props.style) {
                    if (this.props.style instanceof _styler.Styler) {
                        style = this.props.style.boxChartStyle()[column];
                    } else if (_underscore2.default.isFunction(this.props.style)) {
                        style = this.props.style(column);
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
            value: function style(column, event, level) {
                var style = void 0;
                if (!this.providedStyle) {
                    this.providedStyle = this.providedStyleArray(this.props.column);
                }

                if (
                    !_underscore2.default.isNull(this.providedStyle) &&
                    (!_underscore2.default.isArray(this.providedStyle) ||
                        this.providedStyle.length !== 3)
                ) {
                    console.warn("Provided style to BoxChart should be an array of 3 objects");
                    return defaultStyle;
                }

                var isHighlighted =
                    this.props.highlighted && _pondjs.Event.is(this.props.highlighted, event);

                var isSelected =
                    this.props.selected && _pondjs.Event.is(this.props.selected, event);

                if (this.props.selected) {
                    if (isSelected) {
                        if (!this.selectedStyle || !this.selectedStyle[level]) {
                            if (!this.selectedStyle) {
                                this.selectedStyle = [];
                            }
                            this.selectedStyle[level] = (0, _merge2.default)(
                                true,
                                defaultStyle[level].selected,
                                this.providedStyle[level].selected
                                    ? this.providedStyle[level].selected
                                    : {}
                            );
                        }
                        style = this.selectedStyle[level];
                    } else if (isHighlighted) {
                        if (!this.highlightedStyle || !this.highlightedStyle[level]) {
                            if (!this.highlightedStyle) {
                                this.highlightedStyle = [];
                            }
                            this.highlightedStyle[level] = (0, _merge2.default)(
                                true,
                                defaultStyle[level].highlighted,
                                this.providedStyle[level].highlighted
                                    ? this.providedStyle[level].highlighted
                                    : {}
                            );
                        }
                        style = this.highlightedStyle[level];
                    } else {
                        if (!this.mutedStyle) {
                            this.mutedStyle = [];
                        }
                        if (!this.mutedStyle[level]) {
                            this.mutedStyle[level] = (0, _merge2.default)(
                                true,
                                defaultStyle[level].muted,
                                this.providedStyle[level].muted
                                    ? this.providedStyle[level].muted
                                    : {}
                            );
                        }
                        style = this.mutedStyle[level];
                    }
                } else if (isHighlighted) {
                    style = (0, _merge2.default)(
                        true,
                        defaultStyle[level].highlighted,
                        this.providedStyle[level].highlighted
                            ? this.providedStyle[level].highlighted
                            : {}
                    );
                } else {
                    if (!this.normalStyle) {
                        this.normalStyle = [];
                    }
                    if (!this.normalStyle[level]) {
                        this.normalStyle[level] = (0, _merge2.default)(
                            true,
                            defaultStyle[level].normal,
                            this.providedStyle[level].normal ? this.providedStyle[level].normal : {}
                        );
                    }
                    style = this.normalStyle[level];
                }
                return style;
            }
        },
        {
            key: "renderBars",
            value: function renderBars() {
                var _this2 = this;

                var _props = this.props,
                    timeScale = _props.timeScale,
                    yScale = _props.yScale,
                    column = _props.column;

                var innerSpacing = +this.props.innerSpacing;
                var outerSpacing = +this.props.outerSpacing;
                var innerSize = +this.props.innerSize;
                var outerSize = +this.props.outerSize;

                var bars = [];
                var eventMarker = void 0;

                var scaled = function scaled(d, field) {
                    return d.has(field) &&
                        !_underscore2.default.isUndefined(d.get(field)) &&
                        !_underscore2.default.isNaN(d.get(field))
                        ? yScale(d.get(field))
                        : null;
                };

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    var _loop = function _loop() {
                        var event = _step.value;

                        var index = event.index();
                        var begin = event.begin();
                        var end = event.end();
                        var d = event.data();

                        var beginPosInner = timeScale(begin) + innerSpacing;
                        var endPosInner = timeScale(end) - innerSpacing;

                        var beginPosOuter = timeScale(begin) + outerSpacing;
                        var endPosOuter = timeScale(end) - outerSpacing;

                        var innerWidth = innerSize || endPosInner - beginPosInner;
                        if (innerWidth < 1) {
                            innerWidth = 1;
                        }

                        var outerWidth = outerSize || endPosOuter - beginPosOuter;
                        if (outerWidth < 1) {
                            outerWidth = 1;
                        }

                        var c = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;

                        var xInner = timeScale(begin) + innerSpacing;
                        if (innerSize) {
                            xInner = c - innerSize / 2;
                        }

                        var xOuter = timeScale(begin) + outerSpacing;
                        if (outerSize) {
                            xOuter = c - outerSize / 2;
                        }

                        var styles = [];
                        styles[0] = _this2.style(column, event, 0);
                        styles[1] = _this2.style(column, event, 1);
                        styles[2] = _this2.style(column, event, 2);

                        var innerMin = scaled(d, "innerMin");
                        var innerMax = scaled(d, "innerMax");
                        var outerMin = scaled(d, "outerMin");
                        var outerMax = scaled(d, "outerMax");
                        var center = scaled(d, "center");

                        var hasInner = true;
                        var hasOuter = true;
                        var hasCenter = true;
                        if (
                            _underscore2.default.isNull(innerMin) ||
                            _underscore2.default.isNull(innerMax)
                        ) {
                            hasInner = false;
                        }
                        if (
                            _underscore2.default.isNull(outerMin) ||
                            _underscore2.default.isNull(outerMax)
                        ) {
                            hasOuter = false;
                        }
                        if (_underscore2.default.isNull(center)) {
                            hasCenter = false;
                        }

                        var ymax = 0;
                        if (hasOuter) {
                            var level = 0;
                            if (!hasInner) {
                                level += 1;
                            }
                            if (!hasCenter) {
                                level += 1;
                            }
                            var keyOuter =
                                (_this2.series.name() ? _this2.series.name() : "series") +
                                "-" +
                                index +
                                "-outer";
                            var boxOuter = {
                                x: xOuter,
                                y: outerMax,
                                width: outerWidth,
                                height: outerMin - outerMax,
                                rx: 2,
                                ry: 2
                            };
                            var barOuterProps = _extends(
                                {
                                    key: keyOuter
                                },
                                boxOuter,
                                {
                                    style: styles[level]
                                }
                            );

                            if (_this2.props.onSelectionChange) {
                                barOuterProps.onClick = function(e) {
                                    return _this2.handleClick(e, event);
                                };
                            }
                            if (_this2.props.onHighlightChange) {
                                barOuterProps.onMouseMove = function(e) {
                                    return _this2.handleHover(e, event);
                                };
                                barOuterProps.onMouseLeave = function() {
                                    return _this2.handleHoverLeave();
                                };
                            }

                            bars.push(_react2.default.createElement("rect", barOuterProps));
                            ymax = "outerMax";
                        }

                        if (hasInner) {
                            var _level = 1;
                            if (!hasCenter) {
                                _level += 1;
                            }
                            var keyInner = _this2.series.name() + "-" + index + "-inner";
                            var boxInner = {
                                x: xInner,
                                y: innerMax,
                                width: innerWidth,
                                height: innerMin - innerMax,
                                rx: 1,
                                ry: 1
                            };
                            var barInnerProps = _extends(
                                {
                                    key: keyInner
                                },
                                boxInner,
                                {
                                    style: styles[_level]
                                }
                            );
                            if (_this2.props.onSelectionChange) {
                                barInnerProps.onClick = function(e) {
                                    return _this2.handleClick(e, event);
                                };
                            }
                            if (_this2.props.onHighlightChange) {
                                barInnerProps.onMouseMove = function(e) {
                                    return _this2.handleHover(e, event);
                                };
                                barInnerProps.onMouseLeave = function() {
                                    return _this2.handleHoverLeave();
                                };
                            }

                            bars.push(_react2.default.createElement("rect", barInnerProps));
                            ymax = ymax || "innerMax";
                        }

                        if (hasCenter) {
                            var _level2 = 2;
                            var keyCenter = _this2.series.name() + "-" + index + "-center";
                            var boxCenter = {
                                x: xInner,
                                y: center,
                                width: innerWidth,
                                height: 1
                            };
                            var barCenterProps = _extends(
                                {
                                    key: keyCenter
                                },
                                boxCenter,
                                {
                                    style: styles[_level2]
                                }
                            );
                            if (_this2.props.onSelectionChange) {
                                barCenterProps.onClick = function(e) {
                                    return _this2.handleClick(e, event);
                                };
                            }
                            if (_this2.props.onHighlightChange) {
                                barCenterProps.onMouseMove = function(e) {
                                    return _this2.handleHover(e, event);
                                };
                                barCenterProps.onMouseLeave = function() {
                                    return _this2.handleHoverLeave();
                                };
                            }
                            if (_underscore2.default.isNaN(barCenterProps.y)) {
                                console.log(d.toString());
                            }
                            bars.push(_react2.default.createElement("rect", barCenterProps));
                            ymax = ymax || "center";
                        }

                        // Event marker if info provided and hovering
                        var isHighlighted =
                            _this2.props.highlighted &&
                            _pondjs.Event.is(_this2.props.highlighted, event);
                        if (isHighlighted && _this2.props.info) {
                            eventMarker = _react2.default.createElement(
                                _EventMarker2.default,
                                _extends({}, _this2.props, {
                                    yValueFunc: function yValueFunc(e) {
                                        return e.get(ymax);
                                    },
                                    event: event,
                                    column: column,
                                    marker: "circle",
                                    markerRadius: 2
                                })
                            );
                        }
                    };

                    for (
                        var _iterator = this.series.events()[Symbol.iterator](), _step;
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

                return _react2.default.createElement("g", null, bars, eventMarker);
            }
        },
        {
            key: "render",
            value: function render() {
                return _react2.default.createElement("g", null, this.renderBars());
            }
        }
    ]);

    return BoxChart;
})(_react2.default.Component);

exports.default = BoxChart;

BoxChart.propTypes = {
    /**
     * Show or hide this chart
     */
    visible: _propTypes2.default.bool,

    /**
     * What [Pond TimeSeries](https://esnet-pondjs.appspot.com/#/timeseries)
     * data to visualize. See general notes on the BoxChart.
     */
    series: function series(props, propName, componentName) {
        var value = props[propName];
        if (!(value instanceof _pondjs.TimeSeries)) {
            return new Error(
                "A TimeSeries needs to be passed to " + componentName + " as the 'series' prop."
            );
        }

        // TODO: Better detection of errors

        // everything ok
        return null;
    },

    /**
     * The column within the TimeSeries to plot. Unlike other charts, the BoxChart
     * works on just a single column.
     *
     * NOTE : Columns can't have periods because periods
     * represent a path to deep data in the underlying events
     * (i.e. reference into nested data structures)
     */
    column: _propTypes2.default.string,

    /**
     * The aggregation specification. This object should contain:
     *   - innerMax
     *   - innerMin
     *   - outerMax
     *   - outerMin
     *   - center
     * Though each of the pairs, and center, is optional.
     * For each of these keys you should supply the function you
     * want to use to calculate these. You can import common functions
     * from Pond, e.g. min(), avg(), percentile(95), etc.
     *
     * For example:
     * ```
     *     {
     *       size: this.state.rollup,
     *       reducers: {
     *         outer: [min(), max()],
     *         inner: [percentile(25), percentile(75)],
     *         center: median(),
     *       },
     *     }
     * ```
     */
    aggregation: _propTypes2.default.shape({
        size: _propTypes2.default.string,
        reducers: _propTypes2.default.shape({
            inner: _propTypes2.default.arrayOf(_propTypes2.default.func), // eslint-disable-line
            outer: _propTypes2.default.arrayOf(_propTypes2.default.func), // eslint-disable-line
            center: _propTypes2.default.func // eslint-disable-line
        })
    }), // eslint-disable-line

    /**
     * The style of the box chart drawing (using SVG CSS properties) or
     * a styler object. It is recommended to user the styler unless you need
     * detailed customization.
     */
    style: _propTypes2.default.oneOfType([
        _propTypes2.default.object,
        _propTypes2.default.func,
        _propTypes2.default.instanceOf(_styler.Styler)
    ]),

    /**
     * The style of the info box and connecting lines
     */
    infoStyle: _propTypes2.default.object, //eslint-disable-line

    /**
     * The width of the hover info box
     */
    infoWidth: _propTypes2.default.number, //eslint-disable-line

    /**
     * The height of the hover info box
     */
    infoHeight: _propTypes2.default.number, //eslint-disable-line

    /**
     * The values to show in the info box. This is an array of
     * objects, with each object specifying the label and value
     * to be shown in the info box.
     */
    info: _propTypes2.default.arrayOf(
        _propTypes2.default.shape({
            //eslint-disable-line
            label: _propTypes2.default.string, //eslint-disable-line
            value: _propTypes2.default.string //eslint-disable-line
        })
    ),

    /**
     * If spacing is specified, then the boxes will be separated from the
     * timerange boundary by this number of pixels. Use this to space out
     * the boxes from each other. Inner and outer boxes are controlled
     * separately.
     */
    innerSpacing: _propTypes2.default.number,

    /**
     * If spacing is specified, then the boxes will be separated from the
     * timerange boundary by this number of pixels. Use this to space out
     * the boxes from each other. Inner and outer boxes are controlled
     * separately.
     */
    outerSpacing: _propTypes2.default.number,

    /**
     * If size is specified, then the innerBox will be this number of pixels wide. This
     * prop takes priority over "spacing".
     */
    innerSize: _propTypes2.default.number,

    /**
     * If size is specified, then the outer box will be this number of pixels wide. This
     * prop takes priority over "spacing".
     */
    outerSize: _propTypes2.default.number,

    /**
     * The selected item, which will be rendered in the "selected" style.
     * If a bar is selected, all other bars will be rendered in the "muted" style.
     *
     * See also `onSelectionChange`
     */
    selected: _propTypes2.default.instanceOf(_pondjs.IndexedEvent),

    /**
     * The highlighted item, which will be rendered in the "highlighted" style.
     *
     * See also `onHighlightChange`
     */
    highlighted: _propTypes2.default.instanceOf(_pondjs.IndexedEvent),

    /**
     * A callback that will be called when the selection changes. It will be called
     * with the event corresponding to the box clicked as its only arg.
     */
    onSelectionChange: _propTypes2.default.func,

    /**
     * A callback that will be called when the hovered over box changes.
     * It will be called with the event corresponding to the box hovered over.
     */
    onHighlightChange: _propTypes2.default.func,

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

BoxChart.defaultProps = {
    visible: true,
    column: "value",
    innerSpacing: 1.0,
    outerSpacing: 2.0,
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
    markerRadius: 2,
    infoWidth: 90,
    infoHeight: 30
};
