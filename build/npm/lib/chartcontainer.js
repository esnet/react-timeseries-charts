/*
 * ESnet React Charts, Copyright (c) 2014, The Regents of the University of
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

"use strict";

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

var React = require("react");
var d3 = require("d3");
var _ = require("underscore");
var invariant = require("react/lib/invariant");

var Pond = require("pond");

var ChartRow = require("./chartrow");
var Charts = require("./charts");
var TimeAxis = require("./timeaxis");
var YAxis = require("./yaxis");
var Brush = require("./brush");

var TimeRange = Pond.TimeRange;

require("./chartcontainer.css");

var ChartContainer = React.createClass({
    displayName: "ChartContainer",

    getDefaultProps: function getDefaultProps() {
        return {
            "transition": 0
        };
    },

    propTypes: {
        children: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.element), React.PropTypes.element]) },

    handleTrackerChanged: function handleTrackerChanged(t) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t);
        }
    },

    //Within the charts library the time range of the x axis is kept as a begin and
    //end time (Javascript Date objects). But the interface is Pond based, so
    //this callback returns a Pond TimeRange.
    handleTimeRangeChanged: function handleTimeRangeChanged(beginTime, endTime) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(TimeRange(beginTime, endTime));
        }
    },

    render: function render() {
        var _this = this;

        var chartRows = [];
        var padding = this.props.padding || 0;

        //
        // How much room does the axes of all the charts take up on the right and left.
        // The result is an array for left and right axis which contain the min column width
        // needed to hold the axes widths at the pos for all rows.
        //
        // pos   1      0        <charts>     0        1        2
        //     | Axis | Axis |   CHARTS    |  Axis  |                       Row 1
        //            | Axis |   CHARTS    |  Axis  |  Axis  |  Axis |      Row 2
        //     ...............              ..........................
        //          left cols              right cols
        //

        var leftAxisWidths = [];
        var rightAxisWidths = [];

        React.Children.forEach(this.props.children, function (childRow) {

            if (childRow.type === ChartRow) {
                (function () {

                    //
                    // Within this row, count the number of columns that will be left
                    // and right of the Charts tag, as well as the total number of
                    // Charts tags for error handling
                    //

                    var countLeft = 0;
                    var countRight = 0;
                    var countCharts = 0;
                    var align = "left";

                    React.Children.forEach(childRow.props.children, function (child) {
                        if (child.type === Charts) {
                            countCharts++;
                            align = "right";
                        } else if (child.type !== Brush) {
                            if (align === "left") {
                                countLeft++;
                            } else {
                                countRight++;
                            }
                        }
                    });

                    if (countCharts !== 1) {
                        invariant(false, "ChartRow should have one and only one <Charts> tag within it", childRow.constructor.name);
                    }

                    align = "left";
                    var pos = countLeft - 1;

                    React.Children.forEach(childRow.props.children, function (child) {
                        if (child.type === Charts) {
                            align = "right";
                            pos = 0;
                        } else {
                            var width = Number(child.props.width) || 40;
                            if (align === "left") {
                                leftAxisWidths[pos] = leftAxisWidths[pos] ? Math.max(width, leftAxisWidths[pos]) : width;
                                pos--;
                            } else if (align === "right") {
                                rightAxisWidths[pos] = rightAxisWidths[pos] ? Math.max(width, rightAxisWidths[pos]) : width;
                                pos++;
                            }
                        }
                    });
                })();
            }
        });

        //Extra space used by padding between columns
        var leftExtra = (leftAxisWidths.length - 1) * padding;
        var rightExtra = (rightAxisWidths.length - 1) * padding;

        //Space used by columns on left and right of charts
        var leftWidth = _.reduce(leftAxisWidths, function (a, b) {
            return a + b;
        }, 0) + leftExtra;
        var rightWidth = _.reduce(rightAxisWidths, function (a, b) {
            return a + b;
        }, 0) + rightExtra;

        //
        // Time scale and time axis elements
        //

        var X_AXIS_HEIGHT = 35;

        var transform = "translate(" + leftWidth + ",0)";
        var timeAxisWidth = this.props.width - leftWidth - rightWidth - padding * 2;

        var _props$timeRange$toJSON = this.props.timeRange.toJSON();

        var _props$timeRange$toJSON2 = _slicedToArray(_props$timeRange$toJSON, 2);

        var beginTime = _props$timeRange$toJSON2[0];
        var endTime = _props$timeRange$toJSON2[1];

        var timeScale = d3.time.scale().domain([new Date(beginTime), new Date(endTime)]).range([0, timeAxisWidth]);

        var timeAxis = React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-md-12", style: { "height": X_AXIS_HEIGHT } },
                React.createElement(
                    "div",
                    { className: "chartcontainer timeaxis" },
                    React.createElement(
                        "svg",
                        { width: this.props.width, height: X_AXIS_HEIGHT },
                        React.createElement(
                            "g",
                            { transform: transform },
                            React.createElement(TimeAxis, { scale: timeScale, dayFormat: this.props.dayFormat, monthFormat: this.props.monthFormat })
                        )
                    )
                )
            )
        );

        //
        // For valid children (those children which are ChartRows), we actually build
        // a Bootstrap row wrapper around those and then create cloned ChartRows that
        // are passed the sizes of the determined axis columns.
        //

        var i = 0;
        React.Children.forEach(this.props.children, function (child) {
            if (child.type === ChartRow) {
                var chartRow = child;
                var rowKey = child.props.key ? child.props.key : "chart-row-row-" + i;

                var props = {
                    key: rowKey,
                    width: _this.props.width, // same as container width
                    timeScale: timeScale, // x axis d3 scale
                    leftAxisWidths: leftAxisWidths, // array with column sizes for axes
                    rightAxisWidths: rightAxisWidths,
                    padding: _this.props.padding, // container padding setting
                    minTime: _this.props.minTime, // zoomable min/max times
                    maxTime: _this.props.maxTime,
                    transition: _this.props.transition, // time to make scale transitions
                    trackerPosition: _this.props.trackerPosition, // tracker position
                    onTimeRangeChanged: _this.handleTimeRangeChanged, // zoom/pan callback
                    onTrackerChanged: _this.handleTrackerChanged // tracker change callback
                };

                var row = React.addons.cloneWithProps(chartRow, props);

                chartRows.push(React.createElement(
                    "div",
                    { key: "chart-row-div-" + i, className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-md-12" },
                        React.createElement(
                            "div",
                            { className: "chartcontainer chartrow" },
                            row
                        )
                    )
                ));
            }
            i++;
        });

        //
        // Final render of the ChartContainer is composed of a number of chartRows and a timeAxis
        //
        // TODO: We might want to consider rendering this whole thing in a single SVG rather than
        // depending on Bootstrap for layout.
        //

        return React.createElement(
            "div",
            { className: "chartcontainer" },
            chartRows,
            timeAxis
        );
    }
});

module.exports = ChartContainer;