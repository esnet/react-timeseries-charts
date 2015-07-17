import React from "react/addons";
import _ from "underscore";
import Moment from "moment";
import {TimeSeries} from "pond";

//Imports from the charts library
import ChartContainer from "../../lib/components/chartcontainer";
import ChartRow from "../../lib/components/chartrow";
import Charts from "../../lib/components/charts";
import YAxis from "../../lib/components/yaxis";
import AreaChart from "../../lib/components/areachart";
import LineChart from "../../lib/components/linechart";
import ScatterChart from "../../lib/components/scatterchart";
import Baseline from "../../lib/components/baseline";
import Resizable from "../../lib/components/resizable";
import Legend from "../../lib/components/legend";

//Weather data from Bay Area storm Dec 11th, 2014
import weatherJSON from "../data/weather.json";

import Markdown from "react-markdown-el";
const exampleText = `

This example uses three rows to create stacked chart:

    <ChartContainer timeRange={tempSeries.range()} padding="10">
        
        <ChartRow height="150">
            <YAxis id="temp" label="Temperature (°F)" labelOffset={-5} style={{labelColor: scheme.temp}}
                   min={50} max={70} width="60" type="linear" format=",.1f"/>

            <Charts>
                <LineChart axis="temp" series={tempSeries} style={{color: scheme.temp, width: 2}}/>
                <LineChart axis="pressure" series={pressureSeries} style={{color: scheme.pressure, width: 2}}/>
            </Charts>
            <YAxis id="pressure" label="Pressure (in)" labelOffset={5} style={{labelColor: scheme.pressure}}
                   min={29.5} max={30.0} width="100" type="linear" format=",.1f"/>
        </ChartRow>

        <ChartRow height="150">
            <YAxis id="wind-gust" label="Wind gust (mph)" labelOffset={-5} style={{labelColor: scheme.gust}}
                   min={0} max={50} width="100" type="linear" format=",.1f"/>

            <Charts>
            	<LineChart axis="wind" series={windSeries} style={{color: scheme.wind, width: 2}}/>
                <ScatterChart axis="wind-gust" series={gustSeries} style={{color: scheme.gust, opacity: 0.5}} />
            </Charts>

            <YAxis id="wind" label="Wind (mph)" labelOffset={5} style={{labelColor: scheme.wind}}
                   min={0} max={50} width="60" type="linear" format=",.1f"/>
        </ChartRow>
        
        <ChartRow height="150">
            <YAxis id="rain" label="Precipitation (in)" labelOffset={-5} style={{labelColor: scheme.rain}}
                   min={0} max={rainSeries.max()} width="60" type="linear" format=",.2f"/>
            <Charts>
            	<AreaChart axis="rain" series={[[rainSeries],[]]} style={{up: [scheme.rain]}} interpolate="basis"/>
            	<LineChart axis="total-rain" series={rainAccumSeries} style={{color: scheme.rainAccum, width: 1}} />
            </Charts>
            <YAxis id="total-rain" label="Total Precipitation (in)" labelOffset={5} min={0} max={rainAccumSeries.max()} width="60" type="linear" format=",.2f"/>
        </ChartRow>

    </ChartContainer>
`;

//
// Read in the weather data
//

let temperaturePoints = [];
let pressurePoints = [];
let windPoints = [];
let gustPoints = [];
let rainPoints = [];
let rainAccumPoints = [];
_.each(weatherJSON, readings => {
	let time = new Moment(readings.Time).toDate().getTime();
	let tempReading = readings.TemperatureF;
	let pressureReading = readings["PressureIn"];
	let windReading = readings["WindSpeedMPH"] === "Calm" ? 0 : readings["WindSpeedMPH"];
	let gustReading = readings["WindSpeedGustMPH"];
	let rainReading = readings["HourlyPrecipIn"] === "N/A" ? 0 : readings["HourlyPrecipIn"];
	let rainAccumReading = readings["dailyrainin"];

	temperaturePoints.push([time, tempReading]);
	pressurePoints.push([time, pressureReading]);

	//Somewhat fake the wind speed...
	windPoints.push([time, windReading*5]);
	if (gustReading !== "-" && gustReading !== 0) {
		gustPoints.push([time, gustReading*5+Math.random()*2.5-2.5, gustReading/3]);
	}
	rainPoints.push([time, rainReading]);
	rainAccumPoints.push([time, rainAccumReading]);
})

//
// Timeseries
//

var tempSeries = new TimeSeries({name: "Temperature", columns: ["time", "value"], points: temperaturePoints});
var pressureSeries = new TimeSeries({name: "Pressure", columns: ["time", "value"], points: pressurePoints});
var windSeries = new TimeSeries({name: "Wind", columns: ["time", "value"], points: windPoints});
var gustSeries = new TimeSeries({name: "Gust", columns: ["time", "value", "radius"], points: gustPoints});
var rainSeries = new TimeSeries({name: "Rain", columns: ["time", "value"], points: rainPoints});
var rainAccumSeries = new TimeSeries({name: "Rain Accum", columns: ["time", "value"], points: rainAccumPoints});

//
// Color scheme
//

var scheme = {
	temp: "#CA4040",
	pressure: "#9467bd",
	wind: "#987951",
	gust: "#CC862A",
	rain: "#849AB1",
	rainAccum: "#000"
}

//
// Render weather charts
//

export default React.createClass({

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
		                    <ChartContainer timeRange={tempSeries.range()} padding="10">
		                        
		                        <ChartRow height="150" debug={false}>
		                            <YAxis id="temp" label="Temperature (°F)" labelOffset={-5} style={{labelColor: scheme.temp}}
		                                   min={50} max={70} width="60" type="linear" format=",.1f"/>

		                            <Charts>
		                                <LineChart axis="temp" series={tempSeries} style={{color: scheme.temp, width: 2}}/>
		                                <LineChart axis="pressure" series={pressureSeries} style={{color: scheme.pressure, width: 2}}/>
		                            </Charts>
		                            <YAxis id="pressure" label="Pressure (in)" labelOffset={5} style={{labelColor: scheme.pressure}}
		                                   min={29.5} max={30.0} width="100" type="linear" format=",.1f"/>
		                        </ChartRow>

		                        
		                        <ChartRow height="150" debug={false}>
		                            <YAxis id="wind-gust" label="Wind gust (mph)" labelOffset={-5} style={{labelColor: scheme.gust}}
		                                   min={0} max={50} width="100" type="linear" format=",.1f"/>

		                            <Charts>
		                            	<LineChart axis="wind" series={windSeries} style={{color: scheme.wind, width: 2}}/>
		                                <ScatterChart axis="wind-gust" series={gustSeries} style={{color: scheme.gust, opacity: 0.5}} />
		                            </Charts>

		                            <YAxis id="wind" label="Wind (mph)" labelOffset={5} style={{labelColor: scheme.wind}}
		                                   min={0} max={50} width="60" type="linear" format=",.1f"/>
		                        </ChartRow>
		                        
		                        <ChartRow height="150" debug={false}>
		                            <YAxis id="rain" label="Precipitation (in)" classed="rain" labelOffset={-5} style={{labelColor: scheme.rain}}
		                                   min={0} max={rainSeries.max()} width="60" type="linear" format=",.2f"/>
		                            <Charts>
		                            	<AreaChart axis="rain" series={[[rainSeries],[]]} style={{up: [scheme.rain]}} interpolate="basis"/>
		                            	<LineChart axis="total-rain" series={rainAccumSeries}  style={{color: scheme.rainAccum, width: 1}} />
		                            </Charts>
		                            <YAxis id="total-rain" label="Total Precipitation (in)" labelOffset={5} min={0} max={rainAccumSeries.max()} width="60" type="linear" format=",.2f"/>
		                        </ChartRow>

		                    </ChartContainer>
		                </Resizable>
		            </div>
		        </div>

	            <hr/>

	            <div className="row">
	                <div className="col-md-12">
	                    <Markdown text={exampleText} />
	                </div>
	            </div>
		    </div>
	    );
  	}
});
