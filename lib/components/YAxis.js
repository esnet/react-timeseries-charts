"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _d3Axis = require("d3-axis");

var _d3Format = require("d3-format");

var _d3Selection = require("d3-selection");

var _d3Transition = require("d3-transition");

var _d3Ease = require("d3-ease");

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

var MARGIN = 0;

function scaleAsString(scale) {
    if (scale.domain && scale.range) {
        return scale.domain().toString() + "-" + scale.range().toString();
    } else {
        return "scale-" + Math.random;
    }
}

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
 * The YAxis widget displays a vertical axis to the left or right
 * of the charts. A YAxis always appears within a `ChartRow`, from
 * which it gets its height and positioning. You can have more than
 * one axis per row.
 *
 * ![YAxis](https://raw.githubusercontent.com/esnet/react-timeseries-charts/master/docs/yaxis.png "YAxis")
 *
 * Here's a simple YAxis example:
 *
 * ```js
 * <YAxis id="price-axis" label="Price (USD)" min={0} max={100} width="60" type="linear" format="$,.2f"/>
 * ```
 *
 * Visually you can control the axis `label`, its size via the `width`
 * prop, its `format`, and `type` of scale (linear).
 *
 * Each axis also defines a scale through a `min` and `max` prop. Charts
 * may then refer to the axis by by citing the axis `id` in their `axis`
 * prop. Those charts will then use the axis scale for their y-scale.
 *
 * Here is an example of two line charts that each have their own axis:
 *
 * ```js
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis id="aud" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
 *         <Charts>
 *             <LineChart axis="aud" series={audSeries} style={audStyle}/>
 *             <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
 *         </Charts>
 *         <YAxis id="euro" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 *
 *  Note that there are two `<YAxis>` components defined here, one before
 *  the `<Charts>` block and one after. This defines that the first axis will
 *  appear to the left of the charts and the second will appear after the charts.
 *  Each of the line charts uses its `axis` prop to identify the axis ("aud" or "euro")
 *  it will use for its vertical scale.
 */
exports.default = _react2.default.createClass({

    displayName: "YAxis",

    getDefaultProps: function getDefaultProps() {
        return {
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
    },


    propTypes: {

        /**
         * A name for the axis which can be used by a chart to reference the axis.
         */
        id: _react2.default.PropTypes.string.isRequired,

        /**
         * The label to be displayed alongside the axis.
         */
        label: _react2.default.PropTypes.string,

        /**
         * The scale type: linear, power, or log.
         */
        type: _react2.default.PropTypes.oneOf(["linear", "power", "log"]),

        /**
         * Minium value, which combined with "max", define the scale of the axis.
         */
        min: _react2.default.PropTypes.number.isRequired,

        /**
         * Maxium value, which combined with "min,"" define the scale of the axis.
         */
        max: _react2.default.PropTypes.number.isRequired,

        /**
         * The transition time for moving from one scale to another
         */
        transition: _react2.default.PropTypes.number,

        /**
         * The width of the axis
         */
        width: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),

        /**
         * d3.format for the axis labels. e.g. `format="$,.2f"`
         */
        format: _react2.default.PropTypes.string,

        /**
         * If the chart should be rendered to with the axis on the left or right.
         * If you are using the axis in a ChartRow, you do not need to provide this.
         */
        align: _react2.default.PropTypes.string

    },

    renderAxis: function renderAxis(align, scale, width, absolute, fmt) {
        var yformat = (0, _d3Format.format)(fmt);
        var axisGenerator = void 0;
        var axis = align === "left" ? _d3Axis.axisLeft : _d3Axis.axisRight;
        if (this.props.type === "linear" || this.props.type === "power") {
            if (this.props.height <= 200) {
                axisGenerator = axis(scale).ticks(5).tickFormat(function (d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    } else {
                        return yformat(d);
                    }
                }).tickSizeOuter(0);
            } else {
                axisGenerator = axis(scale).tickFormat(function (d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    } else {
                        return yformat(d);
                    }
                }).tickSizeOuter(0);
            }
        } else if (this.props.type === "log") {
            axisGenerator = axis().scale(scale).ticks(10, ".2s").tickSizeOuter(0);
        }

        // Remove the old axis from under this DOM node
        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).selectAll("*").remove();

        // Add the new axis
        var x = align === "left" ? width - MARGIN : 0;
        var labelOffset = align === "left" ? this.props.labelOffset - 50 : 40 + this.props.labelOffset;

        //
        // Style
        //

        var labelStyle = (0, _merge2.default)(true, defaultStyle.labels, this.props.style.labels ? this.props.style.labels : {});
        var axisStyle = (0, _merge2.default)(true, defaultStyle.axis, this.props.style.axis ? this.props.style.axis : {});
        var axisColor = axisStyle.axisColor;
        var labelColor = labelStyle.labelColor;
        var labelWeight = labelStyle.labelWeight;
        var labelSize = labelStyle.labelSize;


        this.axis = (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).append("g").attr("transform", "translate(" + x + ",0)").style("stroke", "none").attr("class", "yaxis").style("fill", labelColor).style("font-weight", labelWeight).style("font-size", labelSize).call(axisGenerator).append("text").text(this.props.label).attr("transform", "rotate(-90)").attr("y", labelOffset).attr("dy", ".71em").attr("text-anchor", "end").style("fill", this.props.style.labelColor).style("font-family", this.props.style.labelFont || "\"Goudy Bookletter 1911\", sans-serif\"").style("font-weight", this.props.style.labelWeight || 100).style("font-size", this.props.style.labelSize ? this.props.style.width + "px" : "12px");

        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").selectAll(".tick").select("text").style("fill", axisColor).style("stroke", "none");

        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").selectAll(".tick").select("line").style("stroke", axisColor);

        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select("g").select("path").style("fill", "none").style("stroke", axisColor);
    },
    updateAxis: function updateAxis(align, scale, width, absolute, type, fmt) {
        var yformat = (0, _d3Format.format)(fmt);
        var axis = align === "left" ? _d3Axis.axisLeft : _d3Axis.axisRight;
        var axisGenerator = void 0;
        if (type === "linear" || type === "power") {
            if (this.props.height <= 200) {
                axisGenerator = axis(scale).ticks(5).tickFormat(function (d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    } else {
                        return yformat(d);
                    }
                });
            } else {
                axisGenerator = axis(scale).tickFormat(function (d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    } else {
                        return yformat(d);
                    }
                });
            }
        } else if (type === "log") {
            axisGenerator = axis(scale).ticks(10, ".2s");
        }

        (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)).select(".yaxis").transition().duration(500).ease(_d3Ease.easeSinOut).call(axisGenerator);
    },
    componentDidMount: function componentDidMount() {
        this.renderAxis(this.props.align, this.props.scale, +this.props.width, this.props.absolute, this.props.format);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var scale = nextProps.scale;
        var align = nextProps.align;
        var width = nextProps.width;
        var absolute = nextProps.absolute;
        var format = nextProps.format;
        var type = nextProps.type;

        if (scaleAsString(this.props.scale) !== scaleAsString(scale) || this.props.type !== nextProps.type) {
            this.updateAxis(align, scale, width, absolute, type, format);
        }
    },
    shouldComponentUpdate: function shouldComponentUpdate() {
        return false;
    },
    render: function render() {
        return _react2.default.createElement("g", null);
    }
});