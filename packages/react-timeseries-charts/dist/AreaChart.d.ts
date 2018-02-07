import "array.prototype.fill";
import * as React from "react";
import { TimeSeries, Key } from "pondjs";
import { AreaChartStyle } from "./style";
import { ChartProps } from "./Charts";
import { CurveInterpolation, AreaChartColumns } from "./types";
import "@types/d3-shape";
export declare enum StyleType {
    Line = "line",
    Area = "area",
}
export declare type AreaChartProps = ChartProps & {
    series: TimeSeries<Key>;
    columns: AreaChartColumns;
    style: AreaChartStyle;
    interpolation: CurveInterpolation;
    axis: string;
    stack?: boolean;
    highlight?: string;
    selection?: string;
    onHighlightChange?: (column: string) => any;
    onSelectionChange?: (column: string) => any;
};
export declare class AreaChart extends React.Component<AreaChartProps> {
    defaultProps: Partial<AreaChartProps>;
    shouldComponentUpdate(nextProps: AreaChartProps): boolean;
    handleHover(e: React.MouseEvent<SVGPathElement>, column: string): void;
    handleHoverLeave(): void;
    handleClick(e: React.MouseEvent<SVGPathElement>, column: string): void;
    providedAreaStyleMap(column: string): {
        line: {
            [mode: string]: React.CSSProperties;
            normal: React.CSSProperties;
            highlighted: React.CSSProperties;
            selected: React.CSSProperties;
            muted: React.CSSProperties;
        };
        area: {
            [mode: string]: React.CSSProperties;
            normal: React.CSSProperties;
            highlighted: React.CSSProperties;
            selected: React.CSSProperties;
            muted: React.CSSProperties;
        };
    };
    style(column: string, type: StyleType): React.CSSProperties;
    pathStyle(column: string): React.CSSProperties;
    areaStyle(column: string): React.CSSProperties;
    renderPaths(columnList: string[], direction: string): JSX.Element[];
    renderAreas(): JSX.Element;
    render(): JSX.Element;
}
