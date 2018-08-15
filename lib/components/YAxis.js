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

require("d3-transition");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Array = require("d3-array");

var _d3Axis = require("d3-axis");

var _d3Ease = require("d3-ease");

var _d3Format = require("d3-format");

var _d3Selection = require("d3-selection");

require("d3-selection-multi");

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
} /**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

// eslint-disable-line

var MARGIN = 0;

var defaultStyle = {
    label: {
        stroke: "none",
        fill: "#8B7E7E", // Default label color
        fontWeight: 100,
        fontSize: 12,
        font: '"Goudy Bookletter 1911", sans-serif"'
    },
    values: {
        stroke: "none",
        fill: "#8B7E7E", // Default value color
        fontWeight: 100,
        fontSize: 11,
        font: '"Goudy Bookletter 1911", sans-serif"'
    },
    ticks: {
        fill: "none",
        stroke: "#C0C0C0"
    },
    axis: {
        fill: "none",
        stroke: "#C0C0C0"
    }
};

/**
 * The `YAxis` widget displays a vertical axis to the left or right
 * of the charts. A `YAxis` always appears within a `ChartRow`, from
 * which it gets its height and positioning. You can have more than
 * one axis per row. You do control how wide it is.
 *
 * Here's a simple YAxis example:
 *
 * ```js
 * <YAxis
 *   id="price-axis"
 *   label="Price (USD)"
 *   min={0} max={100}
 *   width="60"
 *   type="linear"
 *   format="$,.2f"
 * />
 * ```
 *
 * Visually you can control the axis `label`, its size via the `width`
 * prop, its `format`, and `type` of scale (linear). You can quicky turn
 * it on and off with the `visible` prop.
 *
 * Each axis also defines a scale through a `min` and `max` prop. Chart
 * then refer to the axis by by citing the axis `id` in their `axis`
 * prop. Those charts will then use the axis scale for their y-scale.
 * This is what ties them together. Many charts can use the same axis,
 * or not.
 *
 * Here is an example of two line charts that each have their own axis:
 *
 * ```js
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis id="aud" label="AUD" min={0.5} max={1.5} width="60" format="$,.2f"/>
 *         <Charts>
 *             <LineChart axis="aud" series={audSeries} style={audStyle}/>
 *             <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
 *         </Charts>
 *         <YAxis id="euro" label="Euro" min={0.5} max={1.5} width="80" format="$,.2f"/>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 *
 *  Note that there are two `<YAxis>` components defined here, one before
 *  the `<Charts>` block and one after. This defines that the first axis will
 *  appear to the left of the charts and the second will appear right of the charts.
 *  Each of the line charts uses its `axis` prop to identify the axis ("aud" or "euro")
 *  it will use for its vertical scale.
 */

var YAxis = (function(_React$Component) {
    _inherits(YAxis, _React$Component);

    function YAxis() {
        _classCallCheck(this, YAxis);

        return _possibleConstructorReturn(
            this,
            (YAxis.__proto__ || Object.getPrototypeOf(YAxis)).apply(this, arguments)
        );
    }

    _createClass(YAxis, [
        {
            key: "componentDidMount",
            value: function componentDidMount() {
                this.renderAxis(
                    this.props.align,
                    this.props.scale,
                    +this.props.width,
                    +this.props.height,
                    this.props.showGrid,
                    +this.props.chartExtent,
                    this.props.hideAxisLine,
                    this.props.absolute,
                    this.props.type,
                    this.props.format
                );
            }
        },
        {
            key: "componentWillReceiveProps",
            value: function componentWillReceiveProps(nextProps) {
                var scale = nextProps.scale,
                    align = nextProps.align,
                    width = nextProps.width,
                    height = nextProps.height,
                    chartExtent = nextProps.chartExtent,
                    absolute = nextProps.absolute,
                    format = nextProps.format,
                    type = nextProps.type,
                    showGrid = nextProps.showGrid,
                    hideAxisLine = nextProps.hideAxisLine;

                if (
                    (0, _util.scaleAsString)(this.props.scale) !== (0, _util.scaleAsString)(scale)
                ) {
                    this.updateAxis(
                        align,
                        scale,
                        width,
                        height,
                        showGrid,
                        chartExtent,
                        hideAxisLine,
                        absolute,
                        type,
                        format
                    );
                } else if (
                    this.props.format !== format ||
                    this.props.align !== align ||
                    this.props.width !== width ||
                    this.props.height !== height ||
                    this.props.type !== type ||
                    this.props.absolute !== absolute ||
                    this.props.chartExtent !== chartExtent ||
                    this.props.showGrid !== showGrid ||
                    this.props.hideAxisLine !== hideAxisLine
                ) {
                    this.renderAxis(
                        align,
                        scale,
                        +width,
                        +height,
                        showGrid,
                        chartExtent,
                        hideAxisLine,
                        absolute,
                        type,
                        format
                    );
                }
            }
        },
        {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate() {
                return false;
            }
        },
        {
            key: "yformat",
            value: function yformat(fmt) {
                if (_underscore2.default.isString(fmt)) {
                    return (0, _d3Format.format)(fmt);
                } else if (_underscore2.default.isFunction(fmt)) {
                    return fmt;
                } else {
                    return (0, _d3Format.format)("");
                }
            }
        },
        {
            key: "mergeStyles",
            value: function mergeStyles(style) {
                return {
                    labelStyle: (0, _merge2.default)(
                        true,
                        defaultStyle.label,
                        this.props.style.label ? this.props.style.label : {}
                    ),
                    valueStyle: (0, _merge2.default)(
                        true,
                        defaultStyle.values,
                        this.props.style.values ? this.props.style.values : {}
                    ),
                    axisStyle: (0, _merge2.default)(
                        true,
                        defaultStyle.axis,
                        this.props.style.axis ? this.props.style.axis : {}
                    ),
                    tickStyle: (0, _merge2.default)(
                        true,
                        defaultStyle.ticks,
                        this.props.style.ticks ? this.props.style.ticks : {}
                    )
                };
            }
        },
        {
            key: "postSelect",
            value: function postSelect(style, hideAxisLine, height) {
                var valueStyle = style.valueStyle,
                    tickStyle = style.tickStyle,
                    axisStyle = style.axisStyle;

                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                    .select("g")
                    .selectAll(".tick")
                    .select("text")
                    .styles(valueStyle);

                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                    .select("g")
                    .selectAll(".tick")
                    .select("line")
                    .styles(tickStyle);

                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                    .select("g")
                    .selectAll(".domain")
                    .remove();

                if (!hideAxisLine) {
                    (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                        .select("g")
                        .append("line")
                        .styles(axisStyle)
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", 0)
                        .attr("y2", height);
                }
            }
        },
        {
            key: "generator",
            value: function generator(type, absolute, yformat, axis, scale) {
                var axisGenerator = void 0;
                if (type === "linear" || type === "power") {
                    if (this.props.tickCount > 0) {
                        var stepSize =
                            (this.props.max - this.props.min) / (this.props.tickCount - 1);
                        axisGenerator = axis(scale)
                            .tickValues(
                                (0, _d3Array.range)(
                                    this.props.min,
                                    this.props.max + this.props.max / 10000,
                                    stepSize
                                )
                            )
                            .tickFormat(function(d) {
                                if (absolute) {
                                    return yformat(Math.abs(d));
                                }
                                return yformat(d);
                            })
                            .tickSizeOuter(0);
                    } else {
                        if (this.props.height <= 200) {
                            axisGenerator = axis(scale)
                                .ticks(4)
                                .tickFormat(function(d) {
                                    if (absolute) {
                                        return yformat(Math.abs(d));
                                    }
                                    return yformat(d);
                                })
                                .tickSizeOuter(0);
                        } else {
                            axisGenerator = axis(scale)
                                .tickFormat(function(d) {
                                    if (absolute) {
                                        return yformat(Math.abs(d));
                                    }
                                    return yformat(d);
                                })
                                .tickSizeOuter(0);
                        }
                    }
                } else if (type === "log") {
                    if (this.props.min === 0) {
                        throw Error("In a log scale, minimum value can't be 0");
                    }
                    axisGenerator = axis(scale)
                        .ticks(10, ".2s")
                        .tickSizeOuter(0);
                }
                return axisGenerator;
            }
        },
        {
            key: "renderAxis",
            value: function renderAxis(
                align,
                scale,
                width,
                height,
                showGrid,
                chartExtent,
                hideAxisLine,
                absolute,
                type,
                fmt
            ) {
                var yformat = this.yformat(fmt);
                var axis = align === "left" ? _d3Axis.axisLeft : _d3Axis.axisRight;
                var style = this.mergeStyles(this.props.style);
                var labelStyle = style.labelStyle,
                    valueStyle = style.valueStyle;

                var tickSize = showGrid && this.props.isInnerAxis ? -chartExtent : 5;
                var x = align === "left" ? width - MARGIN : 0;
                var labelOffset =
                    align === "left" ? this.props.labelOffset - 50 : 40 + this.props.labelOffset;

                // Axis generator
                var axisGenerator = this.generator(type, absolute, yformat, axis, scale);

                // Remove the old axis from under this DOM node
                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                    .selectAll("*")
                    .remove();

                // Add the new axis
                this.axis = (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                    .append("g")
                    .attr("transform", "translate(" + x + ",0)")
                    .attr("class", "yaxis")
                    .styles(valueStyle)
                    .call(axisGenerator.tickSize(tickSize))
                    .append("text")
                    .text(this.props.label)
                    .styles(labelStyle)
                    .attr("transform", "rotate(-90)")
                    .attr("y", labelOffset)
                    .attr("dy", ".71em")
                    .attr("text-anchor", "end");

                this.postSelect(style, hideAxisLine, height);
            }
        },
        {
            key: "updateAxis",
            value: function updateAxis(
                align,
                scale,
                width,
                height,
                showGrid,
                chartExtent,
                hideAxisLine,
                absolute,
                type,
                fmt
            ) {
                var yformat = this.yformat(fmt);
                var axis = align === "left" ? _d3Axis.axisLeft : _d3Axis.axisRight;
                var style = this.mergeStyles(this.props.style);
                var tickSize = showGrid && this.props.isInnerAxis ? -chartExtent : 5;

                var axisGenerator = this.generator(type, absolute, yformat, axis, scale, tickSize);

                // Transition the existing axis
                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                    .select(".yaxis")
                    .transition()
                    .duration(this.props.transition)
                    .ease(_d3Ease.easeSinOut)
                    .call(axisGenerator.tickSize(tickSize));

                this.postSelect(style, hideAxisLine, height);
            }
        },
        {
            key: "render",
            value: function render() {
                return _react2.default.createElement("g", null);
            }
        }
    ]);

    return YAxis;
})(_react2.default.Component);

exports.default = YAxis;

YAxis.defaultProps = {
    id: "yaxis", // id referred to by the chart
    align: "left", // left or right of the chart
    min: 0, // range
    max: 1,
    showGrid: false,
    hideAxisLine: false,
    type: "linear", // linear, log, or power
    absolute: false, // Display scale always positive
    format: ".2s", // Format string for d3.format
    labelOffset: 0, // Offset the label position
    transition: 100, // Axis transition time
    width: 80,
    style: defaultStyle
};

YAxis.propTypes = {
    /**
     * A name for the axis which can be used by a chart to reference the axis.
     * This is used by the ChartRow to match charts to this axis.
     */
    id: _propTypes2.default.string.isRequired, // eslint-disable-line

    /**
     * Show or hide this axis
     */
    visible: _propTypes2.default.bool,

    /**
     * The label to be displayed alongside the axis.
     */
    label: _propTypes2.default.string,

    /**
     * The scale type: linear, power, or log.
     */
    type: _propTypes2.default.oneOf(["linear", "power", "log"]),

    /**
     * Minium value, which combined with "max", define the scale of the axis.
     */
    min: _propTypes2.default.number.isRequired, // eslint-disable-line

    /**
     * Maxium value, which combined with "min,"" define the scale of the axis.
     */
    max: _propTypes2.default.number.isRequired, // eslint-disable-line

    /**
     * A d3 scale for the y-axis which you can use to transform your data in the y direction.
     * If omitted, the scale will be automatically computed based on the max and min props.
     */
    yScale: _propTypes2.default.func,

    /**
     * Render all ticks on the axis as positive values.
     */
    absolute: _propTypes2.default.bool, // eslint-disable-line

    /**
     * Object specifying the CSS by which the axis can be styled. The object can contain:
     * "label", "values", "axis" and "ticks". Each of these is an inline CSS style applied
     * to the axis label, axis values, axis line and ticks respectively.
     *
     * Note that these are passed into d3's styling, so are regular CSS property names
     * and not React's camel case names (e.g. "stroke-dasharray" not strokeDasharray).
     */
    style: _propTypes2.default.shape({
        label: _propTypes2.default.object, // eslint-disable-line
        axis: _propTypes2.default.object, // eslint-disable-line
        values: _propTypes2.default.object, // esline-disable-line
        ticks: _propTypes2.default.object // esline-disable-line
    }),

    /**
     * Render a horizontal grid by extending the axis ticks across the chart area. Note that this
     * can only be applied to an inner axis (one next to a chart). If you have multiple axes then
     * this can't be used on the outer axes. Also, if you have an axis on either side of the chart
     * then you can use this, but the UX not be ideal.
     */
    showGrid: _propTypes2.default.bool,

    /**
     * Render the axis line. This is a nice option of you are also using `showGrid` as you may not
     * want both the vertical axis line and the extended ticks.
     */
    hideAxisLine: _propTypes2.default.bool,

    /**
     * The transition time for moving from one scale to another
     */
    transition: _propTypes2.default.number,

    /**
     * The width of the axis
     */
    width: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),

    /**
     * Offset the axis label from its default position. This allows you to
     * fine tune the label location, which may be necessary depending on the
     * scale and how much room the tick labels take up. Maybe positive or
     * negative.
     */
    labelOffset: _propTypes2.default.number,

    /**
     * If a string, the d3.format for the axis labels (e.g. `format=\"$,.2f\"`).
     * If a function, that function will be called with each tick value and
     * should generate a formatted string for that value to be used as the label
     * for that tick (e.g. `function (n) { return Number(n).toFixed(2) }`).
     */
    format: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),

    /**
     * If the chart should be rendered to with the axis on the left or right.
     * If you are using the axis in a ChartRow, you do not need to provide this.
     */
    align: _propTypes2.default.string,

    /**
     * [Internal] The scale supplied by the ChartRow
     */
    scale: _propTypes2.default.func,

    /**
     * [Internal] The height supplied by the surrounding ChartContainer
     */
    height: _propTypes2.default.number,

    /**
     * The number of ticks
     */
    tickCount: _propTypes2.default.number
};
