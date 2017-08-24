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
import merge from "merge";
import React from "react";
import ReactDOM from "react-dom"; // eslint-disable-line
import PropTypes from "prop-types";
import { range } from "d3-array";
import { axisLeft, axisRight } from "d3-axis";
import { easeSinOut } from "d3-ease";
import { format } from "d3-format";
import { select } from "d3-selection";
import { Axis } from "react-axis";

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
 * The YAxis widget displays a vertical axis to the left or right
 * of the charts. A YAxis always appears within a `ChartRow`, from
 * which it gets its height and positioning. You can have more than
 * one axis per row.
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
 *  appear to the left of the charts and the second will appear after the charts.
 *  Each of the line charts uses its `axis` prop to identify the axis ("aud" or "euro")
 *  it will use for its vertical scale.
 */
export default class YAxis extends React.Component {
    shouldComponentUpdate() {
        // eslint-disable-line
        return true;
    }

    render() {
        // eslint-disable-line
        return (
            <Axis
                label={this.props.label ? this.props.label : this.props.id}
                labelStyle={this.props.style}
                width={this.props.width}
                position={this.props.align}
                margin={5}
                height={this.props.height}
                max={this.props.max}
                min={this.props.min}
                type={this.props.type}
                format={this.props.format}
                tickCount={this.props.tickCount}
                absolute={this.props.absolute}
            />
        );
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
   * d3.format for the axis labels. e.g. `format="$,.2f"`
   */
    format: PropTypes.string,
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
