/// <reference types="react" />
import * as React from "react";
import { TimeRange } from "pondjs";
import { LabelValueList } from "./types";
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
    enablePanZoom?: boolean;
    minDuration?: number;
    transition?: number;
    showGrid?: boolean;
    showGridPosition?: ShowGridPosition;
    trackerTime?: Date;
    trackerInfo?: LabelValueList | string;
    trackerInfoWidth?: number;
    trackerInfoHeight?: number;
    onTrackerChanged?: (time: Date) => any;
    onTimeRangeChanged?: (timerange: TimeRange) => any;
    onBackgroundClick?: () => any;
};
export declare class ChartContainer extends React.Component<ChartContainerProps> {
    static defaultProps: Partial<ChartContainerProps>;
    handleMouseMove(t: Date): void;
    handleMouseOut(): void;
    handleBackgroundClick(): void;
    handleZoom(timerange: TimeRange): void;
    render(): JSX.Element;
}
