import * as React from "react";
export declare type TickStyle = {
    ticks: React.CSSProperties;
    values: React.CSSProperties;
};
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
    angled?: boolean;
    style?: TickStyle;
};
export declare class Tick extends React.Component<TickProps> {
    static defaultProps: Partial<TickProps>;
    constructor(props: TickProps);
    renderLabel(label: string, isTop: boolean, isLeft: boolean, tickSize: number, direction: string): JSX.Element;
    renderVerticalTick(id: string, label: string, labelPosition: number, size: number, tickExtend: number, isTop: boolean): JSX.Element;
    renderHorizontalTick(id: string, label: string, labelPosition: number, size: number, tickExtend: number, isLeft: boolean): JSX.Element;
    render(): JSX.Element;
}
