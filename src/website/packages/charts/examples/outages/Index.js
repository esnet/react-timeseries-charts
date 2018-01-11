/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react/";
import createReactClass from "create-react-class";

// Pond
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../../../../components/ChartContainer";
import ChartRow from "../../../../../components/ChartRow";
import Charts from "../../../../../components/Charts";
import EventChart from "../../../../../components/EventChart";
import Resizable from "../../../../../components/Resizable";

import outages_docs from "./outages_docs.md";
import outages_thumbnail from "./outages_thumbnail.png";

//
// Test data
//

const outageEvents = [
    {
        startTime: "2015-03-08T09:00:00Z",
        endTime: "2015-03-22T14:00:00Z",
        title: "ANL Scheduled Maintenance",
        description: "ANL will be switching border routers...",
        completed: true,
        external_ticket: "",
        esnet_ticket: "ESNET-20150302-002",
        organization: "ANL",
        type: "Planned"
    },
    {
        startTime: "2015-04-01T03:30:00Z",
        endTime: "2015-04-02T16:50:00Z",
        title: "STAR-CR5 < 100 ge 06519 > ANL  - Outage",
        description: "The listed circuit was unavailable due to bent pins.",
        completed: true,
        external_ticket: "3576:144",
        esnet_ticket: "ESNET-20150421-013",
        organization: "Internet2 / Level 3",
        type: "Unplanned"
    },
    {
        startTime: "2015-04-22T03:30:00Z",
        endTime: "2015-04-22T13:00:00Z",
        description: "At 13:33 pacific circuit 06519 went down.",
        title: "STAR-CR5 < 100 ge 06519 > ANL  - Outage",
        completed: true,
        external_ticket: "",
        esnet_ticket: "ESNET-20150421-013",
        organization: "Internet2 / Level 3",
        type: "Unplanned"
    }
];

//
// Turn data into TimeSeries
//

const events = outageEvents.map(
    ({ startTime, endTime, ...data }) =>
        new TimeRangeEvent(new TimeRange(new Date(startTime), new Date(endTime)), data)
);
const series = new TimeSeries({ name: "outages", events });

//
// Render event chart
//

function outageEventStyleFunc(event, state) {
    const color = event.get("type") === "Planned" ? "#998ec3" : "#f1a340";
    switch (state) {
        case "normal":
            return {
                fill: color
            };
        case "hover":
            return {
                fill: color,
                opacity: 0.4
            };
        case "selected":
            return {
                fill: color
            };
        default:
        //pass
    }
}

const outages = createReactClass({
    getInitialState() {
        return {
            tracker: null,
            timerange: series.timerange()
        };
    },
    handleTrackerChanged(tracker) {
        this.setState({ tracker });
    },
    handleTimeRangeChange(timerange) {
        this.setState({ timerange });
    },
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={this.state.timerange}
                                enablePanZoom={true}
                                onTimeRangeChanged={this.handleTimeRangeChange}
                            >
                                <ChartRow height="30">
                                    <Charts>
                                        <EventChart
                                            series={series}
                                            size={45}
                                            style={outageEventStyleFunc}
                                            label={e => e.get("title")}
                                        />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
});

// Export example
export default { outages, outages_docs, outages_thumbnail };
