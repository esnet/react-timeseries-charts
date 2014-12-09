/** @jsx React.DOM */

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

var React = require("react");
var d3 = require("d3");
var _ = require("underscore");

var ChartRow = require("./chartrow");
var AxisGroup = require("./axisgroup");
var TimeAxis = require("./timeaxis");
var YAxis    = require("./yaxis");

require("./chartcontainer.css");

var ChartContainer = React.createClass({

    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.component),
            React.PropTypes.component]),
    },

    handleTrackerChanged: function(t) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t);
        }
    },

    handleTimeRangeChanged: function(beginTime, endTime) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(beginTime, endTime);
        }
    },

    render: function() {
        var self = this;
        var chartRows = [];
        var padding = this.props.padding || 0;

        //
        // How much room does the axes of all the charts take up on the right and left.
        // The result is an array for left and right axis which contain the min column width
        // needed to hold the axes widths at the pos for all rows.
        //
        // pos   1      0                     0        1        2
        //     | Axis | Axis |   CHARTS    |  Axis  |                       Row 1
        //            | Axis |   CHARTS    |  Axis  |  Axis  |  Axis |      Row 2     
        //     ...............              ..........................
        //          left cols              right cols
        //

        var leftAxisWidths = [];
        var rightAxisWidths = [];

        React.Children.forEach(this.props.children, function(childRow) {
            if (childRow instanceof ChartRow) {
                console.log("CHART ROW:");
                React.Children.forEach(childRow.props.children, function(childGroup) {
                    if (childGroup instanceof AxisGroup) {
                        var axisGroup = childGroup;
                        var align = axisGroup.props.align;
                        var pos = 0;

                        console.log("   AXIS GROUP", align, childGroup.props);

                        React.Children.forEach(axisGroup.props.children, function(axis) {
                            var width = Number(axis.props.width) || 40;
                            if (align === "left") {
                                console.log("           Left", pos);
                                leftAxisWidths[pos] = leftAxisWidths[pos] ?
                                    Math.max(width, leftAxisWidths[pos]) : width;
                            } else if (align === "right") {
                                console.log("           Right", pos);
                                rightAxisWidths[pos] = rightAxisWidths[pos] ?
                                    Math.max(width, rightAxisWidths[pos]) : width;
                            }
                            pos++;
                        });
                    }
                });
            }
        });

        //Extra space used by padding between columns
        var leftExtra = (leftAxisWidths.length - 1) * padding;
        var rightExtra = (rightAxisWidths.length - 1) * padding;
        
        //Space used by columns on left and right of charts
        var leftWidth = _.reduce(leftAxisWidths, function(a, b) { return a + b; }, 0) + leftExtra;
        var rightWidth = _.reduce(rightAxisWidths, function(a, b) { return a + b; }, 0) + rightExtra;

        console.log("Left:", leftAxisWidths, leftWidth, padding, leftExtra);
        console.log("Right:", rightAxisWidths, rightWidth, padding, rightExtra);

        //
        // Time scale and time axis elements
        //

        // TODO: time axis should be defined (or not) the way the YAxis is defined, and should
        //       be more general (i.e. support linear, categories etc)

        var X_AXIS_HEIGHT = 35;


        var transform = "translate(" + leftWidth + ",0)";
        var timeAxisWidth = this.props.width - leftWidth - rightWidth - 5;

        console.log("timeAxisWidth", timeAxisWidth);

        var timeScale = d3.time.scale()
            .domain([this.props.beginTime,this.props.endTime])
            .range([0, timeAxisWidth]);

        var timeAxis = (
            <div className="row">
                <div className="col-md-12" style={{"height": X_AXIS_HEIGHT}}>
                    <div className="chartcontainer timeaxis" >
                        <svg width={this.props.width} height={X_AXIS_HEIGHT}>
                            <g transform={transform}>
                                <TimeAxis scale={timeScale}/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        );

        //
        // For valid children (those children which are ChartRows), we actually build
        // a Bootstrap row wrapper around those and then create new ChartRows that
        // are passed the number of left and right axis slots. Within each ChartRow
        // we pass through the original Chart children of each of the rows.
        //
        // TODO: - Clone original ChartRow with new props on it
        //       - Pass down timeScale as scale and max/minTime as max/min.

        var i = 0;
        React.Children.forEach(this.props.children, function(child) {
            if (child instanceof ChartRow) {
                var chartRow = child;
                var rowKey = child.props.key ? child.props.key : "chart-row-row-" + i;
                chartRows.push(
                    <div key={"chart-row-div-" + i } className="row">
                        <div className="col-md-12">
                            <div className="chartcontainer chartrow">
                                <ChartRow width={self.props.width}

                                          timeScale={timeScale}

                                          leftAxisWidths={leftAxisWidths}
                                          rightAxisWidths={rightAxisWidths}
                                          
                                          height={chartRow.props.height}
                                          margin={chartRow.props.margin}
                                          padding={self.props.padding}

                                          minTime={self.props.minTime}
                                          maxTime={self.props.maxTime}

                                          trackerPosition={self.props.trackerPosition}

                                          onChartResize={chartRow.props.onChartResize}
                                          enableZoom={chartRow.props.enableZoom}

                                          onTimeRangeChanged={self.handleTimeRangeChanged}
                                          onTrackerChanged={self.handleTrackerChanged} >

                                    {chartRow.props.children}
                                </ChartRow>
                            </div>

                        </div>
                    </div>
                );
            }
            i++;

        });

        //
        // Final render of the ChartContainer is composed of a number of chartRows
        // and a timeAxis
        //

        return (
            <div className="chartcontainer">
                {chartRows}
                {timeAxis}
            </div>
        );
    }
});

module.exports = ChartContainer;