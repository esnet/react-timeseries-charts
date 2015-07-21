import React from "react/addons";
import _ from "underscore";
import {TimeSeries} from "pond";

//Imports from the charts library
import SeriesTable from "../../lib/components/table";

import Markdown from "react-markdown-el";
const exampleText = `

Tables are generated from a TimeSeries. Optionally they can choose which columns to display. 
For each column they can also specify the format to use to display that column:

	const columns = [
		{key: "time", label: "Timestamp"}, 
		{key: "uptime", label: "Uptime"}
	]

    <Table series={events} columns={columns} />
`;

var availabilityData = {
    "name": "availability",
    "columns": ["time", "uptime", "notes", "outages"],
    "points": [
        ["2015-06", "100%", "", 0],
        ["2015-05", "92%", "", 26],
        ["2015-04", "87%", "Planned downtime in April", 82],
        ["2015-03", "99%", "", 4],
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

const columns = [
	{key: "time", label: "Timestamp"}, 
	{key: "uptime", label: "Availability"},
	{key: "outages", label: "Outages", format: "04d"}
];

export default React.createClass({

	setDefaultProps: function() {
		return {
			indexFormat: null,
		}
	},

  	render: function() {

  		var availability = new TimeSeries(availabilityData);

	    return (
	    	<div>

	          	<div className="row">
	              	<div className="col-md-12">
	                  	<h3>Timeseries Table</h3>
	              	</div>
	          	</div>

	          	<div className="row">
	          		<div className="col-md-6">
              	    	<SeriesTable series={availability} timeFormat="MMMM, YYYY" columns={columns} />
              	    </div>
	          	</div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Markdown text={exampleText} />
                    </div>
                </div>
		    </div>
	    );
  	}
});
