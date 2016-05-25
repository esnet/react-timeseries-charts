/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import ReactDOM from "react-dom";
import { axisLeft, axisRight } from "d3-axis";

import { format } from "d3-format";
import { select } from "d3-selection";

import "./yaxis.css";

const MARGIN = 0;

function scaleAsString(scale) {
    return `${scale.domain().toString()}-${scale.range().toString()}`;
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
export default React.createClass({

    displayName: "YAxis",

    getDefaultProps() {
        return {
            id: "yaxis",             // id referred to by the chart
            align: "left",           // left or right of the chart
            min: 0,                  // range
            max: 1,
            type: "linear",          // linear, log, or power
            absolute: false,         // Display scale always positive
            format: ".2s",           // Format string for d3.format
            labelOffset: 0,          // Offset the label position
            transition: 100,           // Axis transition time
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
        id: React.PropTypes.string.isRequired,

        /**
         * The label to be displayed alongside the axis.
         */
        label: React.PropTypes.string,

        /**
         * Minium value, which combined with "max", define the scale of the axis.
         */
        min: React.PropTypes.number.isRequired,

        /**
         * Maxium value, which combined with "min,"" define the scale of the axis.
         */
        max: React.PropTypes.number.isRequired,

        width: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),

        /**
         * The scale type: linear, power, or exp.
         */
        type: React.PropTypes.oneOf([
            "linear",
            "power",
            "exp"
        ]),

        /**
         * d3.format for the axis labels. e.g. `format="$,.2f"`
         */
        format: React.PropTypes.string,

        /**
         * If the chart should be rendered to with the axis on the left or right.
         * If you are using the axis in a ChartRow, you do not need to provide this.
         */
        align: React.PropTypes.string

    },

    renderAxis(align, scale, width, absolute, fmt) {
        const yformat = format(fmt);
        let axisGenerator;
        let axis = align === "left" ? axisLeft : axisRight;
        if (this.props.type === "linear" || this.props.type === "power") {
            if (this.props.height <= 200) {
                axisGenerator = axis(scale)
                    .ticks(5)
                    .tickFormat(d => {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        } else {
                            return yformat(d);
                        }
                    });
            } else {
                axisGenerator = axis(scale)
                    .tickFormat(d => {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        } else {
                            return yformat(d);
                        }
                    });
            }
        } else if (this.props.type === "log") {
            axisGenerator = axis()
                .scale(scale)
                .ticks(10, ".2s");
        }

        // Remove the old axis from under this DOM node
        select(ReactDOM.findDOMNode(this)).selectAll("*").remove();

        // Add the new axis
        const x = align === "left" ? width - MARGIN : 0;
        const labelOffset = align === "left" ?
            this.props.labelOffset - 50 : 40 + this.props.labelOffset;
        const classed = this.props.classed ?
            this.props.classed : "";
        const axisClass = `yaxis ${classed}`;
        const axisLabelClass = `yaxis-label ${classed}`;

        this.axis = select(ReactDOM.findDOMNode(this))
            .append("g")
                .attr("transform", `translate(${x},0)`)
                .attr("class", axisClass)
                .call(axisGenerator)
            .append("text")
                .text(this.props.label)
                .attr("transform", "rotate(-90)")
                .attr("class", axisLabelClass)
                .attr("y", labelOffset)
                .attr("dy", ".71em")
                .attr("text-anchor", "end")
                .style("fill", this.props.style.labelColor)
                .style("font-family", this.props.style.labelFont || "\"Goudy Bookletter 1911\", sans-serif\"")
                .style("font-weight", this.props.style.labelWeight || 100)
                .style("font-size", this.props.style.labelSize ? `${this.props.style.width}px` : "12px");
    },

    updateAxis(align, scale, width, absolute, fmt) {
        const yformat = format(fmt);
        let axis = align === "left" ? axisLeft : axisRight;

        let axisGenerator;
        if (this.props.type === "linear" || this.props.type === "power") {
            if (this.props.height <= 200) {
                axisGenerator = axis(scale)
                    .ticks(5)
                    .tickFormat(d => {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        } else {
                            return yformat(d);
                        }
                    });
            } else {
                axisGenerator = axis(scale)
                    .tickFormat(d => {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        } else {
                            return yformat(d);
                        }
                    });
            }
        } else if (this.props.type === "log") {
            axisGenerator = axis(scale)
                .ticks(10, ".2s");
        }

        select(ReactDOM.findDOMNode(this))
            .select(".yaxis")
                .call(axisGenerator);
    },

    componentDidMount() {
        this.renderAxis(this.props.align, this.props.scale, +this.props.width,
                        this.props.absolute, this.props.format);
    },

    componentWillReceiveProps(nextProps) {
        const scale = nextProps.scale;
        const align = nextProps.align;
        const width = nextProps.width;
        const absolute = nextProps.absolute;
        const format = nextProps.format;

        if (scaleAsString(this.props.scale) !== scaleAsString(scale)) {
            this.updateAxis(align, scale, width, absolute, format);
        }
    },

    shouldComponentUpdate() {
        return false;
    },

    render() {
        return (
            <g />
        );
    }
});
