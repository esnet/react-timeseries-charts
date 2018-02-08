/// <reference types="react" />
import * as React from "react";
export declare type ValueAxisProps = {
    value?: string | number;
    detail?: string;
    width?: number;
    height?: number;
};
export declare class ValueAxis extends React.Component<ValueAxisProps> {
    render(): JSX.Element;
}
