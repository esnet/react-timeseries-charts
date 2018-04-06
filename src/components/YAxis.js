/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import "d3-transition";
import _ from "underscore";
import merge from "merge";
import React from "react";
import ReactDOM from "react-dom"; // eslint-disable-line
import PropTypes from "prop-types";
import { range } from "d3-array";
import { axisLeft, axisRight } from "d3-axis";
import { easeSinOut } from "d3-ease";
import { format } from "d3-format";
import { select } from "d3-selection";

import { scaleAsString } from "../js/util";

const MARGIN = 0;

const defaultStyle = {
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
export default class YAxis extends React.Component {
    componentDidMount() {
        this.renderAxis(
            this.props.align,
            this.props.scale,
            +this.props.width,
            this.props.absolute,
            this.props.format
        );
    }

    componentWillReceiveProps(nextProps) {
        const scale = nextProps.scale;
        const align = nextProps.align;
        const width = nextProps.width;
        const absolute = nextProps.absolute;
        const fmt = nextProps.format;
        const type = nextProps.type;

        if (
            scaleAsString(this.props.scale) !== scaleAsString(scale) ||
            this.props.type !== nextProps.type
        ) {
            this.updateAxis(align, scale, width, absolute, type, fmt);
        }
    }

    shouldComponentUpdate() {
        // eslint-disable-line
        return false;
    }

    yformat(fmt) {
        if (_.isString(fmt)) {
            return format(fmt);
        } else if (_.isFunction(fmt)) {
            return fmt;
        } else {
            return format("");
        }
    }

    updateAxis(align, scale, width, absolute, type, fmt) {
        const yformat = this.yformat(fmt);
        const axis = align === "left" ? axisLeft : axisRight;

        const axisStyle = merge(
            true,
            defaultStyle.axis,
            this.props.style.axis ? this.props.style.axis : {}
        );
        const { axisColor } = axisStyle;

        //
        // Make an axis generator
        //

        let axisGenerator;
        if (type === "linear" || type === "power") {
            if (this.props.height <= 200) {
                axisGenerator = axis(scale)
                    .ticks(5)
                    .tickFormat(d => {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        }
                        return yformat(d);
                    });
            } else {
                axisGenerator = axis(scale).tickFormat(d => {
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

        select(ReactDOM.findDOMNode(this))
            .select(".yaxis")
            .transition()
            .duration(this.props.transition)
            .ease(easeSinOut)
            .call(axisGenerator);

        select(ReactDOM.findDOMNode(this)) // eslint-disable-line
            .select("g")
            .selectAll(".tick")
            .select("text")
            .style("fill", axisColor)
            .style("stroke", "none");

        select(ReactDOM.findDOMNode(this)) // eslint-disable-line
            .select("g")
            .selectAll(".tick")
            .select("line")
            .style("stroke", axisColor);
    }

    renderAxis(align, scale, width, absolute, fmt) {
        const yformat = this.yformat(fmt);
        let axisGenerator;
        const axis = align === "left" ? axisLeft : axisRight;
        if (this.props.type === "linear" || this.props.type === "power") {
            if (this.props.tickCount > 0) {
                const stepSize = (this.props.max - this.props.min) / (this.props.tickCount - 1);
                axisGenerator = axis(scale)
                    .tickValues(
                        range(this.props.min, this.props.max + this.props.max / 10000, stepSize)
                    )
                    .tickFormat(d => {
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
                        .tickFormat(d => {
                            if (absolute) {
                                return yformat(Math.abs(d));
                            }
                            return yformat(d);
                        })
                        .tickSizeOuter(0);
                } else {
                    axisGenerator = axis(scale)
                        .tickFormat(d => {
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
        select(ReactDOM.findDOMNode(this))
            .selectAll("*")
            .remove(); // eslint-disable-line
        // Add the new axis
        const x = align === "left" ? width - MARGIN : 0;
        const labelOffset =
            align === "left" ? this.props.labelOffset - 50 : 40 + this.props.labelOffset;

        //
        // Style
        //

        const labelStyle = merge(
            true,
            defaultStyle.labels,
            this.props.style.labels ? this.props.style.labels : {}
        );
        const axisStyle = merge(
            true,
            defaultStyle.axis,
            this.props.style.axis ? this.props.style.axis : {}
        );
        const { axisColor } = axisStyle;
        const { labelColor, labelWeight, labelSize } = labelStyle;

        this.axis = select(ReactDOM.findDOMNode(this)) // eslint-disable-line
            .append("g")
            .attr("transform", `translate(${x},0)`)
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
                this.props.style.labelSize ? `${this.props.style.width}px` : "12px"
            );

        select(ReactDOM.findDOMNode(this)) // eslint-disable-line
            .select("g")
            .selectAll(".tick")
            .select("text")
            .style("fill", axisColor)
            .style("stroke", "none");

        select(ReactDOM.findDOMNode(this)) // eslint-disable-line
            .select("g")
            .selectAll(".tick")
            .select("line")
            .style("stroke", axisColor);

        select(ReactDOM.findDOMNode(this)) // eslint-disable-line
            .select("g")
            .select("path")
            .style("fill", "none")
            .style("stroke", axisColor);
    }

    render() {
        // eslint-disable-line
        return <g />;
    }
}

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
    id: PropTypes.string.isRequired, // eslint-disable-line

    /**
     * Show or hide this axis
     */
    visible: PropTypes.bool,

    /**
     * The label to be displayed alongside the axis.
     */
    label: PropTypes.string,

    /**
     * The scale type: linear, power, or log.
     */
    type: PropTypes.oneOf(["linear", "power", "log"]),

    /**
     * Minium value, which combined with "max", define the scale of the axis.
     */
    min: PropTypes.number.isRequired, // eslint-disable-line

    /**
     * Maxium value, which combined with "min,"" define the scale of the axis.
     */
    max: PropTypes.number.isRequired, // eslint-disable-line

    /**
     * Render all ticks on the axis as positive values.
     */
    absolute: PropTypes.bool, // eslint-disable-line

    /**
     * Object specifying the available parameters by which the axis can be
     * styled. The object can contain: "labels" and "axis". Each of these
     * is an inline CSS style applied to the tick labels and axis lines
     * respectively.
     *
     * In addition the axis label itself can be styled with: "labelColor",
     * "labelFont", "labelWidth" and "labelSize".
     */
    style: PropTypes.shape({
        labels: PropTypes.object, // eslint-disable-line
        axis: PropTypes.object, // eslint-disable-line
        labelColor: PropTypes.string,
        labelFont: PropTypes.string,
        labelWeight: PropTypes.string,
        labelSize: PropTypes.string,
        width: PropTypes.number
    }),

    /**
     * The transition time for moving from one scale to another
     */
    transition: PropTypes.number,

    /**
     * The width of the axis
     */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Offset the axis label from its default position. This allows you to
     * fine tune the label location, which may be necessary depending on the
     * scale and how much room the tick labels take up. Maybe positive or
     * negative.
     */
    labelOffset: PropTypes.number,

    /**
     * If a string, the d3.format for the axis labels (e.g. `format=\"$,.2f\"`).
     * If a function, that function will be called with each tick value and
     * should generate a formatted string for that value to be used as the label
     * for that tick (e.g. `function (n) { return Number(n).toFixed(2) }`).
     */
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    /**
     * If the chart should be rendered to with the axis on the left or right.
     * If you are using the axis in a ChartRow, you do not need to provide this.
     */
    align: PropTypes.string,

    /**
     * [Internal] The scale supplied by the ChartRow
     */
    scale: PropTypes.func,

    /**
     * [Internal] The height supplied by the surrounding ChartContainer
     */
    height: PropTypes.number,

    /**
     * The number of ticks
     */
    tickCount: PropTypes.number
};
