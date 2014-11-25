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
        var labelStyle = {fontSize: 14, textAnchor: "middle", fill: "#838383"};
        var detailStyle = {fontSize: 12, textAnchor: "left", fill: "#bdbdbd"};
        var VALWIDTH = 20;
        var rectWidth = this.props.width - VALWIDTH;
        var valXPos = rectWidth + 3; // padding

        var format = _.has(this.props,"format") ? this.props.format : ".2f";
        var maxStr = d3.format(format)(this.props.max);
        var minStr = d3.format(format)(this.props.min);
        return (
            <g>
                <rect x="0" y="0" width={rectWidth} height={this.props.height} 
                      style={{fill: "#E4E4E4", fillOpacity: 0.65}}/>
                <text x={parseInt(rectWidth/2)} y={20} dy="2.5em" style={labelStyle}>
                    {this.props.label}
                </text>
                <text x={valXPos} y={0} dy="1.2em" style={detailStyle}>
                    {maxStr}
                </text>
                <text x={valXPos} y={this.props.height} style={detailStyle}>
                    {minStr}
                </text>                
                
            </g>
        );
    },
});

module.exports = LabelAxis;