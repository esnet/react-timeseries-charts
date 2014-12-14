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
var Baseline = Charts.Baseline;
var Resizable = Charts.Resizable;

//Weather data from Bay Area storm Dec 11th, 2014
var weatherJSON = require("../data/weather.json");

var temperature = [];
var pressure = [];
var wind = [];
var gust = [];

_.each(weatherJSON, function(readings) {
	console.log(readings);
	var d = readings.TimePST;

	var tempReading = readings.TemperatureF;
	var pressureReading = readings["Sea Level PressureIn"];
	var windReading = readings["Wind SpeedMPH"] === "Calm" ? 0 : readings["Wind SpeedMPH"];

	var time = new Moment(d);

	temperature.push({"time": time.toDate(), "value": tempReading});
	pressure.push({"time": time.toDate(), "value": pressureReading});
	wind.push({"time": time.toDate(), "value": windReading});
})

console.log(wind);

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
		                        <ChartRow height="200" debug={false}>
		                            <AxisGroup align="left">
		                                <YAxis id="temp" label="Temerature (°F)" classed="temp" labelOffset={5} min={50} max={70} width="60" type="linear" format=",.1f"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                                <LineChart axis="temp" data={temperature} classed="temp"/>
		                                <LineChart axis="pressure" data={pressure} classed="pressure"/>
		                            </ChartGroup>
		                            <AxisGroup align="right">
		                                <YAxis id="pressure" label="Pressure (in)" labelOffset={-5} classed="pressure" min={29.4} max={29.8} width="60" type="linear" format=",.1f"/>
		                            </AxisGroup>		                        
		                        </ChartRow>
		                        <ChartRow height="100" debug={false}>
		                            <AxisGroup align="left">
		                                <YAxis id="wind" label="Wind (mph)" labelOffset={5} min={0} max={40} width="60" type="linear" format=",.1f"/>
		                            </AxisGroup>
		                            <ChartGroup>
		                                <LineChart axis="wind" data={wind} classed="wind"/>
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

/*


*/

module.exports = Weather;