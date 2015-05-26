"use strict";

var React = require("react");
var _ = require("underscore");

var Pond = require("pond");
var ReactCharts = require("../../entry");

var {TimeSeries} = Pond;
var {Legend,
     ChartContainer,
     ChartRow,
     Charts,
     YAxis,
     AreaChart,
     Baseline,
     Resizable} = ReactCharts;

//Data
var rawInterfaces = require("../data/anl.json");

/**
 * The area chart expects a Timeseries with a simple "value" column
 */
var interfacesIn = _.map(rawInterfaces.objects, iface => {
    return new TimeSeries({
        "name": `${iface.device} ${iface.interface} in`,
        "columns": ["time", "value"],
        "points": iface.channels["in"].samples
    });
});

var interfacesOut = _.map(rawInterfaces.objects, iface => {
    return new TimeSeries({
        "name": `${iface.device} ${iface.interface} out`,
        "columns": ["time", "value"],
        "points": iface.channels["out"].samples
    });
});

var AreaCharts = React.createClass({

    componentWillMount: function() {
        //this.toggle();
    },

    render: function() {
        let n = 3;
        let inData;
        let outData;
        let dateRangeStyle = {fontSize: 12, color: "#AAA",
                              borderBottomStyle: "solid", borderWidth: "1", borderColor: "#F4F4F4"};

        inData = interfacesIn[n];
        outData = interfacesOut[n];

        let max = _.max([inData.max(), outData.max()]);
        let axistype = "linear"

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Traffic example</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3">
                        <Legend categories={{"In": "intraffic", "out": "outtraffic"}} style="swatch"/>
                    </div>
                    <div className="col-md-9">
                        <span style={dateRangeStyle}>{inData.range().humanize()}</span>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>

                            <ChartContainer timeRange={inData.range()} padding="0" transition="300">
                                <ChartRow height="150" debug={false}>
                                    <Charts>
                                        <AreaChart axis="traffic" series={[[inData],[outData]]} />
                                    </Charts>
                                    <YAxis id="traffic" label="Traffic (bps)" labelOffset={0} min={-max} max={max} absolute={true} width="60" type={axistype}/>
                                </ChartRow>
                            </ChartContainer>

                        </Resizable>
                    </div>
                </div>

            </div>
        );
    }
});

module.exports = AreaCharts;