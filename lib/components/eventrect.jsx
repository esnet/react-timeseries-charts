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

    zoom: function() {
        var t = d3.event.translate[0] - this.state.translate[0];
        var s = d3.event.scale;
        var mouse = d3.mouse(this.getDOMNode());

        var center = this.props.scale.invert(mouse[0]).getTime(); //mouse position in ms since 1970
        var begin = this.props.scale.domain()[0].getTime();       //begin of range in ms
        var end = this.props.scale.domain()[1].getTime();         //end of range in ms

        var offset = this.props.scale.invert(-t).getTime() - begin;  //translation offset in ms

        var beforeDuration = center - begin;                      //ms before mouse position
        var afterDuration = end - center;                         //ms after mouse position

        var newBeforeDuration = parseInt(beforeDuration / this.state.scale * s); // scaled ms before mouse
        var newAfterDuration = parseInt(afterDuration / this.state.scale * s);    // scaled ms after mouse

        var newBegin;
        var newEnd;
        if (s === this.state.scale) {
            newBegin = new Date(begin + offset);
            newEnd = new Date(end + offset);
        } else {
            newBegin = new Date(center - newBeforeDuration);
            newEnd = new Date(center + newAfterDuration);
        }

        if (this.props.onZoom) {
            this.props.onZoom(newBegin, newEnd);
        }
    },

    renderEventSurface: function(scale, width, height) {
        var self = this;

        //Remove the old touch rect from under this DOM node
        d3.select(this.getDOMNode()).selectAll("*").remove();

        //Construct a new overlay rect for catching events and attach a zoom behavior
        d3.select(this.getDOMNode()).append("rect")
            .style("fill", "none")
            .attr("id", "chart-touch-surface")
            .attr("width", width)
            .attr("height", height)
            .attr("pointer-events", "all")
            .call(this.zoom);

        //Mouse move events
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

    getInitialState: function() {
        return {"translate": [0,0],
                "scale": 1};
    },

    componentWillMount: function() {
        this.zoom = d3.behavior.zoom()
            .on("zoom", this.zoom);
    },

    componentDidMount: function() {
        this.renderEventSurface(this.props.scale, this.props.width, this.props.height);
        if (this.props.onResize) {
            this.props.onResize(this.props.width, this.props.height);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        var scale = nextProps.scale;
        var width = nextProps.width;
        var height = nextProps.height;

        //If the size changes we have to rebuild the event rect
        if (this.props.width !== width || this.props.height !== height) {
            this.renderEventSurface(scale, width, height);
            if (this.props.onResize) {
                this.props.onResize(width, height);
            }
        }

        //If the scale has changed, we can keep the rect, but reset the start point of
        //any zooming that might be in progress
        if (scaleAsString(this.props.scale) !== scaleAsString(scale)) {
            this.setState({"translate": this.zoom.translate(),
                           "scale": this.zoom.scale()});
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