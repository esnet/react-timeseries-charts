/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * Renders a 'axis' that display a label for a current tracker value:
 * ```
 *      ----+----------------+
 *          |     56.2G      |
 *          |      bps       |
 *          |                |
 *      ----+----------------+
 * ```
 * This would be used when you have many rows of data and the user is required
 * to interact with the data to see actual values. You would use this at the
 * end of the row and supply it with the current value. See the cycling example
 * for how that would all work.
 */

const defaultStyle = {
    label: {
        // fill: "#666",
        fill: '#FF0000',
        fontSize: 20,
        textAnchor: "middle"
    },
    detail: {
        fontSize: 12,
        textAnchor: "middle",
        // fill: "#9a9a9a"
        fill: "#008000"
    }
};

const ValueAxis = ({ width, height, value, detail, style }) => {

    const labelStyle = style.label ? style.label : defaultStyle.label;
    const detailStyle = style.detail ? style.detail : defaultStyle.detail;

    return (
        <g>
            <rect
                key="background"
                x="0"
                y="0"
                width={width}
                height={height}
                style={{ fill: "none", stroke: "none" }}
            />
            <text key="value" x={parseInt(width / 2, 10)} y={height / 2} style={labelStyle}>
                {value}
            </text>
            <text
                key="detail"
                x={parseInt(width / 2, 10)}
                y={height / 2}
                dy="1.2em"
                style={detailStyle}
            >
                {detail}
            </text>
        </g>
    );
};

ValueAxis.propTypes = {
    /**
     * Show or hide this
     */
    visible: PropTypes.bool,

    /**
     * If values are numbers, use this format string
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Use this to show what units are being used. It will appear below
     * the value.
     */
    detail: PropTypes.string,

    /**
     * The width of the axis
     */
    width: PropTypes.number,

    /**
     * [Internal] The height of the axis
     */
    height: PropTypes.number, 
    /**
     * Object specifying the CSS by which the label axis can be styled. The object can contain:
     * "label", "detail". Each of these is an inline CSS style applied
     * to the text label and detail, respectively. 
     *
     */
    style: PropTypes.shape({
        label: PropTypes.object, // eslint-disable-line
        detail: PropTypes.object // esline-disable-line
    })
};

ValueAxis.defaultProps = {
    visible: true,
    style: defaultStyle
};

export default ValueAxis;
