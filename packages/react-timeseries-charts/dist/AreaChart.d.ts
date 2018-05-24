/// <reference types="react" />
import "array.prototype.fill";
import * as React from "react";
import { ChartProps } from "./Charts";
import { TimeSeries, Key } from "pondjs";
import { CurveInterpolation, AreaChartColumns } from "./types";
import { AreaChartStyle, AreaChartChannelStyle } from "./style";
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
    style: AreaChartStyle;
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
    style(column: string, type: StyleType): any;
    pathStyle(column: string): any;
    areaStyle(column: string): any;
    renderArea(data: AreaData[], column: string, key: number): JSX.Element;
    renderPaths(columnList: string[], direction: string): JSX.Element[];
    renderAreas(): JSX.Element;
    render(): JSX.Element;
}
