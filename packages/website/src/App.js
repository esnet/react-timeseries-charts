/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import "./App.css";
import _ from "lodash";
import React, { Component } from "react";
import { HashRouter as Router, Route, Switch, Link } from "react-router-dom";

import Prism from "prismjs"; // eslint-disable-line
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism.css";

// import App from './App';
import Header from './Header';
import Sidebar from './Sidebar';
import Guide from "./components/Guide";
import Example from "./components/Example";
import API from "./components/API";

import esnetLogo from "./img/logo.png";
import githubLogo from "./img/github.png";
import logo from "./logo.png";

import {bodyStyle, mainStyle, footerStyle, contentStyle, githubLogoStyle} from './styles';

class App extends Component {
    render() {
        return(
            <Router>
                <div style={bodyStyle}>
                    <Header />
                    <div style={mainStyle}>
                        <div style={contentStyle}>
                            {" "}
                            <Switch>
                                <Route exact path="/" component={Guide}/>
                                <Route path="/guide/:doc" component={Guide} />
                                <Route path="/example/:example" component={Example} />
                                <Route path="/api/charts/:component" component={API} />
                            </Switch>
                        </div>
                        <Sidebar />
                    </div>
                </div>
            </Router>
        )
    }
}

export default App;
