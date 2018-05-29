/// <reference types="react" />
import * as React from "react";
import "./Axis.css";
export declare type AxisStyle = {
    label: React.CSSProperties;
    axis: React.CSSProperties;
    values: React.CSSProperties;
    ticks: React.CSSProperties;
};
export declare type AxisProps = {
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
    style?: AxisStyle;
};
export declare class Axis extends React.Component<AxisProps> {
    static defaultProps: Partial<AxisProps>;
    constructor(props: AxisProps);
    renderAxisLabel(): JSX.Element;
    renderAxisLine(): JSX.Element;
    renderAxisTicks(): JSX.Element[];
    renderAxis(): JSX.Element;
    render(): JSX.Element;
}
