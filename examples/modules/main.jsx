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
import Router from "react-router";

import App from "./app.jsx";
import Intro from "./intro.jsx";
import ChartContainer from "./chartcontainer.jsx";
import ChartRow from "./chartrow.jsx";
import Charts from "./charts.jsx";
import YAxis from "./yaxis.jsx";
import AreaCharts from "./areachart.jsx";
import StackedAreaCharts from "./stacked.jsx";
import LineCharts from "./linechart.jsx";
import BarCharts from "./barchart.jsx";
import ScatterCharts from "./scatterchart.jsx";
import Baseline from "./baseline.jsx";
import Legends from "./legend.jsx";
import Weather from "./weather.jsx";
import DDoS from "./ddos.jsx";
import Table from "./table.jsx";

const {Route, DefaultRoute} = Router;

const routes = (
    <Route path="/" handler={App}>
        <DefaultRoute name="intro" handler={Intro} />
        <Route name="chartcontainer" handler={ChartContainer} />
        <Route name="chartrow" handler={ChartRow} />
        <Route name="charts" handler={Charts} />
        <Route name="yaxis" handler={YAxis} />
        <Route name="areacharts" handler={AreaCharts} />
        <Route name="stacked" handler={StackedAreaCharts} />
        <Route name="linecharts" handler={LineCharts} />
        <Route name="barcharts" handler={BarCharts} />
        <Route name="scattercharts" handler={ScatterCharts} />
        <Route name="baseline" handler={Baseline} />
        <Route name="legends" handler={Legends} />
        <Route name="weather" handler={Weather} />
        <Route name="ddos" handler={DDoS} />
        <Route name="table" handler={Table} />
    </Route>
);

Router.run(routes, (Handler) => {
    React.render(<Handler/>, document.getElementById("content"));
});
