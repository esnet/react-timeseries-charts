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

const defaultStyle: TickStyle= {
    ticks: {
        fill: "none",
        stroke: "#C0C0C0"
    },
    values: {
        stroke: "none",
        fill: "#8B7E7E", // Default value color
        fontWeight: 100,
        fontSize: 11,
        font: '"Goudy Bookletter 1911", sans-serif"'
    }
};

export type TickStyle = {
    ticks: React.CSSProperties;
    values: React.CSSProperties;
};

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
    angled?: boolean;
    style?: TickStyle;
};

/**
 * Builds an axis tick mark with associated label
 */
export class Tick extends React.Component<TickProps> {
    static defaultProps: Partial<TickProps> = {
        position: 0,
        size: 15,
        align: "bottom",
        labelAlign: "adjacent",
        tickSize: 15,
        tickExtend: 0,
        smoothTransition: true,
        style: defaultStyle,
        angled: false
    }

    constructor(props: TickProps) {
        super(props);
    }

    /**
     *   ___________   or __________
     *       |                |label
     *     label
     */
    renderLabel(
        label: string, 
        isTop: boolean, 
        isLeft: boolean, 
        tickSize: number, 
        direction: string
    ) {
        const { labelAlign, angled } = this.props;
        const baseLine = isTop ? "baseline" : "hanging";
        const rotate = angled ? `rotate(-65)` : `rotate(0)`;
        const dx = angled ? "-1.2em" : "0em";
        const dy = "0em";

        const valueStyle = _.merge(
            defaultStyle.values,
            this.props.style.values ? this.props.style.values : {}
        );

        if (direction === "horizontal") {
            return (
                <text
                    key={`label-${label}`}
                    className="tick-label"
                    style={valueStyle}
                    textAnchor={isLeft ? "end" : "begin"}
                    transform={rotate}
                    x={isLeft ? -tickSize - 3 : tickSize + 3}
                    y={0}
                    dx={dx}
                    dy={dy}
                    alignmentBaseline="middle"
                >
                    {label}
                </text>
            )
        } else if (direction === "vertical") {
            if (labelAlign === "adjacent") {
                const x = 2;
                const y = isTop ? -6 : 6;
                return (
                    <text
                        key={`label-${label}`}
                        className="tick-label"
                        style={valueStyle}
                        textAnchor={angled ? "end" : "start"}
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
                        style={valueStyle}
                        textAnchor="middle"
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
            }
        }
    }

    renderVerticalTick(
        id: string,
        label: string,
        labelPosition: number,
        size: number,
        tickExtend: number,
        isTop: boolean
    ) {
        const dir = isTop ? -1 : 1;
        const line = {
            x1: 0,
            y1: -dir * tickExtend,
            x2: 0,
            y2: dir * size
        };

        const tickTransitionStyle = {
            transition: "transform 100ms"
        };

        const tickStyle = _.merge(true, defaultStyle.ticks, this.props.style.ticks ? this.props.style.ticks : {});

        const groupKey = `grp-${id}}`;
        const tickKey = `tick-${id}`;

        return (
            <g style={tickTransitionStyle} key={groupKey}>
                <line key={tickKey} className="tick-line" style={tickStyle} {...line} />
                {this.renderLabel(label, isTop, false, size, "vertical")}
            </g>
        );
    }
    
    renderHorizontalTick(
        id: string,
        label: string,
        labelPosition: number,
        size: number,
        tickExtend: number,
        isLeft: boolean
    ) {
        const dir = isLeft ? -1 : 1;
        const line = {
            x1: -dir * tickExtend,
            y1: 0,
            x2: dir * size,
            y2: 0
        };

        const tickStyle = _.merge(true, defaultStyle.ticks, this.props.style.ticks ? this.props.style.ticks : {});

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
                <line key={tickKey} className="tick-line" style={tickStyle} {...line} />
                {this.renderLabel(label, false, isLeft, size, "horizontal")}
            </g>
        );
    }

    render() {
        const {
            id,
            label,
            width,
            height,
            position,
            size = 10,
            tickExtend = 0,
            align = "top",
            smoothTransition = false,
        } = this.props;

        const shouldTransition = false;
        const transition = "transform 100ms";
        
        if (align === "top" || align === "bottom") {
            const transform = `translate(${position}px, ${align === "top" ? height : 0}px)`;
            return (
                <g style={smoothTransition ? { transform, transition } : { transform }}>
                    {this.renderVerticalTick(id, label, position, size, tickExtend, align === "top")}
                </g>
            );
        } else {
            const transform = `translate(${align === "left" ? width : 0}px,${position}px)`;
            return (
                <g style={smoothTransition ? { transform, transition } : { transform }}>
                    {this.renderHorizontalTick(id, label, position, size, tickExtend, align === "left")}
                </g>
            );
        }
    }
}
