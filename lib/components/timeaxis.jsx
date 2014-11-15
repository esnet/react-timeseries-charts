/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3 = require("d3");

require("./timeaxis.css");

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

/**
 * Renders a horizontal time axis
 */

var TimeAxis = React.createClass({
    
    displayName: "TimeAxis",

    renderTimeAxis: function(scale) {
        var axis = d3.svg.axis().scale(scale).orient("bottom");

        //Remove the old axis from under this DOM node
        d3.select(this.getDOMNode()).selectAll("*").remove();

        var axisGroup = d3.select(this.getDOMNode()).append("g")
            .attr("class", "x axis")
            .call(axis.tickSize(10));

        axisGroup.selectAll("tick").append("line")
            .attr("shape-rendering", "crispEdge")
            .attr("stroke", "#FFF")
            .attr("y1", 0)
            .attr("y2", this.props.height);
    },

    componentDidMount: function() {
        this.renderTimeAxis(this.props.scale);
    },


    componentWillReceiveProps: function(nextProps) {
        var scale = nextProps.scale;
        if (scaleAsString(this.props.scale) !== scaleAsString(scale)) {
            this.renderTimeAxis(scale);
        }
    },

    shouldComponentUpdate: function() {
        return false;
    },

    render: function() {
        return <g />;
    },

});

module.exports = TimeAxis;