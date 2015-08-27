//Import the require hook for babel runtime
import "babel/register";

import React from "react/addons";
import Router from "react-router";
import {TimeSeries} from "pond";
import {Legend,
        ChartContainer,
        ChartRow,
        Charts,
        YAxis,
        AreaChart,
        Baseline,
        Resizable} from "../../index";

import App from "./app.jsx";
import Intro from "./intro.jsx";
import AreaCharts from "./areachart.jsx";
import StackedAreaCharts from "./stacked.jsx";
import LineCharts from "./linechart.jsx";
import BarCharts from "./barchart.jsx";
import Legends from "./legend.jsx";
import Weather from "./weather.jsx";
import DDoS from "./ddos.jsx";
import History from "./history.jsx";
import Table from "./table.jsx";

const {Route, DefaultRoute, RouteHandler, Link} = Router;

const routes = (
    <Route path="/" handler={App}>
        <DefaultRoute name="intro" handler={Intro} />
        <Route name="areacharts" handler={AreaCharts} />
        <Route name="stacked" handler={StackedAreaCharts} />
        <Route name="linecharts" handler={LineCharts} />
        <Route name="barcharts" handler={BarCharts} />
        <Route name="legends" handler={Legends} />
        <Route name="history" handler={History} />
        <Route name="weather" handler={Weather} />
        <Route name="ddos" handler={DDoS} />
        <Route name="table" handler={Table} />
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById("content"));
});
