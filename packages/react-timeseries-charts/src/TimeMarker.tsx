/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { timeFormat } from "d3-time-format";
import "moment-duration-format";

import { ChartProps } from "./Charts";

import { InfoBox, InfoBoxProps } from "./Info";
import { TimeMarkerStyle, defaultTimeMarkerStyle } from "./style";
import { LabelValueList } from "./types";

// import "@types/moment-duration-format";

export type StringPair = [string, string];

export type TimeFormatCallback = (d: Date) => string;

export type TimeMarkerProps = ChartProps & {
    /**
     * A Javascript Date object to position the marker
     */
    time: Date;

    /**
     * The style of the info box and connecting lines
     */
    style?: Partial<TimeMarkerStyle>;

    /**
     * The format to display the time of the marker in
     */
    timeFormat?: string | TimeFormatCallback;

    /**
     * The values to show in the info box. This is either an array of objects,
     * with each object specifying the label and value to be shown in the info
     * box, or a simple string label
     */
    info?: LabelValueList | string;

    /**
     * The height of the hover info box
     */
    infoHeight?: number;

    /**
     * The width of the hover info box
     */
    infoWidth?: number;

    /**
     * Display the info box at all. If you don't have any values to show and
     * just want a line and a time (for example), you can set this to false.
     */
    showInfoBox?: boolean;

    /**
     * You can show the info box without the corresponding time marker. Why
     * would you do this? You might use the `ChartContainer` tracker mechanism
     * to show the line across multiple rows, then add a `TimeMarker` selectively
     * to each row.
     */
    showLine?: boolean;

    /**
     * You can hide the time displayed above the info box. You might do this
     * because it is already displayed elsewhere in your UI. Or maybe you
     * just don't like it.
     */
    showTime?: boolean;

    /**
     * Show or hide this chart
     */
    visible?: boolean;
};

/**
 * An overlay marker that marks a specific `time` with a line, time label
 * and info box containing data
 */
export class TimeMarker extends React.Component<TimeMarkerProps> {
    static defaultProps: Partial<TimeMarkerProps> = {
        visible: true,
        showInfoBox: true,
        showLine: true,
        showTime: true,
        style: defaultTimeMarkerStyle,
        infoWidth: 90,
        infoHeight: 25
    };

    renderLine(posx: number) {
        const { style } = this.props;
        return (
            <line 
                style={style.line} 
                x1={posx} 
                y1={0} 
                x2={posx} 
                y2={this.props.height} 
            />
        );
    }

    renderTimeMarker(d: Date) {
        const { style } = this.props;
        let dateStr = `${d}`;
        if (this.props.timeFormat === "day") {
            const formatter = timeFormat("%d");
            dateStr = formatter(d);
        } else if (this.props.timeFormat === "month") {
            const formatter = timeFormat("%B");
            dateStr = formatter(d);
        } else if (this.props.timeFormat === "year") {
            const formatter = timeFormat("%Y");
            dateStr = formatter(d);
        } else if (this.props.timeFormat === "relative") {
            dateStr = moment.duration(+d).format(); //TODO
        } else if (_.isString(this.props.timeFormat)) {
            const formatter = timeFormat(this.props.timeFormat);
            dateStr = formatter(d);
        } else if (_.isFunction(this.props.timeFormat)) {
            const fn = this.props.timeFormat as TimeFormatCallback;
            dateStr = fn(d);
        }
        return (
            <text x={0} y={0} dy="1.2em" style={style.text}>
                {dateStr}
            </text>
        );
    }

    renderInfoBox(posx: number) {
        let infoBox;

        const align: "left" | "center" = "left";
        const { time, style, info, infoWidth, infoHeight, showTime } = this.props;

        const infoBoxProps: Partial<InfoBoxProps> = {
            align,
            style: {
                text: style.text,
                box: style.box
            },
            width: this.props.infoWidth,
            height: this.props.infoHeight
        };

        if (info) {
            infoBox = <InfoBox {...infoBoxProps} info={info} />;

            if (posx + 10 + infoWidth < this.props.width - 50) {
                return (
                    <g transform={`translate(${posx + 10},${5})`}>
                        {showTime ? this.renderTimeMarker(time) : null}
                        <g transform={`translate(0,${showTime ? 20 : 0})`}>{infoBox}</g>
                    </g>
                );
            }
            return (
                <g transform={`translate(${posx - infoWidth - 10},${5})`}>
                    {showTime ? this.renderTimeMarker(time) : null}
                    <g transform={`translate(0,${showTime ? 20 : 0})`}>{infoBox}</g>
                </g>
            );
        }
        return <g />;
    }

    render() {
        const posx = this.props.timeScale(this.props.time);
        if (posx) {
            return (
                <g>
                    {this.props.showLine ? this.renderLine(posx) : null}
                    {this.props.showInfoBox ? this.renderInfoBox(posx) : null}
                </g>
            );
        }
        return null;
    }
}
