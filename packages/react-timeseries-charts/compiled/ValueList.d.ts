/// <reference types="react" />
import * as React from "react";
import { LabelValueList } from "./types";
import { InfoBoxStyle } from "./style";
export declare type ValueListProps = {
    align?: "center" | "left";
    values: LabelValueList;
    style?: InfoBoxStyle;
    width?: number;
    height?: number;
};
export declare class ValueList extends React.Component<ValueListProps> {
    static defaultProps: Partial<ValueListProps>;
    render(): JSX.Element;
}
