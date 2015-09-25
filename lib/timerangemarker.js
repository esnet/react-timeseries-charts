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

var _esnetPond = require("@esnet/pond");

/**
 * Renders a band with extents defined by the supplied TimeRange.
 */
exports["default"] = _reactAddons2["default"].createClass({

    displayName: "TimeRangeMarker",

    propTypes: {
        timerange: _reactAddons2["default"].PropTypes.instanceOf(_esnetPond.TimeRange).isRequired,
        style: _reactAddons2["default"].PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
        return {
            spacing: 1,
            offset: 0,
            style: { fill: "rgba(70, 130, 180, 0.25);" }
        };
    },

    renderBand: function renderBand() {
        var timerange = this.props.timerange;
        var timeScale = this.props.timeScale;

        // Viewport bounds
        var viewBeginTime = timeScale.invert(0);
        var viewEndTime = timeScale.invert(this.props.width);
        var viewport = new _esnetPond.TimeRange(viewBeginTime, viewEndTime);

        var cursor = this.props.isPanning ? "-webkit-grabbing" : "default";

        var bandStyle = undefined;
        if (this.props.style) {
            bandStyle = this.props.style;
        } else {
            bandStyle = { fill: "steelblue" };
        }

        bandStyle.cursor = cursor;

        if (!viewport.disjoint(timerange)) {
            var range = timerange.intersection(viewport);
            var begin = range.begin();
            var end = range.end();
            var beginPos = timeScale(begin);
            var endPos = timeScale(end);
            var width = endPos - beginPos;
            if (width < 1) {
                width = 1;
            }
            return _reactAddons2["default"].createElement("rect", { x: beginPos, y: 0,
                width: width, height: this.props.height,
                style: bandStyle,
                clipPath: this.props.clipPathURL });
        }
    },

    render: function render() {
        return _reactAddons2["default"].createElement(
            "g",
            null,
            this.renderBand()
        );
    }
});
module.exports = exports["default"];