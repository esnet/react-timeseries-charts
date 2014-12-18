/** @jsx React.DOM */

var React = require('react');
var _     = require('underscore');

var Charts = require("../../esnet-react-charts");

var Legend = Charts.Legend;
var ChartContainer = Charts.ChartContainer;
var ChartRow = Charts.ChartRow;
var ChartGroup = Charts.ChartGroup;
var AxisGroup = Charts.AxisGroup;
var YAxis = Charts.YAxis;
var AreaChart = Charts.AreaChart;
var LineChart = Charts.LineChart;
var Baseline = Charts.Baseline;
var Resizable = Charts.Resizable;

//Data
var aud = require("../data/usd_vs_aud.json");
var euro = require("../data/usd_vs_euro.json");

var audCurrency = [];
_.each(aud.widget[0].data, function(val) {
	audCurrency.push({"time": new Date(val[0]), "value": val[1]});
})

var euroCurrency = [];
_.each(euro.widget[0].data, function(val) {
	euroCurrency.push({"time": new Date(val[0]), "value": val[1]});
})

var endTime = audCurrency[0].time;
var beginTime = audCurrency[audCurrency.length-1].time;

var LineCharts = React.createClass({

  	render: function() {
	    return (
	        
	    	<div>

		        <div className="row">
		            <div className="col-md-12">
		                <h3>Line chart examples</h3>
		            </div>
		        </div>

		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
		                    <ChartContainer beginTime={beginTime} endTime={endTime} padding="5">
		                        <ChartRow height="200" debug={false}>
		                            <AxisGroup align="left">
		                                <YAxis id="axis1" label="AUD" min={0} max={2} width="60" type="linear" format="$,.2f"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                                <LineChart axis="axis1" data={audCurrency} classed="aud"/>
		                                <LineChart axis="axis2" data={euroCurrency} classed="euro"/>
		                                <Baseline  axis="axis1" value={1.0} label="USD Baseline" position="right"/>
		                            </ChartGroup>
		                            <AxisGroup align="right">
		                                <YAxis id="axis2" label="Euro" min={0.65} max={0.85} width="80" type="linear" format="$,.2f"/>
		                            </AxisGroup>
		                        </ChartRow>
		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>

		    </div>
	    );
  	}
});

module.exports = LineCharts;