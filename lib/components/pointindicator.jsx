/** @jsx React.DOM */

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

/**
 * Indicator for a particular data point.  Typically used to indicate nearest actual data point to the
 * tracker
 *
 */
"use strict";

var React = require("react");
var d3 = require("d3");
var _ = require("underscore");

require("./linechart.css");

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}


var PointIndicator = React.createClass({

    getDefaultProps: function() {
        return {
            "pointRadius": 1.0
        };
    },

    renderPoint: function(timeScale, yScale, pointRadius, point, classed) {
        var data;

        if (point) {
            data = [point]
        } else {
            data = [];
        }

        d3.select(this.getDOMNode()).selectAll("*").remove();

        if (!yScale)
            return;

        var pointClasses = {"pointindicator-point": true};
        if (classed) {
            pointClasses[classed] = true;
        }

        d3.select(this.getDOMNode()).selectAll("dot")
            .data(data)
            .enter().append("circle")
                .classed(pointClasses)
                .attr("r", pointRadius)
                .attr("cx", function (d) { return timeScale(d.time); })
                .attr("cy", function (d) { return yScale(d.value); })
    },

    componentDidMount: function() {
        this.renderPoint(this.props.timeScale,
                             this.props.yScale,
                             this.props.pointRadius,
                             this.props.point,
                             this.props.classed);

    },

    componentWillReceiveProps: function(nextProps) {
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var pointRadius = nextProps.pointRadius;
        var classed = nextProps.classed;
        var point = nextProps.point;

        if (this.props.point !== point ||
            this.pointRadius !== pointRadius || 
            scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) ||
            scaleAsString(this.props.yScale) !== scaleAsString(yScale)) {
            this.renderPoint(timeScale, yScale, pointRadius, point, classed );
        }
    },

    shouldComponentUpdate: function() {
        return false;
    },

    //TODO: props.attr should be required
    render: function() {
        return (
            <g></g>
        );
    }
});

module.exports = PointIndicator;