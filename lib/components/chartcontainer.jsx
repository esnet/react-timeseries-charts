/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3 = require("d3");

var ChartRow = require("./chartrow");
var TimeAxis = require("./timeaxis");
var YAxis    = require("./yaxis");

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

    render: function() {
        var self = this;
        var chartRows = [];

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
                    if (child instanceof YAxis) {
                        var axis = child;
                        if (axis.props.align === "left") {
                            leftCount++;
                        }
                        if (axis.props.align === "right") {
                            rightCount++;
                        }
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

        var timeAxisRowStyle = {height: AXIS_WIDTH,
                                borderWidth: "1px",
                                borderStyle: "solid",
                                borderColor: "#F7F0F0",
                                background: "#FAFAFA"};

        var transform = "translate(" + leftAxisSlots*AXIS_WIDTH + ",0)";
        var timeAxisWidth = this.props.width - leftAxisSlots*AXIS_WIDTH - rightAxisSlots*AXIS_WIDTH - 5;
        var timeScale = d3.time.scale()
            .domain([this.props.beginTime, this.props.endTime])
            .range([0, timeAxisWidth]);

        var timeAxis = (
            <div className="row">
                <div className="col-md-12" style={timeAxisRowStyle}>
                    <svg width={this.props.width} height={AXIS_WIDTH}>
                        <g transform={transform}>
                            <TimeAxis scale={timeScale}/>
                        </g>
                    </svg>
                </div>
            </div>
        );

        //
        // For valid children (those children which are ChartRows), we actually build
        // a Bootstrap row wrapper around those and then create new ChartRows that
        // are passed the number of left and right axis slots. Within each ChartRow
        // we pass through the original Chart children of each of the rows.
        //

        React.Children.forEach(this.props.children, function(child) {

            if (child instanceof ChartRow) {
                var chartRow = child;
                var rowStyle = {height: Number(chartRow.props.height)+5,
                                borderWidth: "1px",
                                borderStyle: "solid",
                                borderColor: "#F7F0F0",
                                background: "#FAFAFA"};

                //TODO: Use clone with props here?
                chartRows.push(
                    <div className="row">
                        <div className="col-md-12" style={rowStyle}>
                            <ChartRow width={self.props.width}
                                      height={chartRow.props.height}
                                      timeScale={timeScale}
                                      rightAxisSlots={rightAxisSlots}
                                      leftAxisSlots={leftAxisSlots}
                                      onTrackerChanged={self.handleTrackerChanged}
                                      trackerPosition={self.props.trackerPosition}>
                                {chartRow.props.children}
                            </ChartRow>
                        </div>
                    </div>
                );
            }

        });

        //
        // Final render of the ChartContainer is composed of a number of chartRows
        // and a timeAxis
        //

        return (
            <div>
                {chartRows}
                {timeAxis}
            </div>
        );
    }
});

module.exports = ChartContainer;