"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _flexboxReact = require("flexbox-react");

var _d3Scale = require("d3-scale");

var _pondjs = require("pondjs");

var _Resizable = require("./Resizable");

var _Resizable2 = _interopRequireDefault(_Resizable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2016, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

//d3


/**
 * Draws a marker and it's value as a label. The currentIndex is passed in
 * as a prop, along with the series. In addition
 */
var Marker = _react2.default.createClass({

    displayName: "HorizontalBarChart",

    render: function render() {
        var marker = void 0,
            markerLabel = void 0;

        var _props = this.props;
        var value = _props.value;
        var scale = _props.scale;
        var style = _props.style;
        var size = _props.size;
        var format = _props.format;


        if (value) {

            // Marker position
            var valueStart = scale(value);

            // Marker
            marker = _react2.default.createElement("rect", { style: style, x: valueStart - 2, y: -2, width: 4, height: size + 4 });

            // Text
            var text = void 0;
            if (format && _underscore2.default.isString(format)) {
                var formatter = format(format);
                text = formatter(value);
            } else if (_underscore2.default.isFunction(format)) {
                text = format(value);
            }
            if (text) {
                markerLabel = _react2.default.createElement(
                    "text",
                    { style: { fill: "#666", fontSize: 12 }, x: valueStart + 4, y: size - 2 },
                    text
                );
            }

            return _react2.default.createElement(
                "g",
                null,
                marker,
                markerLabel
            );
        } else {
            return _react2.default.createElement("g", null);
        }
    }
});

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

var RangeBar = function (_React$Component) {
    _inherits(RangeBar, _React$Component);

    function RangeBar() {
        _classCallCheck(this, RangeBar);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(RangeBar).apply(this, arguments));
    }

    _createClass(RangeBar, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(_ref) {
            var series = _ref.series;
            var scale = _ref.scale;

            var seriesChanged = !_pondjs.TimeSeries.is(this.props.series, series);
            var scaleChanged = scaleAsString(this.props.scale) !== scaleAsString(scale);
            return seriesChanged || scaleChanged;
        }
    }, {
        key: "render",
        value: function render() {
            var _props2 = this.props;
            var series = _props2.series;
            var column = _props2.column;
            var bgstyle = _props2.bgstyle;
            var fgstyle = _props2.fgstyle;
            var scale = _props2.scale;
            var size = _props2.size;

            //
            // Statistics-based range bar
            //

            var avg = series.avg(column);
            var stdev = series.stdev(column);

            var seriesMin = series.min(column);
            if (_underscore2.default.isUndefined(seriesMin)) seriesMin = 0;

            var seriesMax = series.max(column);
            if (_underscore2.default.isUndefined(seriesMax)) seriesMax = 0;

            var start = scale(seriesMin);
            var end = scale(seriesMax);
            var centerStart = scale(avg - stdev);
            var centerEnd = scale(avg + stdev);

            var backgroundWidth = end - start;
            if (backgroundWidth < 1) backgroundWidth = 1;

            var centerWidth = centerEnd - centerStart;
            if (centerWidth <= 1) centerWidth = 1;

            var barElementBackground = _react2.default.createElement("rect", {
                style: bgstyle,
                rx: 2, ry: 2,
                x: start, y: 1,
                width: backgroundWidth,
                height: size - 2 });
            var barElementCenter = _react2.default.createElement("rect", {
                style: fgstyle,
                x: centerStart,
                y: 0,
                width: centerWidth,
                height: size });

            return _react2.default.createElement(
                "g",
                null,
                barElementBackground,
                barElementCenter
            );
        }
    }]);

    return RangeBar;
}(_react2.default.Component);

/**
 * Render just the bars, with each bar being one series in the seriesList
 */


var Bars = _react2.default.createClass({

    displayName: "HorizontalBarChartBars",

    shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
        var seriesChanged = !_pondjs.TimeSeries.is(this.props.series, nextProps.series);
        var timestampChanged = this.props.timestamp !== nextProps.timestamp;
        return seriesChanged || timestampChanged;
    },
    render: function render() {
        var _props3 = this.props;
        var display = _props3.display;
        var series = _props3.series;
        var max = _props3.max;
        var columns = _props3.columns;
        var spacing = _props3.spacing;
        var padding = _props3.padding;
        var size = _props3.size;
        var width = _props3.width;
        var style = _props3.style;
        var format = _props3.format;
        var timestamp = _props3.timestamp;

        // Highlighted value

        var currentIndex = timestamp ? series.bisect(timestamp) : null;

        //
        // Render the RangeBars, one for each column
        //

        var columnElements = columns.map(function (column, i) {

            // Vertical position of the bar
            var yPosition = padding + i * (size + spacing);
            var transform = "translate(0," + yPosition + ")";

            // Scale
            var scale = (0, _d3Scale.scaleLinear)().domain([0, max]).range([0, width - 100]);

            //
            // Value and it's style
            //

            var value = currentIndex ? series.at(currentIndex).get(column) : null;

            //
            // Styles
            //

            var rectStyleValue = _underscore2.default.isArray(style) && style.length > i ? _underscore2.default.clone(style[i]) : { fill: "#DDD" };

            var rectStyleBackground = _underscore2.default.isArray(style) && style.length > i ? _underscore2.default.clone(style[i]) : { fill: "#DDD" };
            rectStyleBackground.opacity = 0.2;

            var rectStyleCenter = _underscore2.default.isArray(style) && style.length > i ? _underscore2.default.clone(style[i]) : { fill: "#DDD" };
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
                    return _react2.default.createElement(
                        "g",
                        { transform: transform, key: i },
                        _react2.default.createElement(RangeBar, {
                            series: series,
                            column: column,
                            bgstyle: rectStyleBackground,
                            fgstyle: rectStyleCenter,
                            style: style,
                            scale: scale,
                            size: size }),
                        _react2.default.createElement(Marker, {
                            value: value,
                            scale: scale,
                            format: format,
                            size: size,
                            style: rectStyleValue })
                    );
                default:
                    return _react2.default.createElement("g", null);
            }
        });

        //       | <-- bar --> |       | <-- bar --> |
        // | pad |    size     | space |    size     | pad |
        var height = columns.length * size + (columns.length - 1) * spacing + padding * 2;

        return _react2.default.createElement(
            "svg",
            { width: "100%", height: height },
            columnElements
        );
    }
});

/**
 * Each series in the series list has a list of columns to display. So here
 * we render the series label, the bars (one for each column) and the child
 * if there is one for expanded info about the series.
 */
var Row = _react2.default.createClass({

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
    handleNavigate: function handleNavigate() {
        if (this.props.onNavigate) {
            this.props.onNavigate(this.props.series.name());
        }
    },
    renderLabel: function renderLabel() {
        var style = {
            marginTop: 5,
            cursor: this.props.onNavigate ? "pointer" : "default"
        };

        if (this.props.onNavigate) {
            style.color = this.props.navigateColor;
            return _react2.default.createElement(
                "span",
                { style: style, onClick: this.handleNavigate },
                this.props.series.name().toUpperCase()
            );
        } else {
            return _react2.default.createElement(
                "span",
                { style: style },
                this.props.series.name().toUpperCase()
            );
        }
    },
    renderBars: function renderBars() {
        var _this2 = this;

        var _props4 = this.props;
        var display = _props4.display;
        var series = _props4.series;
        var max = _props4.max;
        var columns = _props4.columns;
        var spacing = _props4.spacing;
        var padding = _props4.padding;
        var size = _props4.size;
        var style = _props4.style;
        var format = _props4.format;
        var timestamp = _props4.timestamp;


        var rowStyle = {
            width: "100%"
        };

        var resizableStyle = {};

        return _react2.default.createElement(
            "div",
            {
                style: rowStyle,
                onMouseEnter: function onMouseEnter() {
                    return _this2.setState({ hover: true });
                },
                onMouseLeave: function onMouseLeave() {
                    return _this2.setState({ hover: false });
                } },
            _react2.default.createElement(
                _Resizable2.default,
                { style: resizableStyle },
                _react2.default.createElement(Bars, {
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

        var resizableStyle = {
            marginLeft: 5,
            background: "#F8F8F8"
        };

        if (this.props.child && this.props.selected) {
            var props = {
                series: this.props.series,
                timestamp: this.props.timestamp
            };
            var child = _react2.default.cloneElement(this.props.child, props);
            return _react2.default.createElement(
                "div",
                { style: rowStyle },
                _react2.default.createElement(
                    _Resizable2.default,
                    { style: resizableStyle },
                    child
                )
            );
        }
    },
    render: function render() {
        var _this3 = this;

        var series = this.props.series;

        var rowStyle = {
            borderTopStyle: "solid",
            borderTopWidth: 1,
            borderTopColor: "#DFDFDF"
        };

        var labelStyle = void 0;
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

        if (this.state.hover && (_underscore2.default.isUndefined(this.props.selected) || !this.props.selected)) {
            labelStyle.background = "#EDEDED";
        }

        return _react2.default.createElement(
            _flexboxReact.Flexbox,
            {
                key: this.props.rowNumber,
                style: rowStyle,
                flexDirection: "row",
                onMouseEnter: function onMouseEnter() {
                    return _this3.setState({ hover: true });
                },
                onMouseLeave: function onMouseLeave() {
                    return _this3.setState({ hover: false });
                },
                onClick: this.handleClick },
            _react2.default.createElement(
                _flexboxReact.FlexItem,
                { minWidth: "220px", style: labelStyle },
                this.renderLabel(series)
            ),
            _react2.default.createElement(
                _flexboxReact.FlexItem,
                { flexGrow: 1 },
                this.renderBars()
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
exports.default = _react2.default.createClass({

    displayName: "HorizontalBarChart",

    propTypes: {

        /**
         * Sort by either "max", "avg" or "name"
         */
        display: _react2.default.PropTypes.oneOf(["avg", "max", "range"]),

        /**
         * A list of [TimeSeries](http://software.es.net/pond#timeseries) objects to visualize
         */
        seriesList: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.instanceOf(_pondjs.TimeSeries)).isRequired,

        /**
         * Columns in each timeseries to display
         */
        columns: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string),

        /**
         * Sort by either "name", "max", or "avg"
         */
        sortBy: _react2.default.PropTypes.oneOf(["name", "max", "avg"]),

        /**
         * Display only the top n
         */
        top: _react2.default.PropTypes.number,

        /**
         * The height or thickness of each bar
         */
        size: _react2.default.PropTypes.number,

        /**
         * The spacing between each bar (column) of the series
         */
        spacing: _react2.default.PropTypes.number,

        /**
         * The spacing above and below each series
         */
        padding: _react2.default.PropTypes.number,

        /**
         * The width of the label area
         */
        labelWidth: _react2.default.PropTypes.number,

        /**
         * Callback for when the selection changes. The callback function will be called
         * with the name of the TimeSeries selected.
         */
        onSelectionChanged: _react2.default.PropTypes.func,

        /**
         * Specify which TimeSeries is selected by providing the name of the selected
         * series.
         */
        selected: _react2.default.PropTypes.string,

        /**
         * Color to mark the selected row with.
         */
        selectionColor: _react2.default.PropTypes.string,

        /**
         * Renders the series name as a link and calls this callback function when it is clicked.
         */
        onNavigate: _react2.default.PropTypes.func,

        /**
         * Color to render the series name if navigate is enabled
         */
        navigateColor: _react2.default.PropTypes.string,

        /**
         * The format is used to format the display text for the bar. It can be specified as a d3
         * format string (such as ".2f") or a function. The function will be called with the value
         * and should return a string.
         */
        format: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string]),

        /**
         * A single child which will be rendered when the item is selected. The child will have
         * a couple of additional props injected onto it when rendered:
         *  * `series` - the TimeSeries of the row being rendered
         *  * `timestamp` - the current timestamp being shown
         */
        children: _react2.default.PropTypes.element
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
            selectionColor: "steelblue",
            navigateColor: "steelblue"
        };
    },
    renderRows: function renderRows(seriesList) {
        var _this4 = this;

        var max = 0;

        var _props5 = this.props;
        var columns = _props5.columns;
        var spacing = _props5.spacing;
        var padding = _props5.padding;
        var size = _props5.size;
        var style = _props5.style;
        var format = _props5.format;
        var display = _props5.display;
        var timestamp = _props5.timestamp;
        var onSelectionChanged = _props5.onSelectionChanged;
        var selectionColor = _props5.selectionColor;
        var onNavigate = _props5.onNavigate;
        var navigateColor = _props5.navigateColor;

        //
        // Get the max value in the series list, for overall scale
        //

        seriesList.forEach(function (series) {
            _this4.props.columns.forEach(function (column) {
                var smax = series.max(column);
                if (smax > max) max = smax;
            });
        });

        //
        // Get the 0 or 1 children for the expanded area
        //

        var child = void 0;
        if (_react2.default.Children.count(this.props.children) === 1) {
            child = _react2.default.Children.only(this.props.children);
        }

        //
        // Render a <Row> for each item in the series
        //

        return seriesList.map(function (series, i) {
            return _react2.default.createElement(Row, {
                key: i,
                rowNumber: i,
                series: series,
                display: display,
                max: max,
                selected: _this4.props.selected === series.name(),
                onSelectionChanged: onSelectionChanged,
                selectionColor: selectionColor,
                onNavigate: onNavigate,
                navigateColor: navigateColor,
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
        var _this5 = this;

        //
        // Sort the list by the criteria specified in the "sortBy" prop:
        // name, avg or max.
        //

        var sortedList = _underscore2.default.sortBy(this.props.seriesList, function (series) {
            switch (_this5.props.sortBy) {
                case "name":
                    return series.name;
                case "avg":
                    return -_underscore2.default.reduce(_this5.props.columns.map(function (column) {
                        return series.avg(column);
                    }), function (memo, num) {
                        return memo + num;
                    }, 0);
                case "max":
                    return -_underscore2.default.max(_this5.props.columns.map(function (column) {
                        return series.max(column);
                    }));
                default:
                    throw new Error("unknown sort prop", _this5.props.sortBy);
            }
        });

        //
        // Keep just the top n, where n is specified by the "top" prop.
        //

        var list = this.props.top ? sortedList.slice(0, this.props.top) : sortedList;

        var containerStyle = {
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "#DFDFDF"
        };

        return _react2.default.createElement(
            "div",
            { style: containerStyle },
            this.renderRows(list)
        );
    }
});