"use strict";

var React  = require('react');
var _      = require('underscore');
var Moment = require('moment');

var Charts = require("../../entry");

var ChartContainer = Charts.ChartContainer;
var ChartRow = Charts.ChartRow;
var ChartGroup = Charts.ChartGroup;
var AxisGroup = Charts.AxisGroup;
var YAxis = Charts.YAxis;
var Baseline = Charts.Baseline;

var BarChart = Charts.BarChart;
var LineChart = Charts.LineChart;

var Resizable = Charts.Resizable;

var beginTime = Moment("2014-10-01");
var endTime = Moment("2014-11-01") - 1;

//
// October 2014 daily traffic
//

var trafficInData = [];
var trafficOutData = [];
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
	var dayOfMonth = Number(day);
	var range = "day";
	var oct = 9; //months 0-11
	var date = Moment({year: 2014, month: oct, "day": dayOfMonth});

	max = Math.max(max, value.in);
	max = Math.max(max, value.out);

	//Skip the bad value in oct for a reasonable avg example
	if (dayOfMonth !== 10) {
		totalIn += value.in;
		totalOut += value.out;
		count++;
	}

	var volIn = value.in;
	var volOut = value.out;

	trafficInData.push({"time": date.toDate(), "range": "day", "value": volIn})
	trafficOutData.push({"time": date.toDate(), "range": "day", "value": value.out})
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
				var d = Moment(key.split(' ')[0], "YYYY-MM").toDate();
				if (key.split(' ')[1] === "Accepted") {
					routerData[routerName].accepted.push({"time": d, "value": traffic});
				} else if (key.split(' ')[1] === "Delivered") {
					routerData[routerName].delivered.push({"time": d, "value": traffic});
				}
			}
		});
	}
});

var monthlyBeginTime = Moment("2014-01-01");
var monthlyEndTime = Moment("2014-12-01") - 1;

var BarChartExample = React.createClass({

  	render: function() {

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
		                    <ChartContainer beginTime={beginTime} endTime={endTime} padding="0" dayFormat={true}>
		                        
		                        <ChartRow height="150">
		                            <AxisGroup align="left">
		                                <YAxis id="traffic" label="Traffic In (B)" classed="traffic-in"
		                                	   min={0} max={max} width="70" type="linear"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                                <BarChart axis="traffic" interval="daily" data={trafficInData} classed="traffic-in"/>
		                                <Baseline axis="traffic" classed="traffic-volume" value={avgIn} label="Avg "position="right"/>
		                            </ChartGroup>
		                            <AxisGroup align="right">
		                                <YAxis id="traffic-rate" label="Avg Traffic Rate In (bps)" classed="traffic-in"
		                                	    min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
		                            </AxisGroup>
		                        </ChartRow>

		                        <ChartRow height="150">
		                            <AxisGroup align="left">
		                                <YAxis id="traffic" label="Traffic Out (B)" classed="traffic-out"
		                                	   min={0} max={max} width="70" type="linear"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                                <BarChart axis="traffic" interval="daily" data={trafficOutData} classed="traffic-out"/>
		                                <Baseline axis="traffic" value={avgOut} label="Avg" position="right"/>
		                            </ChartGroup>
		                            <AxisGroup align="right">
		                                <YAxis id="traffic-rate" label="Avg Traffic Rate Out (bps)" classed="traffic-in"
		                                	    min={0} max={ max / (24 * 60 * 60) * 8}  width="70" type="linear"/>
		                            </AxisGroup>		                          
		                        </ChartRow>

		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>


		        <div className="row">
		            <div className="col-md-12">
		                <h3>Monthly traffic - 2014</h3>
		                <b>Router: bnl-mr2</b>
		            </div>
		        </div>


		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
		                    <ChartContainer beginTime={monthlyBeginTime} endTime={monthlyEndTime} padding="0" monthFormat={true}>
		                        
		                        <ChartRow height="150">
		                            <AxisGroup align="left">
		                                <YAxis id="traffic" label="Accepted" classed="traffic-accepted" labelOffset={5}
		                                	   min={0} max={1500000000000000} width="60" type="linear"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                                <BarChart axis="traffic" interval="monthly" data={routerData[routerKey].accepted} classed="traffic-in"/>
		                            </ChartGroup>
		                        </ChartRow>

		                        <ChartRow height="150">
		                            <AxisGroup align="left">
		                                <YAxis id="traffic" label="Delivered" classed="traffic-delivered" labelOffset={5}
		                                	   min={0} max={1500000000000000} width="60" type="linear"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                                <BarChart axis="traffic" interval="monthly" data={routerData[routerKey].delivered} classed="traffic-out"/>
		                            </ChartGroup>
		                        </ChartRow>

		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>


		        <div className="row">
		            <div className="col-md-12">
		                <h3>Monthly traffic - 2014</h3>
		                <b>Multiple bars</b>
		            </div>
		        </div>

		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
		                    <ChartContainer beginTime={beginTime} endTime={endTime} padding="0" dayFormat={true}>
		                        
		                        <ChartRow height="150">
		                            <AxisGroup align="left">
		                                <YAxis id="traffic-volume" label="Traffic In (bytes)" classed="traffic-in" labelOffset={5}
		                                	   min={0} max={max} width="60" type="linear"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                                <BarChart axis="traffic-volume" spacing="10" offset="4" interval="daily" data={trafficInData} classed="traffic-in"/>
		                                <BarChart axis="traffic-volume" spacing="10" offset="-4" interval="daily" data={trafficOutData} classed="traffic-out"/>
		                            </ChartGroup>
		                        </ChartRow>

		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>

		    </div>
	    );
  	}
});

module.exports = BarChartExample;