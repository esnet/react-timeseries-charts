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

require("array.prototype.fill");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _d3Shape = require("d3-shape");

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _pondjs = require("pondjs");

var _util = require("../js/util");

var _styler = require("../js/styler");

var _curve = require("../js/curve");

var _curve2 = _interopRequireDefault(_curve);

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
} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2015-present, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var defaultStyle = {
    line: {
        normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
        selected: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        muted: { stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1 }
    },
    area: {
        normal: { fill: "steelblue", stroke: "none", opacity: 0.75 },
        highlighted: { fill: "#5a98cb", stroke: "none", opacity: 0.75 },
        selected: { fill: "steelblue", stroke: "none", opacity: 0.75 },
        muted: { fill: "steelblue", stroke: "none", opacity: 0.25 }
    }
};

/**
 * The `<AreaChart>` component is able to display single or multiple stacked
 * areas above or below the axis. It used throughout the
 * [My ESnet Portal](http://my.es.net).

 * The `<AreaChart>` should be used within a `<ChartContainer>` structure,
 * as this will construct the horizontal and vertical axis, and manage
 * other elements. Here is an example of an `<AreaChart>` with an up and down
 * network traffic visualization:
 *
 *  ```
 *   render() {
 *      return (
 *          ...
 *          <ChartContainer timeRange={trafficSeries.timerange()} width="1080">
 *              <ChartRow height="150">
 *                  <Charts>
 *                      <AreaChart
 *                          axis="traffic"
 *                          series={trafficSeries}
 *                          columns={{up: ["in"], down: ["out"]}}
 *                       />
 *                  </Charts>
 *                  <YAxis
 *                      id="traffic"
 *                      label="Traffic (bps)"
 *                      min={-max} max={max}
 *                      absolute={true}
 *                      width="60"
 *                      type="linear"
 *                  />
 *              </ChartRow>
 *          </ChartContainer>
 *          ...
 *      );
 *  }
 *  ```
 * The `<AreaChart>` takes a single `TimeSeries` object into its `series` prop. This
 * series can contain multiple columns and those columns can be referenced using the `columns`
 * prop. The `columns` props allows you to map columns in the series to the chart,
 * letting you specify the stacking and orientation of the data. In the above example
 * we map the "in" column in `trafficSeries` to the up direction and the "out" column to
 * the down direction. Each direction is specified as an array, so adding multiple
 * columns into a direction will stack the areas in that direction.
 *
 * Note: It is recommended that `<ChartContainer>`s be placed within a <Resizable> tag,
 * rather than hard coding the width as in the above example.
 */

var AreaChart = (function(_React$Component) {
    _inherits(AreaChart, _React$Component);

    function AreaChart() {
        _classCallCheck(this, AreaChart);

        return _possibleConstructorReturn(
            this,
            (AreaChart.__proto__ || Object.getPrototypeOf(AreaChart)).apply(this, arguments)
        );
    }

    _createClass(AreaChart, [
        {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate(nextProps) {
                var newSeries = nextProps.series;
                var oldSeries = this.props.series;
                var width = nextProps.width;
                var timeScale = nextProps.timeScale;
                var yScale = nextProps.yScale;
                var interpolation = nextProps.interpolation;
                var columns = nextProps.columns;
                var style = nextProps.style;
                var highlight = nextProps.highlight;
                var selection = nextProps.selection;

                var widthChanged = this.props.width !== width;
                var timeScaleChanged = (0, _util.scaleAsString)(this.props.timeScale) !==
                    (0, _util.scaleAsString)(timeScale);
                var yAxisScaleChanged = this.props.yScale !== yScale;
                var interpolationChanged = this.props.interpolation !== interpolation;
                var columnsChanged = JSON.stringify(this.props.columns) !== JSON.stringify(columns);
                var styleChanged = JSON.stringify(this.props.style) !== JSON.stringify(style);
                var highlightChanged = this.props.highlight !== highlight;
                var selectionChanged = this.props.selection !== selection;

                var seriesChanged = false;
                if (oldSeries.length !== newSeries.length) {
                    seriesChanged = true;
                } else {
                    seriesChanged = !_pondjs.TimeSeries.is(oldSeries, newSeries);
                }

                return seriesChanged ||
                    timeScaleChanged ||
                    widthChanged ||
                    interpolationChanged ||
                    columnsChanged ||
                    styleChanged ||
                    yAxisScaleChanged ||
                    highlightChanged ||
                    selectionChanged;
            }
        },
        {
            key: "handleHover",
            value: function handleHover(e, column) {
                if (this.props.onHighlightChange) {
                    this.props.onHighlightChange(column);
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
            value: function handleClick(e, column) {
                e.stopPropagation();
                if (this.props.onSelectionChange) {
                    this.props.onSelectionChange(column);
                }
            }
        },
        {
            key: "providedAreaStyleMap",
            value: function providedAreaStyleMap(column) {
                var style = defaultStyle;
                if (this.props.style) {
                    if (this.props.style instanceof _styler.Styler) {
                        style = this.props.style.areaChartStyle()[column];
                    } else if (_underscore2.default.isObject(this.props.style)) {
                        style = this.props.style[column];
                    } else if (_underscore2.default.isFunction(this.props.style)) {
                        style = this.props.style(column);
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
            value: function style(column, type) {
                var style = void 0;

                var styleMap = this.providedAreaStyleMap(column);
                var isHighlighted = this.props.highlight && column === this.props.highlight;
                var isSelected = this.props.selection && column === this.props.selection;

                if (!_underscore2.default.has(styleMap, "line")) {
                    console.error(
                        "Provided style for AreaChart does not define a style for the outline:",
                        styleMap,
                        column
                    );
                }

                if (!_underscore2.default.has(styleMap, "area")) {
                    console.error(
                        "Provided style for AreaChart does not define a style for the area:",
                        styleMap
                    );
                }

                if (this.props.selection) {
                    if (isSelected) {
                        style = (0, _merge2.default)(
                            true,
                            defaultStyle[type].selected,
                            styleMap[type].selected ? styleMap[type].selected : {}
                        );
                    } else if (isHighlighted) {
                        style = (0, _merge2.default)(
                            true,
                            defaultStyle[type].highlighted,
                            styleMap[type].highlighted ? styleMap[type].highlighted : {}
                        );
                    } else {
                        style = (0, _merge2.default)(
                            true,
                            defaultStyle[type].muted,
                            styleMap[type].muted ? styleMap[type].muted : {}
                        );
                    }
                } else if (isHighlighted) {
                    style = (0, _merge2.default)(
                        true,
                        defaultStyle[type].highlighted,
                        styleMap[type].highlighted ? styleMap[type].highlighted : {}
                    );
                } else {
                    style = (0, _merge2.default)(
                        true,
                        defaultStyle[type].normal,
                        styleMap[type].normal ? styleMap[type].normal : {}
                    );
                }
                return style;
            }
        },
        {
            key: "pathStyle",
            value: function pathStyle(column) {
                return this.style(column, "line");
            }
        },
        {
            key: "areaStyle",
            value: function areaStyle(column) {
                return this.style(column, "area");
            }
        },
        {
            key: "renderPaths",
            value: function renderPaths(columnList, direction) {
                var _this2 = this;

                var dir = direction === "up" ? 1 : -1;
                var size = this.props.series.size();
                var offsets = new Array(size).fill(0);

                return columnList.map(function(column, i) {
                    var style = _this2.areaStyle(column);
                    var pathStyle = _this2.pathStyle(column);

                    // Stack the series columns to get our data in x0, y0, y1 format
                    var data = [];
                    for (var j = 0; j < _this2.props.series.size(); j += 1) {
                        var seriesPoint = _this2.props.series.at(j);
                        data.push({
                            x0: _this2.props.timeScale(seriesPoint.timestamp()),
                            y0: _this2.props.yScale(offsets[j]),
                            y1: _this2.props.yScale(offsets[j] + dir * seriesPoint.get(column))
                        });
                        if (_this2.props.stack) {
                            offsets[j] += dir * seriesPoint.get(column);
                        }
                    }

                    // Use D3 to build an area generation function
                    var areaGenerator = (0, _d3Shape.area)()
                        .curve(_curve2.default[_this2.props.interpolation])
                        .x(function(d) {
                            return d.x0;
                        })
                        .y0(function(d) {
                            return d.y0;
                        })
                        .y1(function(d) {
                            return d.y1;
                        });

                    // Use the area generation function with our stacked data
                    // to get an SVG path
                    var areaPath = areaGenerator(data);

                    // Outline the top of the curve
                    var lineGenerator = (0, _d3Shape.line)()
                        .curve(_curve2.default[_this2.props.interpolation])
                        .x(function(d) {
                            return d.x0;
                        })
                        .y(function(d) {
                            return d.y1;
                        });
                    var outlinePath = lineGenerator(data);

                    return _react2.default.createElement(
                        "g",
                        { key: "area-" + i },
                        _react2.default.createElement("path", {
                            d: areaPath,
                            style: style,
                            onClick: function onClick(e) {
                                return _this2.handleClick(e, column);
                            },
                            onMouseLeave: function onMouseLeave() {
                                return _this2.handleHoverLeave();
                            },
                            onMouseMove: function onMouseMove(e) {
                                return _this2.handleHover(e, column);
                            }
                        }),
                        _react2.default.createElement("path", {
                            d: outlinePath,
                            style: pathStyle,
                            onClick: function onClick(e) {
                                return _this2.handleClick(e, column);
                            },
                            onMouseLeave: function onMouseLeave() {
                                return _this2.handleHoverLeave();
                            },
                            onMouseMove: function onMouseMove(e) {
                                return _this2.handleHover(e, column);
                            }
                        })
                    );
                });
            }
        },
        {
            key: "renderAreas",
            value: function renderAreas() {
                var up = this.props.columns.up || [];
                var down = this.props.columns.down || [];
                return _react2.default.createElement(
                    "g",
                    null,
                    this.renderPaths(up, "up"),
                    this.renderPaths(down, "down")
                );
            }
        },
        {
            key: "render",
            value: function render() {
                return _react2.default.createElement("g", null, this.renderAreas());
            }
        }
    ]);

    return AreaChart;
})(_react2.default.Component);

exports.default = AreaChart;

AreaChart.propTypes = {
    /**
    * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
    */
    series: _propTypes2.default.instanceOf(_pondjs.TimeSeries).isRequired,
    /**
    * Reference to the axis which provides the vertical scale for ## drawing. e.g.
    * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
    */
    axis: _propTypes2.default.string.isRequired, // eslint-disable-line
    /**
    * The series series columns mapped to stacking up and down.
    * Has the format:
    * ```
    *  "columns": {
    *      up: ["in", ...],
    *      down: ["out", ...]
    *  }
    *  ```
    */
    columns: _propTypes2.default.shape({
        up: _propTypes2.default.arrayOf(_propTypes2.default.string),
        down: _propTypes2.default.arrayOf(_propTypes2.default.string)
    }),
    stack: _propTypes2.default.bool,
    /**
    * The styles to apply to the underlying SVG lines. This is a mapping
    * of column names to objects with style attributes, in the following
    * format:
    *
    * ```
    * const style = {
    *     in: {
    *         line: {
    *             normal: {stroke: "steelblue", fill: "none", strokeWidth: 1},
    *             highlighted: {stroke: "#5a98cb", fill: "none", strokeWidth: 1},
    *             selected: {stroke: "steelblue", fill: "none", strokeWidth: 1},
    *             muted: {stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1}
    *         },
    *         area: {
    *             normal: {fill: "steelblue", stroke: "none", opacity: 0.75},
    *             highlighted: {fill: "#5a98cb", stroke: "none", opacity: 0.75},
    *             selected: {fill: "steelblue", stroke: "none", opacity: 0.75},
    *             muted: {fill: "steelblue", stroke: "none", opacity: 0.25}
    *         }
    *     },
    *     out: {
    *         ...
    *     }
    * };
    *
    * <AreaChart style={style} ... />
    * ```
    *
    * Alternatively, you can pass in a Styler. For example:
    *
    * ```
    * const upDownStyler = styler([
    *     {key: "in", color: "#C8D5B8"},
    *     {key: "out", color: "#9BB8D7"}
    * ]);
    *
    * <AreaChart columns={["in", "out"]} style={upDownStyler} ... />
    *
    * ```
    */
    style: _propTypes2.default.oneOfType([
        _propTypes2.default.object,
        _propTypes2.default.func,
        _propTypes2.default.instanceOf(_styler.Styler)
    ]),
    /**
    * Any of D3's interpolation modes.
    */
    interpolation: _propTypes2.default.oneOf([
        "curveBasis",
        "curveBasisOpen",
        "curveBundle",
        "curveCardinal",
        "curveCardinalOpen",
        "curveCatmullRom",
        "curveCatmullRomOpen",
        "curveLinear",
        "curveMonotoneX",
        "curveMonotoneY",
        "curveNatural",
        "curveRadial",
        "curveStep",
        "curveStepAfter",
        "curveStepBefore"
    ]),
    /**
    * The currenly highlighted column
    */
    highlight: _propTypes2.default.string,
    /**
    * Callback called when the highlight changes, i.e. hover event
    */
    onHighlightChange: _propTypes2.default.func,
    /**
    * The currenly selected column
    */
    selection: _propTypes2.default.string,
    /**
    * Callback called when the selection changes, i.e. area is clicked
    */
    onSelectionChange: _propTypes2.default.func,
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

AreaChart.defaultProps = {
    interpolation: "curveLinear",
    columns: {
        up: ["value"],
        down: []
    },
    stack: true
};
