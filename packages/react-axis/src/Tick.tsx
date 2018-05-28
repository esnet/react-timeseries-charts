/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as React from "react";

export type TickProps = {
    id: string;
    label: string;
    position?: number;
    size?: number;
    align?: "top" | "bottom" | "left" | "right";
    labelAlign?: "adjacent" | "center";
    tickSize?: number;
    tickExtend?: number;
    width: number;
    height: number;
    smoothTransition?: boolean;
    extend?: number;
    textStyle?: React.CSSProperties;
    angled?: boolean;
};

/**
 * Builds an axis tick mark with associated label
 */
export class Tick extends React.Component<TickProps> {
    constructor(props: TickProps) {
        super(props);
    }
    static defaultProps: Partial<TickProps> = {
        position: 0,
        size: 15,
        align: "bottom",
        labelAlign: "adjacent",
        tickSize: 15,
        tickExtend: 0,
        extend: 0,
        smoothTransition: true,
        textStyle: {
            fontSize: 11,
            fill: "#b0b0b0",
            pointerEvents: "none"
        },
        angled: false
        //transitionTime: 200
    }
    /**
     *   ___________   or __________
     *       |                |label
     *     label
     */
    renderLabel(label: string, isTop: boolean, tickSize: number) {
        const { labelAlign, textStyle, angled } = this.props;
        const baseLine = isTop ? "baseline" : "hanging";
        const rotate = angled ? `rotate(-65)` : `rotate(0)`;
        const dx = angled ? "-1.2em" : "0em";
        const dy = "0em";

        console.log("this.props render Label ", this.props);
        if (labelAlign === "adjacent") {
            const x = 2;
            const y = isTop ? -6 : 6;
            return (
                <text
                    key={`label-${label}`}
                    className="tick-label"
                    style={textStyle}
                    textAnchor="start"
                    transform={rotate}
                    x={x}
                    y={y}
                    dx={dx}
                    dy={dy}
                    alignmentBaseline={baseLine}
                >
                    {label}
                </text>
            );
        } else if (labelAlign === "center") {
            const x = 0;
            const y = isTop ? -tickSize - 3 : tickSize + 3;
            return (
                <text
                    key={`label-${label}`}
                    className="tick-label"
                    style={textStyle}
                    textAnchor="middle"
                    x={x}
                    y={y}
                    dx={dx}
                    dy={dy}
                    alignmentBaseline={baseLine}
                >
                    {label}
                </text>
            );
        }
    }
    renderVerticalTick(
        id: string,
        label: string,
        labelPosition: number,
        size: number,
        extend: number,
        isTop: boolean
    ) {
        const dir = isTop ? -1 : 1;
        const line = {
            x1: 0,
            y1: -dir * extend,
            x2: 0,
            y2: dir * size
        };
        const tickTransitionStyle = {
            transition: "transform 100ms"
        };
        const style = { stroke: "#AAA", strokeWidth: 1 };
        const groupKey = `grp-${id}}`;
        const tickKey = `tick-${id}`;
        return (
            <g style={tickTransitionStyle} key={groupKey}>
                <line key={tickKey} className="tick-line" style={style} {...line} />
                {this.renderLabel(label, isTop, size)}
            </g>
        );
    }
    renderHorizontalTick(
        id: string,
        label: string,
        labelPosition: number,
        size: number,
        extend: number,
        isLeft: boolean
    ) {
        const dir = isLeft ? -1 : 1;
        const line = {
            x1: -dir * extend,
            y1: 0,
            x2: dir * size,
            y2: 0
        };
        const { textStyle } = this.props;
        const style = { stroke: "#AAA", strokeWidth: 1 };
        const groupKey = `grp-${id}}`;
        const tickKey = `tick-${id}`;
        const rotate = this.props.angled ? `rotate(-65)` : `rotate(0)`;
        const dx = this.props.angled ? "-1.2em" : "0em";
        const dy = "0em";
        const tickTransitionStyle = {
            transition: "transform 100ms"
        };
        return (
            <g style={tickTransitionStyle} key={groupKey}>
                <line key={tickKey} className="tick-line" style={style} {...line} />
                <text
                    key={`label-${label}`}
                    className="tick-label"
                    style={textStyle}
                    transform={rotate}
                    textAnchor={isLeft ? "end" : "begin"}
                    alignmentBaseline="middle"
                    x={isLeft ? -size - 3 : size + 3}
                    y={0}
                    dx={dx}
                    dy={dy}
                >
                    {label}
                </text>
            </g>
        );
    }
    render() {
        console.log("tick.tsx");
        const {
            id,
            label,
            width,
            height,
            position,
            size = 10,
            extend = 0,
            align = "top",
            smoothTransition = false,
        } = this.props;
        const shouldTransition = false;
        const transition = "transform 100ms";
        if (align === "top" || align === "bottom") {
            const transform = `translate(${position}px, ${align === "top" ? height : 0}px)`;
            return (
                <g style={smoothTransition ? { transform, transition } : { transform }}>
                    {this.renderVerticalTick(id, label, position, size, extend, align === "top")}
                </g>
            );
        } else {
            const transform = `translate(${align === "left" ? width : 0}px,${position}px)`;
            return (
                <g style={smoothTransition ? { transform, transition } : { transform }}>
                    {this.renderHorizontalTick(id, label, position, size, extend, align === "left")}
                </g>
            );
        }
    }
}
