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
import { TimeRange } from "pondjs";

function scaleAsString(scale) {
    return `${scale.domain().toString()}-${scale.range().toString()}`;
}

export default React.createClass({

    displayName: "Brush",

    handleBrushed(brush) {
        const extent = brush.extent();
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(new TimeRange(extent[0], extent[1]));
        }
    },

    renderBrush(timeScale, timeRange) {
        if (!this.brush) {
            this.brush = d3.svg.brush()
                .x(timeScale)
                .on("brush", () => {
                    this.handleBrushed(this.brush);
                });
            this.brush.extent([timeRange.begin(), timeRange.end()]);
        } else {
            const currentExtent = this.brush.extent();
            const currentBegin = currentExtent[0];
            const currentEnd = currentExtent[1];

            // Break feedback cycles
            if (currentBegin.getTime() !== timeRange.begin().getTime() ||
                currentEnd.getTime() !== timeRange.end().getTime()) {
                this.brush.extent([timeRange.begin(), timeRange.end()]);
            } else {
                return;
            }
        }
        d3.select(ReactDOM.findDOMNode(this)).selectAll("*").remove();

        d3.select(ReactDOM.findDOMNode(this))
            .append("g")
                .attr("class", "x brush")
                .call(this.brush)
                .selectAll("rect")
                .attr("y", -6)
                .attr("height", this.props.height + 7);
    },

    componentDidMount() {
        this.renderBrush(this.props.timeScale, this.props.timeRange);
    },

    componentWillReceiveProps(nextProps) {
        const timeScale = nextProps.timeScale;
        const timeRange = nextProps.timeRange;
        if (scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) ||
            this.props.timeRange !== timeRange) {
            this.renderBrush(timeScale, timeRange);
        }
    },

    shouldComponentUpdate() {
        return false;
    },

    render() {
        return <g/>;
    }
});
