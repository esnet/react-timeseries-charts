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
import "d3-selection-multi";

import { scaleAsString } from "../js/util";

const MARGIN = 0;

const defaultStyle = {
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
export default class YAxis extends React.Component {
    componentDidMount() {
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
            this.props.format,
            this.props.label,
            this.props.tickCount,
            this.props.min,
            this.props.max
        );
    }

    componentWillReceiveProps(nextProps) {
        const {
            scale,
            align,
            width,
            height,
            chartExtent,
            absolute,
            format,
            type,
            showGrid,
            hideAxisLine,
            label,
            tickCount,
            min,
            max
        } = nextProps;

        if (scaleAsString(this.props.scale) !== scaleAsString(scale)) {
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
                format,
                label,
                tickCount,
                min,
                max
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
                format,
                label,
                tickCount,
                min,
                max
            );
        } else if (this.props.label !== label) {
            this.updateLabel(label);
        }
    }

    shouldComponentUpdate() {
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

    mergeStyles(style) {
        return {
            labelStyle: merge(
                true,
                defaultStyle.label,
                this.props.style.label ? this.props.style.label : {}
            ),
            valueStyle: merge(
                true,
                defaultStyle.values,
                this.props.style.values ? this.props.style.values : {}
            ),
            axisStyle: merge(
                true,
                defaultStyle.axis,
                this.props.style.axis ? this.props.style.axis : {}
            ),
            tickStyle: merge(
                true,
                defaultStyle.ticks,
                this.props.style.ticks ? this.props.style.ticks : {}
            )
        };
    }

    postSelect(style, hideAxisLine, height) {
        const { valueStyle, tickStyle, axisStyle } = style;
        select(ReactDOM.findDOMNode(this))
            .select("g")
            .selectAll(".tick")
            .select("text")
            .styles(valueStyle);

        select(ReactDOM.findDOMNode(this))
            .select("g")
            .selectAll(".tick")
            .select("line")
            .styles(tickStyle);

        select(ReactDOM.findDOMNode(this))
            .select("g")
            .selectAll(".domain")
            .remove();

        if (!hideAxisLine) {
            select(ReactDOM.findDOMNode(this))
                .select("g")
                .append("line")
                .styles(axisStyle)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", height);
        }
    }

    generator(type, absolute, yformat, axis, scale, height, tickCount, min, max) {
        let axisGenerator;
        if (type === "linear" || type === "power") {
            if (tickCount > 0) {
                const stepSize = (max - min) / (tickCount - 1);
                axisGenerator = axis(scale)
                    .tickValues(range(min, max + max / 10000, stepSize))
                    .tickFormat(d => {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        }
                        return yformat(d);
                    })
                    .tickSizeOuter(0);
            } else {
                if (height <= 200) {
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
        } else if (type === "log") {
            if (min === 0) {
                throw Error("In a log scale, minimum value can't be 0");
            }
            axisGenerator = axis(scale)
                .ticks(10, ".2s")
                .tickSizeOuter(0);
        }
        return axisGenerator;
    }

    renderAxis(
        align,
        scale,
        width,
        height,
        showGrid,
        chartExtent,
        hideAxisLine,
        absolute,
        type,
        fmt,
        label,
        tickCount,
        min,
        max
    ) {
        const yformat = this.yformat(fmt);
        const axis = align === "left" ? axisLeft : axisRight;
        const style = this.mergeStyles(this.props.style);
        const { labelStyle, valueStyle } = style;
        const tickSize = showGrid && this.props.isInnerAxis ? -chartExtent : 5;
        const x = align === "left" ? width - MARGIN : 0;
        const labelOffset =
            align === "left" ? this.props.labelOffset - 50 : 40 + this.props.labelOffset;

        // Axis generator
        const axisGenerator = this.generator(
            type,
            absolute,
            yformat,
            axis,
            scale,
            height,
            tickCount,
            min,
            max
        );

        // Remove the old axis from under this DOM node
        select(ReactDOM.findDOMNode(this))
            .selectAll("*")
            .remove();

        // Add the new axis
        this.axis = select(ReactDOM.findDOMNode(this))
            .append("g")
            .attr("transform", `translate(${x},0)`)
            .attr("class", "yaxis")
            .styles(valueStyle)
            .call(axisGenerator.tickSize(tickSize))
            .append("text")
            .text(label || this.props.label)
            .styles(labelStyle)
            .attr("transform", "rotate(-90)")
            .attr("class", "yaxislabel")
            .attr("y", labelOffset)
            .attr("dy", ".71em")
            .attr("text-anchor", "end");

        this.postSelect(style, hideAxisLine, height);
    }

    updateAxis(
        align,
        scale,
        width,
        height,
        showGrid,
        chartExtent,
        hideAxisLine,
        absolute,
        type,
        fmt,
        label,
        tickCount,
        min,
        max
    ) {
        const yformat = this.yformat(fmt);
        const axis = align === "left" ? axisLeft : axisRight;
        const style = this.mergeStyles(this.props.style);
        const tickSize = showGrid && this.props.isInnerAxis ? -chartExtent : 5;

        const axisGenerator = this.generator(
            type,
            absolute,
            yformat,
            axis,
            scale,
            height,
            tickCount,
            min,
            max
        );

        // Transition the existing axis
        select(ReactDOM.findDOMNode(this))
            .select(".yaxis")
            .transition()
            .duration(this.props.transition)
            .ease(easeSinOut)
            .call(axisGenerator.tickSize(tickSize));

        this.updateLabel(label);

        this.postSelect(style, hideAxisLine, height);
    }

    updateLabel(label) {
        select(ReactDOM.findDOMNode(this))
            .select(".yaxislabel")
            .text(label);
    }

    render() {
        return <g />;
    }
}

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
     * Minimum value, which combined with "max", define the scale of the axis.
     */
    min: PropTypes.number.isRequired, // eslint-disable-line

    /**
     * Maximum value, which combined with "min", define the scale of the axis.
     */
    max: PropTypes.number.isRequired, // eslint-disable-line

    /**
     * A d3 scale for the y-axis which you can use to transform your data in the y direction.
     * If omitted, the scale will be automatically computed based on the max and min props.
     */
    yScale: PropTypes.func,

    /**
     * Render all ticks on the axis as positive values.
     */
    absolute: PropTypes.bool, // eslint-disable-line

    /**
     * Object specifying the CSS by which the axis can be styled. The object can contain:
     * "label", "values", "axis" and "ticks". Each of these is an inline CSS style applied
     * to the axis label, axis values, axis line and ticks respectively.
     *
     * Note that these are passed into d3's styling, so are regular CSS property names
     * and not React's camel case names (e.g. "stroke-dasharray" not strokeDasharray).
     */
    style: PropTypes.shape({
        label: PropTypes.object, // eslint-disable-line
        axis: PropTypes.object, // eslint-disable-line
        values: PropTypes.object, // esline-disable-line
        ticks: PropTypes.object // esline-disable-line
    }),

    /**
     * Render a horizontal grid by extending the axis ticks across the chart area. Note that this
     * can only be applied to an inner axis (one next to a chart). If you have multiple axes then
     * this can't be used on the outer axes. Also, if you have an axis on either side of the chart
     * then you can use this, but the UX not be ideal.
     */
    showGrid: PropTypes.bool,

    /**
     * Render the axis line. This is a nice option of you are also using `showGrid` as you may not
     * want both the vertical axis line and the extended ticks.
     */
    hideAxisLine: PropTypes.bool,

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
