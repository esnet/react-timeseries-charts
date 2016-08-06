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
import merge from "merge";
import { TimeSeries, Event } from "pondjs";
import EventMarker from "./EventMarker";

const defaultStyle = {
    normal: {fill: "steelblue", opacity: 0.8},
    highlighted: {fill: "#5a98cb", opacity: 1.0},
    selected: {fill: "orange", opacity: 1.0},
    muted: {fill: "steelblue", opacity: 0.4},
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
 * The `<ScatterChart >` widget is able to display multiple columns of a series
 * scattered across a time axis.
 *
 * The ScatterChart should be used within `<ChartContainer>` etc.,
 * as this will construct the horizontal and vertical axis, and
 * manage other elements. As with other charts, this lets them be stacked or
 * overlaid on top of each other.
 *
 * A custom info overlay lets you hover over the data and examine points. Points
 * can be selected or highlighted.
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
 *
 * ### Styling
 *
 * A scatter chart supports per-column or per-event styling. Styles can be set for
 * each of the four states that are possible for each event: normal, highlighted,
 * selected or muted. To style per-column, supply an object. For per-event styling
 * supply a function: `(event, column) => {}` The functon will return a style object.
 * See the `style` prop in the API documentation for more information.
 *
 * Separately the size of the dots can be controlled with the `radius` prop. This
 * can either be a fixed value (e.g. 2.0), or a function. If a function is supplied
 * it will be called as `(event, column) => {}` and should return the size.
 *
 * The hover info for each point is also able to be styled using the info style.
 * This enables you to control the drawing of the box and connecting lines. Using
 * the `infoWidth` and `infoHeight` props you can control the size of the box, which
 * is fixed.
 */
export default React.createClass({

    displayName: "ScatterChart",

    getDefaultProps() {
        return {
            columns: ["value"],
            radius: 2.0,
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
                }
            },
            infoWidth: 90,
            infoHeight: 30
        };
    },

    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: React.PropTypes.instanceOf(TimeSeries).isRequired,


        /**
         * Which columns of the series to render
         */
        columns: React.PropTypes.arrayOf(
            React.PropTypes.string
        ),

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
         *
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
         * per the `columns` prop. Each of those keys has an object as its
         * value which has keys which are style properties for an SVG <Circle> and
         * the value to use.
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
         * 4 states (normal, highlighted, selected and muted) and the corresponding
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
         * The selected dot, which will be rendered in the "selected" style.
         * If a dot is selected, all other dots will be rendered in the "muted" style.
         *
         * See also `onSelectionChange`
         */
        selected: React.PropTypes.object,
        
        /**
         * A callback that will be called when the selection changes. It will be called
         * with an object containing the event and column.
         */
        onSelectionChange: React.PropTypes.func,

        /**
         * The highlighted dot, as an object containing the event and
         * column, which will be rendered in the "highlighted" style.
         *
         * See also `onHighlightChanged`
         */
        highlighted: React.PropTypes.object,

        /**
         * A callback that will be called when the hovered over dot changes.
         * It will be called with an object containing the event and column.
         */
        onHighlightChanged: React.PropTypes.func
    },

    handleClick(e, event, column) {
        const point = {event, column};
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(point);
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

                // Hover info
                if (isHighlighted && this.props.info) {
                    hoverOverlay = (
                        <EventMarker
                            {...this.props}
                            event={event}
                            column={column}
                            marker="circle"
                            markerRadius="0" />
                    );
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
                    onMouseMove={this.handleHover}
                    onMouseLeave={this.handleHoverLeave} />
                {this.renderScatter()}
            </g>
        );
    }
});
