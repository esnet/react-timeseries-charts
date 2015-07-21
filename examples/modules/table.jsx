import React from "react/addons";
import _ from "underscore";
import {TimeSeries} from "pond";

//Imports from the charts library
import TimeSeriesTable from "../../lib/components/table";

import Markdown from "react-markdown-el";
const example1Text = `

Tables are generated from a TimeSeries. Optionally they can choose which columns to display.
For each column they can also specify the format to use to display that column. In this example
the points in the TimeSeries are indexed based on the month:

    const availabilityData = {
        "name": "availability",
        "columns": ["time", "uptime", "notes", "outages"],
        "points": [
            ["2015-06", "100%", "", 0],
            ["2015-05", "92%", "Router failure June 12", 26],
            ["2015-04", "87%", "Planned downtime in April", 82],
            ["2015-03", "99%", "Minor outage March 2", 4],
            ...
        ]
    };

    const availability = new TimeSeries(availabilityData);

    const columns = [
        {key: "time", label: "Timestamp"},
        {key: "uptime", label: "Availability"},
        {key: "outages", label: "Outages", format: "04d"}
    ];

    <TimeSeriesTable series={availability} timeFormat="MMMM, YYYY" columns={columns} />
`;

const example2Text = `

In this example a TimeSeries of measurement data is used. The difference here is that each event 
in the TimeSeries is a timestamp rather than and Index:

    var measurementData = {
        "name": "stats",
        "columns": ["time", "value"],
        "points": [
            [1400425941000, 0.13],
            [1400425942000, 0.18],
            [1400425943000, 0.13],
            ...
        ]
    };

    const measurements = new TimeSeries(measurementData);
    
    const measurementColumns = [
        {key: "time", label: "Timestamp"},
        {key: "value", label: "Measurement", format: "%"},
    ];

    <TimeSeriesTable series={measurements} timeFormat="h:mm:ss a" columns={measurementColumns}/>
`;

var availabilityData = {
    "name": "availability",
    "columns": ["time", "uptime", "notes", "outages"],
    "points": [
        ["2015-06", "100%", "", 0],
        ["2015-05", "92%", "Router failure June 12", 26],
        ["2015-04", "87%", "Planned downtime in April", 82],
        ["2015-03", "99%", "Minor outage March 2", 4],
        ["2015-02", "92%", "",12],
        ["2015-01", "100%", "", 0],
        ["2014-12", "99%", "", 3],
        ["2014-11", "91%", "", 14],
        ["2014-10", "99%", "", 3],
        ["2014-09", "95%", "", 6],
        ["2014-08", "88%", "", 17],
        ["2014-09", "100%", "", 2]
    ]
};


var measurementData = {
    "name": "stats",
    "columns": ["time", "value"],
    "points": [
        [1400425941000, 0.13],
        [1400425942000, 0.18],
        [1400425943000, 0.13],
        [1400425944000, 0.14],
        [1400425945000, 0.13],
        [1400425946000, 0.16],
        [1400425947000, 0.14],
        [1400425948000, 0.21],
        [1400425948000, 0.13]
    ]
};

const columns = [
	{key: "time", label: "Timestamp"},
	{key: "uptime", label: "Availability"},
	{key: "outages", label: "Outages", format: "04d"}
];

const measurementColumns = [
    {key: "time", label: "Timestamp"},
    {key: "value", label: "Measurement", format: "%"},
];

export default React.createClass({

	setDefaultProps: function() {
		return {
			indexFormat: null,
		}
	},

  	render: function() {

  		const availability = new TimeSeries(availabilityData);
        const measurements = new TimeSeries(measurementData);

	    return (
	    	<div>

	          	<div className="row">
	              	<div className="col-md-12">
	                  	<h3>Timeseries Table</h3>

                        A TimeSeries Table lets you quickly generate a table of data from a TimeSeries.
	              	</div>
	          	</div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <h4>Example 1: Indexed events</h4>
                    </div>
                </div>

	          	<div className="row">
	          		<div className="col-md-6">
              	    	<TimeSeriesTable series={availability} timeFormat="MMMM, YYYY" columns={columns} />
              	    </div>
	          	</div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Markdown text={example1Text} />
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <h4>Example 2: Timestamped events</h4>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <TimeSeriesTable series={measurements} timeFormat="h:mm:ss a" columns={measurementColumns}/>
                    </div>
                </div>
                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Markdown text={example2Text} />
                    </div>
                </div>
		    </div>
	    );
  	}
});
