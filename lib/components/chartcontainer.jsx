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

var ChartRow = require("./chartrow");
var TimeAxis = require("./timeaxis");
var YAxis    = require("./yaxis");

require("./chartcontainer.css");

var AXIS_WIDTH = 40;

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
        var slotWidth = this.props.slotWidth || AXIS_WIDTH;

        //
        // How much room does the axes of all the charts take up on the right and left.
        // The result is a count of axis slots left and right
        //

        var leftAxisSlots = 0;
        var rightAxisSlots = 0;

        React.Children.forEach(this.props.children, function(childRow) {
            var leftCount = 0;
            var rightCount = 0;
            if (childRow instanceof ChartRow) {
                React.Children.forEach(childRow.props.children, function(child) {
                    var axis = child;
                    if (axis.props.align === "left") {
                        leftCount++;
                    }
                    if (axis.props.align === "right") {
                        rightCount++;
                    }
                });
            }
            if (leftCount > leftAxisSlots) {
                leftAxisSlots = leftCount;
            }
            if (rightCount > rightAxisSlots) {
                rightAxisSlots = rightCount;
            }
        });

        //
        // Time scale and time axis elements
        //

        // TODO: time axis should be defined (or not) the way the YAxis is defined, and should
        //       be more general (i.e. support linear, categories etc)

        var X_AXIS_HEIGHT = 35;

        var transform = "translate(" + leftAxisSlots*slotWidth + ",0)";
        var timeAxisWidth = this.props.width - leftAxisSlots*slotWidth - rightAxisSlots*slotWidth - 5;

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
                                          height={chartRow.props.height}
                                          slotWidth={slotWidth}
                                          timeScale={timeScale}
                                          margin={chartRow.props.margin}
                                          padding={chartRow.props.padding}
                                          minTime={self.props.minTime}
                                          maxTime={self.props.maxTime}
                                          rightAxisSlots={rightAxisSlots}
                                          leftAxisSlots={leftAxisSlots}
                                          onTrackerChanged={self.handleTrackerChanged}
                                          trackerPosition={self.props.trackerPosition}
                                          onTimeRangeChanged={self.handleTimeRangeChanged}
                                          onChartResize={chartRow.props.onChartResize}
                                          enableZoom={chartRow.props.enableZoom}>
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