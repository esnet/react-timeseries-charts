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
import PropTypes from "prop-types";
import { TimeSeries, IndexedEvent, Event } from "pondjs";

import EventMarker from "./EventMarker";
import { Styler } from "../js/styler";

const defaultStyle = {
    normal: { fill: "steelblue", opacity: 0.8 },
    highlighted: { fill: "steelblue", opacity: 1.0 },
    selected: { fill: "steelblue", opacity: 1.0 },
    muted: { fill: "steelblue", opacity: 0.4 }
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
export default class BarChart extends React.Component {
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

    providedStyleMap(column, event) {
        let style = {};
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
                style = this.props.style.barChartStyle()[column];
            } else if (_.isFunction(this.props.style)) {
                style = this.props.style(column, event);
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
        const styleMap = this.providedStyleMap(column, event);

        const isHighlighted =
            this.props.highlighted &&
            ((column === this.props.highlighted.column &&
                Event.is(this.props.highlighted.event, event)) ||
                (this.props.highlightEntireEvent && Event.is(this.props.highlighted.event, event)));

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
        const minBarHeight = this.props.minBarHeight;
        const series = this.props.series;
        const timeScale = this.props.timeScale;
        const yScale = this.props.yScale;
        const columns = this.props.columns || ["value"];

        const bars = [];
        let eventMarker;

        for (const event of series.events()) {
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
                    const index = event.index();
                    const key = `${series.name()}-${index}-${column}`;
                    const value = event.get(column);
                    const style = this.style(column, event);

                    let height = yScale(0) - yScale(value);
                    // Allow negative values. Minimum bar height = 1 pixel.
                    // Stack negative bars below X-axis and positive above X-Axis
                    let positiveBar = height >= 0;
                    height = Math.max(Math.abs(height), minBarHeight);
                    const y = positiveBar ? yposPositive - height : yposNegative;

                    // Don't draw a rect when height and minBarHeight are both 0
                    if (height === 0) break;

                    // Event marker if info provided and hovering
                    const isHighlighted =
                        this.props.highlighted &&
                        column === this.props.highlighted.column &&
                        Event.is(this.props.highlighted.event, event);
                    if (isHighlighted && this.props.info) {
                        eventMarker = (
                            <EventMarker
                                {...this.props}
                                event={event}
                                column={column}
                                offsetX={offset}
                                offsetY={yBase - (positiveBar ? yposPositive : yposNegative)}
                            />
                        );
                    }

                    const box = { x, y, width, height };
                    const barProps = { key, ...box, style };

                    if (this.props.onSelectionChange) {
                        barProps.onClick = e => this.handleClick(e, event, column);
                    }
                    if (this.props.onHighlightChange) {
                        barProps.onMouseMove = e => this.handleHover(e, event, column);
                        barProps.onMouseLeave = () => this.handleHoverLeave();
                    }

                    bars.push(<rect {...barProps} />);

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
        return <g>{this.renderBars()}</g>;
    }
}

BarChart.propTypes = {
    /**
     * Show or hide this chart
     */
    visible: PropTypes.bool,

    /**
     * What [Pond TimeSeries](https://esnet-pondjs.appspot.com/#/timeseries)
     * data to visualize
     */
    series: PropTypes.instanceOf(TimeSeries).isRequired,

    /**
     * The distance in pixels to inset the bar chart from its actual timerange
     */
    spacing: PropTypes.number,

    /**
     * The distance in pixels to offset the bar from its center position within the timerange
     * it represents
     */
    offset: PropTypes.number,

    /**
     * The minimum height of a bar given in pixels.
     * By default, the minimum height of a bar is 1 pixel
     */
    minBarHeight: PropTypes.number,

    /**
     * A list of columns within the series that will be stacked on top of each other
     *
     * NOTE : Columns can't have periods because periods
     * represent a path to deep data in the underlying events
     * (i.e. reference into nested data structures)
     */
    columns: PropTypes.arrayOf(PropTypes.string),

    /**
     * When true, the entire `highlighted` event will be highlighted, instead of
     * only the column bar that's currently being hovered
     */
    highlightEntireEvent: PropTypes.bool,

    /**
     * The style of the bar chart drawing (using SVG CSS properties).
     * This is an object with a key for each column which is being drawn,
     * per the `columns` prop. For each column a style is defined for
     * each state the bar may be in. This style is the CSS properties for
     * the underlying SVG <Rect>, so most likely you'll define fill and
     * opacity.
     *
     * For example:
     * ```
     * style = {
     *     columnName: {
     *         normal: {
     *             fill: "steelblue",
     *             opacity: 0.8,
     *         },
     *         highlighted: {
     *             fill: "#a7c4dd",
     *             opacity: 1.0,
     *         },
     *         selected: {
     *             fill: "orange",
     *             opacity: 1.0,
     *         },
     *         muted: {
     *             fill: "grey",
     *             opacity: 0.5
     *         }
     *     }
     * }
     * ```
     *
     * You can also supply a function, which will be called with an event
     * and column. The function should return an object containing the
     * four states (normal, highlighted, selected and muted) and the corresponding
     * CSS properties.
     */
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.instanceOf(Styler)]),

    /**
     * The values to show in the info box. This is an array of
     * objects, with each object specifying the label and value
     * to be shown in the info box.
     */
    info: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string, //eslint-disable-line
            value: PropTypes.string //eslint-disable-line
        })
    ),

    /**
     * The style of the info box itself. Typically you'd want to
     * specify a fill color, and stroke color / width here.
     */
    infoStyle: PropTypes.object, //eslint-disable-line

    /**
     * The width of the info box
     */
    infoWidth: PropTypes.number, //eslint-disable-line

    /**
     * The height of the info box
     */
    infoHeight: PropTypes.number, //eslint-disable-line

    /**
     * The vertical offset in pixels of the EventMarker info box from the
     * top of the chart.
     */
    infoOffsetY: PropTypes.number,

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
    infoTimeFormat: PropTypes.oneOfType([
        //eslint-disable-line
        PropTypes.string, //eslint-disable-line
        PropTypes.func //eslint-disable-line
    ]),

    /**
     * The radius of the infoBox dot at the end of the marker
     */
    markerRadius: PropTypes.number,

    /**
     * The style of the infoBox dot at the end of the marker
     */
    markerStyle: PropTypes.object,

    /**
     * If size is specified, then the bar will be this number of pixels wide. This
     * prop takes priority over "spacing".
     */
    size: PropTypes.number,

    /**
     * The selected item, which will be rendered in the "selected" style.
     * If a bar is selected, all other bars will be rendered in the "muted" style.
     *
     * See also `onSelectionChange`
     */
    selected: PropTypes.shape({
        event: PropTypes.instanceOf(IndexedEvent),
        column: PropTypes.string
    }),

    /**
     * A callback that will be called when the selection changes. It will be called
     * with an object containing the event and column.
     */
    onSelectionChange: PropTypes.func,

    /**
     * The highlighted item, which will be rendered in the "highlighted" style.
     *
     * See also `onHighlightChange`
     */
    highlighted: PropTypes.shape({
        event: PropTypes.instanceOf(IndexedEvent),
        column: PropTypes.string
    }),

    /**
     * A callback that will be called when the hovered over bar changes.
     * It will be called with an object containing the event and column.
     */
    onHighlightChange: PropTypes.func,

    /**
     * [Internal] The timeScale supplied by the surrounding ChartContainer
     */
    timeScale: PropTypes.func,

    /**
     * [Internal] The yScale supplied by the associated YAxis
     */
    yScale: PropTypes.func
};

BarChart.defaultProps = {
    visible: true,
    columns: ["value"],
    highlightEntireEvent: false,
    spacing: 1.0,
    offset: 0,
    minBarHeight: 1,
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
    infoHeight: 30,
    infoOffsetY: 20
};
