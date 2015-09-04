/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react/addons";
import _ from "underscore";
import Moment from "moment"
import Markdown from "react-markdown-el";

// Pond
import {TimeSeries, TimeRange, Index} from "@esnet/pond";

//Imports from the charts library
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import BarChart from "../../src/barchart";
import LineChart from "../../src/linechart";
import Baseline from "../../src/baseline";
import Legend from "../../src/legend";
import Resizable from "../../src/resizable";

// Docs
const exampleText = `

This simple example of a bar chart displays a pan and zoom chart that shows traffic levels
for each day of October 2014. The original data used here was captured to debug a messurement
error (seen clearly in Oct 10th).

To begin with we converted the original data into Pond's TimeSeries data structure as \`octoberTraffic\`:

	import {TimeSeries} from "@esnet/pond";

	const octoberTraffic = new TimeSeries({
		name: "Traffic",
		utc: false,
		columns: ["time", "in", "out"],
		points: trafficPoints
	});

Points are simply an array of tuples, each of which is \`[index, value1, value2, ...]\`. In this case this
looks like \`['2014-10-DD', volIn, volOut]\`. An index can be of several forms, but is a string that
represents a time range (e.g. 2014-10-08 represents the time range spanning October 8th 2014).

We also set utc to false here so that the index time ranges are defined in local time. Currently all
visualizations of time series data are in local time, while the default is for indexes to be in UTC.

Now we can render a the chart. The \`<BarChart>\` element does the rendering of the chart itself. As with
other chart types, the vertical scale is provided by referencing the \`<YAxis>\` (\`axis='traffic'\`). 

    <ChartContainer timeRange={this.state.timerange} padding="0" format="day"
    				enablePanZoom={true} onTimeRangeChanged={this.handleTimeRangeChange}
    				maxTime={new Date(1414827330868)}
    				minTime={new Date(1412143472795)}
    				minDuration={1000*60*60*24*5}>
        <ChartRow height="150">
            <YAxis id="traffic" label="Traffic In (B)" min={0} max={max} width="70" type="linear"/>
            <Charts>
                <BarChart axis="traffic" style={chartStyle} columns={["in"]}
                		  series={octoberTrafficSeries}
                		  selection={this.state.selection}
                		  onSelectionChange={this.handleSelectionChanged}/>
                <Baseline axis="traffic" value={avgIn} label="Avg "position="right"/>
            </Charts>
            <YAxis id="traffic-rate" label="Avg Traffic Rate In (bps)" classed="traffic-in"
            	    min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
        </ChartRow>
    </ChartContainer>

The style provides the coloring, relating each channel to styles for normal, highlight (hover) and
selected:

	const style = {
		"in": {
			normal: {fill: "#619F3A"},
			highlight: {fill: "rgb(113, 187, 67)"},
			selected: {fill: "#436D28"}
		}
	};

As a side note, this chart can also be zoomed in and then panned with constraints. This is controlled
using the \`<ChartContainer>\` props.

The final result is below, along with other examples:

`;

//
// October 2014 daily traffic
//

var trafficPoints = [];

var trafficRateInData = [];
var trafficRateOutData = [];

var interfacesJSON = require("../data/interface-traffic.json");
var interfaceKey = "ornl-cr5::to_ornl_ip-a::standard";
var days = interfacesJSON[interfaceKey].days;
var max = 0;

var count = 0;
var totalIn = 0;
var totalOut = 0;
var totalRateIn = 0;
var totalRateOut = 0;

_.each(days, function(value, day) {
	const dayOfMonth = Number(day);
	const volIn = value.in;
	const volOut = value.out;

	//Max
	max = Math.max(max, value.in);
	max = Math.max(max, value.out);

	//Skip the bad value in oct for a reasonable avg example
	if (dayOfMonth !== 10) {
		totalIn += value.in;
		totalOut += value.out;
		count++;
	}

	trafficPoints.push([`2014-10-${dayOfMonth}`, volIn, volOut]);
});

var octoberTrafficSeries = new TimeSeries({
	name: "October Traffic",
	utc: false,
	columns: ["time", "in", "out"],
	points: trafficPoints
});

max = max/100;

var avgIn = totalIn/count;
var avgOut = totalOut/count;

//
// ESnet wide monthy traffic summary (part of 2014)
//

var routerKey = "bnl-mr2";
var monthlyJSON = require("../data/total_traffic_6mo.json");
var routerData = {};
_.each(monthlyJSON, function(router) {
	var routerName = router["Router"];
	if (routerName) {
		routerData[routerName] = {"accepted": [], "delivered": []};
		_.each(router, function(traffic, key) {
			if (key !== "Router") {
				const month = key.split(' ')[0];
				const type = key.split(' ')[1];
				if (type === "Accepted") {
					routerData[routerName].accepted.push([month, traffic]);
				} else if (type === "Delivered") {
					routerData[routerName].delivered.push([month, traffic]);
				}
			}
		});
	}
});

var monthlyAcceptedSeries = new TimeSeries({
	name: "Monthly Accepted",
	columns: ["time", "value"],
	points: routerData[routerKey].accepted
});

var monthlyDeliveredSeries = new TimeSeries({
	name: "Monthly Delivered",
	columns: ["time", "value"],
	points: routerData[routerKey].delivered
});

export default React.createClass({

	getInitialState: function() {
		return {
			timerange: octoberTrafficSeries.range(),
			selection: "October Traffic-2014-10-10-in"
		}
	},

	handleTimeRangeChange: function(timerange) {
		this.setState({timerange: timerange})
	},

	handleSelectionChanged: function(key, value, context) {
		console.log(key)
		this.setState({
			selection: key,
			value: value,
			series: context.series,
			index: context.index,
			column: context.column,
		});
	},

  	render: function() {
		const beginTime = Moment("2014-10-01");
		const endTime = Moment("2014-11-01") - 1;
		const timerange = new TimeRange([beginTime, endTime]);

		const style = {
			"in": {
				normal: {fill: "#619F3A"},
				highlight: {fill: "rgb(113, 187, 67)"},
				selected: {fill: "#436D28"}
			},
			"out": {
				normal: {fill: "#E37E23"},
				highlight: {fill: "rgb(255, 141, 39)"},
				selected: {fill: "#A55D1C"}
			}
		}

		const leftStyle = {
			"in": {
				normal: {fill: "#619F3A"},
				highlight: {fill: "rgb(113, 187, 67)"},
				selected: {fill: "#436D28"}
			}
		};
		const rightStyle = {
			"out": {
				normal: {fill: "#E37E23"},
				highlight: {fill: "rgb(255, 141, 39)"},
				selected: {fill: "#B3621A"}
			}
		};

		const tourStyleRight = {
			"start": {
				normal: {fill: "#DDDDDD"},
				highlight: {fill: "DEDEDE"}
			}
		};

		const tourStyleLeft = {
			"start": {
				normal: {fill: "#E37E23"},
				highlight: {fill: "#C37E23"}
			}
		};

		const formatter = d3.format(".2s");

	    return (
	    	<div>

	            <div className="row">
	                <div className="col-md-12">
	                    <Markdown text={exampleText} />
	                </div>
	            </div>

		        <div className="row">
		            <div className="col-md-12">
		                <h3>Daily traffic - October 2014</h3>
		                <b>Interface: ornl-cr5::to_ornl_ip-a</b>
		                <p style={{color: "#808080"}}>
		                	Selected: {this.state.index ? this.state.index.toNiceString() : "--"} ({this.state.column ? this.state.column : "--"}) | {this.state.value ? `${formatter(this.state.value)}B` : "--"}
		                </p>
		            </div>
		        </div>

		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
		                    <ChartContainer timeRange={this.state.timerange} padding="0" format="day"
		                    				enablePanZoom={true} onTimeRangeChanged={this.handleTimeRangeChange}
		                    				maxTime={new Date(1414827330868)}
		                    				minTime={new Date(1412143472795)}
		                    				minDuration={1000*60*60*24*5}>
		                        
		                        <ChartRow height="150">
		                            <YAxis id="traffic" label="Traffic In (B)" classed="traffic-in"
		                                   min={0} max={max} width="70" type="linear"/>
		                            <Charts>
		                                <BarChart axis="traffic" style={leftStyle} columns={["in"]}
		                                		  series={octoberTrafficSeries}
		                                		  selection={this.state.selection}
		                                		  onSelectionChange={this.handleSelectionChanged}/>
		                                <Baseline axis="traffic" value={avgIn} label="Avg "position="right"/>
		                            </Charts>
	                                <YAxis id="traffic-rate" label="Avg Traffic Rate In (bps)" classed="traffic-in"
	                                	    min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
		                        </ChartRow>

		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>

                <div className="row">
                    <div className="col-md-12">
                    	<hr />
                    	Alternatively we can display bars side by side using the 'spacing' and 'offset' props:
                    	<hr />
                    </div>
                </div>


                <div className="row">
                	<div className="col-md-1">
                	</div>
                    <div className="col-md-11">
                        <Legend type="swatch" categories={[{"key": "in", "label": "Traffic In", "style": {backgroundColor: "#619F3A"}},
                                                           {"key": "out", "label": "Traffic Out", "style": {backgroundColor: "#E37E23"}}]} />
                    </div>
                </div>
		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
		                    <ChartContainer timeRange={octoberTrafficSeries.range()} padding="0" format="day">
		                        
		                        <ChartRow height="150">
		                            <YAxis id="traffic-volume" label="Traffic (B)" classed="traffic-in"
		                                   min={0} max={max} width="70" type="linear"/>
		                            <Charts>
		                                <BarChart axis="traffic-volume" style={leftStyle} size={10} offset={5.5} columns={["in"]} series={octoberTrafficSeries} />
		                                <BarChart axis="traffic-volume" style={rightStyle} size={10} offset={-5.5} columns={["out"]} series={octoberTrafficSeries} />
		                            </Charts>
	                                <YAxis id="traffic-rate" label="Avg Traffic Rate (bps)" classed="traffic-in"
	                                	    min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
		                        </ChartRow>

		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>

                <div className="row">
                    <div className="col-md-12">
                    	<hr />
                    	Or of course you can stack them:
                    	<hr />
                    </div>
                </div>


                <div className="row">
                	<div className="col-md-1">
                	</div>
                    <div className="col-md-11">
                        <Legend type="swatch" categories={[{"key": "in", "label": "Traffic In", "style": {backgroundColor: "#619F3A"}},
                                                           {"key": "out", "label": "Traffic Out", "style": {backgroundColor: "#E37E23"}}]} />
                    </div>
                </div>
		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
		                    <ChartContainer timeRange={octoberTrafficSeries.range()} padding="0" format="day">
		                        
		                        <ChartRow height="150">
		                            <YAxis id="traffic-volume" label="Traffic (B)" classed="traffic-in"
		                                   min={0} max={max} width="70" type="linear"/>
		                            <Charts>
		                                <BarChart axis="traffic-volume" style={style} spacing={3} series={octoberTrafficSeries} />
		                            </Charts>
	                                <YAxis id="traffic-rate" label="Avg Traffic Rate (bps)" classed="traffic-in"
	                                	    min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
		                        </ChartRow>

		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>

                <div className="row">
                    <div className="col-md-12">
                    	<hr />
                    	Another example, this time with monthly data:
                    	<hr />
                    </div>
                </div>

		        <div className="row">
		            <div className="col-md-12">
		                <h3>Monthly traffic - 6 months</h3>
		                <b>Router: bnl-mr2</b>
		            </div>
		        </div>

		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
		                    <ChartContainer timeRange={monthlyAcceptedSeries.range()} padding="0" format="month">
		                        
		                        <ChartRow height="150">
		                            <YAxis id="traffic" label="Traffic In (B)" classed="traffic-in"
		                                   min={0} max={1500000000000000} width="70" type="linear"/>
		                            <Charts>
		                                <BarChart axis="traffic" series={monthlyAcceptedSeries} />
		                                <Baseline axis="traffic" value={monthlyAcceptedSeries.avg()} label="Avg "position="right"/>
		                            </Charts>
	                                <YAxis id="traffic-rate" label="Avg Traffic Rate In (bps)" classed="traffic-in"
	                                	    min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
		                        </ChartRow>

		                        <ChartRow height="150">
	                                <YAxis id="traffic" label="Traffic Out (B)" classed="traffic-out"
	                                	   min={0} max={1500000000000000} width="70" type="linear"/>
		                            <Charts>
		                                <BarChart axis="traffic" series={monthlyDeliveredSeries} />
		                                <Baseline axis="traffic" value={monthlyDeliveredSeries.avg()} label="Avg" position="right"/>
		                            </Charts>
		                            <YAxis id="traffic-rate" label="Avg Traffic Rate Out (bps)" classed="traffic-in"
		                                   min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
		                        </ChartRow>

		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>
		    </div>
	    );
  	}
});
