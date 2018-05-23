/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import * as React from "react";

import { TimeSeries, Event, Key } from "pondjs";

import { EventMarker, EventMarkerProps } from "./EventMarker";
import { ChartProps } from "./Charts";

import { getElementOffset } from "./util";
import { LabelValueList } from "./types";
import { Styler } from "./styler";
import {
    ScatterChartStyle,
    defaultScatterChartChannelStyle as defaultStyle,
    ScatterChartChannelStyle,
    EventMarkerStyle,
    defaultEventMarkerStyle
} from "./style";

export type EventColumnPair = {
    event?: Event<Key>;
    column?: string;
};

export type ScatterChartProps = ChartProps & {
    series: any;
    columns?: string[];
    axis: string;
    radius?: number | ((...args: any[]) => any) | any;
    style?:
        | ScatterChartStyle
        | ((channel: string, event?: Event<Key>) => ScatterChartChannelStyle)
        | Styler;
    info?: LabelValueList | string;
    infoStyle?: EventMarkerStyle;
    infoWidth?: number;
    infoHeight?: number;
    infoTimeFormat?: ((date: Date) => string) | string;
    selected?: EventColumnPair;
    onSelectionChange?: (...args: any[]) => any;
    highlight?: EventColumnPair;
    onMouseNear?: (...args: any[]) => any;
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
export class ScatterChart extends React.Component<ScatterChartProps> {
    static defaultProps: Partial<ScatterChartProps> = {
        columns: ["value"],
        radius: 2.0,
        infoStyle: defaultEventMarkerStyle,
        infoWidth: 90,
        infoHeight: 30
    };

    // Stored reference to event rect
    eventrect: SVGRectElement;

    constructor(props: ScatterChartProps) {
        super(props);
        this.handleHover = this.handleHover.bind(this);
        this.handleHoverLeave = this.handleHoverLeave.bind(this);
    }

    // get the event mouse position relative to the event rect
    getOffsetMousePosition(e: React.MouseEvent<SVGElement>) {
        const offset = getElementOffset(this.eventrect);
        const x = e.pageX - offset.left;
        const y = e.pageY - offset.top;
        return [Math.round(x), Math.round(y)];
    }

    //
    // Event handlers
    //

    handleClick(e: React.MouseEvent<SVGCircleElement>, event: Event<Key>, column: string) {
        const point = { event, column };
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(point);
        }
    }

    handleHover(e: React.MouseEvent<SVGElement>) {
        const [x, y] = this.getOffsetMousePosition(e);
        let point;
        let minDistance = Infinity;
        for (const column of this.props.columns) {
            const eventList = this.props.series.collection().eventList();
            eventList.forEach(event => {
                const t = event.timestamp();
                const value = event.get(column);
                const px = this.props.timeScale(t);
                const py = this.props.yScale(value);
                const distance = Math.sqrt((px - x) * (px - x) + (py - y) * (py - y));
                if (distance < minDistance) {
                    point = { event, column };
                    minDistance = distance;
                }
            });
        }
        console.log("point is ", point);
        if (this.props.onMouseNear) {
            this.props.onMouseNear(point);
        }
    }
    handleHoverLeave() {
        if (this.props.onMouseNear) {
            this.props.onMouseNear(null);
        }
    }

    providedStyleMap(column: string, event: Event<Key>): ScatterChartChannelStyle {
        let style = {};
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
                return this.props.style.scatterChartStyle()[column];
            } else if (_.isFunction(this.props.style)) {
                return this.props.style(column, event);
            } else if (_.isObject(this.props.style)) {
                return this.props.style ? this.props.style[column] : defaultStyle;
            }
        }
    }

    /**
     * Returns the style used for drawing the path
     */
    style(column: string, event: Event<Key>) {
        let style;
        const styleMap = this.providedStyleMap(column, event);

        const s = styleMap.point;
        const d = defaultStyle.point;

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
                style = _.merge(d.selected, s.selected ? s.selected : {});
            } else if (isHighlighted) {
                style = _.merge(d.highlighted, s ? s.highlighted : {});
            } else {
                style = _.merge(d.muted, s ? s.muted : {});
            }
        } else if (isHighlighted) {
            style = _.merge(d.highlighted, s ? s.highlighted : {});
        } else {
            style = _.merge(d.normal, s ? s.normal : {});
        }
        return style;
    }
    //
    // Render
    //
    renderScatter() {
        const { series, timeScale, yScale } = this.props;
        const points: JSX.Element[] = [];
        let eventMarker;
        // if selectionChange is enabled, pointerEvents should be enabled as well
        const pointerEvents = this.props.onSelectionChange ? "auto" : "none";
        this.props.columns.forEach(column => {
            let key = 1;
            const eventList = series.collection().eventList();
            eventList.forEach(event => {
                const t = new Date(
                    event.begin().getTime() + (event.end().getTime() - event.begin().getTime()) / 2
                );
                const value = event.get(column);
                const style = this.style(column, event);
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
                    const eventMarkerProps: EventMarkerProps = {
                        key: `marker`,
                        event,
                        column,
                        type: "point",
                        info: this.props.info,
                        style: this.props.infoStyle,
                        width: this.props.width,
                        height: this.props.height,
                        infoWidth: this.props.infoWidth,
                        infoHeight: this.props.infoWidth,
                        infoTimeFormat: this.props.infoTimeFormat,
                        markerRadius: 0,
                        timeScale: this.props.timeScale,
                        yScale: this.props.yScale
                    };
                    eventMarker = <EventMarker {...eventMarkerProps} />;
                }
                const point = (
                    <circle
                        key={`${column}-${key}`}
                        cx={x}
                        cy={y}
                        r={radius}
                        style={style}
                        pointerEvents={pointerEvents}
                        onMouseMove={e => this.handleHover(e)}
                        onClick={e => this.handleClick(e, event, column)}
                    />
                );
                points.push(point);
                key += 1;
            });
        });
        return (
            <g>
                {points}
                {eventMarker}
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
                    onMouseMove={e => this.handleHover(e)}
                    onMouseLeave={e => this.handleHoverLeave()}
                />
                {this.renderScatter()}
            </g>
        );
    }
}
