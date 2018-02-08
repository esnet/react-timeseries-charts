/// <reference types="react" />
import * as React from "react";
import { Event, Index, Time, TimeSeries, Window } from "pondjs";
import { ChartProps } from "./Charts";
import { LabelValueList } from "./types";
import { Styler } from "./styler";
import { BoxChartStyle, BoxChartChannelStyle as ChannelStyle, LevelStyle, EventMarkerStyle } from "./style";
import { ReducerFunction } from "pondjs/lib/types";
import { CSSProperties } from "react";
export declare type AggregationSpec = {
    size: Window;
    reducers: {
        outer?: [ReducerFunction, ReducerFunction];
        inner?: [ReducerFunction, ReducerFunction];
        center?: ReducerFunction;
    };
};
export declare type BoxChartRanges = {
    center: number;
    innerMin: number;
    innerMax: number;
    outerMin: number;
    outerMax: number;
};
export declare type BoxChartProps = ChartProps & {
    series?: TimeSeries<Index> | TimeSeries<Time>;
    column?: string;
    aggregation?: AggregationSpec;
    style?: BoxChartStyle | ((channel: string) => ChannelStyle) | Styler;
    info?: LabelValueList | string;
    infoStyle?: EventMarkerStyle;
    infoTimeFormat?: ((date: Date) => string) | string;
    infoWidth?: number;
    infoHeight?: number;
    infoMarkerRadius?: number;
    innerSpacing?: number;
    outerSpacing?: number;
    innerSize?: number;
    outerSize?: number;
    selected?: Event<Index>;
    highlighted?: Event<Index>;
    onSelectionChange?: (e: Event<Index>) => any;
    onHighlightChange?: (e: Event<Index>) => any;
};
export declare class BoxChart extends React.Component<BoxChartProps> {
    static defaultProps: {
        column: string;
        innerSpacing: number;
        outerSpacing: number;
        infoStyle: {
            stroke: string;
            fill: string;
            opacity: number;
            pointerEvents: string;
        };
        stemStyle: {
            stroke: string;
            cursor: string;
            pointerEvents: string;
        };
        markerStyle: {
            fill: string;
        };
        infoMarkerRadius: number;
        infoWidth: number;
        infoHeight: number;
    };
    series: TimeSeries<Index>;
    providedStyle: CSSProperties;
    selectedStyle: CSSProperties;
    highlightedStyle: CSSProperties;
    mutedStyle: CSSProperties;
    normalStyle: CSSProperties;
    constructor(props: BoxChartProps);
    componentWillReceiveProps(nextProps: BoxChartProps): void;
    shouldComponentUpdate(nextProps: BoxChartProps): boolean;
    handleHover(e: React.MouseEvent<SVGElement>, event: Event<Index>): void;
    handleHoverLeave(): void;
    handleClick(e: React.MouseEvent<SVGElement>, event: Event<Index>): void;
    providedStyleArray(column: string): LevelStyle[];
    style(column: string, event: Event<Index>, level: number): LevelStyle;
    renderBars(): JSX.Element;
    render(): JSX.Element;
}
