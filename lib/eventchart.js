/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactAddons = require("react/addons");

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

require("./eventchart.css");

/**
 * Renders an event view that shows the supplied set of
 * events along a time axis.
 *
 * EXPERIMENTAL
 *
 * TODO: Convert to use Pond Events
 */
exports["default"] = _reactAddons2["default"].createClass({

    displayName: "EventChart",

    render: function render() {
        var scale = this.props.timeScale;
        // Create and array of markers, one for each event
        var markers = _underscore2["default"].map(this.props.events, function (event) {
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