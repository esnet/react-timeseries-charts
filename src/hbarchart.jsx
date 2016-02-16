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

    displayName: "HorizontalBarChartBars",

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
    }
});

const Row = React.createClass({

    displayName: "HorizontalBarChartRow",

    getInitialState() {
        return {
            hover: false
        };
    },

    handleClick() {
        if (this.props.onSelectionChanged) {
            this.props.onSelectionChanged(this.props.series.name());
        }
    },

    renderLabel() {
        const style = {
            marginTop: 5,
            cursor: "default"
        };

        return (
            <span style={style}>
                {this.props.series.name().toUpperCase()}
            </span>
        );
    },

    renderBars() {
        const {
            display,
            series,
            max,
            columns,
            spacing,
            padding,
            size,
            style,
            format,
            timestamp } = this.props;

        const rowStyle = {
            width: "100%",
            boxShadow: "inset 11px 0px 7px -9px rgba(0,0,0,0.28)"
        };

        const resizableStyle = {
            margin: 3
        };

        return (
            <div
                style={rowStyle}
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})} >
                <Resizable style={resizableStyle}>
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
        );
    },

    renderChild() {
        const rowStyle = {
            width: "100%",
            boxShadow: "inset 11px 0px 7px -9px rgba(0,0,0,0.28)"
        };

        if (this.props.child && this.props.selected) {
            const props = {
                series: this.props.series,
                timestamp: this.props.timestamp
            };
            const child =  React.cloneElement(this.props.child, props);
            return (
                <FlexBox style={rowStyle}>
                    <div style={{marginLeft: 5}}>
                        {child}
                    </div>
                </FlexBox>
            );
        }
    },

    render() {
        const { series } = this.props;
        const rowStyle = {
            borderTopStyle: "solid",
            borderTopWidth: 1,
            borderTopColor: "#DFDFDF"
        };

        let labelStyle;
        if (this.props.selected) {
            labelStyle = {
                paddingLeft: 2,
                borderLeftStyle: "solid",
                borderLeftWidth: 5,
                borderLeftColor: this.props.selectionColor
            };
        } else {
            labelStyle = {
                background: "#FAFAFA",
                paddingLeft: 7
            };
        }

        if (this.state.hover && (_.isUndefined(this.props.selected) || !this.props.selected)) {
            labelStyle.background = "#EDEDED";
        }

        return (
            <FlexBox column
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})}
                onClick={this.handleClick} >
                <FlexBox key={series.name()} row style={rowStyle}>
                    <FlexBox
                        column width="220px"
                        style={labelStyle} >
                        {this.renderLabel(series)}
                    </FlexBox>
                    <FlexBox column>
                        {this.renderBars()}
                        {this.renderChild()}
                     </FlexBox>
                </FlexBox>
            </FlexBox>
        );
    }
});

/**

The HorizontalBarChart takes a list of `TimeSeries` objects and displays a bar chart
visualization summarizing those. As an example, let's say we have a set of interfaces, which
together carry the entire network traffic to a particular location. We want to see which
interfaces contribute the most to the total traffic.

To display this we render the HorizontalBarChart in our page:
 
    <HorizontalBarChart
        display="range"
        seriesList={interfaces}
        columns={["out", "in"]}
        top={5} sortBy="max"
        timestamp={this.state.tracker}
        format={formatter}
        selected={this.state.selected}
        onSelectionChanged={this.handleSelectionChange}
        selectionColor="#37B6D3"
        style={[{fill: "#1F78B4"}, {fill: "#FF7F00"}]} >

        <SeriesSummary />

    </HorizontalBarChart>

Our first prop `display` tells the component how to draw the bars. In this case we use the
"range", which will draw from min to max (with additional drawing to show 1 stdev away from
the center).

Next we specify the `seriesList` itself. This should be an array of Pond TimeSeries objects.

The `columns` prop tells us which columns within the TimeSeries should be displayed as a bar.
In this case we have `in` and `out` traffic columns, so we'll get two bars for each series.

`top` and `sortBy` are used to order and trim the list of TimeSeries. Here we order by the max
values in the specified columns, then just display the top 5.

The `timestamp` lets the component know the current value. You could display the last timestamp
in the series, or perhaps a time being interacted with in the UI.

The `format` can either be a d3 format string of a function. In this case we have our own
formatter function to display values:

    function formatter(value) {
        const prefix = d3.formatPrefix(value);
        return `${prefix.scale(value).toFixed()} ${prefix.symbol}bps`;
    }

Selection is handled with `selected`, which gives the name of the TimeSeries currently selected.
If the user selects a different row the callback passed to `onSelectionChanged` will be called
with the name of the TimeSeries represented in the newly selected row. We also specify a color
to mark the selected item with the `selectionColor` prop.

Next we specify the `style`. This is the css style of each column's bars. Typically you would
just want to specify the fill color. Each bar is a svg rect.

Finally, you can specify a child component, in this case `<SeriesSummary>`. This can be any
component and will be rendered under the bars when the row is selected. The component can render
anything it wants. In our case we render some text for the averages of the series:

    const SeriesSummary = ({series}) => (
        <table><tbody><tr>
            <td><b>Avg:</b></td>
            <td style={{paddingLeft: 5}}>{formatter(series.avg("in"))} to site</td>
            <td style={{paddingLeft: 15}}>{formatter(series.avg("out"))} from site</td>
        </tr> </tbody></table>
    );

Note that the component will have the `series` it is rendering, as well as the `timestamp` injected
into its props so you can use those when rendering.

*/
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
         * Sort by either "name", "max", or "avg"
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
         * Callback for when the selection changes. The callback function will be called
         * with the name of the TimeSeries selected.
         */
        onSelectionChanged: React.PropTypes.func,

        /**
         * Specify which TimeSeries is selected by providing the name of the selected
         * series.
         */
        selected: React.PropTypes.string,

        /**
         * Color to mark the selected row with.
         */
        selectionColor: React.PropTypes.string,

        /**
         * The format is used to format the display text for the bar. It can be specified as a d3
         * format string (such as ".2f") or a function. The function will be called with the value
         * and should return a string.
         */
        format: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.string
        ]),

        /**
         * A single child which will be rendered when the item is selected. The child will have
         * a couple of additional props injected onto it when rendered:
         *  * `series` - the TimeSeries of the row being rendered
         *  * `timestamp` - the current timestamp being shown 
         */
        children: React.PropTypes.element
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
            sortBy: "max",
            selectionColor: "steelblue"
        };
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
            timestamp,
            onSelectionChanged,
            selectionColor
        } = this.props;

        seriesList.forEach(series => {
            this.props.columns.forEach(column => {
                const smax = series.max(column);
                if (smax > max) max = smax;
            });
        });

        let child;
        if (React.Children.count(this.props.children) === 1) {
            child = React.Children.only(this.props.children);
        }

        return seriesList.map((series, i) => (
            <Row
                key={i}
                series={series}
                display={display}
                max={max}
                selected={this.props.selected === series.name()}
                onSelectionChanged={onSelectionChanged}
                selectionColor={selectionColor}
                columns={columns}
                spacing={spacing}
                padding={padding}
                size={size}
                style={style}
                format={format}
                timestamp={timestamp}
                child={child} />
        ));
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
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "#DFDFDF"
        };

        return (
            <div style={containerStyle}>
                {this.renderRows(list)}
            </div>
        );
    }
});
