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

var React = require("react/addons");
var d3 = require("d3");
var _ = require("underscore");

//var AreaChart  = require("./areachart");
//var LineChart  = require("./linechart");
//var Baseline   = require("./baseline");
//var EventChart = require("./eventchart");

var YAxis      = require("./yaxis");
var AxisGroup  = require("./axisgroup");
var ChartGroup = require("./chartgroup");
var Brush      = require("./brush");
var Tracker    = require("./tracker");
var EventRect  = require("./eventrect");
var PointIndicator = require("./pointindicator");

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

        var margin = (this.props.margin !== undefined) ? Number(this.props.margin) : 5;
        var padding = (this.props.padding !== undefined) ? Number(this.props.padding) : 2;

        var axisTopMargin = 5;
        var innerHeight = Number(this.props.height) - axisTopMargin * 2;

        console.log("innerHeight", innerHeight, axisTopMargin, padding);

        // We'll also add our own padding so that marks at the min or max of the 
        // domain are visible:
        
        var rangeTop = axisTopMargin;
        var rangeBottom = innerHeight - axisTopMargin;
        

        //
        // Build a map of elements that occupy left or right slots next to the chart.
        //
        // If an element has both and id and a min/max range, then we consider it to be a y axis.
        // For those we calculate a d3 scale that can be reference by a chart. That scale will
        // also be available to the axis when it renders.
        //
        // For this row, we will need to know how many axis slots we are using and the
        // scales associated with them. We store the scales in a map from attr name to
        // the d3 scale.
        //

        var yAxisMap = {};          // Maps axis id -> axis element
        var yAxisScaleMap = {};     // Maps axis id -> axis scale

        var usedLeftAxisColumns = 0;
        var usedRightAxisColumns = 0;
        var leftAxisList = [];      // Ordered list of left axes ids
        var rightAxisList = [];     // Ordered list of right axes ids


        console.log("ROW", this.props);
        React.Children.forEach(this.props.children, function(childGroup) {
            //Each axis group
            if (childGroup instanceof AxisGroup) {
                var axisGroup = childGroup;
                var align = axisGroup.props.align;
                var props = axisGroup.props;

                React.Children.forEach(axisGroup.props.children, function(yaxis) {

                    console.log("   AXIS", yaxis);

                    //Relate id to the axis itself
                    yAxisMap[yaxis.props.id] = yaxis;

                    //If its in an axis group, we assume it's a yaxis, however if it doesn't have
                    // a min/max or id we throw up a warning. Otherwise, we go ahead and calculate the scale
                    if (yaxis instanceof YAxis ||
                        _.has(props, "id") && _.has(props, "min") && _.has(props, "max")) {

                        //Relate id to a d3 scale generated from the max, min and scaleType props
                        var type = props.type || "linear";
                        if (yaxis.props.min === undefined || yaxis.props.min !== yaxis.props.min ||
                            yaxis.props.max === undefined || yaxis.props.max !== yaxis.props.max) {
                            yAxisScaleMap[yaxis.props.id] = null;
                        } else if (type === "linear") {
                            yAxisScaleMap[yaxis.props.id] = d3.scale.linear()
                                .domain([yaxis.props.min, yaxis.props.max])
                                .range([rangeBottom,rangeTop])
                                .nice();
                        } else if (type === "log") {
                            var base = yaxis.props.logBase || 10;
                            yAxisScaleMap[yaxis.props.id] = d3.scale.log()
                                .base(base)
                                .domain([yaxis.props.min, yaxis.props.max])
                                .range([rangeBottom,rangeTop]);
                        } else if (type === "power") {
                            var power = yaxis.props.powerExponent || 2;
                            yAxisScaleMap[yaxis.props.id] = d3.scale.pow()
                                .exponent(power)
                                .domain([yaxis.props.min, yaxis.props.max])
                                .range([rangeBottom,rangeTop]);
                        }
                    } else {
                        console.warn("Axis needs an id, a min, and a max prop");
                    }

                    //Columns counts
                    if (align === "left") {
                        usedLeftAxisColumns++;
                        leftAxisList.push(yaxis.props.id);
                    } else if (align === "right") {
                        usedRightAxisColumns++;
                        rightAxisList.push(yaxis.props.id);
                    }
                });
            }
        });

        console.log("LEFT:", usedLeftAxisColumns, leftAxisList);
        console.log("RIGHT:", usedLeftAxisColumns, rightAxisList);
        console.log("MAPS:", yAxisMap, yAxisScaleMap);

        //
        // Push each axis onto the yAxisList, transforming each into its column location
        //

        var x, y;
        var transform;
        var id;
        var props;
        var axis;

        var i = 0;
        var posx = 0;

        console.log("GEOMETRY CACLULATIONS:");

        //Extra space used by padding between columns
        var leftExtra = (this.props.leftAxisWidths.length - 1) * padding;
        var rightExtra = (this.props.rightAxisWidths.length - 1) * padding;
        
        //Space used by columns on left and right of charts
        var leftWidth = _.reduce(this.props.leftAxisWidths, function(a, b) { return a + b; }, 0) + leftExtra;
        var rightWidth = _.reduce(this.props.rightAxisWidths, function(a, b) { return a + b; }, 0) + rightExtra;

        var debug;

        posx = leftWidth;
        for (var leftColumnIndex = 0; leftColumnIndex < this.props.leftAxisWidths.length; leftColumnIndex++) {
            var colWidth = this.props.leftAxisWidths[leftColumnIndex];

            posx = posx - colWidth;
            if (leftColumnIndex > 0) {
                posx = posx - padding;
            }

            if (leftColumnIndex < leftAxisList.length) {
                id = leftAxisList[leftColumnIndex];
                transform = "translate(" + posx + "," + margin + ")";
                props = {"width": colWidth,
                         "height": innerHeight,
                         "align": "left"};
                if (_.has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                //Cloned axis, with new width, height and scale
                axis = React.addons.cloneWithProps(yAxisMap[id], props);

                debug = (
                    <rect className="y-axis-debug" x="0" y="0" width={colWidth} height={innerHeight} />
                );

                yAxisList.push(
                    <g key={"y-axis-left-" + leftColumnIndex} transform={transform}>
                        {debug}
                        {axis}
                    </g>
                );
            }
        }

        posx = this.props.width - rightWidth;
        for (var rightColumnIndex = 0; rightColumnIndex < this.props.rightAxisWidths.length; rightColumnIndex++) {
            var colWidth = this.props.rightAxisWidths[rightColumnIndex];

            if (rightColumnIndex < rightAxisList.length) {
                id = rightAxisList[rightColumnIndex];
                transform = "translate(" + posx + "," + margin + ")";
                props = {"width": colWidth,
                         "height": innerHeight,
                         "align": "right"};
                if (_.has(yAxisScaleMap, id)) {
                    props.scale = yAxisScaleMap[id];
                }

                //Cloned axis, with new width, height and scale
                axis = React.addons.cloneWithProps(yAxisMap[id], props);

                debug = (
                    <rect className="y-axis-debug" x="0" y="0" width={colWidth} height={innerHeight} />
                );

                yAxisList.push(
                    <g key={"y-axis-right-" + rightColumnIndex} transform={transform}>
                        {debug}
                        {axis}
                    </g>
                );
            }

            posx = posx + colWidth + padding;          
        }

        //
        // Push each chart onto the chartList, transforming each to the right of the left axis slots
        // and specifying its width.
        //

        var chartWidth = this.props.width - leftWidth - rightWidth;
        var chartTransform = "translate(" + leftWidth + "," + margin + ")";


        var keyCount = 0;
        React.Children.forEach(this.props.children, function(childGroup) {
            //Each axis group
            if (childGroup instanceof ChartGroup) {
                var chartGroup = childGroup;
                React.Children.forEach(childGroup.props.children, function(chart) {
                    var props = {
                        key: chart.props.key ? chart.props.key : "chart-" + keyCount,
                        width: chartWidth,
                        height: innerHeight,
                        clipPathURL: self.state.clipPathURL,
                        timeScale: self.props.timeScale,
                        yScale: yAxisScaleMap[chart.props.axis]
                    };
                    chartList.push(React.addons.cloneWithProps(chart, props));

                    keyCount++;
                });
            }
        });
       
        // Push each child Brush on to the brush list.  We need brushed to be rendered last (on top) of
        // everything else in the Z order, both for visual correctness and to ensure that the brush gets
        // mouse events before anything underneath
        var brushList=[];
        keyCount=0;
        React.Children.forEach(this.props.children, function(child) {
            if (child instanceof Brush) {
                var props = {
                    key: "brush-" + keyCount,
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: self.props.timeScale,
                    yScale: yAxisScaleMap[child.props.axis]
                };
                brushList.push(React.addons.cloneWithProps(child, props));
            }
            keyCount++;

        });

        var enableZoom = _.has(this.props,'enableZoom') ? this.props.enableZoom : false;

        var zoomHandler=null;
        if (enableZoom) {
            zoomHandler=self.handleZoom;
        }

        return (
            <svg width={this.props.width} height={Number(this.props.height)}>
                {yAxisList}

                <rect className="chart-debug" x={leftWidth} y={margin} width={chartWidth} height={innerHeight} />

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
                               enableZoom={enableZoom}
                               onZoom={zoomHandler}
                               minTime={self.props.minTime}
                               maxTime={self.props.maxTime}
                               onResize={self.handleResize}/>
                </g>

                <g transform={chartTransform} key="brush-group">
                    {brushList}
                </g>

            </svg>
        );
    }
});

module.exports = ChartRow;