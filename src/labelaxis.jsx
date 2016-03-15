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
import d3 from "d3";
import _ from "underscore";

import ValueList from "./valuelist";

/**
 * Renders a 'axis' that display a label for a data channel and a
 * max and average value
 *      +----------------+-----+------- ...
 *      | Traffic        | 120 |
 *      | Max 100 Gbps   |     | Chart  ...
 *      | Avg 26 Gbps    | 0   |
 *      +----------------+-----+------- ...
 *
 * EXPERIMENTAL
 *
 */

export default React.createClass({

    displayName: "LabelAxis",

    propTypes: {

        values: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                value: React.PropTypes.oneOfType([
                    React.PropTypes.number,
                    React.PropTypes.string
                ])
            }),
        ).isRequired,

        /**
         * The width of the axis
         */
        width: React.PropTypes.number
    },

    render() {
        const labelStyle = {
            fontSize: 12,
            textAnchor: "middle",
            fill: "#838383"
        };
        const detailStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd"
        };

        const valueWidth = (this.props.valWidth) ? this.props.valWidth : 40;
        const rectWidth = this.props.width - valueWidth;
        const valXPos = rectWidth + 3; // padding

        const format = _.has(this.props, "format") ? this.props.format : ".2f";
        const maxStr = d3.format(format)(this.props.max);
        const minStr = d3.format(format)(this.props.min);

        let valueList = null;
        let labelYPos;
        if (this.props.values) {
            labelYPos = parseInt(this.props.height / 4, 10);
            valueList = (
                <ValueList
                    style={{fill: "none", stroke: "none"}}
                    values={this.props.values}
                    width={rectWidth} />
            );
        } else {
            labelYPos = parseInt(this.props.height / 2, 10);
        }

        return (
            <g>
                <rect
                    x="0"
                    y="0"
                    width={rectWidth}
                    height={this.props.height}
                    style={{fill: "none", stroke: "none"}} />
                <text
                    x={parseInt(rectWidth / 2, 10)}
                    y={labelYPos}
                    style={labelStyle}>
                    {this.props.label}
                </text>
                <g
                    transform={`translate(0,${labelYPos + 2})`} >
                    {valueList}
                </g>
                <text
                    x={valXPos}
                    y={0}
                    dy="1.2em"
                    style={detailStyle} >
                    {maxStr}
                </text>
                <text
                    x={valXPos}
                    y={this.props.height}
                    style={detailStyle}>
                    {minStr}
                </text>
            </g>
        );
    }
});
