/*
 * ESnet React Charts, Copyright (c) 2014, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
 *
 * If you have questions about your rights to use or distribute this
 * software, please contact Berkeley Lab's Technology Transfer
 * Department at TTD@lbl.gov.
 *
 * NOTICE.  This software is owned by the U.S. Department of Energy.
 * As such, the U.S. Government has been granted for itself and others
 * acting on its behalf a paid-up, nonexclusive, irrevocable,
 * worldwide license in the Software to reproduce, prepare derivative
 * works, and perform publicly and display publicly.  Beginning five
 * (5) years after the date permission to assert copyright is obtained
 * from the U.S. Department of Energy, and subject to any subsequent
 * five (5) year renewals, the U.S. Government is granted for itself
 * and others acting on its behalf a paid-up, nonexclusive,
 * irrevocable, worldwide license in the Software to reproduce,
 * prepare derivative works, distribute copies to the public, perform
 * publicly and display publicly, and to permit others to do so.
 *
 * This code is distributed under a BSD style license, see the LICENSE
 * file for complete information.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _reactAddons = require("react/addons");

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

require("./eventchart.css");

/**
 * Renders an event view that shows the supplied set of
 * events along a time axis.
 */

exports["default"] = _reactAddons2["default"].createClass({

    displayName: "EventChart",

    render: function render() {
        var scale = this.props.timeScale;
        // Create and array of markers, one for each event
        var markers = [];
        markers = _underscore2["default"].map(this.props.events, function (event) {
            var posx = scale(new Date(event.time));
            var transform = "translate(" + posx + ",0)";
            return _reactAddons2["default"].createElement(
                "g",
                { transform: transform },
                _reactAddons2["default"].createElement("rect", { className: "eventchart-marker",
                    x: 0, y: 0,
                    width: 2, height: 30 }),
                _reactAddons2["default"].createElement(
                    "text",
                    { className: "eventchart-marker-label",
                        x: 4, y: 10 },
                    event.label
                )
            );
        });

        return _reactAddons2["default"].createElement(
            "g",
            null,
            markers
        );
    }
});
module.exports = exports["default"];