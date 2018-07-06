/// <reference types="react" />
import * as React from "react";
import { TimeSeries, Key } from "pondjs";
import { ChartProps } from "./Charts";
import { Styler } from "./styler";
import { LineChartChannelStyle, LineChartStyle } from "./style";
import { CurveInterpolation } from "./types";
export declare type LineChartProps = ChartProps & {
    series: TimeSeries<Key>;
    axis: string;
    columns?: string[];
    style?: Partial<LineChartStyle> | ((column: string) => LineChartChannelStyle) | Styler;
    interpolation?: CurveInterpolation;
    breakLine?: boolean;
    selection?: string;
    onSelectionChange?: (...args: any[]) => any;
    highlight?: string;
    onHighlightChange?: (...args: any[]) => any;
    visible?: boolean;
};
export declare type Point = {
    x: Date;
    y: number;
};
export declare type PointData = Point[];
export declare class LineChart extends React.Component<LineChartProps, {}> {
    static defaultProps: Partial<LineChartProps>;
    shouldComponentUpdate(nextProps: LineChartProps): boolean;
    handleHover(e: React.MouseEvent<SVGPathElement>, column: string): void;
    handleHoverLeave(): void;
    handleClick(e: React.MouseEvent<SVGPathElement>, column: string): void;
    providedPathStyleMap(column: string): LineChartChannelStyle;
    pathStyle(element: string, column: string): React.CSSProperties;
    renderPath(data: PointData, column: string, key: number): JSX.Element;
    renderLines(): JSX.Element[];
    renderLine(column: string): JSX.Element;
    render(): JSX.Element;
}
