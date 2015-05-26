"use strict";

var React = require("react");
var _     = require("underscore");

var ReactCharts = require("../../entry");
var Pond = require("pond");

var {TimeSeries} = Pond;
var {Legend,
	 ChartContainer,
	 ChartRow,
	 Charts,
	 YAxis,
	 LineChart,
	 Baseline,
	 Resizable} = ReactCharts;

//Data
var aud = require("../data/usd_vs_aud.json");
var euro = require("../data/usd_vs_euro.json");

var audSeries = new TimeSeries({
	name: "AUD",
	columns: ["time", "value"],
	points: aud.widget[0].data
});

var euroSeries = new TimeSeries({
	name: "EURO",
	columns: ["time", "value"],
	points: euro.widget[0].data
});

var beginTime = audSeries.begin();
var endTime = audSeries.end();

var audStyle = {
    "color": "#2ca02c"
}

var euroStyle = {
    "color": "#a02c2c"
}

var LineCharts = React.createClass({

  	render: function() {
	    return (
	    	<div>
		        <div className="row">
		            <div className="col-md-12">
		                <h3>Line chart example</h3>
		            </div>
		        </div>
		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
            				<ChartContainer timeRange={audSeries.range()} padding="5">
				                <ChartRow height="200" debug={false}>
				                    <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
				                    <Charts>
				                        <LineChart axis="axis1" series={audSeries} style={audStyle}/>
				                        <LineChart axis="axis2" series={euroSeries} classed="euro"/>
				                        <Baseline  axis="axis1" value={1.0} label="USD Baseline" position="right"/>
				                    </Charts>
				                    <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
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