import * as React from "react";
import { TimeRange } from "pondjs";
import { ChartProps } from "./Charts";
export declare type MultiBrushProps = ChartProps & {
    timeRanges?: TimeRange[];
    style?: any;
    handleSize?: number;
    allowFreeDrawing?: boolean;
    onTimeRangeChanged?: (timeRange: TimeRange, brushIndex: number) => any;
    onUserMouseUp?: (brushIndex: number) => any;
    onTimeRangeClicked?: (brushIndex: number) => any;
};
export declare type MultiBrushState = {
    isBrushing?: boolean;
    brushingInitializationSite?: string;
    initialBrushBeginTime?: number;
    initialBrushEndTime?: number;
    initialBrushXYPosition?: number[];
    brushIndex?: number;
};
export declare class MultiBrush extends React.Component<MultiBrushProps, MultiBrushState> {
    static defaultProps: Partial<MultiBrushProps>;
    overlay: SVGRectElement;
    constructor(props: any);
    viewport(): TimeRange;
    handleBrushMouseDown(e: React.MouseEvent<SVGRectElement>, brushIndex: number): void;
    handleOverlayMouseDown(e: React.MouseEvent<SVGRectElement>): void;
    hasNullBrush(): boolean;
    handleMouseClick(e: React.MouseEvent<SVGRectElement>, brushIndex: number): void;
    handleHandleMouseDown(e: React.MouseEvent<SVGRectElement>, handle: string, brushIndex: number): void;
    handleMouseUp(e: React.MouseEvent<SVGRectElement>): void;
    handleMouseMove(e: React.MouseEvent<SVGRectElement>): void;
    renderOverlay(): JSX.Element;
    renderBrush(timeRange: TimeRange, index: number): JSX.Element;
    renderHandles(timeRange: TimeRange, index: number): JSX.Element;
    render(): JSX.Element;
}
