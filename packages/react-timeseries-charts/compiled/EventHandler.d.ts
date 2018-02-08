/// <reference types="react" />
import * as React from "react";
import { ScaleTime } from "d3-scale";
import { TimeRange } from "pondjs";
export declare type EventHandlerProps = {
    enablePanZoom?: boolean;
    scale: ScaleTime<number, number>;
    width: number;
    height: number;
    minDuration?: number;
    minTime?: Date;
    maxTime?: Date;
    onZoom?: (timerange: TimeRange) => any;
    onMouseMove?: (d: Date) => any;
    onMouseOut?: () => any;
    onMouseClick?: () => any;
};
export declare type EventHandlerState = {
    isPanning: boolean;
    initialPanBegin: any;
    initialPanEnd: any;
    initialPanPosition: number[];
};
export declare class EventHandler extends React.Component<EventHandlerProps, EventHandlerState> {
    static defaultProps: Partial<EventHandlerProps>;
    eventRect: SVGRectElement;
    constructor(props: EventHandlerProps);
    getOffsetMousePosition(e: React.MouseEvent<SVGGElement>): number[];
    handleScrollWheel(e: React.WheelEvent<SVGGElement>): void;
    handleMouseDown(e: React.MouseEvent<SVGGElement>): boolean;
    handleMouseUp(e: React.MouseEvent<SVGGElement>): void;
    handleMouseOut(e: React.MouseEvent<SVGGElement>): void;
    handleMouseMove(e: React.MouseEvent<SVGGElement>): void;
    render(): JSX.Element;
}
