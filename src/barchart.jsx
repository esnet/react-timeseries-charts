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
import _ from "underscore";
import merge from "merge";
import { TimeSeries, Event, IndexedEvent } from "pondjs";
import EventMarker from "./eventmarker";

const defaultStyle = {
    normal: {fill: "steelblue"},
    highlight: {fill: "#5a98cb"},
    selected: {fill: "yellow"},
    text: {fill: "#333", stroke: "none"}
};

/**
 * Renders a barchart based on IndexedEvents within a TimeSeries.
 *
 * This BarChart implementation is a little different that other time axis
 * bar charts in that it will render across a the time range of the event
 * rather than rendering to specific categories. As a result,
 * a Aug-2014 bar will render between the Aug 2014 tick mark and the Sept 2014
 * tickmark.
 *
 * The BarChart will render a single TimeSeries. You can specify the columns
 * you want to render with the `columns` prop. Each column will be stacked on
 * the other, in the order specified in the `columns` array.
 *
 * The BarChart supports selection of individual bars. To control this use
 * `onSelectionChange` to get a callback of selection changed. Your callback
 * will be called with with the selection (and object containing the event
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
 * `onHighlightChanged` callback. This can be used to determine the info text
 * to display. Info text will display a box (like a tooltip) with a line
 * connecting it to the bar. You use the `info` prop to evoke this and to
 * supply the text for the info box. See the styling notes below for more
 * information on this.
 *
 * ### Styling
 *
 * A BarChart supports per-column or per-event styling. Styles can be set for
 * each of the four states that are possible for each event: normal, highlighted,
 * selected and muted. To style per-column, supply an object. For per-event styling
 * supply a function: `(event, column) => {}` The functon will return a style object.
 *
 * See the `style` prop in the API documentation for more information.
 *
 * Separately the size of the bars can be controlled with the `spacing` and
 * `offset` props. Spacing controls the gap between the bars. Offset moves the
 * bars left or right by the given number of pixels. You can use this to place
 * bars along side each other. Alternatively, you can give each column a fixed width
 * using the `size` prop. In this case this size will be used over the size
 * determined from the timerange of the event and the `spacing`.
 *
 * The highlight info for each bar is also able to be styled using the `infoStyle`.
 * This enables you to control the drawing of the box, connecting lines and dot.
 * Using the `infoWidth` and `infoHeight` props you can control the size of the
 * box, which is fixed. For the info inside the box, it's up to you: it can either
 * be a simple string or an array of {label, value} pairs.
 */
export default React.createClass({

    displayName: "BarChart",

    getDefaultProps() {
        return {
            columns: ["value"],
            spacing: 1.0,
            offset: 0,
            style: {},
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
            infoHeight: 30
        };
    },

    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries)
         * data to visualize
         */
        series: React.PropTypes.instanceOf(TimeSeries).isRequired,

        /**
         * The distance in pixels to inset the bar chart from its actual timerange
         */
        spacing: React.PropTypes.number,

        /**
         * The distance in pixels to offset the bar from its center position within the timerange
         * it represents
         */
        offset: React.PropTypes.number,

        /**
         * A list of columns within the series that will be stacked on top of each other
         */
        columns: React.PropTypes.arrayOf(
            React.PropTypes.string
        ),

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
        style: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.func
        ]),

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
         * The values to show in the info box. This is an array of
         * objects, with each object specifying the label and value
         * to be shown in the info box.
         */
        info: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                value: React.PropTypes.string
            })
        ),
 
        /**
         * If size is specified, then the bar will be this number of pixels wide. This
         * prop takes priority over "spacing".
         */
        size: React.PropTypes.number,

        /**
         * The selected item, which will be rendered in the "selected" style.
         * If a bar is selected, all other bars will be rendered in the "muted" style.
         *
         * See also `onSelectionChange`
         */
        selected: React.PropTypes.shape({
            event: React.PropTypes.instanceOf(IndexedEvent),
            column: React.PropTypes.string
        }),
        
        /**
         * A callback that will be called when the selection changes. It will be called
         * with an object containing the event and column.
         */
        onSelectionChange: React.PropTypes.func,

        /**
         * The highlighted item, which will be rendered in the "highlighted" style.
         *
         * See also `onHighlightChanged`
         */
        highlighted: React.PropTypes.shape({
            event: React.PropTypes.instanceOf(IndexedEvent),
            column: React.PropTypes.string
        }),

        /**
         * A callback that will be called when the hovered over bar changes.
         * It will be called with an object containing the event and column.
         */
        onHighlightChanged: React.PropTypes.func

    },

    handleHover(e, event, column) {
        const bar = {event, column};
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(bar);
        }
    },

    handleHoverLeave() {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    },

    handleClick(e, event, column) {
        const bar = {event, column};
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(bar);
        }

        e.stopPropagation();
    },

    handleBackgroundClick() {
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(null);
        }
    },

    renderBars() {
        const spacing = +this.props.spacing;
        const offset = +this.props.offset;
        const series = this.props.series;
        const timeScale = this.props.timeScale;
        const yScale = this.props.yScale;
        const columns = this.props.columns || series._columns;

        const bars = [];
        let hoverOverlay;

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
                const center = timeScale(begin) +
                    (timeScale(end) - timeScale(begin)) / 2;
                x = center - this.props.size / 2 + offset;
            } else {
                x = timeScale(begin) + spacing + offset;
            }

            const yBase = yScale(0);
            let ypos = yBase;
            if (columns) {
                for (const column of columns) {
                    const index = event.index();
                    const key = `${series.name()}-${index}-${column}`;
                    const value = event.get(column);

                    let height = yScale(0) - yScale(value);
                    if (height < 1) {
                        height = 1;
                    }

                    const y = ypos - height;

                    const isHighlighted =
                        this.props.highlight &&
                        Event.is(this.props.highlight.event, event) &&
                        column === this.props.highlight.column;

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

                    // Hover info box
                    if (isHighlighted && this.props.info) {
                        hoverOverlay = (
                            <EventMarker
                                {...this.props}
                                offsetX={offset}
                                offsetY={yBase - ypos}
                                event={event}
                                column={column} />
                        );
                    }

                    bars.push(
                        <rect
                            key={key}
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            pointerEvents="none"
                            style={style}
                            clipPath={this.props.clipPathURL}
                            onClick={e => this.handleClick(e, event, column)}
                            onMouseLeave={this.handleHoverLeave}
                            onMouseMove={e => this.handleHover(e, event, column)}/>
                    );

                    ypos -= height;
                }
            }
        }

        return (
            <g>
                {bars}
                {hoverOverlay}
            </g>
        );
    },

    render() {
        return (
            <g>
                {this.renderBars()}
            </g>
        );
    }
});
