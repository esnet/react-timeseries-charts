/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";

/**
 * Renders a simple label surrounded by a box within in svg
 *
 *      +----------------+
 *      | My label       |
 *      |                |
 *      +----------------+
 */

export default React.createClass({

    displayName: "Label",

    getDefaultProps() {
        return {
            align: "center",
            width: 100,
            height: 100,
            pointerEvents: "none",
            style: {fill: "#FEFEFE", stroke: "#DDD", opacity: 0.8}
        };
    },

    propTypes: {

        align: React.PropTypes.oneOf(["center", "left"]),

        /**
         * The label to render
         */
        label: React.PropTypes.string.isRequired,

        /**
         * The width of the rectangle to render into
         */
        width: React.PropTypes.number,

        /**
         * The height of the rectangle to render into
         */
        height: React.PropTypes.number
    },

    render() {
        const textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#b0b0b0",
            pointerEvents: "none"
        };

        const textStyleCentered = {
            fontSize: 11,
            textAnchor: "middle",
            fill: "#bdbdbd",
            pointerEvents: "none"
        };

        const style = this.props.align === "center" ?
            textStyleCentered : textStyle;

        const posx = this.props.align === "center" ?
            parseInt(this.props.width / 2, 10) : 10;

        const label = (
            <text
                x={posx}
                y={5}
                dy="1.2em"
                style={style}>
                {this.props.label}
            </text>
        );

        const box = (
            <rect
                style={this.props.style}
                x={0}
                y={0}
                width={this.props.width}
                height={this.props.height} />
        );

        return (
            <g>
                {box}
                {label}
            </g>
        );
    }
});
