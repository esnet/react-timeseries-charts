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
import _ from "underscore";
import Moment from "moment";

import "./barchart.css";

var DAY = 1000 * 60 * 60 * 24;
var HOUR = 1000 * 60 * 60;

function scaleAsString(scale) {
    return `${scale.domain()}-${scale.range()}`;
}

/**
 * Renders a barchart. This BarChart implementation is a little different
 * in that it will render onto a time axis, rather than rendering to
 * specific values. As a result, an Aug 2014 bar will render between the
 * Aug 2014 tick mark and the Sept 2014 tickmark.
 */
export default React.createClass({

    propTypes: {
        /**
         * The width of each bar is the width determined by the time range - spacing x 2
         */
        spacing: React.PropTypes.number,

        /**
         * The position of the bar is then offset by this value.
         */
        offset: React.PropTypes.number,
    },

    getDefaultProps: function() {
        return {
            spacing: 1,
            offset: 0
        };
    },

    renderBarChart: function(data, timeScale, yScale, classed) {
        let spacing = Number(this.props.spacing);
        let offset = Number(this.props.offset);

        if (!yScale || !data[0]) {
            return null;
        }

        if (this.props.dropNulls) {
            data = _.filter(data, d => { return d.value!==null; } );
        }

        d3.select(this.getDOMNode()).selectAll("*").remove();

        let barClasses = {"barchart-rect": true};
        if (classed) {
            barClasses[classed] = true;
        }

        d3.select(this.getDOMNode()).selectAll("rect")
            .data(data)
            .enter().append("rect")
                .classed(barClasses)
                .attr("width", d => {
                    let start = d.time;
                    let end;

                    if (this.props.interval === "monthly") {
                        let daysInMonth = Moment(d.time).daysInMonth();
                        end = new Date(d.time.getTime() + daysInMonth * DAY); 
                    } else if (this.props.interval === "daily") {
                        end = new Date(d.time.getTime() + DAY);
                    } else if (this.props.interval === "hourly") {
                        end = new Date(d.time.getTime() + HOUR);
                    }

                    let startLocation = timeScale(start) + spacing;
                    let endLocation = timeScale(end) - spacing;
                    return endLocation - startLocation;
                })
                .attr("height", d => {
                    return yScale(0) - yScale(d.value);
                })
                .attr("x", d => { return timeScale(d.time) + spacing + offset; })
                .attr("y", d => { return yScale(d.value); })

    },

    componentDidMount: function() {
        this.renderBarChart(this.props.data,
                             this.props.timeScale,
                             this.props.yScale,
                             this.props.classed);

    },

    componentWillReceiveProps: function(nextProps) {
        let data = nextProps.data;
        let timeScale = nextProps.timeScale;
        let yScale = nextProps.yScale;
        let classed = nextProps.classed;

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
