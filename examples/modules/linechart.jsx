import React from "react/addons";
import _ from "underscore";
import {TimeSeries} from "pond";

//Imports from the charts library
import ChartContainer from "../../lib/components/chartcontainer";
import ChartRow from "../../lib/components/chartrow";
import Charts from "../../lib/components/charts";
import YAxis from "../../lib/components/yaxis";
import LineChart from "../../lib/components/linechart";
import Baseline from "../../lib/components/baseline";
import Legend from "../../lib/components/legend";
import Resizable from "../../lib/components/resizable";

import Markdown from "react-markdown-el";
const exampleText = `
	<ChartContainer timeRange={audSeries.range()} padding="5">
        <ChartRow height="200">
            <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
            <Charts>
                <LineChart axis="axis1" series={audSeries} style={audStyle}/>
                <LineChart axis="axis2" series={euroSeries} style={euroStyle}/>
                <Baseline  axis="axis1" value={1.0} label="USD Baseline" position="right"/>
            </Charts>
            <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
        </ChartRow>
    </ChartContainer>
`;

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

export default React.createClass({

    getInitialState: function() {
        return {
            tracker: null,
            timerange: audSeries.range()
        }
    },

    handleTrackerChanged: function(t) {
        this.setState({tracker: t});
    },

    handleTimeRangeChange: function(timerange) {
        this.setState({timerange: timerange})
    },

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
                        <Legend type="line" categories={[{"key": "aust", "label": "AUD", "style": {backgroundColor: "#2ca02c"}},
                                                         {"key": "euro", "label": "Euro", "style": {backgroundColor: "#a02c2c"}}]} />
                    </div>
                </div>
		        <div className="row">
		            <div className="col-md-12">
		                <Resizable>
            				<ChartContainer timeRange={this.state.timerange} padding="5"
                                            trackerPosition={this.state.tracker}
                                            onTrackerChanged={this.handleTrackerChanged}
                                            enablePanZoom={true}
                                            onTimeRangeChanged={this.handleTimeRangeChange}
                                            minDuration={1000*60*60*24*30} >
				                <ChartRow height="200" debug={false}>
				                    <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
				                    <Charts>
				                        <LineChart axis="axis1" series={audSeries} style={audStyle}/>
				                        <LineChart axis="axis2" series={euroSeries} style={euroStyle}/>
				                        <Baseline  axis="axis1" value={1.0} label="USD Baseline" position="right"/>
				                    </Charts>
				                    <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
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
