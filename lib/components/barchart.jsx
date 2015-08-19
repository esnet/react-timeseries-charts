/*
 * ESnet React Charts, Copyright (c) 2015, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
 *
 * If you have questions about your rights to use or distribute this
 * software, please contact Berkeley Lab's Technology Transfer
 * Department at TTD@lbl.gov.
 *
 * NOTICE.  This software is owned by the U.S. Department of Energy.
 * As such, the U.S. Government has been granted for itself and others
 * acting on its behalf a paid-up, nonexclusive, irrevocable,
 * worldwide license in the Software to reproduce, prepare derivative
 * works, and perform publicly and display publicly.  Beginning five
 * (5) years after the date permission to assert copyright is obtained
 * from the U.S. Department of Energy, and subject to any subsequent
 * five (5) year renewals, the U.S. Government is granted for itself
 * and others acting on its behalf a paid-up, nonexclusive,
 * irrevocable, worldwide license in the Software to reproduce,
 * prepare derivative works, distribute copies to the public, perform
 * publicly and display publicly, and to permit others to do so.
 *
 * This code is distributed under a BSD style license, see the LICENSE
 * file for complete information.
 */

import React from "react/addons";
import d3 from "d3";
import _ from "underscore";
import {TimeSeries} from "pond";

/**
 * Renders a barchart based on IndexedEvents within a TimeSeries.
 *
 * This BarChart implementation is a little different in that it will render onto a time axis,
 * rather than rendering to specific values. As a result, an Aug 2014 bar will render between the
 * Aug 2014 tick mark and the Sept 2014 tickmark.
 */
export default React.createClass({

    propTypes: {
        series: React.PropTypes.instanceOf(TimeSeries).isRequired,
        clipPathURL: React.PropTypes.string.isRequired,
        timeScale: React.PropTypes.object.isRequired,
        yScale: React.PropTypes.object.isRequired,
        spacing: React.PropTypes.number,
        offset: React.PropTypes.number,
        columns: React.PropTypes.array,
        style: React.PropTypes.object,
        size: React.PropTypes.number,
        onSelectionChange: React.PropTypes.func,
    },

    getDefaultProps: function() {
        return {
            spacing: 1,
            offset: 0,
            style: {"value": {fill: "#619F3A"}}
        };
    },

    /**
     * hover state is tracked internally and a highlight shown as a result
     */
    getInitialState: function() {
        return {
            hover: null
        };
    },

    /**
     * Continues a hover event on a specific bar of the bar chart.
     */
    handleMouseMove: function(e, key) {
        this.setState({hover: key});
    },

    /**
     * Handle click will call the onSelectionChange callback if one is provided as a prop.
     * It will be called with the key, which is $series.name-$index-$column, the value of
     * that event, along with the context. The context provides the series (a TimeSeries), the
     * column (a string) and the index (an Index).
     */
    handleClick: function(e, key, value, series, column, index) {
        e.stopPropagation();
        const context = {series: series, column: column, index: index};
        this.props.onSelectionChange && this.props.onSelectionChange(key, value, context);
    },

    renderBars: function() {
        const spacing = Number(this.props.spacing);
        const offset = Number(this.props.offset);
        const series = this.props.series;
        const timeScale = this.props.timeScale;
        const yScale = this.props.yScale;
        const columns = this.props.columns || series._columns;

        let rects = [];
        for (event of series.events()) {
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
                const center = timeScale(begin) + (timeScale(end) - timeScale(begin))/2;
                x = center - this.props.size/2 + offset;
            } else {
                x = timeScale(begin) + spacing + offset;
            }
            
            let ypos = yScale(0);
            for (let column of columns) {

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
                    if (this.props.style && this.props.style[column].highlight) {
                        barStyle = this.props.style[column].highlight;
                    } else {
                        barStyle = {fill: "rgb(78, 144, 199)"};
                    }
                }  else {
                    if (this.props.style && this.props.style[column].normal) {
                        barStyle = this.props.style[column].normal;
                    } else {
                        barStyle = {fill: "steelblue"};
                    }
                }
                
                rects.push(
                    <rect key={key}
                          data-tip={key === this.state.hover ? "React-tooltip" : ""}
                          x={x} y={y} width={width} height={height}
                          pointerEvents="none"
                          style={barStyle}
                          clipPath={this.props.clipPathURL}
                          onClick={e => {this.handleClick(e, key, value, series, column, index)}}
                          onMouseLeave={e => {this.setState({hover: null})}}
                          onMouseMove={e => this.handleMouseMove(e, key)}/>
                );

                ypos -= height;
            }
        }
        return rects;
    },

    render: function() {
        return (
            <g>
                {this.renderBars()}
            </g>
        );
    }
});
