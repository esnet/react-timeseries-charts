/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as moment from 'moment';
import 'moment-timezone';

// import moment from "moment-timezone";
import * as _ from "lodash";
import * as React from "react";

import ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import { scaleTime } from "d3-scale";

import { Tick } from "./Tick";
import durationFormatter from "./util/duration-format";
import timeFormatter from "./util/time-format";

import "./Axis.css";

const durationSecond = 1000;
const durationMinute = durationSecond * 60;
const durationHour = durationMinute * 60;
const durationDay = durationHour * 24;
const durationWeek = durationDay * 7;
const durationMonth = durationDay * 30;
const durationYear = durationDay * 365;

const majors = {
    second: "minute",
    minute: "hour",
    hour: "day",
    day: "month",
    week: "month",
    month: "year",
    year: "year"
};

const tickIntervals = [
    [durationSecond, "second", 1],
    [5 * durationSecond, "second", 5],
    [15 * durationSecond, "second", 15],
    [30 * durationSecond, "second", 30],
    [durationMinute, "minute", 1],
    [5 * durationMinute, "minute", 5],
    [15 * durationMinute, "minute", 15],
    [30 * durationMinute, "minute", 30],
    [durationHour, "hour", 1],
    [3 * durationHour, "hour", 3],
    [6 * durationHour, "hour", 6],
    [12 * durationHour, "hour", 12],
    [durationDay, "day", 1],
    [2 * durationDay, "day", 2],
    [3 * durationDay, "day", 3],
    [4 * durationDay, "day", 4],
    [5 * durationDay, "day", 5],
    [durationWeek, "week", 1],
    [durationMonth, "month", 1],
    [3 * durationMonth, "month", 3],
    [durationYear, "year", 1],
    [2 * durationYear, "year", 2],
    [5 * durationYear, "year", 5],
    [10 * durationYear, "year", 10],
    [25 * durationYear, "year", 25],
    [100 * durationYear, "year", 100],
    [500 * durationYear, "year", 250]
];

export type TimeAxisProps = {
    standalone: boolean;
    beginTime: Date;
    endTime: Date;
    align?: "center" | "left";
    label?: string;
    width?: number;
    height?: number;
    margin?: number;
    format?:
        | ("second" | "minute" | "hour" | "day" | "month" | "year" | "duration")
        | ((...args: any[]) => any);
    tickMinor?: number;
    tickMajor?: number;
    tickExtend?: number;
    smoothTransition?: boolean;
    position?: "left" | "right" | "top" | "bottom";
    labelPosition?: number;
    labelStyle?: React.CSSProperties;
    timezone?: string;
    transition?: boolean;
};

/**
 * A TimeAxis component rendered into SVG. The component can be aligned using the
 * `position` prop to the top or bottom.
 *
 * Scaling of the axis is done with the `beginTime` and `endTime` props. These
 * are Javascript Date objects.
 *
 * Overall size of the SVG component is done with `width` and `height`.
 *
 * Note that the default `margin` is currently 10, so depending on your application
 * you may want to explicitly set this to 0.
 *
 * The `TimeAxis` has support for rendering in any timezone using the `timezone`
 * props. It defaults to local time.
 *
 * For example:
 * ```
 *  <TimeAxis
 *      beginTime={beginTime}
 *      endTime={endTime}
 *      timezone="America/Chicago"
 *      position="bottom"
 *      width={800}
 *      height={50}
 *  />
 * ```
 *
 * The format of the axis labels has an appropiate default. However, you
 * can use the `format` props to gain additional control, either with
 * some built in formats or by supplying a function.
 *
 */
export class TimeAxis extends React.Component<TimeAxisProps> {
    static defaultProps = {
        width: 100,
        height: 100,
        tickCount: 10,
        tickMajor: 20,
        tickMinor: 14,
        tickExtend: 0,
        margin: 10,
        standalone: false,
        labelPosition: 50,
        labelStyle: {
            fill: "grey",
            stroke: "none",
            pointerEvents: "none"
        },
        absolute: false,
        smoothTransition: false
    }
    renderAxisLabel() {
        const { width, height, position, labelPosition, labelStyle } = this.props;
        let translate;
        let rotate = `rotate(0)`;
        let anchor = "start";
        switch (position) {
            case "left":
                translate = `translate(${width - labelPosition},5)`;
                rotate = `rotate(-90)`;
                anchor = "end";
                break;
            case "right":
                translate = `translate(${labelPosition},5)`;
                rotate = `rotate(-90)`;
                anchor = "end";
                break;
            case "top":
                translate = `translate(5, ${height - labelPosition})`;
                break;
            case "bottom":
                translate = `translate(5, ${labelPosition})`;
                break;
            default:
        }
        return (
            <g transform={translate}>
                <text transform={rotate} textAnchor={anchor} style={labelStyle}>
                    {this.props.label}
                </text>
            </g>
        );
    }
    renderAxisLine() {
        const p = this.props.position;
        return (
            <line
                key="axis"
                className="axis"
                style={{ stroke: "#AAA", strokeWidth: 2 }}
                x1={this.props.margin}
                y1={p === "bottom" ? 0 : this.props.height}
                x2={this.props.width - this.props.margin}
                y2={p === "bottom" ? 0 : this.props.height}
            />
        );
    }
    renderAxisTicks() {
        let formatter = this.props.format;
        let timezone = this.props.timezone;
        // A duration format is relative to UTC for the purposes
        // of tick alignment
        const formatAsDuration = this.props.format === "duration";
        if (formatAsDuration) {
            timezone = "Etc/UTC";
        }
        const interval = 5; //this.props.interval
        const scale = scaleTime()
            .domain([this.props.beginTime, this.props.endTime])
            .range([this.props.margin, this.props.width - this.props.margin * 2]);
        const start = +this.props.beginTime;
        const stop = +this.props.endTime;
        const target = Math.abs(stop - start) / interval;
        // Determine the time unit of the spacing of ticks,
        // either because it's explicitly defined as the format
        // (day, month, year, etc), or using our tickInterval
        // lookup
        let type, num;
        if (_.isString(formatter) && formatter !== "duration") {
            type = formatter;
            num = 1;
        } else {
            for (const [d, t, n] of tickIntervals) {
                if (target < d) break;
                type = t;
                num = n;
            }
        }
        formatter = timeFormatter(type, timezone);
        // Formatter will be a function (date) => string, or
        // a string format type. In the case of the string type
        // that might be "duration", or "minutes", "day", etc.
        if (formatAsDuration) {
            formatter = durationFormatter();
        }
        const starttz = timezone ? moment(start).tz(timezone) : moment(start);
        const stoptz = timezone ? moment(stop).tz(timezone) : moment(stop);
        // We want to align our minor ticks to our major ones.
        // For instance if we are showing 3 hour minor ticks then we
        // want to them to be 12am, 3am, etc (not 11pm, 2am, etc)
        const startd = starttz.startOf(majors[type]).add(num, "type");
        const stopd = stoptz.endOf(type);
        let i = 0;
        let d = startd;
        let ticks = [];
        while (d.isBefore(stopd)) {
            const date = d.toDate();
            const pos = scale(date);
            const { label, size, labelAlign } = formatter(date);
            if (+d >= start && +d < stop) {
                ticks.push(
                    <Tick
                        key={+d}
                        id={`${i}`}
                        align={this.props.position}
                        label={label}
                        size={size}
                        position={pos}
                        extend={this.props.tickExtend}
                        labelAlign={labelAlign}
                        width={this.props.width}
                        height={this.props.height}
                        smoothTransition={this.props.smoothTransition}
                    />
                );
            }
            d = d.add(num, type);
            i++;
        }
        return ticks;
    }
    renderAxis() {
        if (this.props.transition === true) {
            return (
                <g>
                    {this.renderAxisLine()}
                    <ReactCSSTransitionGroup
                        component="g"
                        transitionName="ticks"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                    >
                        {this.renderAxisTicks()}
                    </ReactCSSTransitionGroup>
                    {this.renderAxisLabel()}
                </g>
            );
        } else {
            return (
                <g>
                    {this.renderAxisLine()}
                    {this.renderAxisTicks()}
                    {this.renderAxisLabel()}
                </g>
            );
        }
    }
    render() {
        if (this.props.standalone) {
            return (
                <svg
                    height={this.props.height}
                    width={this.props.width}
                    style={{ shapeRendering: "crispEdges" }}
                >
                    {this.renderAxis()}
                </svg>
            );
        } else {
            return this.renderAxis();
        }
    }
}
