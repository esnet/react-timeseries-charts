/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3 = require("d3");

/**
 * Renders a 'axis' that display a label for a current tracker value
 *
 *      ----+----------------+
 *          |     56.2G      |
 *          |      bps       |
 *          |                |
 *      ----+----------------+
 */

var ValueAxis = React.createClass({

    displayName: "ValueAxis",

    render: function() {
        var labelStyle = {fontSize: 16, textAnchor: "middle", fill: "#838383"};
        return (
            <g>
                <rect x="0" y="0" width={this.props.width} height={this.props.height} 
                      style={{fill: "#E4E4E4", fillOpacity: 0.65}}/>
                <text x={parseInt(this.props.width/2)} y={this.props.height/2-10} style={labelStyle}>
                    {this.props.value}
                </text>
            </g>
        );
    },
});

module.exports = ValueAxis;