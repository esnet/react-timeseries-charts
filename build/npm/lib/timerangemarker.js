/*
 * ESnet React Charts, Copyright (c) 2015, The Regents of the University of
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

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _esnetPond = require("@esnet/pond");

/**
 * Renders a band with extents defined by the supplied TimeRange.
 */
exports["default"] = _reactAddons2["default"].createClass({

    displayName: "TimeRangeMarker",

    propTypes: {
        timerange: _reactAddons2["default"].PropTypes.instanceOf(_esnetPond.TimeRange).isRequired,
        style: _reactAddons2["default"].PropTypes.object },

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
        var yScale = this.props.yScale;

        //Viewport bounds
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
            return _reactAddons2["default"].createElement("rect", { x: beginPos, y: 0, width: width, height: this.props.height,
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