/** @jsx React.DOM */

var React  = require('react');
var _      = require('underscore');
var Moment = require('moment');

var Charts = require("../../esnet-react-charts");

var Legend = Charts.Legend;
var ChartContainer = Charts.ChartContainer;
var ChartRow = Charts.ChartRow;
var ChartGroup = Charts.ChartGroup;
var AxisGroup = Charts.AxisGroup;
var YAxis = Charts.YAxis;
var AreaChart = Charts.AreaChart;
var LineChart = Charts.LineChart;
var ScatterChart = Charts.ScatterChart;
var Baseline = Charts.Baseline;
var Resizable = Charts.Resizable;

//Weather data from Bay Area storm Dec 11th, 2014
var weatherJSON = require("../data/weather.json");

var temperature = [];
var pressure = [];
var wind = [];
var gust = [];
var rain = [];
var rainAccum = [];

_.each(weatherJSON, function(readings) {
	console.log(readings);

	var d = readings.Time;
	var time = new Moment(d);

	var tempReading = readings.TemperatureF;
	var pressureReading = readings["PressureIn"];
	var windReading = readings["WindSpeedMPH"] === "Calm" ? 0 : readings["WindSpeedMPH"];
	var gustReading = readings["WindSpeedGustMPH"];
	var rainReading = readings["HourlyPrecipIn"] === "N/A" ? 0 : readings["HourlyPrecipIn"];
	var rainAccumReading = readings["dailyrainin"];

	temperature.push({"time": time.toDate(), "value": tempReading});
	pressure.push({"time": time.toDate(), "value": pressureReading});
	wind.push({"time": time.toDate(), "value": windReading});
	rainAccum.push({"time": time.toDate(), "value": rainAccumReading});

	if (gustReading !== "-" && gustReading !== 0) {
		gust.push({"time": time.toDate(), "value": gustReading});
	}

	rain.push({"time": time.toDate(), "value": rainReading})
})

console.log(rainAccum);

var endTime = temperature[temperature.length-1].time;
var beginTime = temperature[0].time;

var Weather = React.createClass({

  	render: function() {
	    return (

	    	<div>

		        <div className="row">
		            <div className="col-md-12">
		                <h3>Weather example</h3>
		            </div>
		        </div>


		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
		                    <ChartContainer beginTime={beginTime} endTime={endTime} padding="0">
		                        
		                        <ChartRow height="150" debug={false}>
		                            <AxisGroup align="left">
		                                <YAxis id="temp" label="Temperature (°F)" classed="temp" labelOffset={5} min={50} max={70} width="60" type="linear" format=",.1f"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                                <LineChart axis="temp" data={temperature} classed="temp"/>
		                                <LineChart axis="pressure" data={pressure} classed="pressure"/>
		                            </ChartGroup>
		                            <AxisGroup align="right">
		                                <YAxis id="pressure" label="Pressure (in)" labelOffset={-5} classed="pressure" min={29.5} max={30.0} width="60" type="linear" format=",.1f"/>
		                            </AxisGroup>		                        
		                        </ChartRow>
		                        
		                        <ChartRow height="150" debug={false}>
		                            <AxisGroup align="left">
		                                <YAxis id="wind" label="Wind (mph)" classed="wind" labelOffset={5} min={0} max={10} width="60" type="linear" format=",.1f"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                            	<LineChart axis="wind" data={wind} classed="wind"/>
		                                <ScatterChart axis="wind-gust" data={gust} radius={2} classed="wind"/>
		                            </ChartGroup>
		                            <AxisGroup align="right">
		                                <YAxis id="wind-gust" label="Wind gust (mph)" classed="wind-gust" labelOffset={-5} min={0} max={10} width="60" type="linear" format=",.1f"/>
		                            </AxisGroup>	                        
		                        </ChartRow>
		                        
		                        <ChartRow height="150" debug={false}>
		                            <AxisGroup align="left">
		                                <YAxis id="rain" label="Precipitation (in)" classed="rain" labelOffset={5} min={0} max={1.5} width="60" type="linear" format=",.1f"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                            	<AreaChart axis="rain" data={[[rain],[]]} classed="rain"/>
		                            	<LineChart axis="total-rain" data={rainAccum} classed="rain"/>
		                            </ChartGroup>
		                            <AxisGroup align="right">
		                                <YAxis id="total-rain" label="Total Precipitation (in)" classed="rain" labelOffset={-5} min={0} max={5} width="60" type="linear" format=",.1f"/>
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

/*


*/

module.exports = Weather;