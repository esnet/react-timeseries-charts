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
            fill: "#666",
            fontSize: 20,
            textAnchor: "middle"
        };
        const detailStyle = {
            fontSize: 12,
            textAnchor: "middle",
            fill: "#9a9a9a"
        };
        return (
            <g>
                <rect
                    key="background"
                    x="0" y="0"
                    width={this.props.width}
                    height={this.props.height}
                    style={{fill: "none", stroke: "none"}}/>
                <text
                    key="value"
                    x={parseInt(this.props.width / 2, 10)}
                    y={this.props.height / 2}
                    style={labelStyle}>
                    {this.props.value}
                </text>
                <text
                    key="detail"
                    x={parseInt(this.props.width / 2, 10)}
                    y={this.props.height / 2} dy="1.2em"
                    style={detailStyle}>
                    {this.props.detail}
                </text>
            </g>
        );
    }
});
