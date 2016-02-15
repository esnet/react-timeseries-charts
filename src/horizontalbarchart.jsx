/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import d3 from "d3";
import FlexBox from "react-flexbox";
import { TimeSeries } from "pondjs";

import Resizable from "./resizable";

const Bars = React.createClass({

    render() {
        const {
            display, series, max, columns,
            spacing, padding, size, width,
            style, format, timestamp } = this.props;

        // Highlighted value
        const index = timestamp ? series.bisect(timestamp) : null;
        
        const columnElements = columns.map((column, i) => {

            // Vertical position of the bar
            const y = padding + i * (size + spacing);

            // Scale
            const scale = d3.scale.linear()
                .domain([0, max])
                .range([0, width - 100]);

            // Start and end of the bar
            let start, end, value, centerStart, centerEnd;
            let textElement;
            switch (display) {
                case "avg":
                case "max":

                    // Style of the bar
                    const rectStyle = _.isArray(style) && style.length > i ?
                        _.clone(style[i]) : {fill: "#DDD"};

                    value = display === "avg" ? series.avg(column) : series.max(column);
                    start = scale(0);
                    end = scale(value);
                    let w = end - start;
                    if (w <= 1) {
                        w = 1;
                    }
                    const barElement = (
                        <rect style={rectStyle} x={start} y={y} width={w} height={size} />
                    );

                    // Text
                    let text;
                    if (format && _.isString(format)) {
                        const formatter = d3.format(format);
                        text = formatter(value);
                    } else if (_.isFunction(format)) {
                        text = format(value);
                    }
                    
                    if (text) {
                        textElement =(
                            <text style={{fill: "#666", fontSize: 12}} x={end + 2} y={y + size - 1}>{text}</text>
                        );
                    }

                    return (
                        <g key={i}>{barElement}{textElement}</g>
                    );

                    break;

                case "range":

                    // Styles
                    const rectStyleBackground = _.isArray(style) && style.length > i ?
                        _.clone(style[i]) : {fill: "#DDD"};
                    rectStyleBackground.opacity = 0.2;

                    const rectStyleCenter = _.isArray(style) && style.length > i ?
                        _.clone(style[i]) : {fill: "#DDD"};
                    rectStyleCenter.opacity = 0.2;

                    const rectStyleValue = _.isArray(style) && style.length > i ?
                        _.clone(style[i]) : {fill: "#DDD"};

                    // Statistics
                    const avg = series.avg(column);
                    const stdev = series.stdev(column);

                    let seriesMin = series.min(column);
                    if (_.isNull(seriesMin)) seriesMin = 0;

                    let seriesMax = series.max(column);
                    if (_.isNull(seriesMax)) seriesMax = 0;

                    start = scale(seriesMin);
                    end = scale(seriesMax);
                    centerStart = scale(avg - stdev);
                    centerEnd = scale(avg + stdev);

                    // Current value
                    let barElementValue;
                    if (index) {
                        value = series.at(index).get(column);
                        const valueStart = scale(value);
                        barElementValue = (
                            <rect style={rectStyleValue} x={valueStart-2} y={y-2} width={4} height={size+4} />
                        );

                        // Text
                        let text;
                        if (format && _.isString(format)) {
                            const formatter = d3.format(format);
                            text = formatter(value);
                        } else if (_.isFunction(format)) {
                            text = format(value);
                        }
                        
                        if (text) {
                            textElement =(
                                <text style={{fill: "#666", fontSize: 12}} x={end + 2} y={y + size - 1}>{text}</text>
                            );
                        }
                    }

                    let backgroundWidth = end - start;
                    if (backgroundWidth < 1) backgroundWidth = 1;

                    let centerWidth = centerEnd - centerStart;
                    if (centerWidth <= 1) centerWidth = 1;

                    const barElementBackground = (
                        <rect style={rectStyleBackground} rx="2" ry={2} x={start} y={y+1} width={backgroundWidth} height={size-2} />
                    );
                    const barElementCenter = (
                        <rect style={rectStyleCenter} x={centerStart} y={y} width={centerWidth} height={size} />
                    );
                    return (
                        <g key={i}>{barElementBackground}{barElementCenter}{barElementValue}{textElement}</g>
                    );

                    break;
            }

        });

        const height = columns.length * size + (columns.length - 1) * spacing + padding * 2;

        return (
            <svg
                width="100%"
                height={height} >
                {columnElements}
            </svg>
        );
    },
})

export default React.createClass({

    displayName: "HorizontalBarChart",

    propTypes: {

        /**
         * Sort by either "max", "avg" or "name"
         */
        display: React.PropTypes.oneOf(["avg", "max", "range"]),

        /**
         * A list of [TimeSeries](http://software.es.net/pond#timeseries) objects to visualize
         */
        seriesList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TimeSeries)).isRequired,

        /**
         * Columns in each timeseries to display
         */
        columns: React.PropTypes.arrayOf(React.PropTypes.string),

        /**
         * Sort by either "max", "avg" or "name"
         */
        sortBy: React.PropTypes.oneOf(["name", "max", "avg"]),

        /**
         * Display only the top n
         */
        top: React.PropTypes.number,

        /**
         * The height or thickness of each bar
         */
        size: React.PropTypes.number,

        /**
         * The spacing between each bar (column) of the series
         */
        spacing: React.PropTypes.number,

        /**
         * The spacing above and below each series
         */
        padding: React.PropTypes.number,

        /**
         * The width of the label area
         */
        labelWidth: React.PropTypes.number,

        /**
         * The format is used to format the display text for the bar. It can be specified as a d3
         * format string (such as ".2f") or a function. The function will be called with the value
         * and should return a string.
         */
        format: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.string
        ])
    },

    getDefaultProps() {
        return {
            display: "avg",
            size: 14,
            spacing: 2,
            padding: 5,
            labelWidth: 240,
            style: [{fill: "steelblue"}],
            seriesList: [],
            columns: ["value"],
            sortBy: "max"
        };
    },

    renderName(series) {
        return (
            <span style={{marginTop: 5}}>{series.name().toUpperCase()}</span>
        );
    },

    renderRows(seriesList) {
        let max = 0;

        const {
            columns,
            spacing,
            padding,
            size,
            style,
            format,
            display,
            timestamp
        } = this.props;

        seriesList.forEach(series => {
            this.props.columns.forEach(column => {
                const smax = series.max(column);
                if (smax > max) max = smax;
            });
        });

        const boxStyle = {
            width: "100%",
            boxShadow: "inset 11px 0px 7px -9px rgba(0,0,0,0.28)"
        };

        return seriesList.map((series, i) => {
            return (
                <FlexBox column>
                    <FlexBox key={i} row style={{background: i % 2 ? "#F8F8F8" : "white"}}>
                        <FlexBox column width="220px">
                            {this.renderName(series)}
                        </FlexBox>
                        <FlexBox row>
                            <div style={boxStyle}>
                                <Resizable style={{margin: 3}}>
                                    <Bars
                                        display={display}
                                        series={series}
                                        max={max}
                                        columns={columns}
                                        spacing={spacing}
                                        padding={padding}
                                        size={size}
                                        style={style}
                                        format={format}
                                        timestamp={timestamp} />
                                </Resizable>
                            </div>
                        </FlexBox>
                    </FlexBox>
                </FlexBox>
            );
        });
    },

    render() {
        // Sort the list
        const sortedList = _.sortBy(this.props.seriesList, series => {
            switch (this.props.sortBy) {
                case "name":
                    return series.name;
                case "avg":
                    return -_.reduce(this.props.columns.map(column => series.avg(column)),
                                     (memo, num) => memo + num,
                                     0);
                case "max":
                    return -_.max(this.props.columns.map(column => series.max(column)));
            }
        });

        // Top n
        const list = this.props.top ? sortedList.slice(0, this.props.top) : sortedList;

        const containerStyle = {
            borderTopStyle: "solid",
            borderTopWidth: 1,
            borderTopColor: "#EEE",
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "#EEE"
        };

        return (
            <div style={containerStyle}>
                {this.renderRows(list)}
            </div>
        );
    }
});
