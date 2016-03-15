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
import d3 from "d3";
import moment from "moment";
import "moment-duration-format";

import ValueList from "./valuelist";

export default React.createClass({

    displayName: "Tracker",

    propTypes: {
        style: React.PropTypes.object,
        position: React.PropTypes.instanceOf(Date),
        height: React.PropTypes.number,
        width: React.PropTypes.number,
        timeScale: React.PropTypes.func.isRequired
    },

    getDefaultProps() {
        return {
            offset: 0,
            style: {
                line: {
                    stroke: "#AAA",
                    cursor: "crosshair"
                },
                box: {
                    fill: "#FFF",
                    opacity: 0.85,
                    stroke: "#AAA"
                }
            },
            trackerHintWidth: 90,
            trackerHintHeight: 90
        };
    },

    renderLine(posx) {
        return (
            <line
                style={this.props.style.line}
                x1={posx}
                y1={0}
                x2={posx}
                y2={this.props.height} />
        );
    },

    renderTrackerTime(d) {
        const textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd"
        };

        let dateStr = `${d}`;
        if (this.props.format === "day") {
            const format = d3.time.format("%d");
            dateStr = format(d);
        } else if (this.props.format === "month") {
            const format = d3.time.format("%B");
            dateStr = format(d);
        } else if (this.props.format === "year") {
            const format = d3.time.format("%Y");
            dateStr = format(d);
        } else if (this.props.format === "relative") {
            dateStr = moment.duration(+d).format();
        }
        return (
            <text x={0} y={0} dy="1.2em" style={textStyle}>
                {dateStr}
            </text>
        );
    },

    renderHint(posx) {
        const w = this.props.trackerHintWidth;
        if (this.props.trackerValues) {
            if (posx + 10 + w < this.props.width - 50) {
                return (
                    <g transform={`translate(${posx + 10},${10})`} >
                        {this.renderTrackerTime(this.props.position)}
                        <g transform={`translate(0,${20})`}>
                            <ValueList
                                style={this.props.style.box}
                                align="left"
                                values={this.props.trackerValues}
                                width={this.props.trackerHintWidth}
                                height={this.props.trackerHintHeight} />
                        </g>
                    </g>
                );
            } else {
                return (
                    <g transform={`translate(${posx - w - 10},${10})`} >
                        {this.renderTrackerTime(this.props.position)}
                        <g transform={`translate(0,${20})`}>
                            <ValueList
                                style={this.props.style.box}
                                align="left"
                                values={this.props.trackerValues}
                                width={this.props.trackerHintWidth}
                                height={this.props.trackerHintHeight} />
                        </g>
                    </g>
                );
            }
        } else {
            return (
                <g />
            );
        }
    },

    render() {
        const posx = this.props.timeScale(this.props.position);
        if (posx) {
            return (
                <g>
                    {this.renderLine(posx)}
                    {this.renderHint(posx)}
                </g>
            );
        }
        return null;
    }
});
