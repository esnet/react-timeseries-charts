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

import { ChartProps } from "./Charts";
import { EventChartStyle } from "./style";

export type EventChartProps = ChartProps & {
    /**
     * What [Pond TimeSeries](https://esnet-pondjs.appspot.com/#/timeseries) data to visualize
     */
    series: TimeSeries<Key>;

    /**
     * Set hover label text
     * When label is function callback it will be called with current event.
     */
    label?: string | ((...args: any[]) => any);
    
    /**
     * The height in pixels for the event bar
     */
    size?: number;

    /**
     * The distance in pixels to inset the event bar from its actual timerange
     */
    spacing?: number;

    /**
     * Marker width on hover
     */
    hoverMarkerWidth?: number;

    /**
     * Hover text offset position X
     */
    textOffsetX?: number;

    /**
     * Hover text offset position Y
     */
    textOffsetY?: number;

    /**
     * Show or hide this chart
     */
    visible?: boolean;

    /**
     * A function that should return the style of the event box
     */
    style?: EventChartStyle;

    /**
     * Event selection on click. Will be called with selected event.
     */
    onSelectionChange?: (e: Event<Key>) => any;
    
    /**
     * Mouse over event callback
     */
    onMouseOver?: (e: Event<Key>) => any;

    /**
     * Mouse leave at end of hover event
     */
    onMouseLeave?: (b: boolean) => any;
};

/**
 * @private
 */
export type EventChartState = {
    hover: any;
};

/**
 * Renders an event view that shows the supplied set of events along a time axis.
 * The events should be supplied as a Pond TimeSeries.
 * That series may contain regular TimeEvents, TimeRangeEvents
 * or IndexedEvents.
 */
export class EventChart extends React.Component<EventChartProps, EventChartState> {
    static defaultProps = {
        visible: true,
        size: 30,
        spacing: 0,
        textOffsetX: 0,
        textOffsetY: 0,
        hoverMarkerWidth: 5
    };

    hover: Event<Key>;

    constructor(props: EventChartProps) {
        super(props);
        this.state = {
            hover: null
        };
    }

    /**
     * Continues a hover event on a specific bar of the bar chart.
     */
    onMouseOver(e: React.MouseEvent<SVGRectElement>, event: Event<Key>) {
        if (this.props.onMouseOver) {
            this.props.onMouseOver(event);
        }
        this.setState({ hover: event });
    }

    /**
     * Handle mouse leave and calls onMouseLeave callback if one is provided
     */
    onMouseLeave() {
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave(this.state.hover);
        }
        this.setState({ hover: null });
    }

    /**
     * Handle click will call the onSelectionChange callback if one is provided
     * as a prop. It will be called with the event selected.
     */
    handleClick(e: React.MouseEvent<SVGRectElement>, event: Event<Key>) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(event);
        }
    }

    render() {
        const { series, textOffsetX, textOffsetY, hoverMarkerWidth } = this.props;
        const scale = this.props.timeScale;
        const eventMarkers: JSX.Element[] = [];

        // Create and array of markers, one for each event
        let i = 0;
        series
            .collection()
            .eventList()
            .forEach(event => {
                const begin = event.begin();
                const end = event.end();
                const beginPos = scale(begin) >= 0 ? scale(begin) : 0;
                const endPos = scale(end) <= this.props.width ? scale(end) : this.props.width;

                const transform = `translate(${beginPos},0)`;
                const isHover = this.state.hover ? Event.is(event, this.state.hover) : false;

                let state: string;
                if (isHover) {
                    state = "hover";
                } else {
                    state = "normal";
                }

                let barNormalStyle = {};
                let barStyle = {};
                if (this.props.style) {
                    barNormalStyle = this.props.style(event, "normal");
                    barStyle = this.props.style(event, state);
                }

                let label = "";
                if (this.props.label) {
                    if (_.isString(this.props.label)) {
                        label = this.props.label;
                    } else if (_.isFunction(this.props.label)) {
                        label = this.props.label(event);
                    }
                }

                const x = this.props.spacing;
                const y = 0;
                let width = endPos - beginPos - 2 * this.props.spacing;
                width = width < 0 ? 0 : width;
                const height = this.props.size;

                const textStyle: React.CSSProperties = {
                    fontSize: 11,
                    fontWeight: 100,
                    pointerEvents: "none",
                    fill: "#444"
                };

                let text = null;
                if (isHover) {
                    text = (
                        <g>
                            <rect
                                className="eventchart-marker"
                                x={x}
                                y={y}
                                width={hoverMarkerWidth}
                                height={height + 4}
                                style={_.merge(true, barNormalStyle, { pointerEvents: "none" } as React.CSSProperties)}
                            />
                            <text 
                                style={textStyle} 
                                x={8 + textOffsetX} 
                                y={15 + textOffsetY}
                            >
                                {label}
                            </text>
                        </g>
                    );
                }

                const marker = (
                    <g transform={transform} key={i}>
                        <rect
                            className="eventchart-marker"
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            style={barStyle}
                            onClick={e => this.handleClick(e, event)}
                            onMouseLeave={() => this.onMouseLeave()}
                            onMouseOver={e => this.onMouseOver(e, event)}
                        />
                        {text}
                    </g>
                );
                eventMarkers.push(marker);
                i += 1;
            });
        return <g>{eventMarkers}</g>;
    }
}
