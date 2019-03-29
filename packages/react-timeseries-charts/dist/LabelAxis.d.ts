import * as React from "react";
export declare type LabelAxisProps = {
    label: string;
    hideScale?: boolean;
    values: {
        label?: string;
        value?: number | string;
    }[];
    valWidth?: number;
    max: number;
    min: number;
    format?: string;
    width?: number;
    height?: number;
};
export declare class LabelAxis extends React.Component<LabelAxisProps> {
    static defaultProps: Partial<LabelAxisProps>;
    renderAxis(): JSX.Element;
    render(): JSX.Element;
}
