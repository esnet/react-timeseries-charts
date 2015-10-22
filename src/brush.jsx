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
import d3 from "d3";

function scaleAsString(scale) {
    return `${scale.domain().toString()}-${scale.range().toString()}`;
}

export default React.createClass({

    displayName: "Brush",

    getInitialState() {
        return {
            d3brush: null
        };
    },

    handleBrushed(brush) {
        const extent = brush.extent();
        if (this.props.onBrushed) {
            this.props.onBrushed(brush,extent[0],extent[1]);
        }
    },

    renderBrush(timeScale,beginTime,endTime) {
        let d3brush = this.state.d3brush;

        if (!d3brush) {
            d3brush = d3.svg.brush()
                .x(timeScale)
                .on("brush", () => {
                    this.handleBrushed(d3brush);
                });
            this.setState({d3brush: d3brush});
            d3brush.extent([beginTime,endTime]);
        } else {
            const currentExtent = d3brush.extent();
            const curBegin = currentExtent[0];
            const curEnd = currentExtent[1];

            // This check is critical to break feedback cycles that
            // will cause the brush to get very confused.
            if (curBegin.getTime() !== beginTime.getTime() ||
                curEnd.getTime() !== endTime.getTime()) {
                d3brush.extent([beginTime,endTime]);
            } else {
                return;
            }
        }
        d3.select(this.getDOMNode()).selectAll("*").remove();

        d3.select(this.getDOMNode())
            .append("g")
                .attr("class","x brush")
                .call(d3brush)
                .selectAll("rect")
                .attr("y", -6)
                .attr("height", this.props.height + 7);
    },

    componentDidMount() {
        this.renderBrush(this.props.timeScale,
                         this.props.beginTime,
                         this.props.endTime);
    },

    componentWillReceiveProps(nextProps) {
        const timeScale = nextProps.timeScale;
        const beginTime = nextProps.beginTime;
        const endTime = nextProps.endTime;

        if (scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) ||
            this.props.beginTime.getTime() !== beginTime.getTime() ||
            this.props.endTime.getTime() !== endTime.getTime() ) {
            this.renderBrush(timeScale, beginTime, endTime);
        }
    },

    shouldComponentUpdate() {
        return false;
    },

    render() {
        return <g/>;
    }
});
