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
import APIDocs from "./docs";
import Highlighter from "./highlighter";

// Pond
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";

// Imports from the charts library
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import LabelAxis from "../../src/labelaxis";
import EventChart from "../../src/eventchart";
import Resizable from "../../src/resizable";

const outageEvents = [
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
    }, {
        startTime: "2015-04-01T03:30:00Z",
        endTime: "2015-04-02T16:50:00Z",
        title: "STAR-CR5 < 100 ge 06519 > ANL  - Outage",
        description: "The listed circuit was unavailable due to bent pins.",
        completed: true,
        external_ticket: "3576:144",
        esnet_ticket: "ESNET-20150421-013",
        organization: "Internet2 / Level 3",
        type: "Unplanned"
    }, {
        startTime: "2015-03-08T09:00:00Z",
        endTime: "2015-03-22T14:00:00Z",
        title: "ANL Scheduled Maintenance",
        description: "ANL will be switching border routers...",
        completed: true,
        external_ticket: "",
        esnet_ticket: "ESNET-20150302-002",
        organization: "ANL",
        type: "Planned"
    }
];

const events = outageEvents.map(({startTime, endTime, ...data}) =>
    new TimeRangeEvent(new TimeRange(new Date(startTime),new Date(endTime)), data)
);

const series = new TimeSeries({name: "outages", events});

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
    }
}

function outageLabelFunc(event) {
    return event.get("title");
}

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            tracker: null,
            timerange: series.timerange()
        };
    },

    handleTrackerChanged(tracker) {
        this.setState({tracker});
    },

    handleTimeRangeChange(timerange) {
        this.setState({timerange});
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>EventChart</h3>
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={this.state.timerange}
                                enablePanZoom={true}
                                onTimeRangeChanged={this.handleTimeRangeChange}>
                                <ChartRow height="35">
                                    <LabelAxis
                                        hideScale={true}
                                        id="outages"
                                        label="Outages"
                                        min={0} max={0}
                                        width={140}
                                        type="linear" format=",.1f"/>
                                    <Charts>
                                        <EventChart
                                            series={series}
                                            size={45}
                                            style={outageEventStyleFunc}
                                            label={outageLabelFunc} />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <APIDocs file="src/eventchart.jsx"/>
                    </div>
                </div>
            </div>
        );
    }
});
