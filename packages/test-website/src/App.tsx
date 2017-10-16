import * as React from 'react';
import './App.css';
// import esnetLogo from './img/logo.png';
// import githubLogo from './img/github.png';

// Pond
import { indexedSeries, Index } from "pondjs";

// Imports from the charts library
import { ChartContainer, ChartRow, Charts, YAxis, BarChart, Resizable, styler } from "react-timeseries-charts";

const data = [
    ["2017-01-24 00:00", 0.01],
    ["2017-01-24 01:00", 0.13],
    ["2017-01-24 02:00", 0.07],
    ["2017-01-24 03:00", 0.04],
    ["2017-01-24 04:00", 0.33],
    ["2017-01-24 05:00", 0.2],
    ["2017-01-24 06:00", 0.08],
    ["2017-01-24 07:00", 0.54],
    ["2017-01-24 08:00", 0.95],
    ["2017-01-24 09:00", 1.12],
    ["2017-01-24 10:00", 0.66],
    ["2017-01-24 11:00", 0.06],
    ["2017-01-24 12:00", 0.3],
    ["2017-01-24 13:00", 0.05],
    ["2017-01-24 14:00", 0.5],
    ["2017-01-24 15:00", 0.24],
    ["2017-01-24 16:00", 0.02],
    ["2017-01-24 17:00", 0.98],
    ["2017-01-24 18:00", 0.46],
    ["2017-01-24 19:00", 0.8],
    ["2017-01-24 20:00", 0.39],
    ["2017-01-24 21:00", 0.4],
    ["2017-01-24 22:00", 0.39],
    ["2017-01-24 23:00", 0.28]
];

const series = indexedSeries({
    name: "hilo_rainfall",
    columns: ["index", "precip"],
    points: data.map(([d, value]) => [Index.getIndexString("1h", new Date(d)), value])
});

class App extends React.Component {
    renderBarChart() {
        const style = styler([{ key: "precip", color: "#A5C8E1", selected: "#2CB1CF" }]);
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <b>BarChart</b>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer timeRange={series.range()}>
                                <ChartRow height="150">
                                    <YAxis
                                        id="rain"
                                        label="Rainfall (inches/hr)"
                                        min={0}
                                        max={1.5}
                                        format=".2f"
                                        width="70"
                                        type="linear"
                                    />
                                    <Charts>
                                        <BarChart
                                            axis="rain"
                                            style={style}
                                            spacing={1}
                                            columns={["precip"]}
                                            series={series}
                                        />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }

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
                                <span className="sr-only">
                                    Toggle navigation
                                </span>
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            <a className="navbar-brand" href="#">
                                React Timeseries Charts
                            </a>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <a href="http://www.es.net">
                                        
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/esnet/react-timeseries-charts/">
                                        
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
                    </div>

                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                        {this.props.children}
                    </div>

                </div>

                <div>
                    {this.renderBarChart()}
                </div>

            </div>
        );
    }
}

export default App;