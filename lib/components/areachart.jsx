/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3 = require("d3");
var _ = require("underscore");

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

var AreaChart = React.createClass({



    renderAreaChart: function(data, timeScale, yScale) {

        console.log("RENDER AREA CHART!", timeScale.domain().toString(), timeScale.range().toString());

        var colorMap = [["#448fdd", "#a7cff9"], ["#ff8a00", "#ffc784"]];

        if (!data[0]) {
            return null;
        }

        d3.select(this.getDOMNode()).selectAll("*").remove();

        var up = data[0].map(function(d) {
            return {"values": d.map(function(dd) {
                return { "date": dd.time, "value": dd.value};
            })};
        });

        var down = data[1].map(function(d) {
            return {"values": d.map(function(dd) {
                return { "date": dd.time, "value": dd.value};
            })};
        });

        //
        // D3 area generator. If a data element is d = [time, val]
        // then we want the date (x) to be d[0] and y to be d[1].
        // y0 here is the base, y1 is the top of the graph, and x is x.
        //

        var upArea = d3.svg.area()
            .x(function(d)  { return timeScale(d.date); })
            .y0(function(d) { return yScale(d.y0); })
            .y1(function(d) { return yScale(d.y0 + d.value); }); //.interpolate(self.options.interpolation

        var downArea = d3.svg.area()
            .x(function(d)  { return timeScale(d.date); })
            .y0(function(d) { return yScale(d.y0); })
            .y1(function(d) { return yScale(d.y0 - d.value); }); //.interpolate(self.options.interpolation

        //
        // Our D3 stack. When this is evoked with data (an array of layers) it builds up
        // the stack of graphs on top of each other (i.e propogates a baseline y position
        // up through the stack).
        //

        var stackUp = d3.layout.stack()
            .values(function(d) { return d.values; })
            .x(function(d) { return d.date; })
            .y(function(d) { return d.value; });

        var stackDown = d3.layout.stack()
            .values(function(d) { return d.values; })
            .x(function(d) { return d.date; })
            .y(function(d) { return -d.value; });

        //
        // Stack up and down charts
        //

        stackUp(up);
        if (down.length) {
            stackDown(down);
        }

        //
        // Up chart drawing
        //

        //Make a group 'upchartarea' for each stacked area
        var upChart = d3.select(this.getDOMNode()).selectAll(".upchartarea")
            .data(up)
          .enter().append("g")
            .attr("id", function() {
                return _.uniqueId("up-chart-area-");})
            .attr("class", "upchartarea");

        // Append the area chart path onto the upchartarea group
        upChart.append("path")
            .attr("class", "area")
            .attr("d", function(d) {
                return upArea(d.values);
            })
            //.attr("clip-path", clipURL)
            .style("fill", function(d, i) {
                return colorMap[0][i];
            })
            .style("fill-opacity", 0.85);

        //
        // Down chart drawing
        // TODO: test this!

        //Make a group 'upchartarea' for each stacked area
        var downChart = d3.select(this.getDOMNode()).selectAll(".downchartarea")
            .data(down)
          .enter().append("g")
            .attr("id", function() {
                return _.uniqueId("down-chart-area-");})
            .attr("class", "downchartarea");

        // Append the area chart path onto the downchartarea group
        downChart.append("path")
            .attr("class", "area")
            .attr("d", function(d) {
                return downArea(d.values);
            })
            //.attr("clip-path", clipURL)
            .style("fill", function(d, i) {
                return colorMap[0][i];
            })
            .style("fill-opacity", 0.85);

    },

    componentDidMount: function() {
        this.renderAreaChart(this.props.data, this.props.timeScale, this.props.yScale);
    },

    componentWillReceiveProps: function(nextProps) {
        var data = nextProps.data;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        if (this.props.data[0].time !== data[0].time ||
            scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) ||
            scaleAsString(this.props.yScale) !== scaleAsString(yScale)) {

            this.renderAreaChart(data, timeScale, yScale);
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

module.exports = AreaChart;