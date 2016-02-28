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

import { TimeSeries } from "pondjs";

/**
 * Renders an event view that shows the supplied set of
 * events along a time axis.
 *
 * EXPERIMENTAL
 *
 * TODO: Convert to use Pond Events
 */
export default React.createClass({

    displayName: "EventChart",

    /**
     * hover state is tracked internally and a highlight shown as a result
     */
    getInitialState() {
        return {
            hover: null
        };
    },

    getDefaultProps() {
        return {
            size: 30,
            spacing: 0
        };
    },

    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
         */
        series: React.PropTypes.instanceOf(TimeSeries).isRequired,

        /**
         * The height in pixels for the event bar
         */
        size: React.PropTypes.number,

        /**
         * Minimum width for an event
         */
        /**
         * The distance in pixels to inset the bar chart from its actual timerange
         */
        spacing: React.PropTypes.number,

        /**
         * A function that should return the style of the event box
         */
        style: React.PropTypes.func

    },

    /**
     * Continues a hover event on a specific bar of the bar chart.
     */
    handleMouseMove(e, event) {
        this.setState({hover: event});
    },

    /**
     * Handle click will call the onSelectionChange callback if one is provided
     * as a prop. It will be called with the event selected.
     */
    handleClick(e, event) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(event);
        }
    },

    render() {
        const series = this.props.series;
        const scale = this.props.timeScale;
        const eventMarkers = [];

        // Create and array of markers, one for each event
        let i = 0;
        for (const event of series.events()) {
            // console.log(" - event", event.toString());
            const begin = event.begin();
            const end = event.end();
            const beginPos = scale(begin);
            const endPos = scale(end);
            const transform = `translate(${beginPos},0)`;

            const isHover = this.state.hover ? event.data() === this.state.hover.data() : false;

            let state;
            
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
            const width = endPos - beginPos - 2 * this.props.spacing;
            const height = this.props.size;

            let text = null;
            if (isHover) {
                text = (
                    <g>
                    <rect
                        className="eventchart-marker"
                        x={x} y={y} width={5} height={height+4}
                        style={merge(true, barNormalStyle, {pointerEvents: "none"})}
                        clipPath={this.props.clipPathURL}/>
                        <text
                            style={{pointerEvents: "none", fill: "#444"}}
                            x={8} y={15}>
                            {label}
                        </text>
                    </g>
                );
            }

            eventMarkers.push(
                <g transform={transform} key={i++}>
                    <rect
                        className="eventchart-marker"
                        x={x} y={y} width={width} height={height}
                        style={barStyle}
                        clipPath={this.props.clipPathURL}
                        onClick={e => this.handleClick(e, event)}
                        onMouseLeave={() => this.setState({hover: null})}
                        onMouseMove={e => this.handleMouseMove(e, event)} />
                    {text}
                </g>
            );
        }

        return (
            <g>
                {eventMarkers}
            </g>
        );
    }
});
