/// <reference types="react" />
import * as React from "react";
import { ScaleTime, ScaleLinear, ScaleLogarithmic } from "d3-scale";
import { ScalerFunction } from "./interpolators";
export declare type Scale = ScaleLogarithmic<number, number> | ScaleLinear<number, number> | ScaleLogarithmic<number, number>;
export declare enum ScaleType {
    Linear = "LINEAR",
    Power = "POWER",
    Log = "LOG",
}
export declare type AxisProps = {
    type: ScaleType;
    id: string;
    max: number;
    min: number;
    transition?: number;
    height: number;
    width: number;
};
export declare type ChartProps = {
    key: string | number;
    width: number;
    height: number;
    timeScale?: ScaleTime<number, number>;
    yScale?: ScalerFunction;
    timeFormat?: string;
};
export declare type ChartsProps = {
    children?: any;
};
export declare class Charts extends React.Component<ChartsProps> {
    render(): JSX.Element;
}
