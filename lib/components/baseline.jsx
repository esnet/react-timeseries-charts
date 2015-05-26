/*
 * ESnet React Charts, Copyright (c) 2014-2015, The Regents of the University of
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

var React = require("react/addons");
var util  = require("util");

require("./baseline.css");

/**
 * Draws a horizontal line across the chart
 *
 * Props:
 *
 * - value          The positon of the horizontal line, which is transformed to
 *                  a pixel position using the yscale
 * - label          A label to display along side the line
 * - position       The position of the label, either left or right
 *
 * - yscale         The scale of the y axis to transform the value
 *                  (passed in automatically)
 */
var Baseline = React.createClass({

    getDefaultProps: function() {
        return {
            "value": 0,
            "label": "",
            "position": "left" //or right
        };
    },

    render: function() {
        if (!this.props.yScale || !this.props.value) {
            return null;
        }

        let ymin = Math.min(this.props.yScale.range()[0], this.props.yScale.range()[1]);
        let y = this.props.yScale(this.props.value);
        let transform = `translate(0 ${y})`;
        let textAnchor;
        let textPositionX;
        let pts = [];
        let points;

        let textPositionY = -3;
        if (y < ymin + 10) {
            textPositionY = 12;
        }

        if (this.props.position === "left") {
            textAnchor = "start";
            textPositionX = 5;
        }
        if (this.props.position === "right") {
            textAnchor = "end";
            textPositionX = this.props.width - 5;
        }

        pts.push(`0 0`);
        pts.push(`${this.props.width} 0`);
        points = pts.join(" ");

        return (
            <g className="baseline" transform={transform}>
                <polyline points={points} />
                <text className="baseline-label" x={textPositionX} y={textPositionY} textAnchor={textAnchor}>
                    {this.props.label}
                </text>
            </g>
        );
    }
});

module.exports = Baseline;