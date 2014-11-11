/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3    = require("d3");

//Returns a d3 scale as a string so we can determine if we have a new scale
function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

var EventRect = React.createClass({

    displayName: "EventRect",

    renderEventSurface: function(scale, width, height) {
        var self = this;

        //Remove the old touch rect from under this DOM node
        d3.select(this.getDOMNode()).selectAll("*").remove();

        this.zoom = d3.behavior.zoom().on("zoom", function() {
            var x = d3.event.translate[0];
            var scale = d3.event.scale;
            if (self.props.onZoom) {
                self.props.onZoom(x, scale);
            }
        });

        //Construct a new overlay rect for catching events
        d3.select(this.getDOMNode()).append("rect")
            .style("fill", "none")
            .attr("id", "chart-touch-surface")
            .attr("width", width)
            .attr("height", height)
            .attr("pointer-events", "all")
            .call(this.zoom);

        //Events
        d3.select(this.getDOMNode())
            .on("mousemove", function() {
                var xpos = d3.mouse(this)[0];
                var time = self.props.scale.invert(xpos);
                if (self.props.onMouseMove) {
                    self.props.onMouseMove(time);
                }
            });

        d3.select(this.getDOMNode())
            .on("mouseout", function() {
                if (self.props.onMouseOut) {
                    self.props.onMouseOut();
                }
            });
    },

    componentDidMount: function() {
        this.renderEventSurface(this.props.scale, this.props.width, this.props.height);
    },

    componentWillReceiveProps: function(nextProps) {
        var scale = nextProps.scale;
        var width = nextProps.width;
        var height = nextProps.height;
        if (scaleAsString(this.props.scale) !== scaleAsString(scale) ||
            this.props.width !== width ||
            this.props.height !== height) {
            this.renderEventSurface(scale, width, height);
        }
    },

    shouldComponentUpdate: function() {
        return false;
    },

    render: function() {
        return <g/>;
    },
});

module.exports = EventRect;