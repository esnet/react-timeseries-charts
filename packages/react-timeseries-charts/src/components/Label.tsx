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

export type LabelProps = {
    label: string,
    align?: "center" | "left",
    style?: object,
    width?: number,
    height?: number
};

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

export class Label extends React.Component<LabelProps> {

    static defaultProps: Partial<LabelProps> = {
        align: "center",
        width: 100,
        height: 100,
        style: { fill: "#FEFEFE", stroke: "#DDD", opacity: 0.8, pointerEvents: "none" }
    };

    render() {
        const { label, style, align, width, height } = this.props;

        const tstyle = align === "center" ? textStyleCentered : textStyle;
        const posx = align === "center" ? Math.round(width / 2) : 10;
        const text = (
            <text x={posx} y={5} dy="1.2em" style={tstyle}>
                {label}
            </text>
        );
        const box = <rect x={0} y={0} style={style} width={width} height={height} />;
        return (
            <g>
                {box}
                {text}
            </g>
        );
    }
};
