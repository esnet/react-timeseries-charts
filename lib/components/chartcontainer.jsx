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

import React from "react/addons";
import d3 from "d3";
import _ from "underscore";
import moment from "moment";

import invariant from "react/lib/invariant";

import {TimeRange} from "@esnet/pond";

import ChartRow from "./chartrow";
import Charts from "./charts";
import TimeAxis from "./timeaxis";
import YAxis from "./yaxis";
import Brush from "./brush";

import "./chartcontainer.css";

export default React.createClass({

    getDefaultProps: function() {
        return {
            "transition": 0,
            "enablePanZoom": false,
        };
    },

    propTypes: {
        enablePanZoom: React.PropTypes.bool,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element]),
    },

    handleTrackerChanged: function(t) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t);
        }
    },

    //Within the charts library the time range of the x axis is kept as a begin and
    //end time (Javascript Date objects). But the interface is Pond based, so
    //this callback returns a Pond TimeRange.
    handleTimeRangeChanged: function(timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    },

    render: function() {
        let chartRows = [];
        let padding = this.props.padding || 0;

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

        let leftAxisWidths = [];
        let rightAxisWidths = [];

        React.Children.forEach(this.props.children, childRow => {
            
            if (childRow.type === ChartRow) {

                //
                // Within this row, count the number of columns that will be left
                // and right of the Charts tag, as well as the total number of
                // Charts tags for error handling
                //

                let countLeft = 0;
                let countRight = 0;
                let countCharts = 0;
                let align = "left";

                React.Children.forEach(childRow.props.children, child => {
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
                    invariant(false, 'ChartRow should have one and only one <Charts> tag within it',
                    childRow.constructor.name
                    );
                }

                align = "left";
                let pos = countLeft-1;
                
                React.Children.forEach(childRow.props.children, child => {
                    if (child.type === Charts) {
                        align = "right";
                        pos = 0;
                    } else {
                        let width = Number(child.props.width) || 40;
                        if (align === "left") {
                            leftAxisWidths[pos] = leftAxisWidths[pos] ? Math.max(width, leftAxisWidths[pos]) : width;
                            pos--;
                        } else if (align === "right") {
                            rightAxisWidths[pos] = rightAxisWidths[pos] ? Math.max(width, rightAxisWidths[pos]) : width;
                            pos++;
                        }
                    }
                });
            }
        });

        
        //Extra space used by padding between columns
        let leftExtra = (leftAxisWidths.length - 1) * padding;
        let rightExtra = (rightAxisWidths.length - 1) * padding;
        
        //Space used by columns on left and right of charts
        let leftWidth = _.reduce(leftAxisWidths, (a, b) => { return a + b; }, 0) + leftExtra;
        let rightWidth = _.reduce(rightAxisWidths, (a, b) => { return a + b; }, 0) + rightExtra;

        //
        // Time scale and time axis elements
        //

        let X_AXIS_HEIGHT = 35;

        let transform = `translate(${leftWidth},0)`;
        let timeAxisWidth = this.props.width - leftWidth - rightWidth - padding * 2;

        let [beginTime, endTime] = this.props.timeRange.toJSON();

        let timeScale = d3.time.scale()
            .domain([beginTime, endTime])
            .range([0, timeAxisWidth]);

        let timeAxis = (
            <div className="row">
                <div className="col-md-12" style={{"height": X_AXIS_HEIGHT}}>
                    <div className="chartcontainer timeaxis" >
                        <svg width={this.props.width} height={X_AXIS_HEIGHT}>
                            <g transform={transform}>
                                <TimeAxis scale={timeScale} format={this.props.format}/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        );

        //
        // For valid children (those children which are ChartRows), we actually build
        // a Bootstrap row wrapper around those and then create cloned ChartRows that
        // are passed the sizes of the determined axis columns.
        //

        let i = 0;
        React.Children.forEach(this.props.children, child => {
            if (child.type === ChartRow) {
                let chartRow = child;
                let rowKey = child.props.key ? child.props.key : "chart-row-row-" + i;
                
                let props = {
                    key: rowKey,
                    width: this.props.width,                          // same as container width
                    timeScale: timeScale,                             // x axis d3 scale
                    leftAxisWidths: leftAxisWidths,                   // array with column sizes for axes
                    rightAxisWidths: rightAxisWidths,
                    padding: this.props.padding,                      // container padding setting
                    minTime: this.props.minTime,                      // zoomable min/max times
                    maxTime: this.props.maxTime,
                    transition: this.props.transition,                // time to make scale transitions
                    enablePanZoom: this.props.enablePanZoom,          // hook up pan/zoom events
                    minDuration: this.props.minDuration,
                    trackerPosition: this.props.trackerPosition,      // tracker position
                    onTimeRangeChanged: this.handleTimeRangeChanged,  // zoom/pan callback
                    onTrackerChanged: this.handleTrackerChanged       // tracker change callback
                };

                let row = React.addons.cloneWithProps(chartRow, props);

                chartRows.push(
                    <div key={"chart-row-div-" + i } className="row">
                        <div className="col-md-12">
                            <div className="chartcontainer chartrow">
                                {row}
                            </div>
                        </div>
                    </div>
                );
            }
            i++;

        });

        //
        // Final render of the ChartContainer is composed of a number of chartRows and a timeAxis
        //
        // TODO: We might want to consider rendering this whole thing in a single SVG rather than
        // depending on Bootstrap for layout.
        //

        return (
            <div className="chartcontainer">
                {chartRows}
                {timeAxis}
            </div>
        );
    }
});
