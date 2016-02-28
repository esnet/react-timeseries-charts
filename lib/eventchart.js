"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("./eventchart.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders an event view that shows the supplied set of
 * events along a time axis.
 *
 * EXPERIMENTAL
 *
 * TODO: Convert to use Pond Events
 */
/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

exports.default = _react2.default.createClass({

    displayName: "EventChart",

    render: function render() {
        var series = this.props.series;
        var scale = this.props.timeScale;
        var eventMarkers = [];

        console.log("Render event chart", series);

        // Create and array of markers, one for each event
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = series.events()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var event = _step.value;

                console.log(" - event", event.toString());
                var begin = event.begin();
                var end = event.end();
                var beginPos = scale(begin);
                var endPos = scale(end);
                var transform = "translate(" + beginPos + ",0)";
                eventMarkers.push(_react2.default.createElement(
                    "g",
                    { transform: transform },
                    _react2.default.createElement("rect", { className: "eventchart-marker",
                        x: 0, y: 0,
                        width: endPos - beginPos, height: 30 }),
                    _react2.default.createElement(
                        "text",
                        { className: "eventchart-marker-label",
                            x: endPos + 4, y: 10 },
                        event.label
                    )
                ));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return _react2.default.createElement(
            "g",
            null,
            eventMarkers
        );
    }
});