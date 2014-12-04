/** @jsx React.DOM */

/*
 * ESnet React Charts, Copyright (c) 2014, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
 *
 * If you have questions about your rights to use or distribute this
 * software, please contact Berkeley Lab's Technology Transfer
 * Department at TTD@lbl.gov.
 *
 * NOTICE.  This software is owned by the U.S. Department of Energy.
 * As such, the U.S. Government has been granted for itself and others
 * acting on its behalf a paid-up, nonexclusive, irrevocable,
 * worldwide license in the Software to reproduce, prepare derivative
 * works, and perform publicly and display publicly.  Beginning five
 * (5) years after the date permission to assert copyright is obtained
 * from the U.S. Department of Energy, and subject to any subsequent
 * five (5) year renewals, the U.S. Government is granted for itself
 * and others acting on its behalf a paid-up, nonexclusive,
 * irrevocable, worldwide license in the Software to reproduce,
 * prepare derivative works, distribute copies to the public, perform
 * publicly and display publicly, and to permit others to do so.
 *
 * This code is distributed under a BSD style license, see the LICENSE
 * file for complete information.
 */
 
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
                <text x={parseInt(rectWidth/2)} y={this.props.height/2} style={labelStyle}>
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