/// <reference types="react" />
import * as React from "react";
import { ScaleTime } from "d3-scale";
import ScaleInterpolator, { ScalerFunction } from "./interpolators";
import { LabelValueList } from "./types";
export declare type ChartRowProps = {
    children?: any;
    width?: number;
    height?: number;
    timeScale?: ScaleTime<number, number>;
    trackerTime?: Date;
    trackerTimeFormat?: string;
    timeFormat?: string;
    trackerShowTime?: boolean;
    trackerInfoWidth?: number;
    trackerInfoHeight?: number;
    trackerInfoValues?: LabelValueList | string;
    leftAxisWidths?: number[];
    rightAxisWidths?: number[];
    transition: number;
};
export declare type ChartRowState = {
    yAxisScalerMap?: {
        [key: string]: ScalerFunction;
    };
    clipId?: string;
    clipPathURL?: string;
};
export declare type ScalarMap = {
    [id: string]: (v: number) => number;
};
export declare type ElementMap = {
    [id: string]: React.ReactElement<any>;
};
export declare class ChartRow extends React.Component<ChartRowProps, ChartRowState> {
    static defaultProps: Partial<ChartRowProps>;
    scaleInterpolatorMap: {
        [key: string]: ScaleInterpolator;
    };
    constructor(props: ChartRowProps);
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: ChartRowProps): void;
    render(): JSX.Element;
}
