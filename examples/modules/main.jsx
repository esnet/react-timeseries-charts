/** @jsx React.DOM */

var React = require('react');

var App = require('./app.jsx');

var Intro = require('./intro.jsx');
var AreaCharts = require('./areachart.jsx');
var LineCharts = require('./linechart.jsx');
var BarCharts = require('./barchart.jsx');
var Legends = require('./legend.jsx');
var Weather = require('./weather.jsx');

var {DefaultRoute, Route, Routes} = require('react-router');

// Add new pages here as new routes, with the handler being the component
// to render the example page. Also add a link to it in app.jsx.
React.renderComponent((
	<Routes>
    	<Route path="/" handler={App}>
      		<DefaultRoute name="intro" handler={Intro} />
      		<Route name="areacharts" handler={AreaCharts} />
      		<Route name="linecharts" handler={LineCharts} />
      		<Route name="barcharts" handler={BarCharts} />
      		<Route name="legends" handler={Legends} />
      		<Route name="weather" handler={Weather} />
    	</Route>
  	</Routes>
), document.getElementById("content"));