/// <reference types="react" />
import * as React from "react";
import { LegendItemType } from "./LegendItem";
import { Styler } from "./styler";
import { LegendStyle, CategoryStyle, StyleMode } from "./style";
export declare type LegendCategory = {
    key: string;
    label: string;
    value: string;
    disabled?: boolean;
    style?: object;
    labelStyle?: object;
};
export declare type LegendProps = {
    type?: LegendItemType;
    align?: "left" | "right";
    style?: LegendStyle | ((column: string) => CategoryStyle) | Styler;
    categories: LegendCategory[];
    symbolWidth?: number;
    symbolHeight?: number;
    highlight?: string;
    selection?: string;
    stack?: boolean;
    onSelectionChange?: (...args: any[]) => any;
    onHighlightChange?: (...args: any[]) => any;
};
export declare class Legend extends React.Component<LegendProps> {
    static defaultProps: Partial<LegendProps>;
    providedStyle(category: LegendCategory, type: LegendItemType): CategoryStyle;
    styleMode(category: LegendCategory): StyleMode;
    symbolStyle(category: LegendCategory): true & {
        [mode: string]: React.CSSProperties;
        normal: React.CSSProperties;
        highlighted: React.CSSProperties;
        selected: React.CSSProperties;
        muted: React.CSSProperties;
    } & React.CSSProperties;
    labelStyle(category: LegendCategory): true & {
        [mode: string]: React.CSSProperties;
        normal: React.CSSProperties;
        highlighted: React.CSSProperties;
        selected: React.CSSProperties;
        muted: React.CSSProperties;
    } & React.CSSProperties;
    valueStyle(category: LegendCategory): true & {
        [mode: string]: React.CSSProperties;
        normal: React.CSSProperties;
        highlighted: React.CSSProperties;
        selected: React.CSSProperties;
        muted: React.CSSProperties;
    } & React.CSSProperties;
    render(): JSX.Element;
}
