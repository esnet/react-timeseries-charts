/// <reference types="react" />
import * as React from "react";
export declare enum LegendItemType {
    Swatch = "SWATCH",
    Line = "LINE",
    Dot = "DOT",
}
export declare type LegendItemProps = {
    itemKey: string;
    type: LegendItemType;
    label: string;
    value: string;
    symbolType: LegendItemType;
    symbolWidth: number;
    symbolHeight: number;
    symbolStyle: React.CSSProperties;
    labelStyle: React.CSSProperties;
    valueStyle: React.CSSProperties;
    onSelectionChange: (key: string) => any;
    onHighlightChange: (key: string) => any;
};
export declare class LegendItem extends React.Component<LegendItemProps> {
    handleClick(e: React.MouseEvent<HTMLDivElement>, key: string): void;
    handleHover(e: React.MouseEvent<HTMLDivElement>, key: string): void;
    handleHoverLeave(): void;
    renderLine(style: React.CSSProperties): JSX.Element;
    renderSwatch(style: React.CSSProperties): JSX.Element;
    renderDot(style: React.CSSProperties): JSX.Element;
    render(): JSX.Element;
}
