/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import { format } from "d3-format";
import Markdown from "react-markdown";
import Highlighter from "./highlighter";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import TimeSeriesTable from "../../src/table";

const example1Text = `

Tables are generated from a TimeSeries.

In the above example, the points in the TimeSeries are indexed based on the month:

    const availabilityData = {
        "name": "availability",
        "columns": ["index", "uptime", "notes", "outages"],
        "points": [
            ["2015-06", 100, "", 0],
            ["2015-05", 92, "Router failure June 12", 26],
            ["2015-04", 87, "Planned downtime in April", 82],
            ["2015-03", 99, "Minor outage March 2", 4],
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

Optionally they can choose which columns to display. The above example defined the columns
to specify this.

Each column they can also specify the format (using a d3.format) to use to display that column.
`;

const example1bText = `

In addition to simple formats, you can also supply a cell rendering function, for example
to render a little bar visualization for values in a specific column. The cell rendering function
takes three args: the event that is being rendered in the row, the column name of the current
cell and the series itself. In this example the column name is used to apply the function to
just the 'uptime' column. The value is then extracted from the event for the current column,
though of course you could use other columns too, and then a simple bar is constructed using
a div with some styling:

    function renderPercentAsBar(event, column) {
        if (column === "uptime") {
            const v = value + "%";
            const value = parseFloat(event.data().get(column));
            const barStyle = {
                background: "steelblue",
                color: "white",
                paddingLeft: 2,
                width: v
            };
            return (
                <div width="100%" style={{background: "#E4E4E4"}}>
                    <div style={barStyle}>{v}</div>
                </div>
            );
        }
    }

    <TimeSeriesTable series={availability} timeFormat="MMMM, YYYY" columns={columns} />
`;


const example2Text = `

In this example a TimeSeries of measurement data is used. The difference here is that each event
in the TimeSeries is a timestamp rather than an Index:

    const measurementData = {
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

const percentFormat = format(".1%");
const paddedCounterFormat = format("04d");

const availabilityData = {
    name: "availability",
    columns: ["index", "uptime", "notes", "outages"],
    points: [
        ["2014-09", 100, "", 2],
        ["2014-08", 88, "", 17],
        ["2014-09", 95, "", 6],
        ["2014-10", 99, "", 3],
        ["2014-11", 91, "", 14],
        ["2014-12", 99, "", 3],
        ["2015-01", 100, "", 0],
        ["2015-02", 92, "",12],
        ["2015-03", 99, "Minor outage March 2", 4],
        ["2015-04", 87, "Planned downtime in April", 82],
        ["2015-05", 92, "Router failure June 12", 26],
        ["2015-06", 100, "", 0]
    ]
};

const measurementData = {
    name: "stats",
    columns: ["time", "value"],
    points: [
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
    {key: "time", label: "Month"},
    {key: "uptime", label: "Availability"},
    {key: "outages", label: "Outages", format: paddedCounterFormat}
];

const measurementColumns = [
    {key: "time", label: "Timestamp"},
    {key: "value", label: "Measurement", format: percentFormat}
];

function renderPercentAsColor(event, column) {
    if (column === "uptime") {
        const value = parseFloat(event.data().get(column));
        if (value < 90) {
            return (
                <b style={{color: "red"}}>{`${value}%`}</b>
            );
        } else if (value < 95) {
            return (
                <b style={{color: "orange"}}>{`${value}%`}</b>
            );
        } else {
            return (
                <span style={{color: "green"}}>{`${value}%`}</span>
            );
        }
    }
}

function renderPercentAsBar(event, column) {
    if (column === "uptime") {
        const value = parseFloat(event.data().get(column));
        const v = `${value}%`;
        const barStyle = {
            background: "steelblue",
            color: "white",
            paddingLeft: 2,
            width: v
        };
        return (
            <div width="100%" style={{background: "#E4E4E4"}}>
                <div style={barStyle}>{v}</div>
            </div>
        );
    }
}

export default React.createClass({

    mixins: [Highlighter],

    setDefaultProps() {
        return {
            indexFormat: null
        };
    },

    render() {
        const availability = new TimeSeries(availabilityData);
        const measurements = new TimeSeries(measurementData);

        const availabilityDataSummary = {
            time: "Past year",
            uptime: `${percentFormat(availability.avg("uptime") / 100)}`,
            outages: `${paddedCounterFormat(availability.sum("outages"))}`
        };

        const roundedCornerStyle = {
            borderRadius: 5,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#DDDDDD",
            overflow: "auto"
        };

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
                    <div className="col-md-8">
                        <div style={roundedCornerStyle}>
                            <TimeSeriesTable
                                series={availability}
                                timeFormat="MMMM, YYYY"
                                columns={columns}
                                summary={availabilityDataSummary} />
                        </div>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={example1Text}/>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-8">
                        <div style={roundedCornerStyle}>
                            <TimeSeriesTable
                                series={availability}
                                timeFormat="MMMM, YYYY"
                                columns={columns}
                                summary={availabilityDataSummary}
                                renderCell={renderPercentAsBar} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={example1bText}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={`Or in this example the colors of the availability
numbers are controlled based on the values:`} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div style={roundedCornerStyle}>
                            <TimeSeriesTable
                                series={availability}
                                timeFormat="MMMM, YYYY"
                                columns={columns}
                                summary={availabilityDataSummary}
                                renderCell={renderPercentAsColor} />
                        </div>
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
                        <div style={roundedCornerStyle}>
                            <TimeSeriesTable
                                series={measurements}
                                timeFormat="h:mm:ss a"
                                columns={measurementColumns} />
                        </div>
                    </div>
                </div>
                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={example2Text}/>
                    </div>
                </div>
            </div>
        );
    }
});
