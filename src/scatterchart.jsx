/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import { timeFormat } from "d3-time-format";
import merge from "merge";
import { Event } from "pondjs";

import ValueList from "./valuelist";

const defaultStyle = {
    normal: {fill: "steelblue"},
    highlight: {fill: "#5a98cb"},
    selected: {fill: "yellow"},
    text: {fill: "#333", stroke: "none"}
};

// http://stackoverflow.com/a/28857255
function getElementOffset(element) {
    const de = document.documentElement;
    const box = element.getBoundingClientRect();
    const top = box.top + window.pageYOffset - de.clientTop;
    const left = box.left + window.pageXOffset - de.clientLeft;
    return {top, left};
}

/**
 * The `<ScatterChart >` widget is able to display a single series
 * scattered across a time axis.
 *
 * The ScatterChart should be used within `<ChartContainer>` etc.,
 * as this will construct the horizontal and vertical axis, and
 * manage other elements.
 *
 *
 * ```
 * <ChartContainer timeRange={series.timerange()}>
 *     <ChartRow height="150">
 *         <YAxis id="wind" label="Wind gust (mph)" labelOffset={-5}
 *                min={0} max={series.max()} width="100" type="linear" format=",.1f"/>
 *         <Charts>
 *             <ScatterChart axis="wind" series={series} style={{color: "steelblue", opacity: 0.5}} />
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
export default React.createClass({

    displayName: "ScatterChart",

    getDefaultProps() {
        return {
            columns: ["value"],

            radius: 2.0,

            style: {},

            hintStyle: {
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
                }
            },

            hintWidth: 90,
            hintHeight: 30
        };
    },

    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: React.PropTypes.object.isRequired,


        /**
         * Which columns of the series to render
         */
        columns: React.PropTypes.arrayOf(React.PropTypes.string),

        /**
         * Reference to the axis which provides the vertical scale for drawing. e.g.
         * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
         */
        axis: React.PropTypes.string.isRequired,

        /**
         * The radius of the points in the scatter chart.
         *
         * If this is a number it will be used as the radius for every point.
         * If this is a function it will be called for each event.
         *
         * The function is called with the event and the column name and must return a number.
         *
         * For example this function will use the radius column of the event:
         * ```
         * const radius = (event, column) => {
         *    return event.get("radius");
         * }
         * ```
         */
        radius: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.func
        ]),

        /**
         * The style of the scatter chart drawing (using SVG CSS properties).
         * This is an object with a key for each column which is being plotted,
         * per the `columns` argument. Each of those keys has an object as it's
         * value which has keys which are style properties for an SVG Circle and
         * the value to use.
         *
         * For example:
         * ```
         * style = {
         *     columnName: {
         *         normal: {
         *             fill: "steelblue",
         *             opacity: 0.5,
         *         },
         *         highlighted: {
         *             fill: "red",
         *             opacity: 1.0,
         *         },
         *         selected: {
         *             fill: "orange",
         *             opacity: 1.0,
         *         }
         *     }
         * }
         * ```
         */
        style: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.func
        ]),

        /**
         * The width of the hover hint box
         */
        hintWidth: React.PropTypes.number,

        /**
         * The height of the hover hint box
         */
        hintHeight: React.PropTypes.number,

        /**
         * The values to show in the hint box. This is an array of
         * objects, with each object specifying the label and value
         * to be shown in the hint box.
         */
        hintValues: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                value: React.PropTypes.string
            })
        )
    },

    /**
     * hover state is tracked internally and a highlight shown as a result
     */
    getInitialState() {
        return {
            hover: null
        };
    },

    handleClick(e, event, column) {
        const point = {event, column};
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(point);
        }
    },

    handleBackgroundClick() {
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(null);
        }
    },

    // get the event mouse position relative to the event rect
    getOffsetMousePosition(e) {
        const trackerRect = ReactDOM.findDOMNode(this.refs.eventrect);
        const offset = getElementOffset(trackerRect);
        const x = e.pageX - offset.left;
        const y = e.pageY - offset.top;
        return [Math.round(x), Math.round(y)];
    },

    handleHover(e) {
        const [x, y] = this.getOffsetMousePosition(e);

        let point;
        let minDistance = Infinity;
        for (const column of this.props.columns) {
            let key = 1;
            for (const event of this.props.series.events()) {
                const t = event.timestamp();
                const value = event.get(column);
                const px = this.props.timeScale(t);
                const py = this.props.yScale(value);

                const distance =
                    Math.sqrt((px - x)*(px - x) + (py - y)*(py - y));
                if (distance < minDistance) {
                    point = {event, column};
                    minDistance = distance;
                }
                key++;
            }
        }

        if (this.props.onMouseNear) {
            this.props.onMouseNear(point);
        }
    },

    handleHoverLeave() {
        if (this.props.onMouseNear) {
            this.props.onMouseNear(null);
        }
    },

    renderTrackerTime(d) {
        const textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd",
            pointerEvents: "none"
        };

        // Use the hintTimeFormat if supplied, otherwise the timeline format
        const fmt = this.props.hintTimeFormat || "%m/%d/%y %X";
        const format = timeFormat(fmt);
        let dateStr = format(d);

        return (
            <text x={0} y={0} dy="1.2em" style={textStyle}>
                {dateStr}
            </text>
        );
    },

    renderHint(time, posx, posy, valueList) {
        const w = this.props.hintWidth;

        if (valueList) {
            if (posx + 10 + w < this.props.width * 3 / 4) {
                const horizontalConnector = (
                    <line
                        pointerEvents="none"
                        style={this.props.hintStyle.line}
                        x1={-10} y1={posy - 10}
                        x2={0} y2={posy - 10} />
                );
                const verticalConnector = (
                    <line
                        pointerEvents="none"
                        style={this.props.hintStyle.line}
                        x1={0} y1={posy - 10}
                        x2={0} y2={20} />
                );
                return (
                    <g transform={`translate(${posx + 10},${10})`} >
                        {horizontalConnector}
                        {verticalConnector}
                        {this.renderTrackerTime(time)}
                        <g transform={`translate(0,${20})`}>
                            <ValueList
                                align="left"
                                values={valueList}
                                style={this.props.hintStyle.box}
                                width={this.props.hintWidth}
                                height={this.props.hintHeight} />
                        </g>
                    </g>
                );
            } else {
                const verticalConnector = (
                    <line
                        pointerEvents="none"
                        style={this.props.hintStyle.line}
                        x1={w} y1={posy - 10}
                        x2={w} y2={20} />
                );
                const horizontalConnector = (
                    <line
                        pointerEvents="none"
                        style={this.props.hintStyle.line}
                        x1={w} y1={posy - 10}
                        x2={w + 10} y2={posy - 10} />
                );
                return (
                    <g transform={`translate(${posx - w - 10},${10})`} >
                        {horizontalConnector}
                        {verticalConnector}
                        {this.renderTrackerTime(time)}
                        <g transform={`translate(0,${20})`}>
                            <ValueList
                                align="left"
                                values={valueList}
                                style={this.props.hintStyle.box}
                                width={this.props.hintWidth}
                                height={this.props.hintHeight} />
                        </g>
                    </g>
                );
            }
        } else {
            return (
                <g />
            );
        }
    },

    renderScatter() {
        const { series, timeScale, yScale } = this.props;
        const points = [];
        let hoverOverlay;

        this.props.columns.forEach(column => {
            let key = 1;
            for (const event of series.events()) {
                const t = event.timestamp();
                const value = event.get(column);

                const x = timeScale(t);
                const y = yScale(value);

                const radius = _.isFunction(this.props.radius) ?
                    this.props.radius(event, column) : this.props.radius;

                const isHighlighted =
                    (this.state.hover &&
                        Event.is(this.state.hover, event)) ||
                    (this.props.highlight &&
                        Event.is(this.props.highlight.event, event) &&
                        column === this.props.highlight.column);

                const isSelected =
                    (this.props.selection &&
                        Event.is(this.props.selection.event, event) &&
                        column === this.props.selection.column);

                const providedStyle = this.props.style ?
                    this.props.style[column] : {};

                const styleMap = _.isFunction(this.props.style) ?
                    this.props.style(event, column) :
                    merge(true, defaultStyle, providedStyle);

                let style;
                if (this.props.selection) {
                    if (isSelected) {
                        style = styleMap.selected;
                    } else if (isHighlighted) {
                        style = styleMap.highlighted;
                    } else {
                        style = styleMap.muted;
                    }
                } else if (isHighlighted) {
                    style = styleMap.highlighted;
                } else {
                    style = styleMap.normal;
                }
                style.cursor = "crosshair";

                // Hover hint
                if (isHighlighted && this.props.hintValues) {
                    hoverOverlay = this.renderHint(t, x, y, this.props.hintValues);
                }

                points.push(
                    <circle
                        key={`${column}-${key}`}
                        cx={x}
                        cy={y}
                        r={radius}
                        style={style}
                        pointerEvents="none"
                        clipPath={this.props.clipPathURL}
                        onMouseMove={this.handleHover}
                        onClick={e => this.handleClick(e, event, column)} />
                );

                key++;
            }
        });

        return (
            <g>
                {points}
                {hoverOverlay}
            </g>
        );
    },

    render() {
        return (
            <g>
                <rect
                    key="scatter-hit-rect"
                    ref="eventrect"
                    style={{opacity: 0.0}}
                    x={0} y={0}
                    width={this.props.width}
                    height={this.props.height}
                    onClick={this.handleBackgroundClick}
                    onMouseMove={this.handleHover}
                    onMouseLeave={this.handleHoverLeave} />
                {this.renderScatter()}
            </g>
        );
    }
});
