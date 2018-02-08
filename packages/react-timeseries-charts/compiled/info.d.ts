/// <reference types="react" />
import * as React from "react";
import { LabelValueList } from "./types";
import { InfoBoxStyle } from "./style";
export declare type BoxProps = {
    align?: "center" | "left";
    style?: InfoBoxStyle;
    width?: number;
    height?: number;
};
export declare type InfoBoxProps = BoxProps & {
    info: string | LabelValueList;
};
export declare type LabelProps = BoxProps & {
    label: string;
};
export declare type ValueListProps = BoxProps & {
    values: LabelValueList;
};
export declare class Label extends React.Component<LabelProps> {
    static defaultProps: Partial<LabelProps>;
    render(): JSX.Element;
}
export declare class ValueList extends React.Component<ValueListProps> {
    static defaultProps: Partial<ValueListProps>;
    render(): JSX.Element;
}
export declare class InfoBox extends React.Component<InfoBoxProps> {
    static defaultProps: Partial<InfoBoxProps>;
    render(): JSX.Element;
}
