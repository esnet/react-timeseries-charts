/// <reference types="react" />
import "array.prototype.fill";
import * as React from "react";
import { TimeSeries, Key } from "pondjs";
import { ChartProps } from "./Charts";
import { Styler } from "./styler";
import { AreaChartStyle, AreaChartChannelStyle } from "./style";
import { CurveInterpolation, AreaChartColumns } from "./types";
export declare type AreaData = {
    x0: number;
    y0: number;
    y1: number;
};
export declare enum StyleType {
    Line = "line",
    Area = "area",
}
export declare type AreaChartProps = ChartProps & {
    axis: string;
    breakArea?: boolean;
    columns: AreaChartColumns;
    highlight?: string;
    interpolation: CurveInterpolation;
    selection?: string;
    series: TimeSeries<Key>;
    stack?: boolean;
    style: AreaChartStyle | ((column: string) => AreaChartChannelStyle) | Styler;
    visible?: boolean;
    onHighlightChange?: (column: string) => any;
    onSelectionChange?: (column: string) => any;
};
export declare class AreaChart extends React.Component<AreaChartProps> {
    static defaultProps: Partial<AreaChartProps>;
    shouldComponentUpdate(nextProps: AreaChartProps): boolean;
    handleHover(e: React.MouseEvent<SVGPathElement>, column: string): void;
    handleHoverLeave(): void;
    handleClick(e: React.MouseEvent<SVGPathElement>, column: string): void;
    providedAreaStyleMap(column: string): AreaChartChannelStyle;
    style(column: string, type: StyleType): React.CSSProperties;
    pathStyle(column: string): React.CSSProperties;
    areaStyle(column: string): React.CSSProperties;
    renderArea(data: AreaData[], column: string, key: number): JSX.Element;
    renderPaths(columnList: string[], direction: string): JSX.Element[];
    renderAreas(): JSX.Element;
    render(): JSX.Element;
}
