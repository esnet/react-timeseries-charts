/// <reference types="react" />
import 'moment-timezone';
import * as React from "react";
import "./Axis.css";
export declare type TimeAxisProps = {
    standalone: boolean;
    beginTime: Date;
    endTime: Date;
    align?: "center" | "left";
    label?: string;
    width?: number;
    height?: number;
    margin?: number;
    format?: ("second" | "minute" | "hour" | "day" | "month" | "year" | "duration") | ((...args: any[]) => any);
    tickMinor?: number;
    tickMajor?: number;
    tickExtend?: number;
    smoothTransition?: boolean;
    position?: "left" | "right" | "top" | "bottom";
    labelPosition?: number;
    labelStyle?: React.CSSProperties;
    timezone?: string;
    transition?: boolean;
};
export declare class TimeAxis extends React.Component<TimeAxisProps> {
    static defaultProps: {
        width: number;
        height: number;
        tickCount: number;
        tickMajor: number;
        tickMinor: number;
        tickExtend: number;
        margin: number;
        standalone: boolean;
        labelPosition: number;
        labelStyle: {
            fill: string;
            stroke: string;
            pointerEvents: string;
        };
        absolute: boolean;
        smoothTransition: boolean;
    };
    renderAxisLabel(): JSX.Element;
    renderAxisLine(): JSX.Element;
    renderAxisTicks(): any[];
    renderAxis(): JSX.Element;
    render(): JSX.Element;
}
