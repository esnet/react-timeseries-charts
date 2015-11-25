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
import d3 from "d3";

import "./timeaxis.css";

function scaleAsString(scale) {
    return `${scale.domain().toString()}-${scale.range().toString()}`;
}

/**
 * Renders a horizontal time axis
 */
export default React.createClass({

    displayName: "TimeAxis",

    renderTimeAxis(scale) {
        let axis;

        if (this.props.format === "day") {
            axis = d3.svg.axis()
                .scale(scale)
                .orient("bottom")
                .ticks(d3.time.days, 1)
                .tickFormat(d3.time.format("%d"));
        } else if (this.props.format === "month") {
            axis = d3.svg.axis()
                .scale(scale)
                .orient("bottom")
                .ticks(d3.time.months, 1)
                .tickFormat(d3.time.format("%B"));
        } else if (this.props.format === "year") {
            axis = d3.svg.axis()
                .scale(scale)
                .orient("bottom")
                .ticks(d3.time.years, 1)
                .tickFormat(d3.time.format("%Y"));
        } else {
            axis = d3.svg.axis()
                .scale(scale)
                .orient("bottom");
        }

        // Remove the old axis from under this DOM node
        d3.select(ReactDOM.findDOMNode(this)).selectAll("*").remove();

        const axisGroup = d3.select(ReactDOM.findDOMNode(this)).append("g")
            .attr("class", "x axis")
            .call(axis.tickSize(10));

        axisGroup.selectAll("tick").append("line")
            .attr("shape-rendering", "crispEdge")
            .attr("stroke", "#FFF")
            .attr("y1", 0)
            .attr("y2", this.props.height);
    },

    componentDidMount() {
        this.renderTimeAxis(this.props.scale);
    },

    componentWillReceiveProps(nextProps) {
        const scale = nextProps.scale;
        if (scaleAsString(this.props.scale) !== scaleAsString(scale)) {
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
