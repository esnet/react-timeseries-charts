import React from "react/addons";
import _ from "underscore";
import Moment from "moment"
import {TimeSeries, TimeRange, Index} from "pond";

//Imports from the charts library
import ChartContainer from "../../lib/components/chartcontainer";
import ChartRow from "../../lib/components/chartrow";
import Charts from "../../lib/components/charts";
import YAxis from "../../lib/components/yaxis";
import BarChart from "../../lib/components/barchart";
import LineChart from "../../lib/components/linechart";
import Baseline from "../../lib/components/baseline";
import Legend from "../../lib/components/legend";
import Resizable from "../../lib/components/resizable";

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
	name: "October In",
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

/*
var tourSeries = new TimeSeries({
    "name": "availability",
    "utc": false,
    "columns": ["time", "start", "finish"],
    "points": [
        ["2015", 198, 160],
        ["2014", 198, 164],
        ["2013", 198, 169],
        ["2012", 198, 153],
        ["2011", 198, 167],
        ["2010", 197, 170],
        ["2009", 180, 156],
        ["2008", 180, 145]
    ]
});
*/

export default React.createClass({

  	render: function() {
		const beginTime = Moment("2014-10-01");
		const endTime = Moment("2014-11-01") - 1;
		const timerange = new TimeRange([beginTime, endTime]);

		const style = {"in": {fill: "#619F3A"}, "out": {fill: "#E37E23"}};

		const leftStyle = {"in": {fill: "#619F3A"}};
		const rightStyle = {"out": {fill: "#E37E23"}};

		const tourStyleRight = {"start": {fill: "#DDD"}};
		const tourStyleLeft = {"finish": {fill: "#E37E23"}};

	    return (
	    	<div>
		        <div className="row">
		            <div className="col-md-12">
		                <h3>Daily traffic - October 2014</h3>
		                <b>Interface: ornl-cr5::to_ornl_ip-a</b>
		            </div>
		        </div>


		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
		                    <ChartContainer timeRange={octoberTrafficSeries.range()} padding="0" format="day">
		                        
		                        <ChartRow height="150">
		                            <YAxis id="traffic" label="Traffic In (B)" classed="traffic-in"
		                                   min={0} max={max} width="70" type="linear"/>
		                            <Charts>
		                                <BarChart axis="traffic" style={leftStyle} columns={["in"]} series={octoberTrafficSeries} />
		                                <Baseline axis="traffic" value={avgIn} label="Avg "position="right"/>
		                            </Charts>
	                                <YAxis id="traffic-rate" label="Avg Traffic Rate In (bps)" classed="traffic-in"
	                                	    min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
		                        </ChartRow>

		                        <ChartRow height="150">
	                                <YAxis id="traffic" label="Traffic Out (B)" classed="traffic-out"
	                                	   min={0} max={max} width="70" type="linear"/>
		                            <Charts>
		                                <BarChart axis="traffic" style={rightStyle} columns={["out"]} series={octoberTrafficSeries} />
		                                <Baseline axis="traffic" value={avgOut} label="Avg" position="right"/>
		                            </Charts>
		                            <YAxis id="traffic-rate" label="Avg Traffic Rate Out (bps)" classed="traffic-in"
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
		                                <BarChart axis="traffic-volume" style={leftStyle} spacing="10" offset="4" columns={["in"]} series={octoberTrafficSeries} />
		                                <BarChart axis="traffic-volume" style={rightStyle}  spacing="10" offset="-4" columns={["out"]} series={octoberTrafficSeries} />
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
		                                <BarChart axis="traffic-volume" style={style} spacing="3" series={octoberTrafficSeries} />
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
		                                <BarChart axis="traffic" style={leftStyle} series={monthlyAcceptedSeries} />
		                                <Baseline axis="traffic" value={monthlyAcceptedSeries.avg()} label="Avg "position="right"/>
		                            </Charts>
	                                <YAxis id="traffic-rate" label="Avg Traffic Rate In (bps)" classed="traffic-in"
	                                	    min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
		                        </ChartRow>

		                        <ChartRow height="150">
	                                <YAxis id="traffic" label="Traffic Out (B)" classed="traffic-out"
	                                	   min={0} max={1500000000000000} width="70" type="linear"/>
		                            <Charts>
		                                <BarChart axis="traffic" style={rightStyle} series={monthlyDeliveredSeries} />
		                                <Baseline axis="traffic" value={monthlyDeliveredSeries.avg()} label="Avg" position="right"/>
		                            </Charts>
		                            <YAxis id="traffic-rate" label="Avg Traffic Rate Out (bps)" classed="traffic-in"
		                                   min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
		                        </ChartRow>

		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>

		        {/*}
		        
		        <div className="row">
		            <div className="col-md-12">
		                <h3>Tour de France</h3>
		                <b>Number of finishers</b>
		            </div>
		        </div>

		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
		                    <ChartContainer timeRange={tourSeries.range()} padding="0" format="year">
		                        
		                        <ChartRow height="150">
		                            <YAxis id="avail" label="Finishers"
		                                   min={0} max={200} width="70" type="linear"/>
		                            <Charts>
		                                <BarChart axis="avail" style={tourStyleRight}  spacing="20" offset="0"  columns={["start"]} series={tourSeries} />
		                                <BarChart axis="avail" style={tourStyleLeft}  spacing="20" offset="0"  columns={["finish"]} series={tourSeries} />
		                            </Charts>
		                        </ChartRow>

		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>
		    */}
		    </div>
	    );
  	}
});
