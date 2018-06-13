/// <reference types="react" />
import * as React from "react";
import { Event, Index, Time, TimeSeries } from "pondjs";
import { AggregationSpec } from './BoxChart';
import { ChartProps } from "./Charts";
import { CurveInterpolation, LabelValueList } from "./types";
import { Styler } from "./styler";
import { BandChartStyle, BandChartChannelStyle as ChannelStyle, LevelStyle, EventMarkerStyle } from "./style";
export declare type BandChartRanges = {
    center: number;
    innerMin: number;
    innerMax: number;
    outerMin: number;
    outerMax: number;
};
export declare type BandChartProps = ChartProps & {
    series: TimeSeries<Index> | TimeSeries<Time>;
    column?: string;
    aggregation?: AggregationSpec;
    style?: BandChartStyle | ((channel: string) => ChannelStyle) | Styler;
    info?: LabelValueList | string;
    infoStyle?: EventMarkerStyle;
    infoTimeFormat?: ((date: Date) => string) | string;
    infoWidth?: number;
    infoHeight?: number;
    infoMarkerRadius?: number;
    interpolation: CurveInterpolation;
    innerSpacing?: number;
    outerSpacing?: number;
    innerSize?: number;
    outerSize?: number;
    selected?: Event<Index>;
    highlighted?: Event<Index>;
    visible: boolean;
    onSelectionChange?: (column: string) => any;
    onHighlightChange?: (column: string) => any;
};
export declare class BandChart extends React.Component<BandChartProps> {
    static defaultProps: {
        column: string;
        innerSpacing: number;
        outerSpacing: number;
        infoMarkerRadius: number;
        infoWidth: number;
        infoHeight: number;
    };
    series: TimeSeries<Index>;
    providedStyle: LevelStyle[];
    selectedStyle: any;
    highlightedStyle: any;
    mutedStyle: any;
    normalStyle: any;
    constructor(props: BandChartProps);
    componentWillReceiveProps(nextProps: BandChartProps): void;
    shouldComponentUpdate(nextProps: BandChartProps): boolean;
    handleHover(e: React.MouseEvent<SVGElement>, column: string): void;
    handleHoverLeave(): void;
    handleClick(e: React.MouseEvent<SVGElement>, column: string): void;
    providedStyleArray(column: string): LevelStyle[];
    style(column: string, event: Event<Index>, level: number): LevelStyle;
    renderAreas(): JSX.Element;
    render(): JSX.Element;
}
