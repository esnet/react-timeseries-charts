/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import * as React from "react";

import { LabelValueList } from "./types";
import { InfoBoxStyle, defaultInfoBoxStyle as defaultStyle } from "./style";

export type BoxProps = {
    align?: "center" | "left";
    style?: InfoBoxStyle;
    width?: number;
    height?: number;
};

export type InfoBoxProps = BoxProps & {
    info: string | LabelValueList;
};

export type LabelProps = BoxProps & {
    label: string;
};

export type ValueListProps = BoxProps & {
    values: LabelValueList;
};

/**
 * Renders a single label surrounded by a box of size `width` and `height`
 */
export class Label extends React.Component<LabelProps> {
    static defaultProps: Partial<LabelProps> = {
        align: "center",
        width: 100,
        height: 100,
        style: defaultStyle
    };

    render() {
        const { label, style, align, width, height } = this.props;

        const textStyle = {
            ...style.text,
            textAnchor: "left",
            pointerEvents: "none"
        };
        const textStyleCentered = {
            ...style.text,
            textAnchor: "middle",
            pointerEvents: "none"
        };

        const labelStyle = align === "center" ? textStyleCentered : textStyle;
        const boxStyle = style.box;
        const posx = align === "center" ? Math.round(width / 2) : 10;

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
    }
}

/**
 * Renders a box of size `width` and `height` and places a list of label
 * value pairs within that box, `align`ed to the left or center within
 * the box. The `style` prop is a CSS properties object that will be
 * applied to the box.
 */
export class ValueList extends React.Component<ValueListProps> {
    static defaultProps: Partial<ValueListProps> = {
        align: "center",
        width: 100,
        height: 100,
        style: defaultStyle
    };

    render() {
        const { align, style, width, height } = this.props;
        const textStyle = {
            ...style.text,
            textAnchor: "left",
            pointerEvents: "none"
        };
        const textStyleCentered = {
            ...style.text,
            textAnchor: "middle",
            pointerEvents: "none"
        };
        const values = this.props.values.map((item, i) => {
            if (align === "left") {
                return (
                    <g key={i}>
                        <text x={10} y={5} dy={`${(i + 1) * 1.2}em`} style={textStyle}>
                            <tspan style={{ fontWeight: 700 }}>{`${item.label}: `}</tspan>
                            <tspan>{`${item.value}`}</tspan>
                        </text>
                    </g>
                );
            }
            const posx = Math.round(this.props.width / 2);
            return (
                <g key={i}>
                    <text x={posx} y={5} dy={`${(i + 1) * 1.2}em`} style={textStyleCentered}>
                        <tspan style={{ fontWeight: 700 }}>{`${item.label}: `}</tspan>
                        <tspan>{`${item.value}`}</tspan>
                    </text>
                </g>
            );
        });
        const box = <rect style={style.box} x={0} y={0} width={width} height={height} />;
        return (
            <g>
                {box}
                {values}
            </g>
        );
    }
}

/**
 * Renders a box of size `width` and `height` and places a list of label
 * value pairs within that box, `align`ed to the left or center within
 * the box. The `style` prop is a CSS properties object that will be
 * applied to the box.
 */
export class InfoBox extends React.Component<InfoBoxProps> {
    static defaultProps: Partial<InfoBoxProps> = {
        align: "center",
        width: 150,
        height: 100,
        style: defaultStyle
    };

    render() {
        const { info, ...props } = this.props;
        if (_.isString(info)) {
            return <Label label={info} {...props} />;
        } else {
            return <ValueList values={info} {...props} />;
        }
    }
}
