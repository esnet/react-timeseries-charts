/** @jsx React.DOM */

var React = require('react');

var {Link} = require('react-router');

require('./app.css');

var App = React.createClass({
  render: function() {
    return (
      <div>
          <div className="row">
              <div className="col-md-12">
                  <h2>ESnet React Charts - Examples</h2>
              </div>
          </div>

          <hr />

          <div className="row">

            <div className="col-md-2">
              <div className="docs-sidebar">
                  <ul className="docs-sidenav nav">
                    <li><Link to="intro">Introduction</Link></li>
                    <li><Link to="legends">Legends</Link></li>
                    <li><Link to="linecharts">Line charts</Link></li>
                    <li><Link to="areacharts">Area charts</Link></li>
                    <li><Link to="weather">Weather example</Link></li>
                  </ul>
              </div>
            </div>

            <div className="col-md-10">
              <this.props.activeRouteHandler />
            </div>

          </div>
      </div>
    );
  }
});

module.exports = App;
