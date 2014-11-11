/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3 = require("d3");
var _ = require("underscore");

require("./linechart.css");

var LineChart = React.createClass({

    renderLineChart: function(data, timeScale, yScale) {

        if (!data[0]) {
            return null;
        }

        d3.select(this.getDOMNode()).selectAll("*").remove();

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return timeScale(d.time); })
            .y(function(d) { return yScale(d.value); });
        
        d3.select(this.getDOMNode()).append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    },

    componentDidMount: function() {
        this.renderLineChart(this.props.data,
                             this.props.timeScale,
                             this.props.yScale);
    },

    componentWillReceiveProps: function(nextProps) {
        var data = nextProps.data;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;

        this.renderAreaChart(data, timeScale, yScale);
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