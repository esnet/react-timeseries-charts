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
logo.src = require("../../img/logo.png");

export default React.createClass({

    render() {
        return (
            <div className="row">

                <div className="col-sm-3 col-md-2 sidebar">
                    <p />

                    <div className="sidebar-heading">Docs</div>

                    <ul className="nav nav-sidebar">
                        <li><Link to="/">Introduction</Link></li>
                    </ul>

                    <div className="sidebar-heading">Examples</div>

                    <ul className="nav nav-sidebar">
                        <li><Link to="example/realtime">Realtime example</Link></li>
                        <li><Link to="example/baselines">Baselines demo</Link></li>
                        <li><Link to="example/continents">Stacked AreaCharts</Link></li>
                        <li><Link to="example/currency">Currency example</Link></li>
                        <li><Link to="example/cycling">Cycling example</Link></li>
                        <li><Link to="example/ddos">DDoS attack example</Link></li>
                        <li><Link to="example/interfaces">Traffic breakdown</Link></li>
                        <li><Link to="example/outages">Outage events</Link></li>
                        <li><Link to="example/stockchart">Stock chart</Link></li>
                        <li><Link to="example/traffic">Network traffic</Link></li>
                        <li><Link to="example/weather">Weather example</Link></li>
                        <li><Link to="example/wind">Scatter example</Link></li>
                        <li><Link to="example/volume">Barchart example</Link></li>
                    </ul>

                    <div className="sidebar-heading">API</div>

                    <ul className="nav nav-sidebar">
                        <li><Link to="docs/areachart">AreaChart</Link></li>
                        <li><Link to="docs/barchart">BarChart</Link></li>
                        <li><Link to="docs/baseline">Baseline</Link></li>
                        <li><Link to="docs/chartcontainer">ChartContainer</Link></li>
                        <li><Link to="docs/chartrow">ChartRow</Link></li>
                        <li><Link to="docs/charts">Charts</Link></li>
                        <li><Link to="docs/hbarchart">Horizontal BarChart</Link></li>
                        <li><Link to="docs/legend">Legend</Link></li>
                        <li><Link to="docs/linechart">LineChart</Link></li>
                        <li><Link to="docs/scatterchart">ScatterChart</Link></li>
                        <li><Link to="docs/yaxis">YAxis</Link></li>
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
