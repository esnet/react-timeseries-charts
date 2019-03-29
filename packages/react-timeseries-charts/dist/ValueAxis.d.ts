import * as React from "react";
export declare type ValueAxisProps = {
    value?: string | number;
    detail?: string;
    width?: number;
    height?: number;
    visible?: boolean;
};
export declare class ValueAxis extends React.Component<ValueAxisProps> {
    static defaultProps: Partial<ValueAxisProps>;
    render(): JSX.Element;
}
