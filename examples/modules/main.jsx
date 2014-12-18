/** @jsx React.DOM */

var React = require('react');

var App = require('./app.jsx');

var Intro = require('./intro.jsx');
var AreaCharts = require('./areachart.jsx');
var LineCharts = require('./linechart.jsx');
var Legends = require('./legend.jsx');
var Weather = require('./weather.jsx');

var {DefaultRoute, Route, Routes} = require('react-router');

console.log("Init");

React.renderComponent((
	<Routes location="history">
    	<Route path="/" handler={App}>
      		<DefaultRoute name="intro" handler={Intro} />
      		<Route name="areacharts" handler={AreaCharts} />
      		<Route name="linecharts" handler={LineCharts} />
      		<Route name="legends" handler={Legends} />
      		<Route name="weather" handler={Weather} />
    	</Route>
  	</Routes>
), document.getElementById("content"));