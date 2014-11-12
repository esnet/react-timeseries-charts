/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3 = require("d3");

/**
 * Renders a 'axis' that display a label for a data channel and a max and average value
 *      +----------------+-----+------- ...
 *      | Traffic        | 120 |
 *      | Max 100 Gbps   |     | Chart  ...
 *      | Avg 26 Gbps    | 0   |
 *      +----------------+-----+------- ...
 */

var LabelAxis = React.createClass({

    displayName: "LabelAxis",

    render: function() {
        console.log("Rending LabelAxis", this.props);
        var labelStyle = {fontSize: 14, textAnchor: "middle", fill: "#838383"};
        return (
            <g>
                <rect x="0" y="0" width={this.props.width} height={this.props.height} 
                      style={{fill: "#E4E4E4", fillOpacity: 0.65}}/>
                <text x={parseInt(this.props.width/2)} y={20} style={labelStyle}>
                    {this.props.label}
                </text>
            </g>
        );
    },
});

module.exports = LabelAxis;