/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3 = require("d3");
var _ = require("underscore");

require("./linechart.css");

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

var LineChart = React.createClass({

    renderLineChart: function(data, timeScale, yScale, classed) {

        console.log("Linechart: RENDERING LINE CHART!!", classed);

        if (!data[0]) {
            return null;
        }

        d3.select(this.getDOMNode()).selectAll("*").remove();

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return timeScale(d.time); })
            .y(function(d) { return yScale(d.value); });

        var pathClasses = {"linechart-line": true};
        if (classed) {
            pathClasses[classed] = true;
        }

        console.log("pathClasses", pathClasses);

        d3.select(this.getDOMNode()).append("path")
            .datum(data)
            .classed(pathClasses)
            .attr("d", line)
            .attr("clip-path",this.props.clipPathURL);
    },

    componentDidMount: function() {
        console.log("Linechart: componentDidMount");
        this.renderLineChart(this.props.data,
                             this.props.timeScale,
                             this.props.yScale,
                             this.props.classed);

    },

    componentWillReceiveProps: function(nextProps) {
        console.log("Linechart: componentWillReceiveProps");
        var data = nextProps.data;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var classed = nextProps.classed;

        if (this.props.data.time !== data.time ||
            scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) ||
            scaleAsString(this.props.yScale) !== scaleAsString(yScale)) {
            console.log("   Linechart: componentWillReceiveProps: UPDATE");
            this.renderLineChart(data, timeScale, yScale, classed);
        } else {
            console.log("   Linechart: componentWillReceiveProps: NO UPDATE");
        }
    },

    shouldComponentUpdate: function() {
        console.log("Linechart: shouldComponentUpdate");
        return false;
    },

    //TODO: props.attr should be required
    render: function() {
        console.log("Linechart: render");
        return (
            <g></g>
        );
    }
});

module.exports = LineChart;