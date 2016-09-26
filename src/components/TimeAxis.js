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
import merge from "merge";
import { axisBottom } from "d3-axis";
import { timeFormat } from "d3-time-format";
import { timeDay, utcDay, timeMonth, utcMonth, timeYear, utcYear } from "d3-time";
import { select } from "d3-selection";
import moment from "moment";
import "moment-duration-format";

function scaleAsString(scale) {
    return `${scale.domain().toString()}-${scale.range().toString()}`;
}

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
 * Renders a horizontal time axis. The TimeAxis is generally rendered by
 * the <ChartContainer> so you do not have to create one of these yourself.
 */
export default React.createClass({

    displayName: "TimeAxis",

    getDefaultProps() {
        return {
            showGrid: false,
            style: defaultStyle
        };
    },

    renderTimeAxis(scale) {
        let axis;

        const tickSize = this.props.showGrid ? -this.props.gridHeight : 10;
        const utc = this.props.utc;

        if (this.props.format === "day") {
            axis = axisBottom(scale)
                .tickArguments([utc ? utcDay : timeDay, 1])
                .tickFormat(timeFormat("%d"))
                .tickSizeOuter(0);
        } else if (this.props.format === "month") {
            axis = axisBottom(scale)
                .tickArguments([utc ? utcMonth : timeMonth, 1])
                .tickFormat(timeFormat("%B"))
                .tickSizeOuter(0);
        } else if (this.props.format === "year") {
            axis = axisBottom(scale)
                .tickArguments([utc ? utcYear : timeYear, 1])
                .tickFormat(timeFormat("%Y"))
                .tickSizeOuter(0);
        } else if (this.props.format === "relative") {
            axis = axisBottom(scale)
                .tickFormat(d => moment.duration(+d).format())
                .tickSizeOuter(0);
        } else {
            axis = axisBottom(scale)
                .tickSize(0);
        }

        // Style

        const labelStyle = merge(true,
                                 defaultStyle.labels,
                                 this.props.style.labels ? this.props.style.labels : {});
        const axisStyle = merge(true,
                                defaultStyle.axis,
                                this.props.style.axis ? this.props.style.axis : {});
        const { axisColor } = axisStyle;
        const { labelColor, labelWeight, labelSize } = labelStyle;

        // Remove the old axis from under this DOM node
        select(ReactDOM.findDOMNode(this)).selectAll("*").remove();

        // Draw the new axis
        select(ReactDOM.findDOMNode(this))
            .append("g")
                .attr("class", "x axis")
                .style("stroke", "none")
                .style("fill", labelColor)
                .style("font-weight",labelWeight)
                .style("font-size",labelSize)
                .call(axis.tickSize(tickSize));

        select(ReactDOM.findDOMNode(this))
            .select("g")
            .selectAll(".tick")
            .select("text")
            .style("fill", labelColor)
            .style("stroke", "none");

        select(ReactDOM.findDOMNode(this))
            .select("g")
            .selectAll(".tick")
            .select("line")
            .style("stroke", axisColor);

        select(ReactDOM.findDOMNode(this))
            .select("g")
            .select("path").remove();
    },

    componentDidMount() {
        this.renderTimeAxis(this.props.scale);
    },

    componentWillReceiveProps(nextProps) {
        const { scale, utc } = nextProps;
        if (scaleAsString(this.props.scale) !== scaleAsString(scale) ||
            this.props.utc !== utc) {
            this.renderTimeAxis(scale);
        }
    },

    shouldComponentUpdate() {
        return false;
    },

    render() {
        return <g />;
    }
});
