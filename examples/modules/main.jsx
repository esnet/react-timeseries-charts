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

import App from "./app";
import Intro from "./intro";
import ChartContainer from "./chartcontainer";
import ChartRow from "./chartrow";
import Charts from "./charts";
import YAxis from "./yaxis";
import AreaCharts from "./areachart";
import StackedAreaCharts from "./stacked";
import LineCharts from "./linechart";
import BarCharts from "./barchart";
import ScatterCharts from "./scatterchart";
import EventCharts from "./eventchart";
import Baseline from "./baseline";
import Legends from "./legend";
import Weather from "./weather";
import DDoS from "./ddos";
import Table from "./table";
import Channels from "./channels";
import Horizontal from "./horizontal";
import Realtime from "./realtime";
import Apple from "./apple";

import createHistory from "history/lib/createHashHistory";
import useScroll from "scroll-behavior/lib/useStandardScroll";

const history = useScroll(createHistory)();

render((
    <Router history={history}>
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
            <Route path="eventcharts" component={EventCharts} />
            <Route path="baseline" component={Baseline} />
            <Route path="legends" component={Legends} />
            <Route path="weather" component={Weather} />
            <Route path="ddos" component={DDoS} />
            <Route path="table" component={Table} />
            <Route path="channels" component={Channels} />
            <Route path="horizontal" component={Horizontal} />
            <Route path="realtime" component={Realtime} />
            <Route path="apple" component={Apple} />
        </Route>
    </Router>
), document.getElementById("content"));
