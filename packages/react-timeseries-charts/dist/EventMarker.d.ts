/// <reference types="react" />
import * as React from "react";
import { ScaleTime } from "d3-scale";
import { Event, Key } from "pondjs";
import { ChartProps } from "./Charts";
import { ScalerFunction } from "./interpolators";
import { EventMarkerStyle } from "./style";
import { LabelValueList } from "./types";
export declare type EventMarkerProps = ChartProps & {
    event: Event<Key>;
    column?: string;
    type?: "point" | "flag";
    info?: LabelValueList | string;
    style?: EventMarkerStyle;
    infoWidth?: number;
    infoHeight?: number;
    infoTimeFormat?: ((date: Date) => string) | string;
    markerLabel?: string;
    markerLabelAlign?: "left" | "right" | "top" | "bottom";
    markerRadius?: number;
    yValueFunc?: (...args: any[]) => any;
    offsetX?: number;
    offsetY?: number;
    timeScale: ScaleTime<number, number>;
    yScale?: ScalerFunction;
};
export declare class EventMarker extends React.Component<EventMarkerProps> {
    static defaultProps: Partial<EventMarkerProps>;
    renderTime(event: Event<Key>): JSX.Element;
    renderMarker(event: Event<Key>, column: string, info: string | LabelValueList): JSX.Element;
    render(): JSX.Element;
}
