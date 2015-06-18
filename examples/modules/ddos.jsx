import React from "react/addons";
import _ from "underscore";
import moment from "moment";

import {TimeSeries} from "pond";

//Imports from the charts library
import ChartContainer from "../../lib/components/chartcontainer";
import ChartRow from "../../lib/components/chartrow";
import Charts from "../../lib/components/charts";
import YAxis from "../../lib/components/yaxis";
import LineChart from "../../lib/components/linechart";
import Resizable from "../../lib/components/resizable";
import Legend from "../../lib/components/legend";

//Data
var ddosData = require("../data/ddos.json");

var requests = [];
var connections = [];

_.each(ddosData, function(val) {
    var timestamp = new moment("2015-04-03 " + val["time PST"]);
    var numConnection = val["connections"];
    var httpRequests = val["http requests"];
    requests.push([timestamp.toDate().getTime(), httpRequests]);
    connections.push([timestamp.toDate().getTime(), numConnection]);
})

var connectionsSeries = new TimeSeries({
    name: "connections",
    columns: ["time", "value"],
    points: connections
});

var requestsSeries = new TimeSeries({
    name: "requests",
    columns: ["time", "value"],
    points: requests
});


var scheme = {
    connections: "#2ca02c",
    requests: "#9467bd",
}

var connectionsStyle = {
    "color": scheme.connections,
    "width": 2
}

var requestsStyle = {
    "color": scheme.requests,
    "width": 2
}

export default React.createClass({

    renderChart: function() {
        return (
            <ChartContainer timeRange={requestsSeries.range()} padding="5">
                <ChartRow height="300" debug={false}>
                    <YAxis id="axis1" label="Requests" style={{labelColor: scheme.requests}}
                           labelOffset={-10}  min={0} max={1000} format=",.0f" width="60" type="linear" />
                    <Charts>
                        <LineChart axis="axis2" series={connectionsSeries} style={connectionsStyle}/>
                        <LineChart axis="axis1" series={requestsSeries} style={requestsStyle}/>
                    </Charts>
                    <YAxis id="axis2" label="Connections" style={{labelColor: scheme.connections}}
                           labelOffset={12} min={0} format=",.0f" max={10000} width="80" type="linear"/>
                </ChartRow>
            </ChartContainer>
        );
    },

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>April 2015 DDoS Attack</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Legend categories={{"Requests": "requests", "Connections": "connections"}} style="line"/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            {this.renderChart()}
                        </Resizable>
                    </div>
                </div>

            </div>
        );
    }
});
