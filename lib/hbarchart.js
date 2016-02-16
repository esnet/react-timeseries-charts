/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _reactFlexbox = require("react-flexbox");

var _reactFlexbox2 = _interopRequireDefault(_reactFlexbox);

var _pondjs = require("pondjs");

var _resizable = require("./resizable");

var _resizable2 = _interopRequireDefault(_resizable);

var Bars = _react2["default"].createClass({

    displayName: "HorizontalBarChartBars",

    render: function render() {
        var _props = this.props;
        var display = _props.display;
        var series = _props.series;
        var max = _props.max;
        var columns = _props.columns;
        var spacing = _props.spacing;
        var padding = _props.padding;
        var size = _props.size;
        var width = _props.width;
        var style = _props.style;
        var format = _props.format;
        var timestamp = _props.timestamp;

        // Highlighted value
        var index = timestamp ? series.bisect(timestamp) : null;

        var columnElements = columns.map(function (column, i) {

            // Vertical position of the bar
            var y = padding + i * (size + spacing);

            // Scale
            var scale = _d32["default"].scale.linear().domain([0, max]).range([0, width - 100]);

            // Start and end of the bar
            var start = undefined,
                end = undefined,
                value = undefined,
                centerStart = undefined,
                centerEnd = undefined;
            var textElement = undefined;
            switch (display) {
                case "avg":
                case "max":

                    // Style of the bar
                    var rectStyle = _underscore2["default"].isArray(style) && style.length > i ? _underscore2["default"].clone(style[i]) : { fill: "#DDD" };

                    value = display === "avg" ? series.avg(column) : series.max(column);
                    start = scale(0);
                    end = scale(value);
                    var w = end - start;
                    if (w <= 1) {
                        w = 1;
                    }
                    var barElement = _react2["default"].createElement("rect", { style: rectStyle, x: start, y: y, width: w, height: size });

                    // Text
                    var text = undefined;
                    if (format && _underscore2["default"].isString(format)) {
                        var formatter = _d32["default"].format(format);
                        text = formatter(value);
                    } else if (_underscore2["default"].isFunction(format)) {
                        text = format(value);
                    }

                    if (text) {
                        textElement = _react2["default"].createElement(
                            "text",
                            { style: { fill: "#666", fontSize: 12 }, x: end + 2, y: y + size - 1 },
                            text
                        );
                    }

                    return _react2["default"].createElement(
                        "g",
                        { key: i },
                        barElement,
                        textElement
                    );

                case "range":

                    // Styles
                    var rectStyleBackground = _underscore2["default"].isArray(style) && style.length > i ? _underscore2["default"].clone(style[i]) : { fill: "#DDD" };
                    rectStyleBackground.opacity = 0.2;

                    var rectStyleCenter = _underscore2["default"].isArray(style) && style.length > i ? _underscore2["default"].clone(style[i]) : { fill: "#DDD" };
                    rectStyleCenter.opacity = 0.2;

                    var rectStyleValue = _underscore2["default"].isArray(style) && style.length > i ? _underscore2["default"].clone(style[i]) : { fill: "#DDD" };

                    // Statistics
                    var avg = series.avg(column);
                    var stdev = series.stdev(column);

                    var seriesMin = series.min(column);
                    if (_underscore2["default"].isNull(seriesMin)) seriesMin = 0;

                    var seriesMax = series.max(column);
                    if (_underscore2["default"].isNull(seriesMax)) seriesMax = 0;

                    start = scale(seriesMin);
                    end = scale(seriesMax);
                    centerStart = scale(avg - stdev);
                    centerEnd = scale(avg + stdev);

                    // Current value
                    var barElementValue = undefined;
                    if (index) {
                        value = series.at(index).get(column);
                        var valueStart = scale(value);
                        barElementValue = _react2["default"].createElement("rect", { style: rectStyleValue, x: valueStart - 2, y: y - 2, width: 4, height: size + 4 });

                        // Text
                        var _text = undefined;
                        if (format && _underscore2["default"].isString(format)) {
                            var formatter = _d32["default"].format(format);
                            _text = formatter(value);
                        } else if (_underscore2["default"].isFunction(format)) {
                            _text = format(value);
                        }

                        if (_text) {
                            textElement = _react2["default"].createElement(
                                "text",
                                { style: { fill: "#666", fontSize: 12 }, x: end + 2, y: y + size - 1 },
                                _text
                            );
                        }
                    }

                    var backgroundWidth = end - start;
                    if (backgroundWidth < 1) backgroundWidth = 1;

                    var centerWidth = centerEnd - centerStart;
                    if (centerWidth <= 1) centerWidth = 1;

                    var barElementBackground = _react2["default"].createElement("rect", { style: rectStyleBackground, rx: "2", ry: 2, x: start, y: y + 1, width: backgroundWidth, height: size - 2 });
                    var barElementCenter = _react2["default"].createElement("rect", { style: rectStyleCenter, x: centerStart, y: y, width: centerWidth, height: size });
                    return _react2["default"].createElement(
                        "g",
                        { key: i },
                        barElementBackground,
                        barElementCenter,
                        barElementValue,
                        textElement
                    );
            }
        });

        var height = columns.length * size + (columns.length - 1) * spacing + padding * 2;

        return _react2["default"].createElement(
            "svg",
            {
                width: "100%",
                height: height },
            columnElements
        );
    }
});

var Row = _react2["default"].createClass({

    displayName: "HorizontalBarChartRow",

    getInitialState: function getInitialState() {
        return {
            hover: false
        };
    },

    handleClick: function handleClick() {
        if (this.props.onSelectionChanged) {
            this.props.onSelectionChanged(this.props.series.name());
        }
    },

    renderLabel: function renderLabel() {
        var style = {
            marginTop: 5,
            cursor: "default"
        };

        return _react2["default"].createElement(
            "span",
            { style: style },
            this.props.series.name().toUpperCase()
        );
    },

    renderBars: function renderBars() {
        var _this = this;

        var _props2 = this.props;
        var display = _props2.display;
        var series = _props2.series;
        var max = _props2.max;
        var columns = _props2.columns;
        var spacing = _props2.spacing;
        var padding = _props2.padding;
        var size = _props2.size;
        var style = _props2.style;
        var format = _props2.format;
        var timestamp = _props2.timestamp;

        var rowStyle = {
            width: "100%",
            boxShadow: "inset 11px 0px 7px -9px rgba(0,0,0,0.28)"
        };

        var resizableStyle = {
            margin: 3
        };

        return _react2["default"].createElement(
            "div",
            {
                style: rowStyle,
                onMouseEnter: function () {
                    return _this.setState({ hover: true });
                },
                onMouseLeave: function () {
                    return _this.setState({ hover: false });
                } },
            _react2["default"].createElement(
                _resizable2["default"],
                { style: resizableStyle },
                _react2["default"].createElement(Bars, {
                    display: display,
                    series: series,
                    max: max,
                    columns: columns,
                    spacing: spacing,
                    padding: padding,
                    size: size,
                    style: style,
                    format: format,
                    timestamp: timestamp })
            )
        );
    },

    renderChild: function renderChild() {
        var rowStyle = {
            width: "100%",
            boxShadow: "inset 11px 0px 7px -9px rgba(0,0,0,0.28)"
        };

        if (this.props.child && this.props.selected) {
            var props = {
                series: this.props.series,
                timestamp: this.props.timestamp
            };
            var child = _react2["default"].cloneElement(this.props.child, props);
            return _react2["default"].createElement(
                _reactFlexbox2["default"],
                { style: rowStyle },
                _react2["default"].createElement(
                    "div",
                    { style: { marginLeft: 5 } },
                    child
                )
            );
        }
    },

    render: function render() {
        var _this2 = this;

        var series = this.props.series;

        var rowStyle = {
            borderTopStyle: "solid",
            borderTopWidth: 1,
            borderTopColor: "#DFDFDF"
        };

        var labelStyle = undefined;
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

        if (this.state.hover && (_underscore2["default"].isUndefined(this.props.selected) || !this.props.selected)) {
            labelStyle.background = "#EDEDED";
        }

        return _react2["default"].createElement(
            _reactFlexbox2["default"],
            { column: true,
                onMouseEnter: function () {
                    return _this2.setState({ hover: true });
                },
                onMouseLeave: function () {
                    return _this2.setState({ hover: false });
                },
                onClick: this.handleClick },
            _react2["default"].createElement(
                _reactFlexbox2["default"],
                { key: series.name(), row: true, style: rowStyle },
                _react2["default"].createElement(
                    _reactFlexbox2["default"],
                    {
                        column: true, width: "220px",
                        style: labelStyle },
                    this.renderLabel(series)
                ),
                _react2["default"].createElement(
                    _reactFlexbox2["default"],
                    { column: true },
                    this.renderBars(),
                    this.renderChild()
                )
            )
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
exports["default"] = _react2["default"].createClass({

    displayName: "HorizontalBarChart",

    propTypes: {

        /**
         * Sort by either "max", "avg" or "name"
         */
        display: _react2["default"].PropTypes.oneOf(["avg", "max", "range"]),

        /**
         * A list of [TimeSeries](http://software.es.net/pond#timeseries) objects to visualize
         */
        seriesList: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.instanceOf(_pondjs.TimeSeries)).isRequired,

        /**
         * Columns in each timeseries to display
         */
        columns: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.string),

        /**
         * Sort by either "name", "max", or "avg"
         */
        sortBy: _react2["default"].PropTypes.oneOf(["name", "max", "avg"]),

        /**
         * Display only the top n
         */
        top: _react2["default"].PropTypes.number,

        /**
         * The height or thickness of each bar
         */
        size: _react2["default"].PropTypes.number,

        /**
         * The spacing between each bar (column) of the series
         */
        spacing: _react2["default"].PropTypes.number,

        /**
         * The spacing above and below each series
         */
        padding: _react2["default"].PropTypes.number,

        /**
         * The width of the label area
         */
        labelWidth: _react2["default"].PropTypes.number,

        /**
         * Callback for when the selection changes. The callback function will be called
         * with the name of the TimeSeries selected.
         */
        onSelectionChanged: _react2["default"].PropTypes.func,

        /**
         * Specify which TimeSeries is selected by providing the name of the selected
         * series.
         */
        selected: _react2["default"].PropTypes.string,

        /**
         * Color to mark the selected row with.
         */
        selectionColor: _react2["default"].PropTypes.string,

        /**
         * The format is used to format the display text for the bar. It can be specified as a d3
         * format string (such as ".2f") or a function. The function will be called with the value
         * and should return a string.
         */
        format: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.func, _react2["default"].PropTypes.string]),

        /**
         * A single child which will be rendered when the item is selected. The child will have
         * a couple of additional props injected onto it when rendered:
         *  * `series` - the TimeSeries of the row being rendered
         *  * `timestamp` - the current timestamp being shown 
         */
        children: _react2["default"].PropTypes.element
    },

    getDefaultProps: function getDefaultProps() {
        return {
            display: "avg",
            size: 14,
            spacing: 2,
            padding: 5,
            labelWidth: 240,
            style: [{ fill: "steelblue" }],
            seriesList: [],
            columns: ["value"],
            sortBy: "max",
            selectionColor: "steelblue"
        };
    },

    renderRows: function renderRows(seriesList) {
        var _this3 = this;

        var max = 0;

        var _props3 = this.props;
        var columns = _props3.columns;
        var spacing = _props3.spacing;
        var padding = _props3.padding;
        var size = _props3.size;
        var style = _props3.style;
        var format = _props3.format;
        var display = _props3.display;
        var timestamp = _props3.timestamp;
        var onSelectionChanged = _props3.onSelectionChanged;
        var selectionColor = _props3.selectionColor;

        seriesList.forEach(function (series) {
            _this3.props.columns.forEach(function (column) {
                var smax = series.max(column);
                if (smax > max) max = smax;
            });
        });

        var child = undefined;
        if (_react2["default"].Children.count(this.props.children) === 1) {
            child = _react2["default"].Children.only(this.props.children);
        }

        return seriesList.map(function (series, i) {
            return _react2["default"].createElement(Row, {
                key: i,
                series: series,
                display: display,
                max: max,
                selected: _this3.props.selected === series.name(),
                onSelectionChanged: onSelectionChanged,
                selectionColor: selectionColor,
                columns: columns,
                spacing: spacing,
                padding: padding,
                size: size,
                style: style,
                format: format,
                timestamp: timestamp,
                child: child });
        });
    },

    render: function render() {
        var _this4 = this;

        // Sort the list
        var sortedList = _underscore2["default"].sortBy(this.props.seriesList, function (series) {
            switch (_this4.props.sortBy) {
                case "name":
                    return series.name;
                case "avg":
                    return -_underscore2["default"].reduce(_this4.props.columns.map(function (column) {
                        return series.avg(column);
                    }), function (memo, num) {
                        return memo + num;
                    }, 0);
                case "max":
                    return -_underscore2["default"].max(_this4.props.columns.map(function (column) {
                        return series.max(column);
                    }));
            }
        });

        // Top n
        var list = this.props.top ? sortedList.slice(0, this.props.top) : sortedList;

        var containerStyle = {
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "#DFDFDF"
        };

        return _react2["default"].createElement(
            "div",
            { style: containerStyle },
            this.renderRows(list)
        );
    }
});
module.exports = exports["default"];