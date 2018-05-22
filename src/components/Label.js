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
import PropTypes from "prop-types";
import merge from "merge";

const defaultBoxStyle = {
    fill: "#FEFEFE",
    stroke: "#DDD",
    opacity: 0.8
};

const defaultTextStyle = {
    fontSize: 11,
    textAnchor: "left",
    fill: "#b0b0b0",
    pointerEvents: "none"
};

const defaultTextStyleCentered = {
    fontSize: 11,
    textAnchor: "middle",
    fill: "#bdbdbd",
    pointerEvents: "none"
};

function mergeStyles(style, isCentered) {
    return {
        boxStyle: merge(true, defaultBoxStyle, style.box ? style.box : {}),
        labelStyle: merge(
            true,
            isCentered ? defaultTextStyleCentered : defaultTextStyle,
            style.label ? style.label : {}
        )
    };
}

/**
 * Renders a simple label surrounded by a box within in svg
 *
 *      +----------------+
 *      | My label       |
 *      |                |
 *      +----------------+
 */

const Label = ({ label, style, align, width, height }) => {
    const { boxStyle, labelStyle } = mergeStyles(style, align === "center");

    const posx = align === "center" ? parseInt(width / 2, 10) : 10;

    const text = (
        <text x={posx} y={5} dy="1.2em" style={labelStyle}>
            {label}
        </text>
    );

    const box = <rect x={0} y={0} style={boxStyle} width={width} height={height} />;

    return (
        <g>
            {box}
            {text}
        </g>
    );
};

Label.defaultProps = {
    align: "center",
    width: 100,
    height: 100,
    pointerEvents: "none"
};

Label.propTypes = {
    /**
     * Where to position the label, either "left" or "center" within the box
     */
    align: PropTypes.oneOf(["center", "left"]),

    /**
     * The label to render
     */
    label: PropTypes.string.isRequired,

    /**
     * The style of the label. This is the inline CSS applied directly
     * to the label box
     */
    style: PropTypes.object, // eslint-disable-line

    /**
     * The width of the rectangle to render into
     */
    width: PropTypes.number,

    /**
     * The height of the rectangle to render into
     */
    height: PropTypes.number
};

export default Label;
