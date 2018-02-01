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

type ValueAxisProps = {
    value?: string | number,
    detail?: string,
    width?: number,
    height?: number
};

export default class ValueAxis extends React.Component<ValueAxisProps> {
    render() {
        const { width, height, value, detail } = this.props;
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
                    x="0"
                    y="0"
                    width={width}
                    height={height}
                    style={{ fill: "none", stroke: "none" }}
                />
                <text key="value" x={Math.round(width / 2)} y={height / 2} style={labelStyle}>
                    {value}
                </text>
                <text
                    key="detail"
                    x={Math.round(width / 2)}
                    y={height / 2}
                    dy="1.2em"
                    style={detailStyle}
                >
                    {detail}
                </text>
            </g>
        );
    }
};
