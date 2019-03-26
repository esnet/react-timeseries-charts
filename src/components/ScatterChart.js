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
import ReactDOM from "react-dom"; // eslint-disable-line
import { TimeSeries, Event } from "pondjs";

import EventMarker from "./EventMarker";
import { getElementOffset } from "../js/util";
import { Styler } from "../js/styler";

const defaultStyle = {
    normal: { fill: "steelblue", opacity: 0.8 },
    highlighted: { fill: "steelblue", opacity: 1.0 },
    selected: { fill: "steelblue", opacity: 1.0 },
    muted: { fill: "steelblue", opacity: 0.4 }
};

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
 *             <ScatterChart
 *               axis="wind"
 *               series={series}
 *               style={{color: "steelblue", opacity: 0.5}} />
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
export default class ScatterChart extends React.Component {
    constructor(props) {
        super(props);

        this.handleHover = this.handleHover.bind(this);
        this.handleHoverLeave = this.handleHoverLeave.bind(this);
    }

    // get the event mouse position relative to the event rect
    getOffsetMousePosition(e) {
        const offset = getElementOffset(this.eventrect);
        const x = e.pageX - offset.left;
        const y = e.pageY - offset.top;
        return [Math.round(x), Math.round(y)];
    }

    //
    // Event handlers
    //

    handleClick(e, event, column) {
        const point = { event, column };
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(point);
        }
    }

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
                const distance = Math.sqrt((px - x) * (px - x) + (py - y) * (py - y));
                if (distance < minDistance) {
                    point = { event, column };
                    minDistance = distance;
                }
            }
        }

        if (this.props.onMouseNear) {
            this.props.onMouseNear(point);
        }
    }

    handleHoverLeave() {
        if (this.props.onMouseNear) {
            this.props.onMouseNear(null);
        }
    }

    //
    // Internal methods
    //

    providedStyleMap(column, event) {
        let style = {};
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
                style = this.props.style.scatterChartStyle()[column];
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
            this.props.highlight &&
            column === this.props.highlight.column &&
            Event.is(this.props.highlight.event, event);
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

    //
    // Render
    //

    renderScatter() {
        const { series, timeScale, yScale } = this.props;
        const points = [];
        let hoverOverlay;

        // if selectionChange is enabled, pointerEvents should be enabled as well
        const pointerEvents = this.props.onSelectionChange ? "auto" : "none";

        this.props.columns.forEach(column => {
            let key = 1;
            for (const event of series.events()) {
                const t = new Date(
                    event.begin().getTime() + (event.end().getTime() - event.begin().getTime()) / 2
                );
                const value = event.get(column);
                const badPoint = _.isNull(value) || _.isNaN(value) || _.isUndefined(value);
                const style = this.style(column, event);

                if (!badPoint) {
                    const x = timeScale(t);
                    const y = yScale(value);

                    const radius = _.isFunction(this.props.radius)
                        ? this.props.radius(event, column)
                        : +this.props.radius;

                    const isHighlighted =
                        this.props.highlight &&
                        Event.is(this.props.highlight.event, event) &&
                        column === this.props.highlight.column;

                    // Hover info. Note that we just pass all of our props down
                    // into the EventMarker here, but the interesting ones are:
                    // * the info values themselves
                    // * the infoStyle
                    // * infoWidth and infoHeight
                    if (isHighlighted && this.props.info) {
                        hoverOverlay = (
                            <EventMarker
                                {...this.props}
                                event={event}
                                column={column}
                                marker="circle"
                                markerRadius={0}
                            />
                        );
                    }

                    points.push(
                        <circle
                            key={`${column}-${key}`}
                            cx={x}
                            cy={y}
                            r={radius}
                            style={style}
                            pointerEvents={pointerEvents}
                            onMouseMove={this.handleHover}
                            onClick={e => this.handleClick(e, event, column)}
                        />
                    );

                    key += 1;
                }
            }
        });

        return (
            <g>
                {points}
                {hoverOverlay}
            </g>
        );
    }

    render() {
        return (
            <g>
                <rect
                    key="scatter-hit-rect"
                    ref={c => {
                        this.eventrect = c;
                    }}
                    style={{ opacity: 0.0 }}
                    x={0}
                    y={0}
                    width={this.props.width}
                    height={this.props.height}
                    onMouseMove={this.handleHover}
                    onMouseLeave={this.handleHoverLeave}
                />
                {this.renderScatter()}
            </g>
        );
    }
}

ScatterChart.propTypes = {
    /**
     * Show or hide this chart
     */
    visible: PropTypes.bool,

    /**
     * What [Pond TimeSeries](https://esnet-pondjs.appspot.com/#/timeseries) data to visualize
     */
    series: PropTypes.instanceOf(TimeSeries).isRequired,

    /**
     * Which columns of the series to render
     *
     * NOTE : Columns can't have periods because periods
     * represent a path to deep data in the underlying events
     * (i.e. reference into nested data structures)
     */
    columns: PropTypes.arrayOf(PropTypes.string),

    /**
     * Reference to the axis which provides the vertical scale for drawing. e.g.
     * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
     */
    axis: PropTypes.string.isRequired, // eslint-disable-line

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
    radius: PropTypes.oneOfType([PropTypes.number, PropTypes.func, PropTypes.instanceOf(Styler)]),

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
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    /**
     * The style of the info box and connecting lines. The style should
     * be an object of the form { line, box }. Line and box are both objects
     * containing the inline CSS for those elements of the info tracker.
     */
    infoStyle: PropTypes.shape({
        line: PropTypes.object, // eslint-disable-line
        box: PropTypes.object // eslint-disable-line
    }),

    /**
     * The width of the hover info box
     */
    infoWidth: PropTypes.number, // eslint-disable-line

    /**
     * The height of the hover info box
     */
    infoHeight: PropTypes.number, // eslint-disable-line

    /**
     * The vertical offset in pixels of the EventMarker info box from the
     * top of the chart.
     */
    infoOffsetY: PropTypes.number,

    /**
     * The values to show in the info box. This is an array of
     * objects, with each object specifying the label and value
     * to be shown in the info box.
     */
    info: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string, // eslint-disable-line
            value: PropTypes.string // eslint-disable-line
        })
    ),

    /**
     * The selected dot, which will be rendered in the "selected" style.
     * If a dot is selected, all other dots will be rendered in the "muted" style.
     *
     * See also `onSelectionChange`
     */
    selected: PropTypes.arrayOf(
        PropTypes.shape({
            event: PropTypes.instanceOf(Event),
            column: PropTypes.string
        })
    ),

    /**
     * A callback that will be called when the selection changes. It will be called
     * with an object containing the event and column.
     */
    onSelectionChange: PropTypes.func,

    /**
     * The highlighted dot, as an object containing the { event, column },
     * which will be rendered in the "highlighted" style.
     *
     * See also the prop `onMouseNear`.
     */
    highlight: PropTypes.shape({
        event: PropTypes.instanceOf(Event),
        column: PropTypes.string
    }),

    /**
     * Will be called with the nearest point to the cursor. The callback
     * will contain the point, which is a map of { event, column }.
     */
    onMouseNear: PropTypes.func,

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
    width: PropTypes.number,

    /**
     * [Internal] The height supplied by the surrounding ChartContainer
     */
    height: PropTypes.number
};

ScatterChart.defaultProps = {
    visible: true,
    columns: ["value"],
    radius: 2.0,
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
    infoWidth: 90,
    infoHeight: 30,
    infoOffsetY: 20
};
