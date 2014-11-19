/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var d3 = require("d3");
var _ = require("underscore");

var AreaChart  = require("./areachart");
var LineChart  = require("./linechart");
var EventChart = require("./eventchart");

var YAxis      = require("./yaxis");
var Tracker    = require("./tracker");
var EventRect  = require("./eventrect");

/**
 * Hacky workaround for the fact that clipPath is not currently a supported tag in React.
 */
var clipDefs = React.createClass({

    renderClipPath: function(props) {
        d3.select(this.getDOMNode()).selectAll("*").remove();

        d3.select(this.getDOMNode())
            .append("clipPath")
            .attr("id", props.id)
            .append("rect")
            .attr("width", props.clipWidth)
            .attr("height", props.clipHeight);
    },

    componentWillReceiveProps: function(nextProps) {
        this.renderClipPath(nextProps);
    },

    componentDidMount: function() {
        this.renderClipPath(this.props);
    },

    // For now we'll always update to ensure clipping id and rectangle track props
    // Could probably optimize this to detect changes to width/height to avoid d3 touching
    // the real DOM on every re-render.  
    shouldComponentUpdate: function() {
        return true;
    },

    render: function() {
        return (
            <defs></defs>
        );
    }
});



/**
 * A ChartRow has a set of Y axes and multiple charts which are overlayed on each other
 * in a central canvas.
 */
var ChartRow = React.createClass({

    displayName: "ChartRow",

    getInitialState: function() {
        // id of clipping rectangle we will generate and use for each child chart
        // Lives in state to ensure just one clipping rectangle and id per chart row instance; we don't
        // want a fresh id generated on each render.
        var clipId = _.uniqueId("clip_");
        var clipPathURL = "url(#" + clipId + ")";

        return {clipId: clipId, clipPathURL: clipPathURL};
    },

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

    handleZoom: function(beginTime, endTime) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(beginTime, endTime);
        }
    },

    handleResize: function(width, height) {
        if (this.props.onChartResize) {
            this.props.onChartResize(width, height);
        }
    },

    render: function() {
        var self = this;

        var slotWidth = this.props.slotWidth;
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

        var yAxisMap = {};          // Maps axis id -> axis element
        var yAxisScaleMap = {};     // Maps axis id -> axis scale
        var leftAxisList = [];      // Ordered list of left axes ids
        var rightAxisList = [];     // Ordered list of right axes ids

        var MARGIN = this.props.margin || 5;
        var innerHeight = Number(this.props.height) - MARGIN*2;

        //
        // Build a map of elements that occupy left or right slots next to the chart.
        //
        // If an element has both and id and a min/max range, then we consider it to be a y axis.
        // For those we calculate a d3 scale that can be reference by a chart. That scale will
        // also be available to the axis when it renders.
        //

        React.Children.forEach(this.props.children, function(child) {
            var props = child.props;
            if (_.has(props, "align") && (props.align === "left" || props.align === "right")) {
                var yaxis = child;
                
                //Relate id to the axis itself
                yAxisMap[yaxis.props.id] = yaxis;

                //If we know it's a YAxis we go ahead and calculate the scale
                if (yaxis instanceof YAxis ||
                    _.has(props, "id") && _.has(props, "min") && _.has(props, "max")) {

                    //Relate id to a d3 scale generated from the max, min and scaleType props
                    var type = props.type || "linear";
                    if (type === "linear") {
                        yAxisScaleMap[yaxis.props.id] = d3.scale.linear()
                            .domain([yaxis.props.min, yaxis.props.max])
                            .range([innerHeight, 0])
                            .nice();
                    } else if (type === "log") {
                        var base = yaxis.props.logBase || 10;
                        yAxisScaleMap[yaxis.props.id] = d3.scale.log()
                            .base(base)
                            .domain([yaxis.props.min, yaxis.props.max])
                            .range([innerHeight, 0]);
                    
                    } else if (type === "power") {
                        var power = yaxis.props.powerExponent || 2;
                        yAxisScaleMap[yaxis.props.id] = d3.scale.pow()
                            .exponent(power)
                            .domain([yaxis.props.min, yaxis.props.max])
                            .range([innerHeight, 0]);
                    }
                }

                //Slot counts
                if (yaxis.props.align === "left") {
                    usedLeftAxisSlots++;
                    leftAxisList.push(yaxis.props.id);
                } else if (yaxis.props.align === "right") {
                    usedRightAxisSlots++;
                    rightAxisList.push(yaxis.props.id);
                }
            }
        });

        //
        // Push each axis onto the yAxisList, transforming each into its slot
        //

        var x, y;
        var transform;
        var id;
        var props;
        var axis;

        var i = 0;
        for (var leftIndex=Number(this.props.leftAxisSlots)-usedLeftAxisSlots;
             leftIndex < this.props.leftAxisSlots;
             leftIndex++) {

            id = leftAxisList[i];

            //Transform of the axis
            x = leftIndex*slotWidth;
            y = MARGIN;
            transform = "translate(" + x + "," + y + ")";

            props = {"width": slotWidth-MARGIN,
                     "height": innerHeight};
            if (_.has(yAxisScaleMap, id)) {
                props.scale = yAxisScaleMap[id];
            }

            //Cloned axis
            axis = React.addons.cloneWithProps(yAxisMap[id], props);

            yAxisList.push(
                <g transform={transform}>
                    {axis}
                </g>
            );
            i++;
        }

        var j = 0;
        for (var rightIndex=Number(this.props.rightAxisSlots)-usedRightAxisSlots;
             rightIndex < this.props.rightAxisSlots;
             rightIndex++) {

            id = rightAxisList[j];

            //Transform of the axis
            x = this.props.width - (rightIndex+1)*slotWidth;
            y = MARGIN;
            transform = "translate(" + x + "," + y + ")";

            //Props to mix into the axis
            props = {"width": slotWidth-MARGIN,
                     "height": innerHeight};
            if (_.has(yAxisScaleMap, id)) {
                props.scale = yAxisScaleMap[id];
            }

            //Cloned axis
            axis = React.addons.cloneWithProps(yAxisMap[id], props);

            yAxisList.push(
                <g transform={transform}>
                    {axis}
                </g>
            );
            j++;
        }

        //
        // Push each chart onto the chartList, transforming each to the right of the left axis slots
        // and specifying its width.
        //

        var chartWidth = this.props.width - this.props.leftAxisSlots*slotWidth - this.props.rightAxisSlots*slotWidth - 5;
        var chartTransform = "translate(" + this.props.leftAxisSlots*slotWidth + "," + MARGIN + ")";


        var keyCount = 0;
        React.Children.forEach(this.props.children, function(child) {

            //
            // TODO: Do we want to whitelist charts that can be added here
            //      or just depend on align="center" or something?
            //
            
            if (child instanceof AreaChart ||
                child instanceof LineChart ||
                child instanceof EventChart) {
                var props = {
                    key: "chart-" + keyCount,
                    width: chartWidth,
                    height: innerHeight,
                    clipPathURL: self.state.clipPathURL,
                    timeScale: self.props.timeScale,
                    yScale: yAxisScaleMap[child.props.axis]
                };
                chartList.push(React.addons.cloneWithProps(child, props));
            }
            keyCount++;
        });
       
        return (
            <svg width={this.props.width} height={Number(this.props.height)}>
                {yAxisList}

                <g transform={chartTransform} key="chart-group">
                    <clipDefs id={this.state.clipId} clipWidth={chartWidth} clipHeight={innerHeight} />
                    {chartList}
                </g>

                <g transform={chartTransform} key="tracker-group">
                    <Tracker height={innerHeight}
                             scale={self.props.timeScale} position={self.props.trackerPosition} />
                </g>

                <g transform={chartTransform} key="event-rect-group">
                    <EventRect width={chartWidth} height={innerHeight}
                               scale={self.props.timeScale}
                               onMouseOut={self.handleMouseOut}
                               onMouseMove={self.handleMouseMove}
                               onZoom={self.handleZoom}
                               onResize={self.handleResize}/>
                </g>

                {xAxis}

            </svg>
        );
    }
});

module.exports = ChartRow;