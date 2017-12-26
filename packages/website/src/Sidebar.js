/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, { Component } from "react";
import _ from "lodash";
import { NavLink, Link } from "react-router-dom";
import {sidebarStyle, sidebarItemStyle, sidebarTitleStyle, activeStyle} from "./styles";

export default class extends Component {
    render() {
        return (
            <div style={sidebarStyle}>

                <div className="sidebar-heading" style={sidebarTitleStyle}>GUIDE</div>
                <ul className="nav nav-sidebar" style={sidebarItemStyle}>
                    <li><Link to="/guide/intro">1. Introduction</Link></li>
                    <li>
                        <Link to="/guide/start">2. Getting started</Link>
                    </li>
                    <li><Link to="/guide/style">3. Styling</Link></li>
                    <li><Link to="/guide/annotations">4. Annotations</Link></li>
                </ul>

                <div className="sidebar-heading" style={sidebarTitleStyle}>Examples</div>
                <ul className="nav nav-sidebar" style={sidebarItemStyle}>
                    <li>
                        <Link to="/example/realtime">
                            Realtime example
                        </Link>
                    </li>
                    <li>
                        <Link to="/example/baselines">
                            Baselines demo
                        </Link>
                    </li>
                    <li>
                        <Link to="/example/barchart">
                            Simple BarChart example
                        </Link> 
                    </li>
                    <li>
                        <Link to="/example/continents">
                            Stacked AreaCharts
                        </Link>
                    </li>
                    <li>
                        <Link to="/example/currency">
                            Currency example
                        </Link>
                    </li>
                    <li>
                        <Link to="/example/cycling">
                            Cycling example
                        </Link> 
                    </li>
                    <li>
                        <Link to="/example/ddos">
                            DDoS attack example
                        </Link>
                    </li>
                    <li>
                        <Link to="/example/outages">Outage events</Link> 
                    </li>
                    <li>
                        <Link to="/example/traffic">
                            Network traffic
                        </Link>
                    </li>
                    <li>
                        <Link to="/example/weather">
                            Weather example
                        </Link>
                    </li>
                    <li>
                        <Link to="/example/wind">Scatter example</Link>
                    </li>
                    <li>
                        <Link to="/example/volume">
                            Barchart example
                        </Link>
                    </li>
                    <li>
                        <Link to="/example/nyc">Boxplot example</Link>
                    </li>
                    <li>
                        <Link to="/example/climate">
                            Climate example
                        </Link>
                    </li>
                </ul>

                <div className="sidebar-heading" style={sidebarTitleStyle}>API</div>
                <ul className="nav nav-sidebar" style={sidebarItemStyle}>
                    <li><Link to="/api/charts/AreaChart" activeStyle={activeStyle}>AreaChart</Link></li>
                    <li><Link to="/api/charts/BarChart">BarChart</Link></li>
                    <li><Link to="/api/charts/Baseline">Baseline</Link></li>
                    <li><Link to="/api/charts/BoxChart">BoxChart</Link></li>
                    <li><Link to="/api/charts/Brush">Brush</Link></li>
                    <li>
                        <Link to="/api/charts/ChartContainer">
                            ChartContainer
                        </Link>
                    </li>
                    <li><Link to="/api/charts/ChartRow">ChartRow</Link></li>
                    <li><Link to="/api/charts/Charts">Charts</Link></li>
                    <li>
                        <Link to="/api/charts/EventChart">EventChart</Link>
                    </li>
                    <li>
                        <Link to="/api/charts/EventMarker">EventMarker</Link>
                    </li>
                    <li><Link to="/api/charts/LabelAxis">LabelAxis</Link></li>
                    <li><Link to="/api/charts/Legend">Legend</Link></li>
                    <li><Link to="/api/charts/LineChart">LineChart</Link></li>
                    <li><Link to="/api/charts/Resizable">Resizable</Link></li>
                    <li>
                        <Link to="/api/charts/ScatterChart">ScatterChart</Link>
                    </li>
                    <li><Link to="/api/charts/TimeAxis">TimeAxis</Link></li>
                    <li>
                        <Link to="/api/charts/TimeMarker">TimeMarker</Link>
                    </li>
                    <li>
                        <Link to="/api/charts/TimeRangeMarker">
                            TimeRangeMarker
                        </Link>
                    </li>
                    <li><Link to="/api/charts/ValueAxis">ValueAxis</Link></li>
                    <li><Link to="/api/charts/ValueList">ValueList</Link></li>
                    <li><Link to="/api/charts/YAxis">YAxis</Link></li>
                </ul>

                <div className="sidebar-heading" style={sidebarTitleStyle}>Links</div>
                <ul className="nav nav-sidebar" style={sidebarItemStyle}>
                    <li>
                        <a href="https://github.com/esnet/react-timeseries-charts">
                            GitHub
                        </a>
                    </li>
                    <li><a href="https://www.es.net/">ESnet</a></li>
                    <li>
                        <a href="http://software.es.net/">
                            Open Source
                        </a>
                    </li>
                </ul>

                <div className="sidebar-heading" style={sidebarTitleStyle}>Related Projects</div>
                <ul className="nav nav-sidebar" style={sidebarItemStyle}>
                    <li>
                        <a href="http://software.es.net/pond/">
                            pond.js
                        </a>
                    </li>
                    <li>
                        <a href="http://software.es.net/react-network-diagrams/">
                            Network Diagrams
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}
