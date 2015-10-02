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
import Router from "react-router";
const {RouteHandler, Link} = Router;

require("../styles/app.css");

const logo = document.createElement("img");
logo.src = require("../img/logo.png");

export default React.createClass({
    render() {
        const sidebarStyle = {
            borderRightStyle: "solid",
            borderRightColor: "#F2F1F1",
            borderRightWidth: 1
        };

        return (
            <div>
                <div className="row">
                    <div className="col-md-2">
                        <img style={{float: "right"}}
                             className="main-image"
                             src={logo.src} width={80}/>
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

                            Examples:
                            <li><Link to="weather">Weather example</Link></li>
                            <li><Link to="ddos">DDoS example</Link></li>
                            <li><Link to="stacked">Continents</Link></li>

                            <hr />

                            API:
                            <li><Link to="chartcontainer">ChartContainer</Link></li>
                            <li><Link to="chartrow">ChartRow</Link></li>
                            <li><Link to="charts">Charts</Link></li>
                            <li><Link to="yaxis">YAxis</Link></li>
                            <li><Link to="linecharts">LineChart</Link></li>
                            <li><Link to="areacharts">AreaChart</Link></li>
                            <li><Link to="barcharts">BarChart</Link></li>
                            <li><Link to="scattercharts">ScatterChart</Link></li>
                            <li><Link to="baseline">Baseline</Link></li>
                            <li><Link to="legends">Legend</Link></li>
                            <li><Link to="table">Table</Link></li>

                            <hr />

                            Links:
                            <li><a href="https://github.com/esnet/react-timeseries-charts">GitHub</a></li>
                            <li><a href="https://www.es.net/">ESnet</a></li>
                            <li><a href="http://software.es.net/">Open Source</a></li>

                            <hr />

                            Related Projects:
                            <li><a href="http://software.es.net/pond/">Pond</a></li>
                            <li><a href="http://software.es.net/react-network-diagrams/">Network Diagrams</a></li>

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
