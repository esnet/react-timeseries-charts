/// <reference types="react" />
import * as React from "react";
import { TimeRange } from "pondjs";
import { LabelValueList } from "./types";
import { ScaleTime } from "d3-scale";
import { ScalerFunction } from "./interpolators";
export declare type StyleTargets = {
    labels: any;
    axis: any;
};
export declare type StyleTargetKeys = keyof StyleTargets;
export declare type TimeAxisStyleType = {
    [K in StyleTargetKeys]: object;
};
export declare enum ShowGridPosition {
    Over = "OVER",
    Under = "UNDER",
}
export declare type ChartContainerProps = {
    children: any;
    timeRange: TimeRange;
    timezone?: string;
    width?: number;
    minTime?: Date;
    maxTime?: Date;
    timeFormat?: string;
    timeAxisStyle?: any;
    timeAxisAngledLabels?: boolean;
    enablePanZoom?: boolean;
    enableDragZoom?: boolean;
    minDuration?: number;
    transition?: number;
    padding?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    showGrid?: boolean;
    showGridPosition?: ShowGridPosition;
    trackerTime?: Date;
    trackerInfo?: LabelValueList | string;
    trackerInfoWidth?: number;
    trackerInfoHeight?: number;
    onTrackerChanged?: (time: Date, number: (t: any) => number) => any;
    onTimeRangeChanged?: (timerange: TimeRange) => any;
    onBackgroundClick?: () => any;
    onChartResize?: () => any;
    onMouseMove?: (x: number, y: number) => any;
    timeScale?: ScaleTime<number, number>;
    yScale?: ScalerFunction;
    titleHeight?: number;
    title?: string;
    timeAxisHeight?: number;
    titleStyle?: any;
};
export declare class ChartContainer extends React.Component<ChartContainerProps> {
    static defaultProps: Partial<ChartContainerProps>;
    leftWidth: number;
    rightWidth: number;
    timeScale: ScaleTime<number, number>;
    svg: SVGElement;
    constructor(props: any);
    handleTrackerChanged(t: Date): void;
    handleTimeRangeChanged(timerange: TimeRange): void;
    handleMouseMove(x: any, y: any): void;
    handleMouseOut(): void;
    handleBackgroundClick(): void;
    handleZoom(timerange: TimeRange): void;
    render(): JSX.Element;
}
