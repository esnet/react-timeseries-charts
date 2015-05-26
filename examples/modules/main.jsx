"use strict";

var React = require("react/addons");
var Router = require("react-router");

var {Route,
     DefaultRoute,
     RouteHandler,
     Link} = Router;

var App = require("./app.jsx");

var Intro = require("./intro.jsx");
var AreaCharts = require("./areachart.jsx");
var LineCharts = require("./linechart.jsx");
var BarCharts = require("./barchart.jsx");
var Legends = require("./legend.jsx");
var Weather = require("./weather.jsx");
var DDoS = require("./ddos.jsx");
var API = require("./api.jsx");
var APIDoc = require("./doc.jsx");

var {DefaultRoute, Route, Routes} = require("react-router");

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute name="intro" handler={Intro} />
    <Route name="areacharts" handler={AreaCharts} />
    <Route name="linecharts" handler={LineCharts} />
    <Route name="barcharts" handler={BarCharts} />
    <Route name="legends" handler={Legends} />
    <Route name="weather" handler={Weather} />
    <Route name="ddos" handler={DDoS} />
  </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById("content"));
});
