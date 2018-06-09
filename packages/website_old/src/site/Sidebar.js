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
import { NavLink } from "react-router-dom";

import { sidebarTitleStyle, sidebarItemStyle } from "./api/styles";

export default class extends Component {
    render() {
        const sidebarStyle = {
            flex: "0 0 12em",
            background: "#FEFEFE",
            color: "#4183C4",
            textDecoration: "none",
            borderLeftStyle: "solid",
            borderLeftColor: "#64b2c5",
            marginLeft: 40
        };
        const activeStyle = {
            color: "black",
            textDecoration: "none"
        };

        const excluded = ["Resizable", "ScaleInterpolator"];
        const filter = this.props.filter || "";
        const classes = _.sortBy(
            _.filter(this.props.docs.classes, c => !c.flags.isPrivate && c.name.includes(filter) && !excluded.includes(c.name)),
            c => c.name
        );

        const others = ["infobox", "label"];

        // const objects = _.sortBy(
        //     _.filter(this.props.docs.objects, c => !c.flags.isPrivate && c.name.includes(filter)),
        //     c => c.name
        // );

        // const types = _.sortBy(
        //     _.filter(this.props.docs.types, c => !c.flags.isPrivate && c.name.includes(filter)),
        //     c => c.name
        // );

        return (
            <div style={sidebarStyle}>

                <div style={sidebarTitleStyle}>GUIDE</div>
                <div key="intro" style={sidebarItemStyle}>
                    <NavLink to="/guide/intro" activeStyle={activeStyle}>
                        1. Introduction
                    </NavLink>
                </div>
                <div key="start" style={sidebarItemStyle}>
                    <NavLink to="/guide/start" activeStyle={activeStyle}>
                        2. Getting started
                    </NavLink>
                </div>
                <div key="styling" style={sidebarItemStyle}>
                    <NavLink to="/guide/style" activeStyle={activeStyle}>
                        3. Styling
                    </NavLink>
                </div>
                <div key="annotations" style={sidebarItemStyle}>
                    <NavLink to="/guide/annotations" activeStyle={activeStyle}>
                        4. Annotations
                    </NavLink>
                </div>

                <div style={sidebarTitleStyle}>EXAMPLES</div>
                <div key="realtime" style={sidebarItemStyle}>
                    <NavLink to="/example/realtime" activeStyle={activeStyle}>
                        Realtime example
                    </NavLink>
                </div>
                <div key="baselines" style={sidebarItemStyle}>
                    <NavLink to="/example/baselines" activeStyle={activeStyle}>
                        Baselines demo
                    </NavLink>
                </div>
                <div key="barchart" style={sidebarItemStyle}>
                    <NavLink to="/example/barchart" activeStyle={activeStyle}>
                        Simple BarChart example
                    </NavLink> 
                </div>
                <div key="continents" style={sidebarItemStyle}>
                    <NavLink to="/example/continents" activeStyle={activeStyle}>
                        Stacked AreaCharts
                    </NavLink>
                </div>
                <div key="currency" style={sidebarItemStyle}>
                    <NavLink to="/example/currency" activeStyle={activeStyle}>
                        Currency example
                    </NavLink>
                </div>
                <div key="cycling" style={sidebarItemStyle}>
                    <NavLink to="/example/cycling" activeStyle={activeStyle}>
                        Cycling example
                    </NavLink> 
                </div>
                <div key="ddos" style={sidebarItemStyle}>
                    <NavLink to="/example/ddos" activeStyle={activeStyle}>
                        DDoS attack example
                    </NavLink>
                </div>
                <div key="outages" style={sidebarItemStyle}>
                    <NavLink to="/example/outages" activeStyle={activeStyle}>
                        Outage events
                    </NavLink> 
                </div>
                <div key="traffic" style={sidebarItemStyle}>
                    <NavLink to="/example/traffic" activeStyle={activeStyle}>
                        Network traffic
                    </NavLink>
                </div>
                <div key="weather" style={sidebarItemStyle}>
                    <NavLink to="/example/weather" activeStyle={activeStyle}>
                        Weather example
                    </NavLink>
                </div>
                <div key="wind" style={sidebarItemStyle}>
                    <NavLink to="/example/wind" activeStyle={activeStyle}>
                        Scatter example
                    </NavLink>
                </div>
                <div key="volume" style={sidebarItemStyle}>
                    <NavLink to="/example/volume" activeStyle={activeStyle}>
                        Barchart example
                    </NavLink>
                </div>
                <div key="nyc" style={sidebarItemStyle}>
                    <NavLink to="/example/nyc" activeStyle={activeStyle}>
                        Boxplot example
                    </NavLink>
                </div>
                <div key="climate" style={sidebarItemStyle}>
                    <NavLink to="/example/climate" activeStyle={activeStyle}>
                        Climate example
                    </NavLink>
                </div>

                <div style={sidebarTitleStyle}>API</div>
                {_.map(classes, c => (
                    <div key={c.name} style={sidebarItemStyle}>
                        <NavLink
                            exact
                            to={others.includes(c.name.toLowerCase()) ? `/class/${c.name.toLowerCase()}` : `/module/${c.name.toLowerCase()}`}
                            activeStyle={activeStyle}
                        >
                            {c.name}
                        </NavLink>
                    </div>
                ))}
            </div>
        );
    }
}
