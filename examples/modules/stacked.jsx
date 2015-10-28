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

import React from "react/addons";
import _ from "underscore";
import Markdown from "react-markdown";
import Highlighter from "./highlighter";

// Pond
import {TimeSeries} from "@esnet/pond";

// Imports from the charts library
import Legend from "../../src/legend";
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import AreaChart from "../../src/areachart";
import Resizable from "../../src/resizable";

const text = `

This example shows a stacked area chart. Area charts can be stacked both above and below the axis. This
example also shows basic styling using an array of colors:

    const style = {up: ["#1f77b4", "#aec7e8", "#ff7f0e", ... ]}

Area charts default to a step style interpolation. This example also shows how to set the interpolation
to any of d3's interpolate functions, in this case 'linear'.

    <ChartContainer timeRange={range}>
        <ChartRow height="350">
            <Charts>
                <AreaChart axis="value" style={style} series={[series,[]]} interpolate="linear"/>
            </Charts>
            <YAxis id="value" label="" labelOffset={0} max={max} width="60" type="linear"/>
        </ChartRow>
    </ChartContainer>
`;

// Data
const rawData = require("../data/stacked.json");

const numPoints = rawData[0].values.length;

const columns = ["time"];
const displayColumns = [];
_.each(rawData, d => {
    columns.push(d.key);
    displayColumns.push(d.key);
});

const points = [];
for (let i = 0; i < numPoints; i++) {
    const t = rawData[0].values[i][0];
    const point = [t];
    _.each(rawData, d => {
        point.push(d.values[i][1]);
    });
    points.push(point);
}

const series = new TimeSeries({
    name: "Stacked",
    columns: columns,
    points: points
});

const countriesList = _.map(rawData, d => {
    return d.key;
});

const colorsList = [
    "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c",
    "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5",
    "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f",
    "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
];

const legendCategories = _.map(countriesList, (d, i) => ({
    key: d,
    label: d,
    style: {backgroundColor: colorsList[i]}
}));

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            markdown: text
        };
    },

    render() {
        const style = {up: colorsList, down: []};
        const cols = {up: displayColumns, down: []};
        const min = 0;
        const max = 130;
        const axisType = "linear";
        const interpolationType = "linear";

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Stacked continents example</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Legend categories={legendCategories} type="swatch"/>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>

                            <ChartContainer timeRange={series.range()}>
                                <ChartRow height="350">
                                    <YAxis
                                        id="value"
                                        min={min} max={max}
                                        width="60"
                                        type={axisType}/>
                                    <Charts>
                                        <AreaChart
                                            axis="value"
                                            style={style}
                                            series={series}
                                            columns={cols}
                                            interpolate={interpolationType} />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>

                        </Resizable>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Markdown source={this.state.markdown}/>
                    </div>
                </div>

            </div>
        );
    }
});
