/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { Link } from "react-router";

const logo = document.createElement("img");
logo.src = require("../img/logo.png");

export default React.createClass({

    render() {
        return (
            <div className="row">

                <div className="col-sm-3 col-md-2 sidebar">
                    <p />
                    <ul className="nav nav-sidebar">
                        <li><Link to="/">Introduction</Link></li>
                    </ul>

                    <div className="sidebar-heading">Examples</div>

                    <ul className="nav nav-sidebar">
                        <li><Link to="weather">Weather example</Link></li>
                        <li><Link to="channels">Cycling example</Link></li>
                        <li><Link to="ddos">DDoS example</Link></li>
                        <li><Link to="stacked">Continents</Link></li>
                        <li><Link to="realtime">Realtime stream</Link></li>
                    </ul>

                    <div className="sidebar-heading">API</div>

                    <ul className="nav nav-sidebar">
                        <li><Link to="chartcontainer">ChartContainer</Link></li>
                        <li><Link to="chartrow">ChartRow</Link></li>
                        <li><Link to="charts">Charts</Link></li>
                        <li><Link to="yaxis">YAxis</Link></li>
                        <li><Link to="linecharts">LineChart</Link></li>
                        <li><Link to="areacharts">AreaChart</Link></li>
                        <li><Link to="barcharts">BarChart</Link></li>
                        <li><Link to="scattercharts">ScatterChart</Link></li>
                        <li><Link to="eventcharts">EventChart [alpha]</Link></li>
                        <li><Link to="baseline">Baseline</Link></li>
                    </ul>
                        
                    <div className="sidebar-heading">Extras</div>

                    <ul className="nav nav-sidebar">
                        <li><Link to="legends">Legend</Link></li>
                        <li><Link to="horizontal">Horizontal BarChart</Link></li>
                        <li><Link to="table">Timeseries Tables</Link></li>
                    </ul>

                    <div className="sidebar-heading">Links</div>

                    <ul className="nav nav-sidebar">
                        <li><a href="https://github.com/esnet/react-timeseries-charts">GitHub</a></li>
                        <li><a href="https://www.es.net/">ESnet</a></li>
                        <li><a href="http://software.es.net/">Open Source</a></li>
                    </ul>

                    <div className="sidebar-heading">Related Projects</div>

                    <ul className="nav nav-sidebar">
                        <li><a href="http://software.es.net/pond/">pond.js</a></li>
                        <li><a href="http://software.es.net/react-network-diagrams/">Network Diagrams</a></li>
                    </ul>
                </div>

                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    {this.props.children}
                </div>

            </div>
        );
    }
});
