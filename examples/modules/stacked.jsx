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
import _ from "underscore";
//import { scaleOrdinal } from "d3-scale";
import Markdown from "react-markdown";
import Highlighter from "./highlighter";
//import { schemeAccent } from "d3-scale-chromatic";

import colorbrewer from "colorbrewer";

//const colorScale = scaleOrdinal(schemeAccent);
//console.log(colorScale.domain());

console.log(colorbrewer);

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import Legend from "../../src/legend";
import ChartContainer from "../../src/chartcontainer";
import ChartRow from "../../src/chartrow";
import Charts from "../../src/charts";
import YAxis from "../../src/yaxis";
import AreaChart from "../../src/areachart";
import Resizable from "../../src/resizable";
import Style from "../../src/style";

const text = `

This example shows a stacked area chart. Area charts can be stacked both above and below the axis. This
example also shows basic styling using an array of colors:

    const style = {up: ["#1f77b4", "#aec7e8", "#ff7f0e", ... ]}

This example also shows how to set the interpolation to any of d3's interpolate functions,
in this case 'curveBasis'.

    <ChartContainer timeRange={series.range()}>
        <ChartRow height="350">
            <YAxis
                id="y"
                min={min}
                max={max}
                width="60"
                type="linear"/>
            <Charts>
                <AreaChart
                    axis="y"
                    style={style}
                    series={series}
                    columns={columns}
                    fillOpacity={0.4}
                    interpolation="curveBasis" />
            </Charts>
        </ChartRow>
    </ChartContainer>
`;

// Data
const rawData = require("../data/stacked.json");

const numPoints = rawData[0].values.length;

const columns = ["time"];
const columnNames = [];
_.each(rawData, d => {
    columns.push(d.key);
    columnNames.push(d.key);
});

//
// Process out data into a TimeSeries
//

const points = [];
for (let i = 0; i < numPoints; i++) {
    const t = rawData[0].values[i][0];
    const point = [t];
    _.each(rawData, d => {
        point.push(d.values[i][1]);
    });
    points.push(point);
}
const series = new TimeSeries({name: "Continents", columns, points});

//
// Build a list of continents
//

const continentList = _.map(rawData, d => d.key);

//
// Styling for the AreaChart
//

const style = Style()
    .columns(columnNames)
    .usingColorScheme("YlGn");

//
// Build out legend
//

/*
const legendCategories = continentList.map((d, i) => ({
    key: d,
    label: d,
    style: style.legendStyle(d, "swatch")
}));
*/

const areaChartStyle = style.areaChartStyle();

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            markdown: text
        };
    },

    render() {
        const cols = {up: columnNames, down: []};
        const min = 0;
        const max = 130;
        const axisType = "linear";
        const interpolationType = "curveBasis";

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Stacked continents example</h3>
                    </div>
                </div>

                <hr/>
                {/*}
                <div className="row">
                    <div className="col-md-12">
                        <Legend categories={legendCategories} type="swatch"/>
                    </div>
                </div>
                */}
                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Resizable>

                            <ChartContainer
                                timeRange={series.range()}
                                onBackgroundClick={() => this.setState({selection: null})} >
                                <ChartRow height="350">
                                    <YAxis
                                        id="value"
                                        min={min} max={max}
                                        width="60"
                                        type={axisType}/>
                                    <Charts>
                                        <AreaChart
                                            axis="value"
                                            style={areaChartStyle}
                                            series={series}
                                            columns={cols}
                                            fillOpacity={0.4}
                                            interpolation={interpolationType}
                                            highlight={this.state.highlight}
                                            onHighlightChange={highlight => this.setState({highlight})}
                                            selection={this.state.selection}
                                            onSelectionChange={selection => this.setState({selection})} />
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
