/** @jsx React.DOM */

"use strict";

var React = require("react");
var d3 = require("d3");

var TimeAxis  = require("./timeaxis");
var YAxis     = require("./yaxis");
var AreaChart = require("./areachart");
var LineChart = require("./linechart");
var Tracker   = require("./tracker");
var EventRect = require("./eventrect");

var AXIS_WIDTH = 40;

/**
 * A ChartRow has a set of Y axes and multiple charts which are overlayed on each other
 * in a central canvas.
 */
var ChartRow = React.createClass({

    displayName: "ChartRow",

    calculateMax: function(data) {

        if (!data) {
            return;
        }

        var upData = data[0];
        var downData = data[1];

        if (!upData || !downData) {
            return 0;
        }

        var upMax = d3.sum(upData, function(dd) {
            return d3.max(dd, function(d) { return d.value;}); });
        var downMax = d3.sum(downData, function(dd) {
            return d3.max(dd, function(d) { return d.value;}); });
        var max = d3.max([upMax, downMax]);

        return max;
    },

    handleMouseMove: function(t) {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t);
        }
    },

    handleMouseOut: function() {
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(null);
        }
    },

    render: function() {
        var self = this;
        var yAxisList = [];
        var chartList = [];
        var xAxis;

        //
        // For this row, we will need to know how many axis slots we are using and the
        // scales associated with them. We store the scales in a map from attr name to
        // the d3 scale.
        //

        var usedLeftAxisSlots = 0;
        var usedRightAxisSlots = 0;
        var yAxisMap = {};
        var leftAxisList = [];
        var rightAxisList = [];

        var MARGIN = 5;
        var innerHeight = Number(this.props.height) - MARGIN*2;

        React.Children.forEach(this.props.children, function(child) {

            if (child instanceof YAxis) {
                var yaxis = child;
                
                //Axis scale and properties
                yAxisMap[yaxis.props.id] = yaxis.props;
                yAxisMap[yaxis.props.id].scale = d3.scale.linear()
                    .domain([yaxis.props.min, yaxis.props.max])
                    .range([innerHeight, 0])
                    .nice();

                //Axis slots
                if (yaxis.props.align === "left") {
                    usedLeftAxisSlots++;
                    leftAxisList.push(yaxis.props.id);
                }
                if (yaxis.props.align === "right") {
                    usedRightAxisSlots++;
                    rightAxisList.push(yaxis.props.id);
                }
            }
        });

        //
        // Push each axis onto the yAxisList, transforming each into its slot
        //

        var transform;
        var i = 0;
        var id;
        for (var leftIndex=Number(this.props.leftAxisSlots)-usedLeftAxisSlots;
             leftIndex < this.props.leftAxisSlots;
             leftIndex++) {
            transform = "translate(" + Number(leftIndex*AXIS_WIDTH + (AXIS_WIDTH-MARGIN)) + "," + MARGIN + ")";
            id = leftAxisList[i];
            yAxisList.push(
                <g transform={transform}>
                    <YAxis align="left"
                           width={AXIS_WIDTH-MARGIN} height={innerHeight}
                           scale={yAxisMap[id].scale}
                           absolute={yAxisMap[id].absolute}/>
                </g>
            );
            i++;
        }

        var j = 0;
        for (var rightIndex=Number(this.props.rightAxisSlots)-usedRightAxisSlots;
             rightIndex < this.props.rightAxisSlots;
             rightIndex++) {
            var x = this.props.width - (rightIndex+1)*AXIS_WIDTH;
            transform = "translate(" + x + "," + MARGIN + ")";
            id = rightAxisList[j];
            yAxisList.push(
                <g transform={transform}>
                    <YAxis align="right"
                           width={AXIS_WIDTH - MARGIN} height={innerHeight}
                           scale={yAxisMap[id].scale}
                           absolute={yAxisMap[id].absolute}/>
                </g>
            );
            j++;
        }

        //
        // Push each chart onto the chartList, transforming each to the right of the left axis slots
        // and specifying its width.
        //

        var chartWidth = this.props.width - this.props.leftAxisSlots*AXIS_WIDTH - this.props.rightAxisSlots*AXIS_WIDTH - 5;
        var chartTransform = "translate(" + this.props.leftAxisSlots*AXIS_WIDTH + "," + MARGIN + ")";

        React.Children.forEach(this.props.children, function(child) {
            var attr;
            
            if (child instanceof AreaChart) {
                var areaChart = child;
                attr = areaChart.props.axis;

               //TODO: This should transfer props to whatever chart is the child

                chartList.push(
                    <AreaChart width={chartWidth} height={innerHeight}
                               data={areaChart.props.data}
                               timeScale={self.props.timeScale}
                               yScale={yAxisMap[attr].scale}/>
                );
            } else if (child instanceof LineChart) {
                var lineChart = child;
                attr = lineChart.props.axis;

               //TODO: This should transfer props to whatever chart is the child

                chartList.push(
                    <LineChart width={chartWidth} height={innerHeight}
                               data={lineChart.props.data}
                               timeScale={self.props.timeScale}
                               yScale={yAxisMap[attr].scale}/>
                );
            }
        });
       
        return (
            <svg width={this.props.width} height={Number(this.props.height)}>

                {yAxisList}

                <g transform={chartTransform}>
                    {chartList}
                </g>

                <g transform={chartTransform}>
                    <Tracker height={innerHeight}
                             scale={self.props.timeScale} position={self.props.trackerPosition} />
                </g>

                <g transform={chartTransform}>
                    <EventRect width={chartWidth} height={innerHeight}
                               scale={self.props.timeScale}
                               onMouseOut={self.handleMouseOut}
                               onMouseMove={self.handleMouseMove}/>
                </g>

                {xAxis}

            </svg>
        );
    }
});

module.exports = ChartRow;