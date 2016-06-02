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
import { Flexbox, FlexItem } from "flexbox-react";

//d3
import { scaleLinear } from "d3-scale";
import { format } from "d3-format";

import { TimeSeries } from "pondjs";
import Resizable from "./resizable";

/**
 * Draws a marker and it's value as a label. The currentIndex is passed in
 * as a prop, along with the series. In addition
 */
const Marker = React.createClass({

    displayName: "Marker",

    render() {
        let marker, markerLabel;

        const {
            value,
            scale,
            style,
            size,
            format
        } = this.props;

        if (value) {

            // Marker position
            const valueStart = scale(value);

            // Marker
            marker = (
                <rect style={style} x={valueStart-2} y={-2} width={4} height={size+4} />
            );

            // Text
            let text;
            if (format && _.isString(format)) {
                const formatter = format(format);
                text = formatter(value);
            } else if (_.isFunction(format)) {
                text = format(value);
            }
            if (text) {
                markerLabel =(
                    <text style={{fill: "#666", fontSize: 12}} x={valueStart+4} y={size - 2}>{text}</text>
                );
            }

            return (
                <g>
                    {marker}
                    {markerLabel}
                </g>
            );
        } else {
            return (
                <g />
            );
        }
    }
});

function scaleAsString(scale) {
    return `${scale.domain()}-${scale.range()}`;
}

class RangeBar extends React.Component {

    shouldComponentUpdate({ series, scale }) {
        const seriesChanged = !TimeSeries.is(this.props.series, series);
        const scaleChanged = scaleAsString(this.props.scale) !== scaleAsString(scale);
        console.log("Update?", seriesChanged, scaleChanged);
        return seriesChanged || scaleChanged;
    }

    render() {

        const {
            series,
            column,
            bgstyle,
            fgstyle,
            scale,
            size
        } = this.props;

        //
        // Statistics-based range bar
        //

        const avg = series.avg(column);
        const stdev = series.stdev(column);

        let seriesMin = series.min(column);
        if (_.isUndefined(seriesMin)) seriesMin = 0;

        let seriesMax = series.max(column);
        if (_.isUndefined(seriesMax)) seriesMax = 0;

        const start = scale(seriesMin);
        const end = scale(seriesMax);
        const centerStart = scale(avg - stdev);
        const centerEnd = scale(avg + stdev);

        let backgroundWidth = end - start;
        if (backgroundWidth < 1) backgroundWidth = 1;

        let centerWidth = centerEnd - centerStart;
        if (centerWidth <= 1) centerWidth = 1;

        const barElementBackground = (
            <rect
                style={bgstyle}
                rx={2} ry={2}
                x={start} y={1}
                width={backgroundWidth}
                height={size-2} />
        );
        const barElementCenter = (
            <rect
                style={fgstyle}
                x={centerStart}
                y={0}
                width={centerWidth}
                height={size} />
        );

        return (
            <g>
                {barElementBackground}
                {barElementCenter}
            </g>
        );
    }
}

/**
 * Render just the bars, with each bar being one series in the seriesList
 */
const Bars = React.createClass({

    displayName: "HorizontalBarChartBars",

    shouldComponentUpdate(nextProps) {
        const seriesChanged = !TimeSeries.is(this.props.series, nextProps.series);
        const timestampChanged = this.props.timestamp !== nextProps.timestamp;
        return seriesChanged || timestampChanged;
    },

    render() {
        const {
            display,
            series,
            max,
            columns,
            spacing,
            padding,
            size,
            width,
            style,
            format,
            timestamp
        } = this.props;

        // Highlighted value
        const currentIndex = timestamp ? series.bisect(timestamp) : null;
        
        //
        // Render the RangeBars, one for each column
        //

        const columnElements = columns.map((column, i) => {

            // Vertical position of the bar
            const yPosition = padding + i * (size + spacing);
            const transform = `translate(0,${yPosition})`;

            // Scale
            const scale = scaleLinear()
                .domain([0, max])
                .range([0, width - 100]);

            //
            // Value and it's style
            //

            const value = currentIndex ? series.at(currentIndex).get(column) : null;

            //
            // Styles
            //

            const rectStyleValue = _.isArray(style) && style.length > i ?
                _.clone(style[i]) : {fill: "#DDD"};

            const rectStyleBackground = _.isArray(style) && style.length > i ?
                _.clone(style[i]) : {fill: "#DDD"};
            rectStyleBackground.opacity = 0.2;

            const rectStyleCenter = _.isArray(style) && style.length > i ?
                _.clone(style[i]) : {fill: "#DDD"};
            rectStyleCenter.opacity = 0.2;

            //
            // Visual display of the bar, depending on the display prop
            //

            switch (display) {
                /*
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
                        const formatter = format(format);
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
                */
                case "range":
                    return (
                        <g transform={transform} key={i}>
                            <RangeBar
                                series={series}
                                column={column}
                                bgstyle={rectStyleBackground}
                                fgstyle={rectStyleCenter}
                                style={style}
                                scale={scale}
                                size={size} />
                            <Marker
                                value={value}
                                scale={scale}
                                format={format}
                                size={size}
                                style={rectStyleValue} />
                        </g>
                    );
            }
        });

        //       | <-- bar --> |       | <-- bar --> |
        // | pad |    size     | space |    size     | pad |
        const height = columns.length * size +
                       (columns.length - 1) * spacing +
                       padding * 2;

        return (
            <svg width="100%" height={height} >
                {columnElements}
            </svg>
        );
    }
});

/**
 * Each series in the series list has a list of columns to display. So here
 * we render the series label, the bars (one for each column) and the child
 * if there is one for expanded info about the series.
 */
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

    handleNavigate() {
        if (this.props.onNavigate) {
            this.props.onNavigate(this.props.series.name());
        }
    },

    renderLabel() {
        const style = {
            marginTop: 5,
            cursor: this.props.onNavigate ? "pointer" : "default"
        };

        if (this.props.onNavigate) {
            style.color = this.props.navigateColor;
            return (
                <span style={style} onClick={this.handleNavigate}>
                    {this.props.series.name().toUpperCase()}
                </span>
            );
        } else {
            return (
                <span style={style}>
                    {this.props.series.name().toUpperCase()}
                </span>
            );
        }
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
            timestamp
        } = this.props;

        const rowStyle = {
            width: "100%"
        };

        const resizableStyle = {
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

        const resizableStyle = {
            marginLeft: 5,
            background: "#F8F8F8"
        };

        if (this.props.child && this.props.selected) {
            const props = {
                series: this.props.series,
                timestamp: this.props.timestamp
            };
            const child =  React.cloneElement(this.props.child, props);
            return (
                <div style={rowStyle}>
                    <Resizable style={resizableStyle}>
                        {child}
                    </Resizable>
                </div>
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
            <Flexbox
                key={this.props.rowNumber}
                style={rowStyle}
                flexDirection="row"
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})}
                onClick={this.handleClick} >

                    <FlexItem minWidth="220px" style={labelStyle} >
                        {this.renderLabel(series)}
                    </FlexItem>
                    <FlexItem flexGrow={1}>
                        {this.renderBars()}
                        {/*this.renderChild()*/}
                    </FlexItem>
            </Flexbox>
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
        style={[{fill: "#1F78B4"}, {fill: "#FF7F00"}]} />

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
         * Renders the series name as a link and calls this callback function when it is clicked.
         */
        onNavigate: React.PropTypes.func,

        /**
         * Color to render the series name if navigate is enabled
         */
        navigateColor: React.PropTypes.string,

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
            selectionColor: "steelblue",
            navigateColor: "steelblue"
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
            selectionColor,
            onNavigate,
            navigateColor
        } = this.props;

        //
        // Get the max value in the series list, for overall scale
        //

        seriesList.forEach(series => {
            this.props.columns.forEach(column => {
                const smax = series.max(column);
                if (smax > max) max = smax;
            });
        });

        //
        // Get the 0 or 1 children for the expanded area
        //

        let child;
        if (React.Children.count(this.props.children) === 1) {
            child = React.Children.only(this.props.children);
        }

        //
        // Render a <Row> for each item in the series
        //

        return seriesList.map((series, i) => (
            <Row
                key={i}
                rowNumber={i}
                series={series}
                display={display}
                max={max}
                selected={this.props.selected === series.name()}
                onSelectionChanged={onSelectionChanged}
                selectionColor={selectionColor}
                onNavigate={onNavigate}
                navigateColor={navigateColor}
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

        //
        // Sort the list by the criteria specified in the "sortBy" prop:
        // name, avg or max.
        //

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

        //
        // Keep just the top n, where n is specified by the "top" prop.
        //

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
