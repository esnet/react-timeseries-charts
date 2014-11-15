/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3 = require("d3");

require("./yaxis.css");

var MARGIN = 5;

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
            "absolute": false          // Display scale always positive
        };
    },

    renderAxis: function(align, scale, width, absolute) {
        var yformat = d3.format(".2s");

        //TODO: Stop this from re-rendering so much!
        //console.log("renderAxis", absolute);

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
        d3.select(this.getDOMNode()).append("g")
            .attr("transform", "translate(" + x + ",0)")
            .attr("class", "y axis")
            .call(axisGenerator);
    },

    componentDidMount: function() {
        this.renderAxis(this.props.align, this.props.scale, this.props.width, this.props.absolute);
    },

    componentWillReceiveProps: function(nextProps) {
        var scale = nextProps.scale;
        var align = nextProps.align;
        var width = nextProps.width;
        var absolute = nextProps.absolute;

        if (scaleAsString(this.props.scale) !== scaleAsString(scale)) {
            this.renderAxis(align, scale, width, absolute);
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