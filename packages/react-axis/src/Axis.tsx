/**
 *  Copyright (c) 2018, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import * as React from "react";

import ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { format } from "d3-format";
import { scaleLinear, scaleLog, scalePow, ScaleLinear } from "d3-scale";

import { Tick } from "./Tick";
import "./Axis.css";

const defaultAxisStyle: AxisStyle = {
    label: {
        stroke: "none",
        fill: "#8B7E7E", // Default label color
        fontWeight: 100,
        fontSize: 12,
        font: '"Goudy Bookletter 1911", sans-serif"',
        pointerEvents: "none"
    },
    values: {
        stroke: "none",
        fill: "#8B7E7E", // Default values color
        fontWeight: 100,
        fontSize: 11,
        font: '"Goudy Bookletter 1911", sans-serif"'
    },
    ticks: {
        fill: "none",
        stroke: "#C0C0C0"
    },
    axis: {
        fill: "none",
        stroke: "#C0C0C0",
        strokeWidth: 0.5
    }
};

export type AxisStyle = {
    label: React.CSSProperties;
    axis: React.CSSProperties;
    values: React.CSSProperties;
    ticks: React.CSSProperties;
};

export type AxisProps = {
    standalone: boolean;
    position: "left" | "right" | "top" | "bottom";
    width: number;
    height: number;
    min: number;
    max: number;
    format: string;
    tickCount: number;
    tickSize: number;
    tickExtend: number;
    tickFormatSpecifier: string;
    margin: number;
    type: string;
    exponent: number;
    label: string;
    labelPosition: number;
    absolute: boolean;
    angled?: boolean;
    hideAxisLine?: boolean;
    showGrid?: boolean;
    style?: AxisStyle;
};

/**
 * A basic Axis component rendered into SVG. The component can be aligned using the
 * `position` prop, to display it above, below, left or right of a chart or other
 * visualization. Scaling of the axis is done with the `min` and `max` props. The scale
 * type can be "linear" or "log", controlled with the `type` prop.
 *
 * Overall size of the SVG component is done with `width` and `height` and an `offset`
 * controls how inset the rendering of the axis will be from this rectangle. Note that
 * the default `margin` is currently 10, so depending on your application
 * you may want to explicitly set this to 0.
 *
 * You can also control the number of ticks with `tickCount` (for linear scales)
 * and the size of the ticks with `tickSize`.
 * 
 * According to d3, the specified tick count is only a hint. The scale may return 
 * more or fewer values depending on the domain.
 */
export class Axis extends React.Component<AxisProps> {
    static defaultProps: Partial<AxisProps> = {
        width: 100,
        height: 100,
        tickCount: 10,
        tickSize: 5,
        tickExtend: 0,
        margin: 10,
        type: "linear",
        exponent: 2,
        standalone: false,
        labelPosition: 50,
        absolute: false,
        angled: false,
        hideAxisLine: false,
        showGrid: false,
        style: defaultAxisStyle
    };

    constructor(props: AxisProps) {
        super(props);
    }

    renderAxisLabel() {
        const { width, height, position, labelPosition, style } = this.props;
        const labelStyle = _.merge(
            true,
            defaultAxisStyle.label,
            this.props.style.label ? this.props.style.label : {}
        );
        let translate;
        let rotate = `rotate(0)`;
        let anchor = "start";
        switch (position) {
            case "left":
                translate = `translate(${width - labelPosition},5)`;
                rotate = `rotate(-90)`;
                anchor = "end";
                break;
            case "right":
                translate = `translate(${labelPosition},5)`;
                rotate = `rotate(-90)`;
                anchor = "end";
                break;
            case "top":
                translate = `translate(5, ${height - labelPosition})`;
                break;
            case "bottom":
                translate = `translate(5, ${labelPosition})`;
                break;
            default:
        }
        return (
            <g transform={translate}>
                <text transform={rotate} textAnchor={anchor} style={labelStyle}>
                    {this.props.label}
                </text>
            </g>
        );
    }

    renderAxisLine() {
        const p = this.props.position;
        const axisStyle = _.merge(
            true,
            defaultAxisStyle.axis,
            this.props.style.axis ? this.props.style.axis : {}
        );
        if (!this.props.hideAxisLine) {
            if (p === "left" || p === "right") {
                return (
                    <line
                        key="axis"
                        className="axis"
                        style={axisStyle}
                        x1={p === "left" ? this.props.width : 0}
                        y1={this.props.margin}
                        x2={p === "left" ? this.props.width : 0}
                        y2={this.props.height - this.props.margin}
                    />
                );
            } else {
                return (
                    <line
                        key="axis"
                        className="axis"
                        style={axisStyle}
                        x1={this.props.margin}
                        y1={p === "bottom" ? 0 : this.props.height}
                        x2={this.props.width - this.props.margin}
                        y2={p === "bottom" ? 0 : this.props.height}
                    />
                );
            }
        }
    }

    renderAxisTicks() {
        const p = this.props.position;

        let scale: ScaleLinear<number, number>;
        switch (this.props.type.toLowerCase()) {
            case "linear":
                scale = scaleLinear()
                    .domain([this.props.min, this.props.max])
                    .range(
                        p === "left" || p === "right"
                            ? [this.props.height - this.props.margin * 2, 0]
                            : [0, this.props.width - this.props.margin * 2]
                    );
                break;
            case "log":
                scale = scaleLog()
                    .domain([this.props.min, this.props.max])
                    .range(
                        p === "left" || p === "right"
                            ? [this.props.height - this.props.margin * 2, 0]
                            : [0, this.props.width - this.props.margin * 2]
                    );
                break;
            case "power":
                scale = scalePow()
                    .exponent(this.props.exponent)
                    .domain([this.props.min, this.props.max])
                    .range(
                        p === "left" || p === "right"
                            ? [this.props.height - this.props.margin * 2, 0]
                            : [0, this.props.width - this.props.margin * 2]
                    );
                break;
            default:
        }

        const tickStyle = {
            ticks: _.merge(
                true,
                defaultAxisStyle.ticks,
                this.props.style.ticks ? this.props.style.ticks : {}
            ),
            values: _.merge(
                true,
                defaultAxisStyle.values,
                this.props.style.values ? this.props.style.values : {}
            )
        };
        
        return scale.ticks(this.props.tickCount).map((tickValue, tickIndex) => {
            const tickPosition = scale(tickValue) + this.props.margin;
            const tickFormatSpecifier = this.props.tickFormatSpecifier;
            
            // Get a d3 format function, either from the string the user
            // supplied in the format prop, or ask the scale for its
            // suggestion
            const d3Format: (n: number) => string = this.props.format
                ? format(this.props.format)
                : scale.tickFormat(this.props.tickCount, tickFormatSpecifier);
            
            // The user can specify the values all be positive
            const absolute = this.props.absolute;
            
            const formatter = d => (absolute ? d3Format(Math.abs(d)) : d3Format(d));
            const label = formatter(tickValue);

            return (
                <Tick
                    id={`tick-${tickIndex}`}
                    key={tickValue}
                    align={this.props.position}
                    label={label}
                    labelAlign="center"
                    position={tickPosition}
                    size={this.props.tickSize}
                    tickExtend={this.props.tickExtend}
                    width={this.props.width}
                    height={this.props.height}
                    angled={this.props.angled}
                    style={tickStyle}
                />
            );
        });
    }

    renderAxis() {
        return (
            <g>
                {this.renderAxisLine()}
                <ReactCSSTransitionGroup
                    component="g"
                    transitionName="ticks"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {this.renderAxisTicks()}
                </ReactCSSTransitionGroup>
                {this.renderAxisLabel()}
            </g>
        );
    }

    render() {
        if (this.props.standalone) {
            return (
                <svg height={this.props.height} width={this.props.width}>
                    {this.renderAxis()}
                </svg>
            );
        } else {
            return this.renderAxis();
        }
    }
}
