/** @jsx React.DOM */

var React = require('react');

var App = require('./app.jsx');
var Home = require('./home.jsx');

var {DefaultRoute, Route, Routes} = require('react-router');

React.renderComponent((
  <Routes location="history">
    <Route path="/" handler={App}>
      <DefaultRoute name="home" handler={Home} />
    </Route>
  </Routes>
), document.getElementById("content"));