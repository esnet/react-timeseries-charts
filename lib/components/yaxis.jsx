/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3 = require("d3");

require("./yaxis.css");

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
            "align": "left",
            "absolute": false
        };
    },

    renderAxis: function(align, scale, absolute) {
        var yformat = d3.format(".2s");

        //TODO: Stop this from re-rendering so much!
        //console.log("renderAxis", absolute);

        var axisGenerator = d3.svg.axis()
                .scale(scale)
                .tickFormat(function(d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    } else {
                        return yformat(d);
                    }
                }).orient(align);

        //Remove the old axis from under this DOM node
        d3.select(this.getDOMNode()).selectAll("*").remove();

        //Add the new axis
        d3.select(this.getDOMNode()).append("g")
            .attr("class", "y axis")
            .call(axisGenerator);
    },

    componentDidMount: function() {
        this.renderAxis(this.props.align, this.props.scale, this.props.absolute);
    },

    componentWillReceiveProps: function(nextProps) {
        var scale = nextProps.scale;
        var align = nextProps.align;
        var absolute = nextProps.absolute;
        this.renderAxis(align, scale, absolute);
    },

    shouldComponentUpdate: function() {
        return false;
    },

    render: function() {
        return <g/>;
    },
});

module.exports = YAxis;