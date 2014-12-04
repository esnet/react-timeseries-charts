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
 
"use strict";

var React = require("react");
var d3 = require("d3");
var _ = require("underscore");

require("./linechart.css");

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

var LineChart = React.createClass({

    getDefaultProps: function() {
        return {
            "interpolate": "basis",
            "showDataPoints": false,
            "dataPointRadius": 1.0
        };
    },

    renderLineChart: function(data, timeScale, yScale, interpolate, 
                              showDataPoints, dataPointRadius, classed) {
        if (!yScale || !data[0]) {
            return null;
        }

        if (this.props.dropNulls) {
            data = _.filter(data, function(d) { return d.value!==null; } );
        }

        d3.select(this.getDOMNode()).selectAll("*").remove();

        var line = d3.svg.line()
            .interpolate(interpolate)
            .x(function(d) { return timeScale(d.time); })
            .y(function(d) { return yScale(d.value); });

        var pathClasses = {"linechart-line": true};
        if (classed) {
            pathClasses[classed] = true;
        }
        d3.select(this.getDOMNode()).append("path")
            .datum(data)
            .classed(pathClasses)
            .attr("d", line)
            .attr("clip-path",this.props.clipPathURL);

        if (showDataPoints) {
            d3.select(this.getDOMNode()).selectAll("dot")
                .data(data)
                .enter().append("circle")
                    .attr("r", dataPointRadius)
                    .attr("cx", function (d) { return timeScale(d.time); })
                    .attr("cy", function (d) { return yScale(d.value); })
        }
    },

    componentDidMount: function() {
        this.renderLineChart(this.props.data,
                             this.props.timeScale,
                             this.props.yScale,
                             this.props.interpolate,
                             this.props.showDataPoints,
                             this.props.dataPointRadius,
                             this.props.classed);

    },

    componentWillReceiveProps: function(nextProps) {
        var data = nextProps.data;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var classed = nextProps.classed;
        var interpolate = nextProps.interpolate;
        var showDataPoints = nextProps.showDataPoints;
        var dataPointRadius = nextProps.dataPointRadius;

        if (this.props.data !== nextProps.data ||
            this.props.data.time !== data.time ||
            this.interpolate !== interpolate ||
            this.showDataPoints !== showDataPoints ||
            this.dataPointRadius !== dataPointRadius || 
            scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) ||
            scaleAsString(this.props.yScale) !== scaleAsString(yScale)) {
            this.renderLineChart(data, timeScale, yScale, interpolate, 
                    showDataPoints, dataPointRadius, classed);
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

module.exports = LineChart;