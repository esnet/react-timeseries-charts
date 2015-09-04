/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var React = require("react/addons");
var Router = require("react-router");
var {RouteHandler, Link} = Router;

require("../styles/app.css");
var logo = document.createElement('img');
logo.src = require('../img/logo.png');

export default React.createClass({

  render: function() {
    
    var sidebarStyle = {
        borderRightStyle: "solid",
        borderRightColor: "#F2F1F1",
        borderRightWidth: 1
    }

    return (
      <div>
          <div className="row">
              <div className="col-md-2">
                  <img style={{float: "right"}} className="main-image" src={logo.src} width={80}/>
              </div>
              <div className="col-md-10">
                  <h2>React Timeseries Charts</h2>
              </div>
          </div>

          <hr />

          <div className="row">

            <div className="col-md-2" style={sidebarStyle}>
              <div className="docs-sidebar">
                  <ul className="docs-sidenav nav">
                    <li><Link to="intro">Introduction</Link></li>

                    <hr />

                    Basics:
                    <li><Link to="linecharts">Line charts</Link></li>
                    <li><Link to="areacharts">Area charts</Link></li>
                    <li><Link to="stacked">Stacked area</Link></li>
                    <li><Link to="barcharts">Bar charts</Link></li>
                    
                    <hr />

                    Examples:
                    <li><Link to="weather">Weather example</Link></li>
                    <li><Link to="ddos">DDoS example</Link></li>

                    <hr />

                    Extras:
                    <li><Link to="legends">Legends</Link></li>
                    <li><Link to="table">Tables</Link></li>

                  </ul>
              </div>
            </div>

            <div className="col-md-10">
              <RouteHandler />
            </div>

          </div>
      </div>
    );
  }
});
