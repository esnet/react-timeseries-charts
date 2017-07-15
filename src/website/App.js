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

                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                        {this.props.children}
                    </div>

                </div>

            </div>
        );
    }
}

export default App;
