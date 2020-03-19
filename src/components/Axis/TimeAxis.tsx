import moment from "moment";
import "moment-timezone";

// import moment from "moment-timezone";
import * as _ from "lodash";
import * as React from "react";

// import { CSSTransitionGroup } from "react-transition-group";
import { scaleTime } from "d3-scale";

import { Tick } from "./Tick";
import durationFormatter from "./util/duration-format";
import timeFormatter from "./util/time-format";

// import "./Axis.css";

const durationSecond = 1000;
const durationMinute = durationSecond * 60;
const durationHour = durationMinute * 60;
const durationDay = durationHour * 24;
const durationWeek = durationDay * 7;
const durationMonth = durationDay * 30;
const durationYear = durationDay * 365;
const durationDecade = durationYear * 10;

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
    [durationDecade, "year", 10],
    [100 * durationYear, "year", 100],
    [500 * durationYear, "year", 250]
];

const defaultTimeAxisStyle: TimeAxisStyle = {
    values: {
        stroke: "none",
        fill: "#8B7E7E", // Default value color
        fontWeight: 100,
        fontSize: 11,
        font: '"Goudy Bookletter 1911", sans-serif"'
    },
    ticks: {
        fill: "none",
        stroke: "#C0C0C0"
    },
    axis: {
        stroke: "#AAA",
        strokeWidth: 1
    },
    label: {
        fill: "grey",
        stroke: "none",
        pointerEvents: "none"
    }
};

export type TimeAxisStyle = {
    values: React.CSSProperties;
    ticks: React.CSSProperties;
    axis: React.CSSProperties;
    label: React.CSSProperties;
};

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
        | ("second" | "minute" | "hour" | "day" | "month" | "year" | "decade" | "duration")
        | ((...args: any[]) => any);
    tickExtend?: number;
    smoothTransition?: boolean;
    position?: "left" | "right" | "top" | "bottom";
    labelPosition?: number;
    timezone?: string;
    transition?: boolean;
    angled?: boolean;
    style?: TimeAxisStyle;

    // TODO: these aren't in use
    tickMajor?: number;
    tickMinor?: number;
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
const defaultProps: TimeAxisProps = {
    width: 100,
    height: 100,
    tickExtend: 0,
    margin: 10,
    standalone: false,
    labelPosition: 50,
    smoothTransition: false,
    angled: false,
    style: defaultTimeAxisStyle,

    // TODO: these ones aren't in use!
    tickMajor: 20,
    tickMinor: 14
    // absolute: false
};
export const TimeAxis = (props: TimeAxisProps) => {
    const {
        width = 100,
        height = 100,
        margin = 10,
        position,
        labelPosition = 50,
        style = defaultTimeAxisStyle
    } = props;

    const renderAxisLabel = () => {
        const labelStyle = _.merge(
            true,
            defaultTimeAxisStyle.label,
            style && style.label ? style.label : {}
        );
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
                    {props.label}
                </text>
            </g>
        );
    };
    const renderAxisLine = () => {
        const p = props.position;
        const axisStyle = _.merge(
            true,
            defaultTimeAxisStyle.axis,
            props.style && props.style.axis ? props.style.axis : {}
        );
        return (
            <line
                key="axis"
                className="axis"
                style={axisStyle}
                x1={margin}
                y1={p === "bottom" ? 0 : height}
                x2={width - margin}
                y2={p === "bottom" ? 0 : height}
            />
        );
    };
    const renderAxisTicks = () => {
        let formatter = props.format;
        let timezone = props.timezone;

        // A duration format is relative to UTC for the purposes
        // of tick alignment
        const formatAsDuration = props.format === "duration";
        if (formatAsDuration) {
            timezone = "Etc/UTC";
        }

        const interval = 5; //props.interval

        const scale = scaleTime()
            .domain([props.beginTime, props.endTime])
            .range([margin, width - margin * 2]);

        const start = +props.beginTime;
        const stop = +props.endTime;
        const target = Math.abs(stop - start) / interval;

        // Determine the time unit of the spacing of ticks,
        // either because it's explicitly defined as the format
        // (day, month, year, etc), or using our tickInterval
        // lookup
        let type, num;
        if (_.isString(formatter) && !(formatter == "duration" || formatter == "decade")) {
            type = formatter;
            num = 1;
        } else {
            for (const [d, t, n] of tickIntervals) {
                if (target < d) break;
                type = t;
                num = n;
            }
        }

        // Formatter will be a function (date) => string, or
        // a string format type. In the case of the string type
        // that might be "duration", or "minutes", "day", etc.
        if (typeof props.format === "function") {
            formatter = props.format;
        } else if (formatAsDuration) {
            formatter = durationFormatter();
        } else {
            formatter = timeFormatter(type, timezone);
        }

        const starttz = timezone ? moment(start).tz(timezone) : moment(start);
        const stoptz = timezone ? moment(stop).tz(timezone) : moment(stop);

        // We want to align our minor ticks to our major ones.
        // For instance if we are showing 3 hour minor ticks then we
        // want to them to be 12am, 3am, etc (not 11pm, 2am, etc)
        let startd;
        let stopd;
        if (props.format === "decade") {
            // sets start and stop closest to the nearest 100
            // example : 1981 would set to 1980, 2009 would set to 2010
            startd = starttz.set("year", Math.floor(starttz.year() / 10) * 10);
            stopd = stoptz.set("year", Math.ceil(stoptz.year() / 10) * 10);
        } else {
            startd = starttz.startOf(majors[type]).add(num, "type");
            stopd = stoptz.endOf(type);
        }

        const tickStyle = {
            ticks: _.merge(
                true,
                defaultTimeAxisStyle.ticks,
                props.style && props.style.ticks ? props.style.ticks : {}
            ),
            values: _.merge(
                true,
                defaultTimeAxisStyle.ticks,
                props.style && props.style.values ? props.style.values : {}
            )
        };

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
                        align={props.position}
                        label={label}
                        size={size}
                        position={pos}
                        tickExtend={props.tickExtend}
                        labelAlign={labelAlign}
                        width={width}
                        height={height}
                        smoothTransition={props.smoothTransition}
                        angled={props.angled}
                        style={tickStyle}
                    />
                );
            }
            d = d.add(num, type);
            i++;
        }
        return ticks;
    };
    const renderAxis = () => {
        if (props.transition === true) {
            return (
                <g>
                    {renderAxisLine()}
                    {/*<CSSTransitionGroup
                        component="g"
                        transitionName="ticks"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                    >*/}
                    {renderAxisTicks()}
                    {/*</CSSTransitionGroup>*/}
                    {renderAxisLabel()}
                </g>
            );
        } else {
            return (
                <g>
                    {renderAxisLine()}
                    {renderAxisTicks()}
                    {renderAxisLabel()}
                </g>
            );
        }
    };
    if (props.standalone) {
        return (
            <svg height={height} width={width} style={{ shapeRendering: "crispEdges" }}>
                {renderAxis()}
            </svg>
        );
    } else {
        return renderAxis();
    }
};
