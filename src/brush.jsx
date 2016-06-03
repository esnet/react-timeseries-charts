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
import { brushX, brushSelection } from "d3-brush";
import { select, event } from "d3-selection";
import { TimeRange } from "pondjs";

function scaleAsString(scale) {
    return `${scale.domain().toString()}-${scale.range().toString()}`;
}

export default React.createClass({

    displayName: "Brush",

    componentWillMount() {
        this.brush = brushX()
            .on("brush", this.handleBrushed);
    },

    handleBrushed() {
        const [x1, x2] = event.selection;

        const d1 = this.props.timeScale.invert(x1);
        const d2 = this.props.timeScale.invert(x2);

        this.currentBegin = d1.getTime();
        this.currentEnd = d2.getTime();

        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(new TimeRange(d1, d2));
        }
    },

    renderBrush(timeScale, timeRange) {
        if (timeRange.begin().getTime() !== this.currentBegin ||
            timeRange.end().getTime() !== this.currentEnd) {

            const x1 = this.props.timeScale(timeRange.begin());
            const x2 = this.props.timeScale(timeRange.end());

            select(this.refs.group).selectAll("*").remove();
            select(this.refs.group)
                .append("g")
                    .attr("class", "brush")
                    .call(this.brush)
                    .call(this.brush.move, [x1, x2]);
        }
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
        return <g ref="group"/>;
    }
});
