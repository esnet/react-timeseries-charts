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
import { render } from "react-dom";
import { Router, Route, IndexRoute } from "react-router";

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

render((
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Intro}/>
            <Route path="chartcontainer" component={ChartContainer} />
            <Route path="chartrow" component={ChartRow} />
            <Route path="charts" component={Charts} />
            <Route path="yaxis" component={YAxis} />
            <Route path="areacharts" component={AreaCharts} />
            <Route path="stacked" component={StackedAreaCharts} />
            <Route path="linecharts" component={LineCharts} />
            <Route path="barcharts" component={BarCharts} />
            <Route path="scattercharts" component={ScatterCharts} />
            <Route path="baseline" component={Baseline} />
            <Route path="legends" component={Legends} />
            <Route path="weather" component={Weather} />
            <Route path="ddos" component={DDoS} />
            <Route path="table" component={Table} />
        </Route>
    </Router>
), document.getElementById("content"));
