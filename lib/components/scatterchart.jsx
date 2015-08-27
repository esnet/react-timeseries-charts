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
import {TimeSeries} from "pond";
import "./scatterchart.css";

function scaleAsString(scale) {
    return `${scale.domain()}-${scale.range()}`;
}

export default React.createClass({

    getDefaultProps: function() {
        return {
            "radius": 2.0,
            "style": {
                color: "steelblue",
                opacity: 1
            }
        };
    },

    renderScatterChart: function(series, timeScale, yScale, radius) {

        let data = series.toJSON().points;

        if (!yScale || !data[0]) {
            return null;
        }

        if (this.props.dropNulls) {
            data = _.filter(data, d => (d.value !== null) );
        }

        let style = {
            "fill": this.props.style.color || "steelblue",
            "fill-opacity": this.props.style.opacity || 1.0,
            "stroke": "none",
        }

        d3.select(this.getDOMNode()).selectAll("*").remove();

        this.scatter = d3.select(this.getDOMNode()).selectAll("dot")
                .data(data)
            .enter().append("circle")
                .style(style)
                .attr("r", d => d[2] ? d[2] : this.props.radius)
                .attr("cx", d => timeScale(d[0]))
                .attr("cy", d => yScale(d[1]))
                .attr("clip-path",this.props.clipPathURL);
    },

    updateScatterChart: function(series, timeScale, yScale, radius) {
        let data = series.toJSON().points;
        this.scatter
            .data(data)
            .transition()
                .duration(this.props.transiton)
                .ease("sin-in-out")
                .attr("r", d =>  d[2] ? d[2] : this.props.radius)
                .attr("cx", d => timeScale(d[0]))
                .attr("cy", d => yScale(d[1]))
    },

    componentDidMount: function() {
        this.renderScatterChart(this.props.series,
                                this.props.timeScale,
                                this.props.yScale,
                                this.props.radius,
                                this.props.classed);

    },

    componentWillReceiveProps: function(nextProps) {
        var series = nextProps.series;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var radius = nextProps.radius;

        //What changed
        let timeScaleChanged = (scaleAsString(this.props.timeScale) !== scaleAsString(timeScale));
        let yAxisScaleChanged = (scaleAsString(this.props.yScale) !== scaleAsString(yScale));
        let defaultRadiusChanged = (this.props.radius !== radius);
        let seriesChanged = TimeSeries.is(this.props.series, series);

        //
        // Currently if the series changes we completely rerender it. If the y axis scale
        // changes then we just update the existing paths using a transition so that we
        // can get smooth axis transitions.
        //

        if (seriesChanged || timeScaleChanged || defaultRadiusChanged) {
            this.renderScatterChart(series, timeScale, yScale, radius);
        } else if (yAxisScaleChanged) {
            this.updateScatterChart(series, timeScale, yScale, radius);
        }

    },

    shouldComponentUpdate: function() {
        return false;
    },

    render: function() {
        return (
            <g></g>
        );
    }
});
