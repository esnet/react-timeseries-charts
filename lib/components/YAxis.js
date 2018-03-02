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
    labels: {
        labelColor: "#8B7E7E", // Default label color
        labelWeight: 100,
        labelSize: 11
    },
    axis: {
        axisColor: "#C0C0C0"
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
                    this.props.absolute,
                    this.props.format
                );
            }
        },
        {
            key: "componentWillReceiveProps",
            value: function componentWillReceiveProps(nextProps) {
                var scale = nextProps.scale;
                var align = nextProps.align;
                var width = nextProps.width;
                var absolute = nextProps.absolute;
                var fmt = nextProps.format;
                var type = nextProps.type;

                if (
                    (0, _util.scaleAsString)(this.props.scale) !==
                        (0, _util.scaleAsString)(scale) ||
                    this.props.type !== nextProps.type
                ) {
                    this.updateAxis(align, scale, width, absolute, type, fmt);
                }
            }
        },
        {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate() {
                // eslint-disable-line
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
            key: "updateAxis",
            value: function updateAxis(align, scale, width, absolute, type, fmt) {
                var yformat = this.yformat(fmt);
                var axis = align === "left" ? _d3Axis.axisLeft : _d3Axis.axisRight;

                var axisStyle = (0, _merge2.default)(
                    true,
                    defaultStyle.axis,
                    this.props.style.axis ? this.props.style.axis : {}
                );
                var axisColor = axisStyle.axisColor;

                //
                // Make an axis generator
                //

                var axisGenerator = void 0;
                if (type === "linear" || type === "power") {
                    if (this.props.height <= 200) {
                        axisGenerator = axis(scale)
                            .ticks(5)
                            .tickFormat(function(d) {
                                if (absolute) {
                                    return yformat(Math.abs(d));
                                }
                                return yformat(d);
                            });
                    } else {
                        axisGenerator = axis(scale).tickFormat(function(d) {
                            if (absolute) {
                                return yformat(Math.abs(d));
                            }
                            return yformat(d);
                        });
                    }
                } else if (type === "log") {
                    if (this.props.min === 0) {
                        throw Error("In a log scale, minimum value can't be 0");
                    }
                    axisGenerator = axis(scale).ticks(10, ".2s");
                }

                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                    .select(".yaxis")
                    .transition()
                    .duration(this.props.transition)
                    .ease(_d3Ease.easeSinOut)
                    .call(axisGenerator);

                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)) // eslint-disable-line
                    .select("g")
                    .selectAll(".tick")
                    .select("text")
                    .style("fill", axisColor)
                    .style("stroke", "none");

                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)) // eslint-disable-line
                    .select("g")
                    .selectAll(".tick")
                    .select("line")
                    .style("stroke", axisColor);
            }
        },
        {
            key: "renderAxis",
            value: function renderAxis(align, scale, width, absolute, fmt) {
                var yformat = this.yformat(fmt);
                var axisGenerator = void 0;
                var axis = align === "left" ? _d3Axis.axisLeft : _d3Axis.axisRight;
                if (this.props.type === "linear" || this.props.type === "power") {
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
                } else if (this.props.type === "log") {
                    if (this.props.min === 0) {
                        throw Error("In a log scale, minimum value can't be 0");
                    }
                    axisGenerator = axis()
                        .scale(scale)
                        .ticks(10, ".2s")
                        .tickSizeOuter(0);
                }

                // Remove the old axis from under this DOM node
                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                    .selectAll("*")
                    .remove(); // eslint-disable-line
                // Add the new axis
                var x = align === "left" ? width - MARGIN : 0;
                var labelOffset =
                    align === "left" ? this.props.labelOffset - 50 : 40 + this.props.labelOffset;

                //
                // Style
                //

                var labelStyle = (0, _merge2.default)(
                    true,
                    defaultStyle.labels,
                    this.props.style.labels ? this.props.style.labels : {}
                );
                var axisStyle = (0, _merge2.default)(
                    true,
                    defaultStyle.axis,
                    this.props.style.axis ? this.props.style.axis : {}
                );
                var axisColor = axisStyle.axisColor;
                var labelColor = labelStyle.labelColor,
                    labelWeight = labelStyle.labelWeight,
                    labelSize = labelStyle.labelSize;

                this.axis = (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)) // eslint-disable-line
                    .append("g")
                    .attr("transform", "translate(" + x + ",0)")
                    .style("stroke", "none")
                    .attr("class", "yaxis")
                    .style("fill", labelColor)
                    .style("font-weight", labelWeight)
                    .style("font-size", labelSize)
                    .call(axisGenerator)
                    .append("text")
                    .text(this.props.label)
                    .attr("transform", "rotate(-90)")
                    .attr("y", labelOffset)
                    .attr("dy", ".71em")
                    .attr("text-anchor", "end")
                    .style("fill", this.props.style.labelColor)
                    .style(
                        "font-family",
                        this.props.style.labelFont || '"Goudy Bookletter 1911", sans-serif"'
                    )
                    .style("font-weight", this.props.style.labelWeight || 100)
                    .style(
                        "font-size",
                        this.props.style.labelSize ? this.props.style.width + "px" : "12px"
                    );

                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)) // eslint-disable-line
                    .select("g")
                    .selectAll(".tick")
                    .select("text")
                    .style("fill", axisColor)
                    .style("stroke", "none");

                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)) // eslint-disable-line
                    .select("g")
                    .selectAll(".tick")
                    .select("line")
                    .style("stroke", axisColor);

                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)) // eslint-disable-line
                    .select("g")
                    .select("path")
                    .style("fill", "none")
                    .style("stroke", axisColor);
            }
        },
        {
            key: "render",
            value: function render() {
                // eslint-disable-line
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
     * Render all ticks on the axis as positive values.
     */
    absolute: _propTypes2.default.bool, // eslint-disable-line

    /**
     * Object specifying the available parameters by which the axis can be
     * styled. The object can contain: "labels" and "axis". Each of these
     * is an inline CSS style applied to the tick labels and axis lines
     * respectively.
     *
     * In addition the axis label itself can be styled with: "labelColor",
     * "labelFont", "labelWidth" and "labelSize".
     */
    style: _propTypes2.default.shape({
        labels: _propTypes2.default.object, // eslint-disable-line
        axis: _propTypes2.default.object, // eslint-disable-line
        labelColor: _propTypes2.default.string,
        labelFont: _propTypes2.default.string,
        labelWeight: _propTypes2.default.string,
        labelSize: _propTypes2.default.string,
        width: _propTypes2.default.number
    }),

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
