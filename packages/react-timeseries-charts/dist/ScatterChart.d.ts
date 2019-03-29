import * as React from "react";
import { TimeSeries, Event, Key } from "pondjs";
import { ChartProps } from "./Charts";
import { Styler } from "./styler";
import { ScatterChartStyle, ScatterChartChannelStyle, EventMarkerStyle } from "./style";
import { LabelValueList } from "./types";
export declare type EventColumnPair = {
    event?: Event<Key>;
    column?: string;
};
export declare type ScatterChartProps = ChartProps & {
    series: TimeSeries<Key>;
    columns?: string[];
    axis: string;
    radius?: number | ((...args: any[]) => any) | any | Styler;
    style?: ScatterChartStyle | ((channel: string, event?: Event<Key>) => ScatterChartChannelStyle) | Styler;
    info?: LabelValueList | string;
    infoStyle?: EventMarkerStyle;
    infoWidth?: number;
    infoHeight?: number;
    visible?: boolean;
    infoTimeFormat?: ((date: Date) => string) | string;
    selected?: EventColumnPair;
    onSelectionChange?: (...args: any[]) => any;
    highlight?: EventColumnPair;
    onMouseNear?: (...args: any[]) => any;
};
export declare class ScatterChart extends React.Component<ScatterChartProps> {
    static defaultProps: Partial<ScatterChartProps>;
    eventrect: SVGRectElement;
    constructor(props: ScatterChartProps);
    getOffsetMousePosition(e: React.MouseEvent<SVGElement>): number[];
    handleClick(e: React.MouseEvent<SVGCircleElement>, event: Event<Key>, column: string): void;
    handleHover(e: React.MouseEvent<SVGElement>): void;
    handleHoverLeave(): void;
    providedStyleMap(column: string, event: Event<Key>): ScatterChartChannelStyle;
    style(column: string, event: Event<Key>): React.CSSProperties;
    renderScatter(): JSX.Element;
    render(): JSX.Element;
}
