import React, { Component } from "react";
import { Link } from "react-router";

import "./App.css";

import esnetLogo from "./img/logo.png";
import githubLogo from "./img/github.png";

class App extends Component {
    render() {
        return (
            <div className="App">
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button
                                type="button"
                                className="navbar-toggle collapsed"
                                data-toggle="collapse"
                                data-target="#navbar"
                                aria-expanded="false"
                                aria-controls="navbar"
                            >
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            <a className="navbar-brand" href="/">
                                React Timeseries Charts
                            </a>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <a href="http://www.es.net">
                                        <img
                                            src={esnetLogo}
                                            alt="ESnet"
                                            width="32px"
                                            height="32px"
                                        />
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/esnet/react-timeseries-charts/">
                                        <img
                                            src={githubLogo}
                                            alt="Github"
                                            width="32px"
                                            height="32px"
                                        />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="row">
                    <div className="col-sm-3 col-md-2 sidebar">
                        <p />

                        <div className="sidebar-heading">GUIDE</div>

                        <ul className="nav nav-sidebar">
                            <li>
                                <Link to="/guide/intro">1. Introduction</Link>
                            </li>
                            <li>
                                <Link to="/guide/start">2. Getting started</Link>
                            </li>
                            <li>
                                <Link to="/guide/style">3. Styling</Link>
                            </li>
                            <li>
                                <Link to="/guide/annotations">4. Annotations</Link>
                            </li>
                        </ul>

                        <div className="sidebar-heading">Examples</div>

                        <ul className="nav nav-sidebar">
                            <li>
                                <Link to="/example/realtime">Realtime example</Link>
                            </li>
                            <li>
                                <Link to="/example/baselines">Baselines demo</Link>
                            </li>
                            <li>
                                <Link to="/example/barchart">Simple BarChart example</Link>
                            </li>
                            <li>
                                <Link to="/example/continents">Stacked AreaCharts</Link>
                            </li>
                            <li>
                                <Link to="/example/trend">Trend example</Link>
                            </li>
                            <li>
                                <Link to="/example/currency">Currency example</Link>
                            </li>
                            <li>
                                <Link to="/example/cycling">Cycling example</Link>
                            </li>
                            <li>
                                <Link to="/example/ddos">DDoS attack example</Link>
                            </li>
                            <li>
                                <Link to="/example/outages">Outage events</Link>
                            </li>
                            <li>
                                <Link to="/example/stockchart">Stockchart example</Link>
                            </li>
                            <li>
                                <Link to="/example/traffic">Network traffic</Link>
                            </li>
                            <li>
                                <Link to="/example/weather">Weather example</Link>
                            </li>
                            <li>
                                <Link to="/example/wind">Scatter example</Link>
                            </li>
                            <li>
                                <Link to="/example/volume">Volume example</Link>
                            </li>
                            <li>
                                <Link to="/example/nyc">Boxplot example</Link>
                            </li>
                            <li>
                                <Link to="/example/climate">Climate example</Link>
                            </li>
                        </ul>

                        <div className="sidebar-heading">API</div>

                        <ul className="nav nav-sidebar">
                            <li>
                                <Link to="/api/charts/AreaChart">AreaChart</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/BandChart">BandChart</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/BarChart">BarChart</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/Baseline">Baseline</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/BoxChart">BoxChart</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/Brush">Brush</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/ChartContainer">ChartContainer</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/ChartRow">ChartRow</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/Charts">Charts</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/EventChart">EventChart</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/EventMarker">EventMarker</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/LabelAxis">LabelAxis</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/Legend">Legend</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/LineChart">LineChart</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/MultiBrush">MultiBrush</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/Resizable">Resizable</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/ScatterChart">ScatterChart</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/TimeAxis">TimeAxis</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/TimeMarker">TimeMarker</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/TimeRangeMarker">TimeRangeMarker</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/ValueAxis">ValueAxis</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/ValueList">ValueList</Link>
                            </li>
                            <li>
                                <Link to="/api/charts/YAxis">YAxis</Link>
                            </li>
                        </ul>

                        <div className="sidebar-heading">Links</div>

                        <ul className="nav nav-sidebar">
                            <li>
                                <a href="https://github.com/esnet/react-timeseries-charts">
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a href="https://www.es.net/">ESnet</a>
                            </li>
                            <li>
                                <a href="http://software.es.net/">Open Source</a>
                            </li>
                        </ul>

                        <div className="sidebar-heading">Related Projects</div>

                        <ul className="nav nav-sidebar">
                            <li>
                                <a href="http://software.es.net/pond/">pond.js</a>
                            </li>
                            <li>
                                <a href="http://software.es.net/react-network-diagrams/">
                                    Network Diagrams
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
