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

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _pond = require("pond");

require("./barchart.css");

var DAY = 1000 * 60 * 60 * 24;
var HOUR = 1000 * 60 * 60;

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

/**
 * Renders a barchart. This BarChart implementation is a little different
 * in that it will render onto a time axis, rather than rendering to
 * specific values. As a result, an Aug 2014 bar will render between the
 * Aug 2014 tick mark and the Sept 2014 tickmark.
 */
exports["default"] = _reactAddons2["default"].createClass({
    displayName: "barchart",

    propTypes: {
        series: _reactAddons2["default"].PropTypes.instanceOf(_pond.TimeSeries),
        /**
         * The width of each bar is the width determined by the time range - spacing x 2
         */
        spacing: _reactAddons2["default"].PropTypes.number,

        /**
         * The position of the bar is then offset by this value.
         */
        offset: _reactAddons2["default"].PropTypes.number,

        /**
         * Which columns to display stacked on top of each other. If you don't supply
         * a columns prop then all columns will be stacked.
         */
        columns: _reactAddons2["default"].PropTypes.array,

        /**
         * The style of each column e.g. {"traffic": {fill: "#FF0"}}
         */
        style: _reactAddons2["default"].PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
        return {
            spacing: 1,
            offset: 0,
            style: { "value": { fill: "#619F3A" } }
        };
    },

    renderBars: function renderBars() {
        var spacing = Number(this.props.spacing);
        var offset = Number(this.props.offset);
        var series = this.props.series;
        var timeScale = this.props.timeScale;
        var yScale = this.props.yScale;
        var columns = this.props.columns || series._columns;

        var rects = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = series.events()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                event = _step.value;

                var begin = event.begin();
                var end = event.end();

                var beginPos = timeScale(begin) + spacing;
                var endPos = timeScale(end) - spacing;

                var width = undefined;
                if (this.props.size) {
                    width = this.props.size;
                } else {
                    width = endPos - beginPos;
                }

                var x = undefined;
                if (this.props.size) {
                    var center = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;
                    x = center - this.props.size / 2 + offset;
                } else {
                    x = timeScale(begin) + spacing + offset;
                }

                var ypos = yScale(0);
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var column = _step2.value;

                        var value = event.get(column);
                        var height = yScale(0) - yScale(value);
                        var y = ypos - height;
                        var barStyle = this.props.style[column] ? this.props.style[column] : { fill: "steelblue" };

                        rects.push(_reactAddons2["default"].createElement("rect", { x: x, y: y, width: width, height: height, style: barStyle }));

                        ypos -= height;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                            _iterator2["return"]();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return rects;
    },

    //TODO: props.attr should be required
    render: function render() {
        return _reactAddons2["default"].createElement(
            "g",
            null,
            this.renderBars()
        );
    }
});
module.exports = exports["default"];