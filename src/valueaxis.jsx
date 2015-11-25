/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";

/**
 * Renders a 'axis' that display a label for a current tracker value
 *
 *      ----+----------------+
 *          |     56.2G      |
 *          |      bps       |
 *          |                |
 *      ----+----------------+
 *
 *  EXPERIMENTAL
 */
export default React.createClass({

    displayName: "ValueAxis",

    render() {
        const labelStyle = {
            fontSize: 14,
            textAnchor: "middle",
            fill: "#838383"
        };
        const detailStyle = {
            fontSize: 12,
            textAnchor: "middle",
            fill: "#9a9a9a"
        };
        return (
            <g>
                <rect x="0" y="0"
                      width={this.props.width}
                      height={this.props.height}
                      style={{fill: "#E4E4E4", fillOpacity: 0.65}}/>
                <text x={parseInt(this.props.width / 2, 10)}
                      y={this.props.height / 2}
                      style={labelStyle}>
                    {this.props.value}
                </text>
                <text x={parseInt(this.props.width / 2, 10)}
                      y={this.props.height / 2} dy="1.2em"
                      style={detailStyle}>
                    {this.props.detail}
                </text>
            </g>
        );
    }
});
