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

require("./yaxis.css");

var MARGIN = 0;

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

/**
 * Renders a horizontal time axis
 *
 * Props:
 *     * align - if the axis should be draw as if it is on the left or right (defaults to left)
 *     * scale - a d3 scale that defines the domain and range of the axis
 */

var YAxis = React.createClass({

    displayName: "YAxis",

    propTypes: {
        "align": React.PropTypes.string,
    },

    getDefaultProps: function() {
        return {
            "test": "bob",
            "id": "yaxis",             // id referred to by the chart
            "align": "left",           // left or right of the chart
            "min": 0,                  // range
            "max": 1,
            "type": "linear",          // linear, log, or power
            "absolute": false,         // Display scale always positive
            "format": ".2s",           // Format string for d3.format
            "labelOffset": 0           // Allows the user to tweak the position of the label
        };
    },

    renderAxis: function(align, scale, width, absolute, format) {
        var yformat = d3.format(format);

        var axisGenerator;
        if (this.props.type === "linear" || this.props.type === "power") {
            axisGenerator = d3.svg.axis()
                .scale(scale)
                .tickFormat(function(d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    } else {
                        return yformat(d);
                    }
                }).orient(align);
        } else if (this.props.type === "log") {
            axisGenerator = d3.svg.axis()
                .scale(scale)
                .ticks(10, ".2s")
                .orient(align);
        }

        //Remove the old axis from under this DOM node
        d3.select(this.getDOMNode()).selectAll("*").remove();

        //Add the new axis
        var x = align === "left" ? width - MARGIN : 0;
        var labelOffset = align === "left" ? this.props.labelOffset - 50 : 40 + this.props.labelOffset;
        var classed = this.props.classed ? this.props.classed : "";
        var axisClass = "yaxis " + classed
        var axisLabelClass = "yaxis-label " + classed;
        d3.select(this.getDOMNode()).append("g")
            .attr("transform", "translate(" + x + ",0)")
            .attr("class", axisClass)
            .call(axisGenerator)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("class", axisLabelClass)
            .attr("y", labelOffset)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(this.props.label);
    },

    componentDidMount: function() {
        this.renderAxis(this.props.align, this.props.scale, this.props.width,
                        this.props.absolute, this.props.format);
    },

    componentWillReceiveProps: function(nextProps) {
        var scale = nextProps.scale;
        var align = nextProps.align;
        var width = nextProps.width;
        var absolute = nextProps.absolute;
        var format = nextProps.format;

        if (scaleAsString(this.props.scale) !== scaleAsString(scale)) {
            this.renderAxis(align, scale, width, absolute, format);
        }
    },

    shouldComponentUpdate: function() {
        return false;
    },

    render: function() {
        return <g/>;
    },
});

module.exports = YAxis;