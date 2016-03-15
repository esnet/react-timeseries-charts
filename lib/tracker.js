"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d = require("d3");

var _d2 = _interopRequireDefault(_d);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

require("moment-duration-format");

var _valuelist = require("./valuelist");

var _valuelist2 = _interopRequireDefault(_valuelist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

    displayName: "Tracker",

    propTypes: {
        style: _react2.default.PropTypes.object,
        position: _react2.default.PropTypes.instanceOf(Date),
        height: _react2.default.PropTypes.number,
        width: _react2.default.PropTypes.number,
        timeScale: _react2.default.PropTypes.func.isRequired
    },

    getDefaultProps: function getDefaultProps() {
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
    renderLine: function renderLine(posx) {
        return _react2.default.createElement("line", {
            style: this.props.style.line,
            x1: posx,
            y1: 0,
            x2: posx,
            y2: this.props.height });
    },
    renderTrackerTime: function renderTrackerTime(d) {
        var textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd"
        };

        var dateStr = "" + d;
        if (this.props.format === "day") {
            var format = _d2.default.time.format("%d");
            dateStr = format(d);
        } else if (this.props.format === "month") {
            var format = _d2.default.time.format("%B");
            dateStr = format(d);
        } else if (this.props.format === "year") {
            var format = _d2.default.time.format("%Y");
            dateStr = format(d);
        } else if (this.props.format === "relative") {
            dateStr = _moment2.default.duration(+d).format();
        }
        return _react2.default.createElement(
            "text",
            { x: 0, y: 0, dy: "1.2em", style: textStyle },
            dateStr
        );
    },
    renderHint: function renderHint(posx) {
        var w = this.props.trackerHintWidth;
        if (this.props.trackerValues) {
            if (posx + 10 + w < this.props.width - 50) {
                return _react2.default.createElement(
                    "g",
                    { transform: "translate(" + (posx + 10) + "," + 10 + ")" },
                    this.renderTrackerTime(this.props.position),
                    _react2.default.createElement(
                        "g",
                        { transform: "translate(0," + 20 + ")" },
                        _react2.default.createElement(_valuelist2.default, {
                            style: this.props.style.box,
                            align: "left",
                            values: this.props.trackerValues,
                            width: this.props.trackerHintWidth,
                            height: this.props.trackerHintHeight })
                    )
                );
            } else {
                return _react2.default.createElement(
                    "g",
                    { transform: "translate(" + (posx - w - 10) + "," + 10 + ")" },
                    this.renderTrackerTime(this.props.position),
                    _react2.default.createElement(
                        "g",
                        { transform: "translate(0," + 20 + ")" },
                        _react2.default.createElement(_valuelist2.default, {
                            style: this.props.style.box,
                            align: "left",
                            values: this.props.trackerValues,
                            width: this.props.trackerHintWidth,
                            height: this.props.trackerHintHeight })
                    )
                );
            }
        } else {
            return _react2.default.createElement("g", null);
        }
    },
    render: function render() {
        var posx = this.props.timeScale(this.props.position);
        if (posx) {
            return _react2.default.createElement(
                "g",
                null,
                this.renderLine(posx),
                this.renderHint(posx)
            );
        }
        return null;
    }
}); /**
     *  Copyright (c) 2015, The Regents of the University of California,
     *  through Lawrence Berkeley National Laboratory (subject to receipt
     *  of any required approvals from the U.S. Dept. of Energy).
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree.
     */