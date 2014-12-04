/** @jsx React.DOM */
/**
 * Indicator for a particular data point.  Typically used to indicate nearest actual data point to the
 * tracker
 *
 */
"use strict";

var React = require("react");
var d3 = require("d3");
var _ = require("underscore");

require("./linechart.css");

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}


var PointIndicator = React.createClass({

    getDefaultProps: function() {
        return {
            "pointRadius": 1.0
        };
    },

    renderPoint: function(timeScale, yScale, pointRadius, point, classed) {
        var data;

        if (point) {
            data = [point]
        } else {
            data = [];
        }

        d3.select(this.getDOMNode()).selectAll("*").remove();

        var pointClasses = {"pointindicator-point": true};
        if (classed) {
            pointClasses[classed] = true;
        }

        d3.select(this.getDOMNode()).selectAll("dot")
            .data(data)
            .enter().append("circle")
                .classed(pointClasses)
                .attr("r", pointRadius)
                .attr("cx", function (d) { return timeScale(d.time); })
                .attr("cy", function (d) { return yScale(d.value); })
    },

    componentDidMount: function() {
        this.renderPoint(this.props.timeScale,
                             this.props.yScale,
                             this.props.pointRadius,
                             this.props.point,
                             this.props.classed);

    },

    componentWillReceiveProps: function(nextProps) {
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var pointRadius = nextProps.pointRadius;
        var classed = nextProps.classed;
        var point = nextProps.point;

        if (this.props.point !== point ||
            this.pointRadius !== pointRadius || 
            scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) ||
            scaleAsString(this.props.yScale) !== scaleAsString(yScale)) {
            this.renderPoint(timeScale, yScale, pointRadius, point, classed );
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

module.exports = PointIndicator;