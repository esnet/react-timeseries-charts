/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import { timeFormat } from "d3-time-format";
import { Event, TimeRangeEvent, IndexedEvent } from "pondjs";
import ValueList from "./valuelist";
import Label from "./label";

/**
 * Renders a marker at a specific event on the chart. You can also
 * override either the x or y position, so this allows you to position
 * a timestamped label or timestamped list of label/value pairs anywhere
 * on a chart.
 */
export default React.createClass({

    displayName: "EventMarker",

    getDefaultProps() {
        return {
            column: "value",
            infoStyle: {
                line: {
                    stroke: "#999",
                    cursor: "crosshair",
                    pointerEvents: "none"
                },
                box: {
                    fill: "white",
                    opacity: 0.90,
                    stroke: "#999",
                    pointerEvents: "none"
                },
                dot: {
                    fill: "#999"
                }
            },
            infoWidth: 90,
            infoHeight: 25,
            markerRadius: 2,
            offsetX: 0,
            offsetY: 0
        };
    },

    propTypes: {

        /**
         * What [Pond Event](http://software.es.net/pond#event) to mark
         */
        event: React.PropTypes.oneOfType([
            React.PropTypes.instanceOf(Event),
            React.PropTypes.instanceOf(IndexedEvent),
            React.PropTypes.instanceOf(TimeRangeEvent)
        ]).isRequired,

        /**
         * Which column in the Event to use
         */
        column: React.PropTypes.string,

        /**
         * The style of the info box and connecting lines
         */
        infoStyle: React.PropTypes.object,

        /**
         * The width of the hover info box
         */
        infoWidth: React.PropTypes.number,

        /**
         * The height of the hover info box
         */
        infoHeight: React.PropTypes.number,

        /**
         * The values to show in the info box. This is either an array of
         * objects, with each object specifying the label and value
         * to be shown in the info box, or a simple string label
         */
        info: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    label: React.PropTypes.string,
                    value: React.PropTypes.string
                })
            )])
    },

    renderTime(event) {
        if (event instanceof Event) {
            return this.renderEventTime(event.timestamp());
        } else if (event instanceof IndexedEvent) {
            return this.renderEventIndex(event.index());
        } else if (event instanceof TimeRangeEvent) {
            return this.renderEventTimeRange(event.timerange());
        }
    },

    renderEventTime(d) {
        const textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd",
            pointerEvents: "none"
        };

        // Use the infoTimeFormat if supplied, otherwise the timeline format
        const fmt = this.props.infoTimeFormat || "%m/%d/%y %X";
        const format = timeFormat(fmt);
        let dateStr = format(d);

        return (
            <text x={0} y={0} dy="1.2em" style={textStyle}>
                {dateStr}
            </text>
        );
    },

    renderEventIndex(index) {
        const textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd",
            pointerEvents: "none"
        };

        return (
            <text x={0} y={0} dy="1.2em" style={textStyle}>
                {index.toString()}
            </text>
        );
    },

    renderEventTimeRange(timerange) {
        const textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd",
            pointerEvents: "none"
        };

        const d1 = timerange.begin();
        const d2 = timerange.end();

        // Use the infoTimeFormat if supplied, otherwise the timeline format
        const fmt = this.props.infoTimeFormat || "%m/%d/%y %X";
        const format = timeFormat(fmt);
        let dateStr = `${format(d1)} to ${format(d2)}`;

        return (
            <text x={0} y={0} dy="1.2em" style={textStyle}>
                {dateStr}
            </text>
        );
    },

    renderMarker(event, column, info) {

        //
        // Position the marker
        //

        let t;
        if (event instanceof Event) {
            t = event.timestamp();
        } else {
            t = new Date(event.begin().getTime() +
                (event.end().getTime() - event.begin().getTime())/2);
        }

        // Allow overrides on the x and y position
        const posx = this.props.timeScale(t) + this.props.offsetX;
        const posy = this.props.yScale(event.get(column)) - this.props.offsetY;

        //
        // Build the info box
        //

        const infoBoxProps = {
            align: "left",
            style: this.props.infoStyle.box,
            width: this.props.infoWidth,
            height: this.props.infoHeight
        };


        const w = this.props.infoWidth;
        const lineBottom = posy - 10;

        let verticalConnector;
        let horizontalConnector;
        let dot;
        let infoBox;
        let transform;

        if (info) {
            infoBox = _.isString(this.props.info) ? (
                <Label {...infoBoxProps} label={info} />
            ) : (
                <ValueList {...infoBoxProps} values={info} />
            );
        }

        //
        // Marker on right of event
        //

        if (posx + 10 + w < this.props.width * 3 / 4) {
            if (info) {
                verticalConnector = (
                    <line
                        pointerEvents="none"
                        style={this.props.infoStyle.line}
                        x1={-10} y1={lineBottom}
                        x2={-10} y2={20} />
                );
                horizontalConnector = (
                    <line
                        pointerEvents="none"
                        style={this.props.infoStyle.line}
                        x1={-10} y1={20}
                        x2={-2} y2={20} />
                );
            }
            dot = (
                <circle
                    cx={-10}
                    cy={lineBottom}
                    r={this.props.markerRadius}
                    pointerEvents="none"
                    style={this.props.infoStyle.dot} />
            );
            transform = `translate(${posx + 10},${10})`;
        } else {
            if (info) {
                verticalConnector = (
                    <line
                        pointerEvents="none"
                        style={this.props.infoStyle.line}
                        x1={w + 10} y1={lineBottom}
                        x2={w + 10} y2={20} />
                );
                horizontalConnector = (
                    <line
                        pointerEvents="none"
                        style={this.props.infoStyle.line}
                        x1={w + 10} y1={20}
                        x2={w + 2} y2={20} />
                );
            }
            dot = (
                <circle
                    cx={w + 10}
                    cy={lineBottom}
                    r={this.props.markerRadius}
                    pointerEvents="none"
                    style={this.props.infoStyle.dot} />
            );
            transform = `translate(${posx - w - 10},${10})`;

        }

        return (
            <g transform={transform} >
                {verticalConnector}
                {horizontalConnector}
                {dot}
                {this.renderTime(event)}
                <g transform={`translate(0,${20})`}>
                    {infoBox}
                </g>
            </g>
        );
    },

    render() {
        const { event, column, info } = this.props;
        return (
            <g>
                {this.renderMarker(event, column, info)}
            </g>
        );
    }
});
