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
        var labelStyle = {fontSize: 14, textAnchor: "middle", fill: "#838383"};
        var detailStyle = {fontSize: 12, textAnchor: "middle", fill: "#9a9a9a"};
        return (
            <g>
                <rect x="0" y="0" width={this.props.width} height={this.props.height} 
                      style={{fill: "#E4E4E4", fillOpacity: 0.65}}/>
                <text x={parseInt(this.props.width/2)} y={this.props.height/2} style={labelStyle}>
                    {this.props.value}
                </text>
                <text x={parseInt(this.props.width/2)} y={this.props.height/2} dy="1.2em" style={detailStyle}>
                    {this.props.detail}
                </text>
            </g>
        );
    },
});

module.exports = ValueAxis;