/// <reference types="react" />
import * as React from "react";
import { AxisProps } from "./Charts";
export declare type YAxisStyle = {
    label: React.CSSProperties;
    axis: React.CSSProperties;
    values: React.CSSProperties;
    ticks: React.CSSProperties;
};
export declare type YAxisProps = AxisProps & {
    label?: string;
    min: number;
    max: number;
    width: number;
    style?: YAxisStyle;
    absolute?: boolean;
    labelOffset?: number;
    format?: string;
    align?: string;
    scale?: (...args: any[]) => any;
    tickCount?: number;
    hideAxisLine?: boolean;
};
export declare class YAxis extends React.Component<YAxisProps> {
    static defaultProps: Partial<YAxisProps>;
    render(): JSX.Element;
}
