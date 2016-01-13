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
import { TimeSeries } from "pondjs";

/**
 * Renders a barchart based on IndexedEvents within a TimeSeries.
 *
 * This BarChart implementation is a little different in that it will render
 * onto a time axis, rather than rendering to specific values. As a result,
 * an Aug 2014 bar will render between the Aug 2014 tick mark and the Sept 2014
 * tickmark.
 */
export default React.createClass({

    displayName: "BarChart",

    getDefaultProps() {
        return {
            spacing: 1,
            offset: 0,
            style: {
                value: {fill: "#619F3A"}
            }
        };
    },

    propTypes: {

        /**
         * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
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
         * The style provides the coloring, relating each column to styles for normal, highlight (hover) and selected:
         * ```
         * const style = {
         *     "in": {
         *         normal: {fill: "#619F3A"},
         *         highlight: {fill: "rgb(113, 187, 67)"},
         *         selected: {fill: "#436D28"}
         *     }
         * };
         * ```
         */
        style: React.PropTypes.object,
        
        /**
         * If size is specified, then the bar will be this number of pixels wide. This
         * prop takes priority of "spacing".
         */
        size: React.PropTypes.number,
        
        /**
         * A callback that will be called when the selection changes. It will be called
         * with the key, which is $series.name-$index-$column, the value of that event,
         * along with the context. The context provides the series (a Pond TimeSeries),
         * the column (a string) and the index (a Pond Index).
         */
        onSelectionChange: React.PropTypes.func
    },

    /**
     * hover state is tracked internally and a highlight shown as a result
     */
    getInitialState() {
        return {
            hover: null
        };
    },

    /**
     * Continues a hover event on a specific bar of the bar chart.
     */
    handleMouseMove(e, key) {
        this.setState({hover: key});
    },

    /**
     * Handle click will call the onSelectionChange callback if one is provided
     * as a prop. It will be called with the key, which is
     * $series.name-$index-$column, the value of that event, along with the
     * context. The context provides the series (a TimeSeries), the column (a
     * string) and the index (an Index).
     */
    handleClick(e, key, value, series, column, index) {
        e.stopPropagation();
        const context = {series, column, index};
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(key, value, context);
        }
    },

    renderBars() {
        const spacing = +this.props.spacing;
        const offset = +this.props.offset;
        const series = this.props.series;
        const timeScale = this.props.timeScale;
        const yScale = this.props.yScale;
        const columns = this.props.columns || series._columns;

        const rects = [];
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

            let ypos = yScale(0);
            for (const column of columns) {

                const index = event.index();
                const key = `${series.name()}-${index}-${column}`;
                const value = event.get(column);

                let height = yScale(0) - yScale(value);
                if (height < 1) {
                    height = 1;
                }

                const y = ypos - height;

                let barStyle;
                if (key === this.props.selection) {
                    if (this.props.style && this.props.style[column].selected) {
                        barStyle = this.props.style[column].selected;
                    } else {
                        barStyle = {fill: "rgb(0, 144, 199)"};
                    }
                } else if (key === this.state.hover) {
                    if (this.props.style &&
                        this.props.style[column].highlight) {
                        barStyle = this.props.style[column].highlight;
                    } else {
                        barStyle = {fill: "rgb(78, 144, 199)"};
                    }
                } else if (this.props.style &&
                    this.props.style[column].normal) {
                    barStyle = this.props.style[column].normal;
                } else {
                    barStyle = {fill: "steelblue"};
                }

                rects.push(
                    <rect key={key}
                          x={x} y={y} width={width} height={height}
                          pointerEvents="none"
                          style={barStyle}
                          clipPath={this.props.clipPathURL}
                          onClick={e => {
                              this.handleClick(e, key, value, series,
                                               column, index);
                          }}
                          onMouseLeave={() => {
                              this.setState({hover: null});
                          }}
                          onMouseMove={e => {
                              this.handleMouseMove(e, key);
                          }}/>
                );

                ypos -= height;
            }
        }
        return rects;
    },

    render() {
        return (
            <g>
                {this.renderBars()}
            </g>
        );
    }
});
