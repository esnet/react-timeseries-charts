/// <reference types="react" />
import * as React from "react";
export declare type TickProps = {
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
};
export declare class Tick extends React.Component<TickProps> {
    constructor(props: TickProps);
    getDefaultProps(): Partial<TickProps>;
    renderLabel(label: string, isTop: boolean, tickSize: number): JSX.Element;
    renderVerticalTick(id: string, label: string, labelPosition: number, size: number, extend: number, isTop: boolean): JSX.Element;
    renderHorizontalTick(id: string, label: string, labelPosition: number, size: number, extend: number, isLeft: boolean): JSX.Element;
    render(): JSX.Element;
}
