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
import { axisBottom } from "d3-axis";
import { timeFormat } from "d3-time-format";
import { timeDay, utcDay, timeMonth, utcMonth, timeYear, utcYear } from "d3-time";
import { select } from "d3-selection";
import moment from "moment";
import "moment-duration-format";
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

        const tickSize = this.props.showGrid ? -this.props.gridHeight : 10;
        const utc = this.props.utc;

        if (this.props.format === "day") {
            axis = axisBottom(scale)
                .tickArguments([utc ? utcDay : timeDay, 1])
                .tickFormat(timeFormat("%d"));
        } else if (this.props.format === "month") {
            axis = axisBottom(scale)
                .tickArguments([utc ? utcMonth : timeMonth, 1])
                .tickFormat(timeFormat("%B"));
        } else if (this.props.format === "year") {
            axis = axisBottom(scale)
                .tickArguments([utc ? utcYear : timeYear, 1])
                .tickFormat(timeFormat("%Y"));
        } else if (this.props.format === "relative") {
            axis = axisBottom(scale)
                .tickFormat(d => moment.duration(+d).format());
        } else {
            axis = axisBottom(scale)
                .tickSize(-100, 0, 0);
        }

        // Remove the old axis from under this DOM node
        select(ReactDOM.findDOMNode(this)).selectAll("*").remove();

        // Draw the new axis
        select(ReactDOM.findDOMNode(this)).append("g")
            .attr("class", "x axis")
            .call(axis.tickSize(tickSize));
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
