"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _d3Shape = require("d3-shape");

var _d3Shape2 = _interopRequireDefault(_d3Shape);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _pondjs = require("pondjs");

var _styler = require("../js/styler");

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

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

var defaultStyle = {
    normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
    highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
    selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
    muted: { stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1 }
};

/**
 * The `<LineChart>` component is able to display multiple columns of a TimeSeries
 * as separate line charts.
 *
 * The `<LineChart>` should be used within `<ChartContainer>` etc., as this will
 * construct the horizontal and vertical axis, and manage other elements.
 *
 * Here is an example of two columns of a TimeSeries being plotted with the `<LineChart>`:
 *
 * ```
    <ChartContainer timeRange={this.state.timerange} >
        <ChartRow height="200">
            <YAxis id="y" label="Price ($)" min={0.5} max={1.5} format="$,.2f" />
            <Charts>
                <LineChart
                    axis="y"
                    breakLine={false}
                    series={currencySeries}
                    columns={["aud", "euro"]}
                    style={style}
                    interpolation="curveBasis" />
            </Charts>
        </ChartRow>
    </ChartContainer>
 * ```
 */
exports.default = _react2.default.createClass({

    displayName: "LineChart",

    getDefaultProps: function getDefaultProps() {
        return {
            columns: ["value"],
            smooth: true,
            interpolation: "curveLinear",
            breakLine: true
        };
    },


    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: _react2.default.PropTypes.instanceOf(_pondjs.TimeSeries).isRequired,

        /**
         * Reference to the axis which provides the vertical scale for drawing.
         * e.g. specifying `axis="trafficRate"` would refer the y-scale of the YAxis
         * with id="trafficRate".
         */
        axis: _react2.default.PropTypes.string.isRequired,

        /**
         * Which columns from the series to draw.
         */
        columns: _react2.default.PropTypes.array,

        /**
         * The styles to apply to the underlying SVG lines. This is a mapping
         * of column names to objects with style attributes, in the following
         * format:
         *
         * ```
         *  const lineStyles = {
         *      value: {
         *          stroke: "steelblue",
         *          strokeWidth: 1,
         *          strokeDasharray: "4,2"
         *      }
         *  };
         *
         *  <LineChart style={lineStyles} ... />
         *
         *  Alternatively, you can pass in a Styler. For example:
         *
         * ```
         * const currencyStyle = Styler([
         *     {key: "aud", color: "steelblue", width: 1, dashed: true},
         *     {key: "euro", color: "#F68B24", width: 2}
         * ]);
         *
         * <LineChart columns={["aud", "euro"]} style={currencyStyle} ... />
         *
         * ```
         */
        style: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.func, _react2.default.PropTypes.instanceOf(_styler.Styler)]),

        /**
         * Any of D3's interpolation modes.
         */
        interpolation: _react2.default.PropTypes.oneOf(["curveBasis", "curveBasisOpen", "curveBundle", "curveCardinal", "curveCardinalOpen", "curveCatmullRom", "curveCatmullRomOpen", "curveLinear", "curveMonotone", "curveNatural", "curveRadial", "curveStep", "curveStepAfter", "curveStepBefore"]),

        /**
         * The determines how to handle bad/missing values in the supplied
         * TimeSeries. A missing value can be null or NaN. If breakLine
         * is set to true then the line will be broken on either side of
         * the bad value(s). If breakLine is false (the default) bad values
         * are simply removed and the adjoining points are connected.
         */
        breakLine: _react2.default.PropTypes.bool,

        /**
         * The selected item, which will be rendered in the "selected" style.
         * If a line is selected, all other lines will be rendered in the "muted" style.
         *
         * See also `onSelectionChange`
         */
        selected: _react2.default.PropTypes.string,

        /**
         * A callback that will be called when the selection changes. It will be called
         * with the column corresponding to the line being clicked.
         */
        onSelectionChange: _react2.default.PropTypes.func,

        /**
         * The highlighted column, which will be rendered in the "highlighted" style.
         *
         * See also `onHighlightChanged`
         */
        highlighted: _react2.default.PropTypes.string,

        /**
         * A callback that will be called when the hovered over line changes.
         * It will be called with the corresponding column.
         */
        onHighlightChanged: _react2.default.PropTypes.func
    },

    handleHover: function handleHover(e, column) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(column);
        }
    },
    handleHoverLeave: function handleHoverLeave() {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    },
    handleClick: function handleClick(e, column) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(column);
        }
    },
    providedPathStyleMap: function providedPathStyleMap(column) {
        var style = {};
        if (this.props.style) {
            if (this.props.style instanceof _styler.Styler) {
                style = this.props.style.lineChartStyle()[column];
            } else if (_underscore2.default.isObject(this.props.style)) {
                style = this.props.style[column];
            } else if (_underscore2.default.isFunction(this.props.style)) {
                style = this.props.style(column);
            }
        }
        return style;
    },


    /**
     * Returns the style used for drawing the path
     */
    pathStyle: function pathStyle(column) {
        var style = void 0;

        var styleMap = this.providedPathStyleMap(column);
        var isHighlighted = this.props.highlight && column === this.props.highlight;
        var isSelected = this.props.selection && column === this.props.selection;

        if (this.props.selection) {
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
            style = (0, _merge2.default)(true, defaultStyle.normal, styleMap.normal);
        }

        return style;
    },
    renderPath: function renderPath(data, column, key) {
        var _this = this;

        var lineFunction = _d3Shape2.default.line().curve(_d3Shape2.default[this.props.interpolation]).x(function (data) {
            return _this.props.timeScale(data.x);
        }).y(function (data) {
            return _this.props.yScale(data.y);
        });
        var path = lineFunction(data);
        var hitStyle = {
            stroke: "white",
            fill: "none",
            opacity: 0.0,
            strokeWidth: 7,
            cursor: "crosshair"
        };
        return _react2.default.createElement(
            "g",
            { key: key },
            _react2.default.createElement("path", {
                d: path,
                clipPath: this.props.clipPathURL,
                style: this.pathStyle(column) }),
            _react2.default.createElement("path", {
                d: path,
                clipPath: this.props.clipPathURL,
                style: hitStyle,
                onClick: function onClick(e) {
                    return _this.handleClick(e, column);
                },
                onMouseLeave: this.handleHoverLeave,
                onMouseMove: function onMouseMove(e) {
                    return _this.handleHover(e, column);
                } })
        );
    },
    renderLines: function renderLines() {
        var _this2 = this;

        return _underscore2.default.map(this.props.columns, function (column) {
            return _this2.renderLine(column);
        });
    },
    renderLine: function renderLine(column) {
        var pathLines = [];
        var count = 1;
        if (this.props.breakLine) {
            // Remove nulls and NaNs from the line by generating a break in the line
            var currentPoints = null;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.props.series.events()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var d = _step.value;

                    var timestamp = d.timestamp();
                    var value = d.get(column);
                    var badPoint = _underscore2.default.isNull(value) || _underscore2.default.isNaN(value) || !_underscore2.default.isFinite(value);
                    if (!badPoint) {
                        if (!currentPoints) currentPoints = [];
                        currentPoints.push({ x: timestamp, y: value });
                    } else {
                        if (currentPoints) {
                            if (currentPoints.length > 1) pathLines.push(this.renderPath(currentPoints, column, count++));
                            currentPoints = null;
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

            if (currentPoints && currentPoints.length > 1) {
                pathLines.push(this.renderPath(currentPoints, column, count));
            }
        } else {
            // Ignore nulls and NaNs in the line
            var cleanedPoints = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.props.series.events()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _d = _step2.value;

                    var _timestamp = _d.timestamp();
                    var _value = _d.get(column);
                    var _badPoint = _underscore2.default.isNull(_value) || _underscore2.default.isNaN(_value) || !_underscore2.default.isFinite(_value);
                    if (!_badPoint) {
                        cleanedPoints.push({ x: _timestamp, y: _value });
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

            pathLines.push(this.renderPath(cleanedPoints, column, count));
        }

        return _react2.default.createElement(
            "g",
            { key: column },
            pathLines
        );
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
        var newSeries = nextProps.series;
        var oldSeries = this.props.series;

        var width = nextProps.width;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var isPanning = nextProps.isPanning;
        var interpolation = nextProps.interpolation;
        var highlight = nextProps.highlight;
        var selection = nextProps.selection;
        var columns = nextProps.columns;

        // What changed?
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = scaleAsString(this.props.timeScale) !== scaleAsString(timeScale);
        var yAxisScaleChanged = this.props.yScale !== yScale;
        var isPanningChanged = this.props.isPanning !== isPanning;
        var interpolationChanged = this.props.interpolation !== interpolation;
        var highlightChanged = this.props.highlight !== highlight;
        var selectionChanged = this.props.selection !== selection;
        var columnsChanged = this.props.columns !== columns;

        var seriesChanged = false;
        if (oldSeries.length !== newSeries.length) {
            seriesChanged = true;
        } else {
            seriesChanged = !_pondjs.TimeSeries.is(oldSeries, newSeries);
        }

        return widthChanged || seriesChanged || timeScaleChanged || isPanningChanged || yAxisScaleChanged || interpolationChanged || highlightChanged || selectionChanged || columnsChanged;
    },
    render: function render() {
        return _react2.default.createElement(
            "g",
            null,
            this.renderLines()
        );
    }
});