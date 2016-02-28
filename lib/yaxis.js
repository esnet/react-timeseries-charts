"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require("d3");

var _d2 = _interopRequireDefault(_d);

require("./yaxis.css");

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
    return scale.domain().toString() + "-" + scale.range().toString();
}

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
            transition: 0, // Axis transition time
            width: 80,
            style: {
                labelColor: "#8B7E7E", // Default label color
                labelWeight: 100,
                labelSize: 12
            }
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
         * Minium value, which combined with "max", define the scale of the axis.
         */
        min: _react2.default.PropTypes.number.isRequired,

        /**
         * Maxium value, which combined with "min,"" define the scale of the axis.
         */
        max: _react2.default.PropTypes.number.isRequired,

        width: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),

        /**
         * The scale type: linear, log, or exp.
         */
        type: _react2.default.PropTypes.oneOf(["linear", "log", "exp"]),

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

    renderAxis: function renderAxis(align, scale, width, absolute, format) {
        var yformat = _d2.default.format(format);

        var axisGenerator = undefined;
        if (this.props.type === "linear" || this.props.type === "power") {
            if (this.props.height <= 200) {
                axisGenerator = _d2.default.svg.axis().scale(scale).ticks(5).tickFormat(function (d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    } else {
                        return yformat(d);
                    }
                }).orient(align);
            } else {
                axisGenerator = _d2.default.svg.axis().scale(scale).tickFormat(function (d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    } else {
                        return yformat(d);
                    }
                }).orient(align);
            }
        } else if (this.props.type === "log") {
            axisGenerator = _d2.default.svg.axis().scale(scale).ticks(10, ".2s").orient(align);
        }

        var style = {
            fill: this.props.style.labelColor || "#8B7E7E",
            "font-weight": this.props.style.labelWeight || 100,
            "font-size": this.props.style.labelSize ? this.props.style.width + "px" : "12px"
        };

        // Remove the old axis from under this DOM node
        _d2.default.select(_reactDom2.default.findDOMNode(this)).selectAll("*").remove();

        // Add the new axis
        var x = align === "left" ? width - MARGIN : 0;
        var labelOffset = align === "left" ? this.props.labelOffset - 50 : 40 + this.props.labelOffset;
        var classed = this.props.classed ? this.props.classed : "";
        var axisClass = "yaxis " + classed;
        var axisLabelClass = "yaxis-label " + classed;
        this.axis = _d2.default.select(_reactDom2.default.findDOMNode(this)).append("g").attr("transform", "translate(" + x + ",0)").attr("class", axisClass).call(axisGenerator).append("text").style(style).attr("transform", "rotate(-90)").attr("class", axisLabelClass).attr("y", labelOffset).attr("dy", ".71em").style("text-anchor", "end").text(this.props.label);
    },
    updateAxis: function updateAxis(align, scale, width, absolute, format) {
        var yformat = _d2.default.format(format);
        var axisGenerator = undefined;
        if (this.props.type === "linear" || this.props.type === "power") {
            if (this.props.height <= 200) {
                axisGenerator = _d2.default.svg.axis().scale(scale).ticks(5).tickFormat(function (d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    } else {
                        return yformat(d);
                    }
                }).orient(align);
            } else {
                axisGenerator = _d2.default.svg.axis().scale(scale).tickFormat(function (d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    } else {
                        return yformat(d);
                    }
                }).orient(align);
            }
        } else if (this.props.type === "log") {
            axisGenerator = _d2.default.svg.axis().scale(scale).ticks(10, ".2s").orient(align);
        }

        _d2.default.select(_reactDom2.default.findDOMNode(this)).select(".yaxis").transition().duration(this.props.transition).ease("sin-in-out").call(axisGenerator);
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

        if (scaleAsString(this.props.scale) !== scaleAsString(scale)) {
            this.updateAxis(align, scale, width, absolute, format);
        }
    },
    shouldComponentUpdate: function shouldComponentUpdate() {
        return false;
    },
    render: function render() {
        return _react2.default.createElement("g", null);
    }
});