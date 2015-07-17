import React from "react/addons";
import _ from "underscore";
import {TimeSeries} from "pond";

//Imports from the charts library
import Legend from "../../lib/components/legend";
import ChartContainer from "../../lib/components/chartcontainer";
import ChartRow from "../../lib/components/chartrow";
import Charts from "../../lib/components/charts";
import YAxis from "../../lib/components/yaxis";
import AreaChart from "../../lib/components/areachart";
import Baseline from "../../lib/components/baseline";
import Resizable from "../../lib/components/resizable";

import Markdown from "react-markdown-el";
const exampleText = `
    <ChartContainer timeRange={inData.range()}>
        <ChartRow height="150">
            <Charts>
                <AreaChart axis="traffic" series={[[inData],[outData]]} />
            </Charts>
            <YAxis id="traffic" label="Traffic (bps)" min={-max} max={max} absolute={true} width="60" type="linear"/>
        </ChartRow>
    </ChartContainer>
`;

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

export default React.createClass({

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

                <div className="row">
                    <div className="col-md-12">
                        <Markdown text={exampleText} />
                    </div>
                </div>

            </div>
        );
    }
});
