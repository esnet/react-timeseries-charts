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
 * Renders a list of values in svg
 *
 *      +----------------+
 *      | Max 100 Gbps   |
 *      | Avg 26 Gbps    |
 *      +----------------+
 */

export default React.createClass({

    displayName: "ValueList",

    getDefaultProps() {
        return {
            align: "center",
            width: 100,
            height: 100,
            style: {fill: "#FEFEFE", stroke: "#DDD", opacity: 0.8}
        };
    },

    propTypes: {

        align: React.PropTypes.oneOf(["center", "left"]),

        /**
         * An array of label value pairs to render
         */
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
            fill: "#b0b0b0"
        };
        const textStyleCentered = {
            fontSize: 11,
            textAnchor: "middle",
            fill: "#bdbdbd"
        };

        const values = this.props.values.map((item, i) => {
            if (this.props.align === "left") {
                return (
                    <g key={i}>
                        <text x={10} y={5} dy={`${(i + 1) * 1.2}em`} style={textStyle}>
                            <tspan style={{fontWeight: 700}}>{`${item.label}: `}</tspan>
                            <tspan>{`${item.value}`}</tspan>
                        </text>
                    </g>
                );
            } else {
                const posx = parseInt(this.props.width / 2, 10);
                return (
                    <g key={i}>
                        <text x={posx} y={5} dy={`${(i + 1) * 1.2}em`} style={textStyleCentered}>
                            <tspan style={{fontWeight: 700}}>{`${item.label}: `}</tspan>
                            <tspan>{`${item.value}`}</tspan>
                        </text>
                    </g>
                );
            }
        });

        const box = (
            <rect
                style={this.props.style}
                x={0} y={0}
                width={this.props.width} height={this.props.height} />
        );

        return (
            <g>
                {box}
                {values}
            </g>
        );
    }
});
