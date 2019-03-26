/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import React from "react";
import PropTypes from "prop-types";
import merge from "merge";
import { TimeEvent, TimeRangeEvent, IndexedEvent, Index, TimeRange } from "pondjs";
import { timeFormat } from "d3-time-format";

import Label from "./Label";
import ValueList from "./ValueList";

const EventTime = ({ time, format = "%m/%d/%y %X" }) => {
    const textStyle = {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd",
        pointerEvents: "none"
    };

    let text;
    if (_.isFunction(format)) {
        text = format(time);
    } else {
        const fmt = timeFormat(format);
        text = fmt(time);
    }

    return (
        <text x={0} y={0} dy="1.2em" style={textStyle}>
            {text}
        </text>
    );
};

EventTime.propTypes = {
    time: PropTypes.instanceOf(Date),
    format: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

EventTime.defaultProps = {
    infoTimeFormat: "%m/%d/%y %X"
};

const EventTimeRange = ({ timerange, format = "%m/%d/%y %X" }) => {
    const textStyle = {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd",
        pointerEvents: "none"
    };
    const d1 = timerange.begin();
    const d2 = timerange.end();

    let beginText;
    let endText;

    if (_.isFunction(format)) {
        beginText = format(d1);
        endText = format(d2);
    } else {
        const fmt = timeFormat(format);
        beginText = fmt(d1);
        endText = fmt(d2);
    }

    return (
        <text x={0} y={0} dy="1.2em" style={textStyle}>
            {`${beginText} to ${endText}`}
        </text>
    );
};

EventTimeRange.propTypes = {
    timerange: PropTypes.instanceOf(TimeRange),
    format: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

EventTimeRange.defaultProps = {
    infoTimeFormat: "%m/%d/%y %X"
};

const EventIndex = ({ index, format }) => {
    const textStyle = {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd",
        pointerEvents: "none"
    };

    let text;
    if (_.isFunction(format)) {
        text = format(index);
    } else if (_.isString(format)) {
        const fmt = timeFormat(format);
        text = fmt(index.begin());
    } else {
        text = index.toString();
    }

    return (
        <text x={0} y={0} dy="1.2em" style={textStyle}>
            {text}
        </text>
    );
};

EventIndex.propTypes = {
    index: PropTypes.instanceOf(Index),
    format: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

/**
 * Renders a marker at a specific event on the chart.
 *
 * To explain how EventMarkers work, it's useful to explain a little
 * terminology used here. A marker has several parts:
 *
 *  * the "marker" itself which appears at the (value, time) of the event.
 *    This is a dot which whose radius is defined by markerRadius, and
 *    whose style is set with markerStyle
 *  * the "markerLabel" which is a string that will be rendered next to
 *    the marker. The label can be aligned with markerAlign and also
 *    styled with markerLabelStyle
 *  * the "info box" which is a box containing values that hovers that the
 *    top of the chart. Optionally it can show the time above the box.
 *    The values themselves are supplied as an array of objects using
 *    the `info` prop. The info box can be styled with `infoStyle`,
 *    sized with `infoWidth` and `infoHeight`, and the time formatted
 *    with `infoTimeFormat`
 *  * the "stem" which is a connector between the marker and the
 *    info box to visually link the two
 *
 * Combining these attributes, Event markers fall into two flavors, either
 * you want to omit the infoBox and mark the event with a dot and optionally
 * a label, or you want to omit the label (and perhaps marker dot) and show
 * a flag style marker with the infoBox connected to the event with the stem.
 *
 * As with other IndexedEvents or TimeRangeEvents, the marker will appear at
 * the center of the timerange represented by that event. You can, however,
 * override either the x or y position by a number of pixels.
 */
export default class EventMarker extends React.Component {
    renderTime(event) {
        if (event instanceof TimeEvent) {
            return <EventTime time={event.timestamp()} format={this.props.infoTimeFormat} />;
        } else if (event instanceof IndexedEvent) {
            return <EventIndex index={event.index()} format={this.props.infoTimeFormat} />;
        } else if (event instanceof TimeRangeEvent) {
            return (
                <EventTimeRange timerange={event.timerange()} format={this.props.infoTimeFormat} />
            );
        }
        return <g />;
    }

    renderMarker(event, column, info) {
        let t;
        if (event instanceof TimeEvent) {
            t = event.timestamp();
        } else {
            t = new Date(
                event.begin().getTime() + (event.end().getTime() - event.begin().getTime()) / 2
            );
        }

        let value;
        if (this.props.yValueFunc) {
            value = this.props.yValueFunc(event, column);
        } else {
            value = event.get(column);
        }

        // Allow overrides on the x and y position. This is useful for the barchart
        // tracker because bars maybe be offset from their actual event position in
        // order to display them side by side.
        const posx = this.props.timeScale(t) + this.props.offsetX;
        const posy = this.props.yScale(value) - this.props.offsetY;
        const infoOffsetY = this.props.infoOffsetY;

        const infoBoxProps = {
            align: "left",
            style: this.props.infoStyle,
            width: this.props.infoWidth,
            height: this.props.infoHeight
        };

        const w = this.props.infoWidth;
        const lineBottom = posy - 10;

        let verticalStem;
        let horizontalStem;
        let dot;
        let infoBox;
        let transform;
        let label;

        if (info) {
            if (_.isString(this.props.info)) {
                infoBox = <Label {...infoBoxProps} label={info} />;
            } else {
                infoBox = <ValueList {...infoBoxProps} values={info} />;
            }
        }

        //
        // Marker on right of event
        //

        if (this.props.type === "point") {
            let textDefaultStyle = {
                fontSize: 11,
                pointerEvents: "none",
                paintOrder: "stroke",
                fill: "#b0b0b0",
                strokeWidth: 2,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                fontWeight: 800
            };

            let dx = 0;
            let dy = 0;
            switch (this.props.markerLabelAlign) {
                case "left":
                    dx = 5;
                    textDefaultStyle.textAnchor = "start";
                    textDefaultStyle.alignmentBaseline = "central";
                    break;
                case "right":
                    dx = -5;
                    textDefaultStyle.textAnchor = "end";
                    textDefaultStyle.alignmentBaseline = "central";
                    break;
                case "top":
                    dy = -5;
                    textDefaultStyle.textAnchor = "middle";
                    textDefaultStyle.alignmentBaseline = "bottom";
                    break;
                case "bottom":
                    dy = 5;
                    textDefaultStyle.textAnchor = "middle";
                    textDefaultStyle.alignmentBaseline = "hanging";
                    break;
                default:
                //pass
            }

            const tstyle = merge(true, textDefaultStyle, this.props.markerLabelStyle);

            dot = (
                <circle
                    cx={posx}
                    cy={posy}
                    r={this.props.markerRadius}
                    pointerEvents="none"
                    style={this.props.markerStyle}
                />
            );
            label = (
                <text x={posx} y={posy} dx={dx} dy={dy} style={tstyle}>
                    {this.props.markerLabel}
                </text>
            );

            return (
                <g>
                    {dot}
                    {label}
                </g>
            );
        } else {
            if (posx + 10 + w < (this.props.width * 3) / 4) {
                if (info) {
                    verticalStem = (
                        <line
                            pointerEvents="none"
                            style={this.props.stemStyle}
                            x1={-10}
                            y1={lineBottom}
                            x2={-10}
                            y2={infoOffsetY}
                        />
                    );
                    horizontalStem = (
                        <line
                            pointerEvents="none"
                            style={this.props.stemStyle}
                            x1={-10}
                            y1={infoOffsetY}
                            x2={-2}
                            y2={infoOffsetY}
                        />
                    );
                }
                dot = (
                    <circle
                        cx={-10}
                        cy={lineBottom}
                        r={this.props.markerRadius}
                        pointerEvents="none"
                        style={this.props.markerStyle}
                    />
                );
                transform = `translate(${posx + 10},${10})`;
            } else {
                if (info) {
                    verticalStem = (
                        <line
                            pointerEvents="none"
                            style={this.props.stemStyle}
                            x1={w + 10}
                            y1={lineBottom}
                            x2={w + 10}
                            y2={infoOffsetY}
                        />
                    );
                    horizontalStem = (
                        <line
                            pointerEvents="none"
                            style={this.props.stemStyle}
                            x1={w + 10}
                            y1={infoOffsetY}
                            x2={w + 2}
                            y2={infoOffsetY}
                        />
                    );
                }
                dot = (
                    <circle
                        cx={w + 10}
                        cy={lineBottom}
                        r={this.props.markerRadius}
                        pointerEvents="none"
                        style={this.props.markerStyle}
                    />
                );
                transform = `translate(${posx - w - 10},${10})`;
            }

            return (
                <g transform={transform}>
                    {verticalStem}
                    {horizontalStem}
                    {dot}
                    <g transform={`translate(0,${infoOffsetY - 20})`}>{this.renderTime(event)}</g>
                    <g transform={`translate(0,${infoOffsetY})`}>{infoBox}</g>
                </g>
            );
        }
    }

    render() {
        const { event, column, info } = this.props;
        if (!event) {
            return <g />;
        }
        return <g>{this.renderMarker(event, column, info)}</g>;
    }
}

EventMarker.propTypes = {
    type: PropTypes.oneOf(["point", "flag"]),

    /**
     * What [Pond Event](https://esnet-pondjs.appspot.com/#/event) to mark
     */
    event: PropTypes.oneOfType([
        PropTypes.instanceOf(TimeEvent),
        PropTypes.instanceOf(IndexedEvent),
        PropTypes.instanceOf(TimeRangeEvent)
    ]),

    /**
     * Which column in the Event to use
     *
     * NOTE : Columns can't have periods because periods
     * represent a path to deep data in the underlying events
     * (i.e. reference into nested data structures)
     */
    column: PropTypes.string,

    /**
     * The values to show in the info box. This is either an array of
     * objects, with each object specifying the label and value
     * to be shown in the info box, or a simple string label. If this
     * prop is not supplied, no infoBox will be displayed.
     */
    info: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string, // eslint-disable-line
                value: PropTypes.string // eslint-disable-line
            })
        )
    ]),

    /**
     * The style of the info box itself. Typically you'd want to
     * specify a fill color, and stroke color/width here.
     */
    infoStyle: PropTypes.object,

    /**
     * The width of the info box
     */
    infoWidth: PropTypes.number,

    /**
     * The height of the info box
     */
    infoHeight: PropTypes.number,

    /**
     * Alter the format of the timestamp shown on the info box.
     * This may be either a function or a string. If you provide a function
     * that will be passed an Index and should return a string. For example:
     * ```
     *     index => moment(index.begin()).format("Do MMM 'YY")
     * ```
     * Alternatively you can pass in a d3 format string. That will be applied
     * to the begin time of the Index range.
     */
    infoTimeFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

    /**
     * Show a label to the left or right of the marker
     */
    markerLabelAlign: PropTypes.oneOf(["left", "right", "top", "bottom"]),

    /**
     * The radius of the dot at the end of the marker
     */
    markerRadius: PropTypes.number,

    /**
     * The style of the event marker dot
     */
    markerStyle: PropTypes.object,

    /**
     * The y value is calculated by the column and event, but if
     * this prop is provided this will be used instead.
     */
    yValueFunc: PropTypes.func,

    /**
     * Offset the marker position in the x direction.
     */
    offsetX: PropTypes.number,

    /**
     * Offset the marker position in the y direction
     */
    offsetY: PropTypes.number,

    /**
     * The vertical offset in pixels of the EventMarker info box from the
     * top of the chart. The default is 20.
     */
    infoOffsetY: PropTypes.number,

    /**
     * [Internal] The timeScale supplied by the surrounding ChartContainer
     */
    timeScale: PropTypes.func,

    /**
     * [Internal] The yScale supplied by the associated YAxis
     */
    yScale: PropTypes.func,

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width: PropTypes.number
};

EventMarker.defaultProps = {
    type: "flag",
    column: "value",
    infoWidth: 90,
    infoHeight: 25,
    infoStyle: {
        fill: "white",
        opacity: 0.9,
        stroke: "#999",
        pointerEvents: "none"
    },
    stemStyle: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    },
    markerStyle: {
        fill: "#999"
    },
    markerRadius: 2,
    markerLabelAlign: "left",
    markerLabelStyle: {
        fill: "#999"
    },
    offsetX: 0,
    offsetY: 0,
    infoOffsetY: 20
};
