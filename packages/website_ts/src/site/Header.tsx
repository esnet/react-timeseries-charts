/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as React from "react";

const logo = require("./img/logo.png");
const githubLogo = require("./img/github.png");

// tslint:disable-next-line:no-any
export default class Header extends React.Component<any, any> {
    render() {
        const githubLogoStyle = {
            width: 24,
            paddingRight: 5,
            marginTop: -4
        };
        return (
            <nav className="navbar navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <div className="navbar-brand">
                            <span>
                            <a href="/">
                                <img
                                    style={{ marginTop: -4 }}
                                    src={logo}
                                    alt="logo"
                                    height={60}
                                />
                            </a>
                            </span>
                            <span style={{ fontSize: 32, marginLeft: 10 }}>React Timeseries Charts</span>
                        </div>
                    </div>
                    <div>
                        <ul className="nav navbar-nav navbar-right tools-links">
                            <li>
                                <a href="https://github.com/esnet/react-timeseries-charts" style={{ paddingTop: 8 }}>
                                    <img src={githubLogo} style={githubLogoStyle} alt="github" />
                                    Github
                                </a>
                            </li>
                            <li>
                                <a href="http://software.es.net" style={{ paddingTop: 8 }}>
                                    Open Source
                                </a>
                            </li>
                            <li>
                                <a href="http://es.net" style={{ paddingTop: 8 }}>
                                    ESnet
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
