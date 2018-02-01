/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import merge from "merge";
import React from "react";
import { TimeSeries, Time, Event, Key } from "pondjs";

import { ChartProps } from "./Charts";
import { EventMarker, EventMarkerProps } from "./EventMarker";
import { Styler } from "../js/styler";

import { BarChartStyle, ChannelStyle, defaultBarChartStyle as defaultStyle } from "./style";
import { LabelValueList } from "./types";

type BarChartProps = ChartProps & {
    series: TimeSeries<Key>,
    spacing?: number,
    offset?: number,
    columns?: string[],
    style?: BarChartStyle | ((column: string) => ChannelStyle) | Styler,
    info?: LabelValueList | string,
    stemStyle?: object,
    infoStyle?: object,
    infoWidth?: number,
    infoHeight?: number,
    infoTimeFormat?: string | ((...args: any[]) => any),
    markerRadius?: number,
    markerStyle?: object,
    size?: number,
    selected?: {
        event?: any,
        column?: string
    },
    onSelectionChange?: (...args: any[]) => any,
    highlighted?: {
        event?: any,
        column?: string
    },
    onHighlightChange?: (...args: any[]) => any,
};

/**
 * Renders a bar chart based on IndexedEvents within a TimeSeries.
 *
 * This BarChart implementation is a little different that other time axis
 * bar charts in that it will render across a the time range of the event
 * rather than rendering to specific categories. As a result,
 * a Aug-2014 bar will render between the Aug 2014 tick mark and
 * the Sept 2014 tickmark. However, this allows it to play well with other
 * types of charts that maybe integrated into the same visualization.
 *
 * The BarChart will render a single TimeSeries. You can specify the columns
 * you want to render with the `columns` prop. Each column will be stacked on
 * the other, in the order specified in the `columns` array.
 *
 * ### IndexedEvents
 *
 * BarCharts are supposed to be for aggregated values (e.g. average of
 * many points over an hour), so the hours themselves are specified
 * with an "Index". An Index is a string that represents that range of time,
 * rather than a specific time like a timestamp would.
 *
 * Pond provides several mechanisms for building aggregated series from
 * a TimeSeries, and the BarChart code is suited to visualizing that
 * output. See Pond for more details (especially TimeSeries.fixedWindowRollup
 * and the Pipeline processing facilities). The realtime example in this
 * library also shows how to do this on incoming streams of data.
 *
 * If you have one timestamped point per hour and really want to represent
 * those with a BarChart, you can use the Pond static method
 * `Index.getIndexString(period, date)` to take the Date and return an
 * Index string. Say if those points were hourly, you'll end up with
 * strings that look like "1h-412715". This represents a specific hour
 * in time (the 412,715th hour since midnight 1 Jan 1970, actually).
 * Note that for larger time periods, index strings can be partial
 * dates, like "2016-08-31" for Aug 31st, 2016 or "2016-08" for Aug 2016.
 *
 * Use those index strings to build your timeseries instead of timestamps.
 * Here's the Pond code needed to convert a date to an index string:
 *
 * ```
 *   import { Index } from "pondjs";
 *   const d = new Date("2017-01-30T11:58:38.741Z");
 *   const index = Index.getIndexString("1h", d);   // '1h-412715'
 * ```
 *
 * With either the aggregated approach, or the above timestamped
 * conversion, you will want a `TimeSeries` of `IndexedEvent`s that
 * looks like this:
 * ```
 *   const series = new TimeSeries({
 *     name: "myseries",
 *     columns: ["index", "value"],
 *     points: [
 *       ["1h-41275", 22],
 *       ["1h-41276", 35],
 *       ["1h-41277", 72],
 *       ...
 *     ]
 *   })
 * ```
 *
 * Note: the first column of the timeseries should be "index" (not "time")
 * and each point should have an index string at the beginning.
 *
 * ### Interactivity
 *
 * The BarChart supports selection of individual bars. To control this use
 * `onSelectionChange` to get a callback of selection changed. Your callback
 * will be called with the selection (an object containing the event
 * and column). You can pass this back into the BarChart as `selection`. For
 * example:
 *
 * ```
 *  <BarChart
 *      ...
 *      selection={this.state.selection}
 *      onSelectionChange={selection => this.setState({selection})} />
 * ```
 *
 * Similarly you can monitor which bar is being hovered over with the
 * `onHighlightChange` callback. This can be used to determine the info box
 * to display. Info box will display a box (like a tooltip) with a line
 * connecting it to the bar. You use the `info` prop to evoke this and to
 * supply the text for the info box. See the styling notes below for more
 * information on this.
 *
 * ### Styling
 *
 * A BarChart supports per-column or per-event styling. Styles can be set for
 * each of the four states that are possible: normal, highlighted,
 * selected and muted. To style per-column, supply an object. For per-event styling
 * supply a function: `(event, column) => {}` The functon should return a style object.
 *
 * See the `style` prop in the API documentation for more information.
 *
 * Separately the size of the bars can be controlled with the `spacing` and
 * `offset` props. Spacing controls the gap between the bars. Offset moves the
 * bars left or right by the given number of pixels. You can use this to place
 * bars along side each other. Alternatively, you can give each column a fixed width
 * using the `size` prop. In this case this size will be used in preference to the size
 * determined from the timerange of the event and the `spacing`.
 *
 * The info box is also able to be styled using `infoStyle`, `stemStyle` and
 * `markerStyle` This enables you to control the drawing of the box, the connecting
 * lines (stem) and dot respectively. Using the `infoWidth` and `infoHeight`
 * props you can control the size of the box, which is fixed. For the info inside
 * the box, it's up to you: it can either be a simple string or an array of
 * {label, value} pairs.
 */
export default class BarChart extends React.Component<BarChartProps> {

    static defaultProps: Partial<BarChartProps> = {
        columns: ["value"],
        spacing: 1.0,
        offset: 0,
        infoStyle: {
            stroke: "#999",
            fill: "white",
            opacity: 0.9,
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
        infoWidth: 90,
        infoHeight: 30
    };

    handleHover(e, event, column) {
        const bar = { event, column };
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(bar);
        }
    }

    handleHoverLeave() {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    }

    handleClick(e, event, column) {
        const bar = { event, column };
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(bar);
        }
        e.stopPropagation();
    }

    providedStyleMap(column: string): ChannelStyle {
        let style: ChannelStyle;
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
                style = this.props.style.barChartStyle()[column];
            } else if (_.isFunction(this.props.style)) {
                style = this.props.style(column);
            } else if (_.isObject(this.props.style)) {
                style = this.props.style ? this.props.style[column] : defaultStyle;
            }
        }
        return style;
    }

    /**
     * Returns the style used for drawing the path
     */
    style(column, event) {
        let style;
        const styleMap = this.providedStyleMap(column);
        const isHighlighted =
            this.props.highlighted &&
            column === this.props.highlighted.column &&
            Event.is(this.props.highlighted.event, event);
        const isSelected =
            this.props.selected &&
            column === this.props.selected.column &&
            Event.is(this.props.selected.event, event);
        if (this.props.selected) {
            if (isSelected) {
                style = merge(
                    true,
                    defaultStyle.selected,
                    styleMap.selected ? styleMap.selected : {}
                );
            } else if (isHighlighted) {
                style = merge(
                    true,
                    defaultStyle.highlighted,
                    styleMap.highlighted ? styleMap.highlighted : {}
                );
            } else {
                style = merge(true, defaultStyle.muted, styleMap.muted ? styleMap.muted : {});
            }
        } else if (isHighlighted) {
            style = merge(
                true,
                defaultStyle.highlighted,
                styleMap.highlighted ? styleMap.highlighted : {}
            );
        } else {
            style = merge(true, defaultStyle.normal, styleMap.normal ? styleMap.normal : {});
        }
        return style;
    }

    renderBars() {
        const spacing = +this.props.spacing;
        const offset = +this.props.offset;
        const series = this.props.series;
        const timeScale = this.props.timeScale;
        const yScale = this.props.yScale;
        const columns = this.props.columns;

        const bars = [];
        let eventMarker;

        for (const event of series.collection().eventList()) {
            const begin = event.begin();
            const end = event.end();
            const beginPos = timeScale(begin) + spacing;
            const endPos = timeScale(end) - spacing;
            let width;
            if (this.props.size) {
                width = this.props.size;
            } else {
                width = endPos - beginPos;
            }
            if (width < 1) {
                width = 1;
            }
            let x;
            if (this.props.size) {
                const center = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;
                x = center - this.props.size / 2 + offset;
            } else {
                x = timeScale(begin) + spacing + offset;
            }
            const yBase = yScale(0);
            let yposPositive = yBase;
            let yposNegative = yBase;
            if (columns) {
                for (const column of columns) {
                    const index = event.indexAsString();
                    const key = `${series.name()}-${index}-${column}`;
                    const value = event.get(column);
                    const style = this.style(column, event);
                    let height = yScale(0) - yScale(value);

                    // Allow negative values. Minimum bar height = 1 pixel.
                    // Stack negative bars below X-axis and positive above X-Axis
                    const positiveBar = height >= 0;
                    height = Math.max(Math.abs(height), 1);
                    const y = positiveBar ? yposPositive - height : yposNegative;

                    // Event marker if `info` provided and we are hovering over this bar
                    const isHighlighted =
                        this.props.highlighted &&
                        column === this.props.highlighted.column &&
                        Event.is(this.props.highlighted.event, event);
                    if (isHighlighted && this.props.info) {
                        const eventMarkerProps: EventMarkerProps = {
                            key,
                            event,
                            column,
                            type: "flag",
                            info: this.props.info,
                            style,
                            width: this.props.width,
                            height: this.props.height,
                            infoWidth: this.props.infoWidth,
                            infoHeight: this.props.infoWidth,
                            infoTimeFormat: this.props.infoTimeFormat,
                            markerRadius: this.props.markerRadius,
                            offsetX: offset,
                            offsetY: yBase - (positiveBar ? yposPositive : yposNegative),
                        }
                        eventMarker = (
                            <EventMarker {...eventMarkerProps} />
                        );
                    }
                    const box = { x, y, width, height };
                    const barProps: React.SVGProps<SVGRectElement> = { key, ...box, style };

                    if (this.props.onSelectionChange) {
                        barProps.onClick = e => this.handleClick(e, event, column);
                    }
                    if (this.props.onHighlightChange) {
                        barProps.onMouseMove = e => this.handleHover(e, event, column);
                        barProps.onMouseLeave = () => this.handleHoverLeave();
                    }

                    bars.push(
                        <rect {...barProps} />
                    );

                    if (positiveBar) {
                        yposPositive -= height;
                    } else {
                        yposNegative += height;
                    }
                }
            }
        }
        return (
            <g>
                {bars}
                {eventMarker}
            </g>
        );
    }

    render() {
        return (
            <g>{this.renderBars()}</g>
        );
    }
}
