/// <reference types="react" />
import * as React from "react";
import { TimeSeries, Event, Key } from "pondjs";
import { ChartProps } from "./Charts";
import { EventChartStyle } from "./style";
export declare type EventChartProps = ChartProps & {
    series: TimeSeries<Key>;
    label?: string | ((...args: any[]) => any);
    size?: number;
    spacing?: number;
    hoverMarkerWidth?: number;
    textOffsetX?: number;
    textOffsetY?: number;
    visible?: boolean;
    style?: EventChartStyle;
    onSelectionChange?: (e: Event<Key>) => any;
    onMouseOver?: (e: Event<Key>) => any;
    onMouseLeave?: (b: boolean) => any;
};
export declare type EventChartState = {
    hover: any;
};
export declare class EventChart extends React.Component<EventChartProps, EventChartState> {
    static defaultProps: {
        visible: boolean;
        size: number;
        spacing: number;
        textOffsetX: number;
        textOffsetY: number;
        hoverMarkerWidth: number;
    };
    hover: Event<Key>;
    constructor(props: EventChartProps);
    onMouseOver(e: React.MouseEvent<SVGRectElement>, event: Event<Key>): void;
    onMouseLeave(): void;
    handleClick(e: React.MouseEvent<SVGRectElement>, event: Event<Key>): void;
    render(): JSX.Element;
}
