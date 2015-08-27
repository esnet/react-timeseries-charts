/*
 * ESnet React Charts, Copyright (c) 2014, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
 *
 * If you have questions about your rights to use or distribute this
 * software, please contact Berkeley Lab's Technology Transfer
 * Department at TTD@lbl.gov.
 *
 * NOTICE.  This software is owned by the U.S. Department of Energy.
 * As such, the U.S. Government has been granted for itself and others
 * acting on its behalf a paid-up, nonexclusive, irrevocable,
 * worldwide license in the Software to reproduce, prepare derivative
 * works, and perform publicly and display publicly.  Beginning five
 * (5) years after the date permission to assert copyright is obtained
 * from the U.S. Department of Energy, and subject to any subsequent
 * five (5) year renewals, the U.S. Government is granted for itself
 * and others acting on its behalf a paid-up, nonexclusive,
 * irrevocable, worldwide license in the Software to reproduce,
 * prepare derivative works, distribute copies to the public, perform
 * publicly and display publicly, and to permit others to do so.
 *
 * This code is distributed under a BSD style license, see the LICENSE
 * file for complete information.
 */

import React from "react/addons";
import d3 from "d3";

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

export default React.createClass({

    displayName: "Brush",

    getInitialState: function() {
        return {
            "d3brush": null
        };
    },

    handleBrushed: function(brush) {
        var extent = brush.extent();
        if (this.props.onBrushed) {
            this.props.onBrushed(brush,extent[0],extent[1]);
        }
    },

    renderBrush: function(timeScale,beginTime,endTime) {
        var d3brush = this.state.d3brush;
        var self = this;
        if (!d3brush) {
            d3brush = d3.svg.brush()
                .x(timeScale)
                .on("brush", function() {
                    self.handleBrushed(d3brush);
                });
            this.setState({"d3brush": d3brush});
            d3brush.extent([beginTime,endTime]);
        } else {
            var currentExtent = d3brush.extent();
            var curBegin = currentExtent[0];
            var curEnd = currentExtent[1];
            /* This check is critical to break feedback cycles that will cause the brush
             * to get very confused.
             */
            if (curBegin.getTime()!==beginTime.getTime() || curEnd.getTime()!==endTime.getTime()) {
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

    componentDidMount: function() {
        this.renderBrush(this.props.timeScale,this.props.beginTime,this.props.endTime);
    },

    componentWillReceiveProps: function(nextProps) {
        var timeScale = nextProps.timeScale;
        var beginTime = nextProps.beginTime;
        var endTime = nextProps.endTime;

        if (scaleAsString(this.props.timeScale) != scaleAsString(timeScale) ||
            this.props.beginTime.getTime() != beginTime.getTime() ||
            this.props.endTime.getTime() != endTime.getTime() ) {
                this.renderBrush(timeScale,beginTime,endTime);
        }
    },

    shouldComponentUpdate: function() {
        return false;
    },

    render: function() {
        return <g/>;
    },
});
