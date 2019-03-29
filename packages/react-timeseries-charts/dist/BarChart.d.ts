import * as React from "react";
import { TimeSeries, Event, Key, Index } from "pondjs";
import { ChartProps } from "./Charts";
import { Styler } from "./styler";
import { BarChartStyle, BarChartChannelStyle, EventMarkerStyle } from "./style";
import { LabelValueList } from "./types";
export declare type BarChartProps = ChartProps & {
    series: TimeSeries<Key>;
    spacing?: number;
    offset?: number;
    columns?: string[];
    style?: BarChartStyle | ((column: string) => BarChartChannelStyle) | Styler;
    info?: LabelValueList | string;
    infoStyle?: EventMarkerStyle;
    infoWidth?: number;
    infoHeight?: number;
    infoTimeFormat?: string | ((...args: any[]) => any);
    markerRadius?: number;
    markerStyle?: EventMarkerStyle;
    stemStyle?: EventMarkerStyle;
    size?: number;
    visible?: boolean;
    minBarHeight?: number;
    selected?: {
        event?: Event<Index>;
        column?: string;
    };
    onSelectionChange?: (...args: any[]) => any;
    highlighted?: {
        event?: any;
        column?: string;
    };
    onHighlightChange?: (...args: any[]) => any;
};
export declare class BarChart extends React.Component<BarChartProps> {
    static defaultProps: Partial<BarChartProps>;
    handleHover(e: React.MouseEvent<SVGRectElement>, event: Event<Key>, column: string): void;
    handleHoverLeave(): void;
    handleClick(e: React.MouseEvent<SVGRectElement>, event: Event<Key>, column: string): void;
    providedBarStyleMap(column: string): BarChartChannelStyle;
    style(element: string, column: string, event: Event<Key>): React.CSSProperties;
    renderBars(): JSX.Element;
    render(): JSX.Element;
}
