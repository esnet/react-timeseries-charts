/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react/addons";
import d3 from "d3";
import "./yaxis.css";

const MARGIN = 0;

function scaleAsString(scale) {
    return `${scale.domain().toString()}-${scale.range().toString()}`;
}

/**
 * Renders a horizontal time axis
 *
 * Props:
 *     * align - if the axis should be draw as if it is on the
 *               left or right (defaults to left)
 *     * scale - a d3 scale that defines the domain and range of the axis
 */
export default React.createClass({

    displayName: "YAxis",

    propTypes: {
        align: React.PropTypes.string,
    },

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
            transition: 0,           // Axis transition time
            style: {
                labelColor: "#8B7E7E", // Default label color
                labelWeight: 100,
                labelSize: 12
            }
        };
    },

    renderAxis(align, scale, width, absolute, format) {
        const yformat = d3.format(format);

        let axisGenerator;
        if (this.props.type === "linear" || this.props.type === "power") {
            if (this.props.height <= 200) {
                axisGenerator = d3.svg.axis()
                    .scale(scale)
                    .ticks(5)
                    .tickFormat(d => {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        } else {
                            return yformat(d);
                        }
                    }).orient(align);
            } else {
                axisGenerator = d3.svg.axis()
                    .scale(scale)
                    .tickFormat(d => {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        } else {
                            return yformat(d);
                        }
                    }).orient(align);
            }
        } else if (this.props.type === "log") {
            axisGenerator = d3.svg.axis()
                .scale(scale)
                .ticks(10, ".2s")
                .orient(align);
        }

        const style = {
            fill: this.props.style.labelColor || "#8B7E7E",
            "font-weight": this.props.style.labelWeight || 100,
            "font-size": this.props.style.labelSize ?
                `${this.props.style.width}px` : "12px"
        };

        // Remove the old axis from under this DOM node
        d3.select(this.getDOMNode()).selectAll("*").remove();

        // Add the new axis
        const x = align === "left" ? width - MARGIN : 0;
        const labelOffset = align === "left" ?
            this.props.labelOffset - 50 : 40 + this.props.labelOffset;
        const classed = this.props.classed ?
            this.props.classed : "";
        const axisClass = `yaxis ${classed}`;
        const axisLabelClass = `yaxis-label ${classed}`;
        this.axis = d3.select(this.getDOMNode()).append("g")
            .attr("transform", `translate(${x},0)`)
            .attr("class", axisClass)
            .call(axisGenerator)
        .append("text")
            .style(style)
            .attr("transform", "rotate(-90)")
            .attr("class", axisLabelClass)
            .attr("y", labelOffset)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(this.props.label);
    },

    updateAxis(align, scale, width, absolute, format) {
        const yformat = d3.format(format);
        let axisGenerator;
        if (this.props.type === "linear" || this.props.type === "power") {
            if (this.props.height <= 200) {
                axisGenerator = d3.svg.axis()
                    .scale(scale)
                    .ticks(5)
                    .tickFormat(d => {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        } else {
                            return yformat(d);
                        }
                    }).orient(align);
            } else {
                axisGenerator = d3.svg.axis()
                    .scale(scale)
                    .tickFormat(d => {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        } else {
                            return yformat(d);
                        }
                    }).orient(align);
            }
        } else if (this.props.type === "log") {
            axisGenerator = d3.svg.axis()
                .scale(scale)
                .ticks(10, ".2s")
                .orient(align);
        }

        d3.select(this.getDOMNode()).select(".yaxis")
            .transition()
            .duration(this.props.transition)
            .ease("sin-in-out")
                .call(axisGenerator);
    },

    componentDidMount() {
        this.renderAxis(this.props.align, this.props.scale, this.props.width,
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
        return <g/>;
    },
});
