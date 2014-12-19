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
var moment = require("moment");

require("./barchart.css");

var DAY = 1000 * 60 * 60 * 24;
var HOUR = 1000 * 60 * 60;

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

var BarChart = React.createClass({

    getDefaultProps: function() {
        return {
            spacing: 1,   // The width of each bar is the width determined by the time range - spacing x 2
            offset: 0     // The position of the bar is then offset by this value.
        };
    },

    renderBarChart: function(data, timeScale, yScale, classed) {
        var self = this;

        var spacing = Number(self.props.spacing);
        var offset = Number(self.props.offset);

        if (!yScale || !data[0]) {
            return null;
        }

        if (this.props.dropNulls) {
            data = _.filter(data, function(d) { return d.value!==null; } );
        }

        d3.select(this.getDOMNode()).selectAll("*").remove();

        var barClasses = {"barchart-rect": true};
        if (classed) {
            barClasses[classed] = true;
        }

        d3.select(this.getDOMNode()).selectAll("rect")
            .data(data)
            .enter().append("rect")
                .classed(barClasses)
                .attr("width", function(d) {
                    var start = d.time;
                    var end;

                    if (self.props.interval === "monthly") {
                        var daysInMonth = moment(d.time).daysInMonth();
                        end = new Date(d.time.getTime() + daysInMonth * DAY); 
                    } else if (self.props.interval === "daily") {
                        end = new Date(d.time.getTime() + DAY);
                    } else if (self.props.interval === "hourly") {
                        end = new Date(d.time.getTime() + HOUR);
                    }

                    var startLocation = timeScale(start) + spacing;
                    var endLocation = timeScale(end) - spacing;
                    return endLocation - startLocation;
                })
                .attr("height", function(d) {
                    return yScale(0) - yScale(d.value);
                })
                .attr("x", function (d) { return timeScale(d.time) + spacing + offset})
                .attr("y", function (d) { return yScale(d.value); })

    },

    componentDidMount: function() {
        this.renderBarChart(this.props.data,
                             this.props.timeScale,
                             this.props.yScale,
                             this.props.classed);

    },

    componentWillReceiveProps: function(nextProps) {
        var data = nextProps.data;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var classed = nextProps.classed;

        if (this.props.data !== nextProps.data ||
            this.props.data.time !== data.time ||
            scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) ||
            scaleAsString(this.props.yScale) !== scaleAsString(yScale)) {
            this.renderBarChart(data, timeScale, yScale, classed);
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

module.exports = BarChart;