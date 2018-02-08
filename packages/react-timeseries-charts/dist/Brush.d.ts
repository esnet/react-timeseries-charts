/// <reference types="react" />
import * as React from "react";
import { TimeRange } from "pondjs";
import { ChartProps } from "./charts";
export declare type BrushProps = ChartProps & {
    style?: object;
    timeRange?: TimeRange;
    handleSize?: number;
    allowSelectionClear?: boolean;
    onTimeRangeChanged?: (d?: TimeRange) => any;
};
export declare type BrushState = {
    isBrushing?: boolean;
    brushingInitializationSite?: string;
    initialBrushBeginTime?: number;
    initialBrushEndTime?: number;
    initialBrushXYPosition?: number[];
};
export declare class Brush extends React.Component<BrushProps, BrushState> {
    static defaultProps: Partial<BrushProps>;
    overlay: SVGRectElement;
    constructor(props: BrushProps);
    viewport(): TimeRange;
    handleBrushMouseDown(e: React.MouseEvent<SVGRectElement>): void;
    handleOverlayMouseDown(e: React.MouseEvent<SVGRectElement>): void;
    handleHandleMouseDown(e: React.MouseEvent<SVGRectElement>, handle: string): void;
    handleMouseUp(e: React.MouseEvent<SVGRectElement>): void;
    handleClick(): void;
    handleMouseMove(e: React.MouseEvent<SVGGElement>): void;
    renderOverlay(): JSX.Element;
    renderBrush(): JSX.Element;
    renderHandles(): JSX.Element;
    render(): JSX.Element;
}
