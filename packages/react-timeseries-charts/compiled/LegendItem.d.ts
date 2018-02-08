/// <reference types="react" />
import * as React from "react";
import { ElementStyle } from "./style";
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
    symbolWidth: number;
    symbolHeight: number;
    symbolStyle: ElementStyle;
    labelStyle: ElementStyle;
    valueStyle: ElementStyle;
    onSelectionChange: (key: string) => any;
    onHighlightChange: (key: string) => any;
};
export declare class LegendItem extends React.Component<LegendItemProps> {
    handleClick(e: React.MouseEvent<HTMLDivElement>, key: string): void;
    handleHover(e: React.MouseEvent<HTMLDivElement>, key: string): void;
    handleHoverLeave(): void;
    renderLine(style: ElementStyle): JSX.Element;
    renderSwatch(style: ElementStyle): JSX.Element;
    renderDot(style: ElementStyle): JSX.Element;
    render(): JSX.Element;
}
