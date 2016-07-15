"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  Copyright (c) 2016, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

exports.default = style;

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _colorbrewer = require("colorbrewer");

var _colorbrewer2 = _interopRequireDefault(_colorbrewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * For our Style we want to represent two things:
 *
 *   1. The overall style of a AreaChart should be consistent
 *   2. The specific style of a columnName (e.g. "pressure")
 *      should be consistent
 *
 * The overall style is implemented with methods specific to
 * each chart type or entity:
 *   - lineChartStyle()
 *   - areaChartStyle()
 *   - legendStyle()
 *   - etc
 *
 * These will render out an object that can be passed into the
 * charts themselves and will control the visual appearance,
 * keyed by columnName.
 *
 * For the specific style we define here three parameters by
 * which one column can be different from another when rendered:
 *   - color
 *   - width (of a line)
 *   - dashed or not
 *
 * This is passed into the Styler's constructor as a map
 * from columnName -> {color, width, dashed}.
 */

var Style = function () {
    function Style() {
        _classCallCheck(this, Style);

        this._columnStyles = {};
        this._color = null;
    }

    /**
     * The columns define the style associated with a particular
     * quantity, such as "inTraffic" or "temperature". The columns
     * are an array, with each element being either a string, or
     * and object defining the style. In the first case, the assumption
     * is that you want to use a color scheme, so you should call
     * usingColorScheme() to define that. A color will be then assigned
     * to each column based on the scheme. In the second case, you
     * define properties of the style yourself. If you don't supply
     * the color, then color will come from the scheme. If you
     * supply a color, that color will be used instead.
     *
     */


    _createClass(Style, [{
        key: "columns",
        value: function columns(columnStyles) {
            var _this = this;

            this._columnStyles = {};
            if (_underscore2.default.isArray(columnStyles)) {
                columnStyles.forEach(function (column) {
                    if (_underscore2.default.isString(column)) {
                        _this._columnStyles[column] = {};
                    } else if (_underscore2.default.isObject(column)) {
                        _this._columnStyles[column.key] = column;
                    }
                });
            }
            return this;
        }
    }, {
        key: "usingColorScheme",
        value: function usingColorScheme(color) {
            this._color = color;
            return this;
        }

        /**
         */

    }, {
        key: "legendStyle",
        value: function legendStyle(column, type) {

            console.log("legendStyle", column, type);

            var numColumns = _underscore2.default.keys(this._columnStyles).length;
            var maxColorLookupSize = _underscore2.default.max(_underscore2.default.keys(_colorbrewer2.default[this._color]));
            var colorLookupSize = numColumns > maxColorLookupSize ? maxColorLookupSize : numColumns;
            var colorLookup = this._color ? _colorbrewer2.default[this._color][colorLookupSize] : [];
            //const c = color ? color : colorLookup[i % colorLookup.length];

            if (type === "swatch") {
                return {
                    fill: colorsList[i],
                    opacity: 0.9,
                    stroke: colorsList[i]
                };
            }
        }
    }, {
        key: "areaChartStyle",
        value: function areaChartStyle() {
            var style = {};

            var numColumns = _underscore2.default.keys(this._columnStyles).length;
            var maxColorLookupSize = _underscore2.default.max(_underscore2.default.keys(_colorbrewer2.default[this._color]));
            var colorLookupSize = numColumns > maxColorLookupSize ? maxColorLookupSize : numColumns;
            var colorLookup = this._color ? _colorbrewer2.default[this._color][colorLookupSize] : [];

            var i = 0;
            _underscore2.default.forEach(this._columnStyles, function (_ref, column) {
                var color = _ref.color;
                var _ref$width = _ref.width;
                var width = _ref$width === undefined ? 1 : _ref$width;
                var _ref$dashed = _ref.dashed;
                var dashed = _ref$dashed === undefined ? false : _ref$dashed;

                var c = color ? color : colorLookup[i % colorLookup.length];
                var styleLine = {
                    stroke: c,
                    fill: "none",
                    strokeWidth: width
                };
                if (dashed) {
                    styleLine.strokeDasharray = "4,2";
                }
                var styleArea = {
                    fill: c,
                    stroke: "none"
                };
                style[column] = {
                    line: {
                        normal: _extends({}, styleLine, { opacity: 0.9 }),
                        highlighted: _extends({}, styleLine, { opacity: 1.0 }),
                        selected: _extends({}, styleLine, { opacity: 1.0 }),
                        muted: _extends({}, styleLine, { opacity: 0.4 })
                    },
                    area: {
                        normal: _extends({}, styleArea, { opacity: 0.7 }),
                        highlighted: _extends({}, styleArea, { opacity: 0.8 }),
                        selected: _extends({}, styleArea, { opacity: 0.8 }),
                        muted: _extends({}, styleArea, { opacity: 0.2 })
                    }
                };
                i++;
            });
            return style;
        }
    }, {
        key: "lineChartStyle",
        value: function lineChartStyle() {
            var style = {};
            _underscore2.default.forEach(this._columnStyles, function (_ref2, column) {
                var color = _ref2.color;
                var _ref2$width = _ref2.width;
                var width = _ref2$width === undefined ? 1 : _ref2$width;
                var _ref2$dashed = _ref2.dashed;
                var dashed = _ref2$dashed === undefined ? false : _ref2$dashed;

                var styleLine = {
                    stroke: color,
                    strokeWidth: width,
                    fill: "none"
                };
                if (dashed) {
                    styleLine.strokeDasharray = "4,2";
                }
                style[column] = {
                    normal: _extends({}, styleLine, { opacity: 0.8, strokeWidth: width }),
                    highlighted: _extends({}, styleLine, { opacity: 1.0, strokeWidth: width }),
                    selected: _extends({}, styleLine, { opacity: 1.0, strokeWidth: width + 1 }),
                    muted: _extends({}, styleLine, { opacity: 0.4, strokeWidth: width })
                };
            });
            return style;
        }
    }]);

    return Style;
}();

function style(styleMap) {
    return new Style(styleMap);
}