import * as React from "react";
import "moment-duration-format";
import { ChartProps } from "./Charts";
import { TimeMarkerStyle } from "./style";
import { LabelValueList } from "./types";
export declare type StringPair = [string, string];
export declare type TimeFormatCallback = (d: Date) => string;
export declare type TimeMarkerProps = ChartProps & {
    time: Date;
    style?: Partial<TimeMarkerStyle>;
    timeFormat?: string | TimeFormatCallback;
    info?: LabelValueList | string;
    infoHeight?: number;
    infoWidth?: number;
    showInfoBox?: boolean;
    showLine?: boolean;
    showTime?: boolean;
    visible?: boolean;
};
export declare class TimeMarker extends React.Component<TimeMarkerProps> {
    static defaultProps: Partial<TimeMarkerProps>;
    renderLine(posx: number): JSX.Element;
    renderTimeMarker(d: Date): JSX.Element;
    renderInfoBox(posx: number): JSX.Element;
    render(): JSX.Element;
}
