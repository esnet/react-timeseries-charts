"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Styler = undefined;

var _extends =
    Object.assign ||
    function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();
/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

exports.default = styler;

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _colorbrewer = require("colorbrewer");

var _colorbrewer2 = _interopRequireDefault(_colorbrewer);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * For our Style we want to represent two things:
 *
 *   1. The overall style of an AreaChart should be consistent across a site
 *   2. The specific style of a columnName (e.g. "pressure") should be consistent
 *
 * The overall style is implemented with methods specific to
 * each chart type or entity:
 *
 *   - lineChartStyle()
 *   - areaChartStyle()
 *   - legendStyle()
 *   - etc
 *
 * These will render out an object that can be passed into the
 * charts themselves and will control the visual appearance,
 * keyed by columnName. This abstracts away the SVG details of the
 * underlying DOM elements.
 *
 * For the specific style we define here three out of the box parameters
 * by which one column can be different from another when rendered:
 *   - color
 *   - width (of a line)
 *   - dashed or not
 *
 */
var Styler = (exports.Styler = (function() {
    /**
     * The columns define the style associated with a particular
     * quantity, such as "inTraffic" or "temperature". The columns
     * are an array, with each element being either a string, or
     * and object defining the style.
     *
     *  * Using a string makes the assumption that you want to use a
     * color scheme, so you need to define that if you don't want the
     * default. A color will be then assigned to each column based
     * on the scheme. The string is the column name.
     *
     *  * In the second case of providing an object, you define properties
     * of the style yourself. Each object should contain a "key" property
     * which is the column name and optionally the `width` and `dashed`
     * property. If you don't supply the color, then the color
     * will come from the scheme.
     *
     */
    function Styler(columns) {
        var _this = this;

        var scheme = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Paired";

        _classCallCheck(this, Styler);

        this.columnStyles = {};
        if (_underscore2.default.isArray(columns)) {
            columns.forEach(function(column) {
                if (_underscore2.default.isString(column)) {
                    _this.columnStyles[column] = { key: column };
                } else if (_underscore2.default.isObject(column)) {
                    var key = column.key,
                        style = _objectWithoutProperties(column, ["key"]);

                    _this.columnStyles[key] = style;
                }
            });
        }
        this.columnNames = _underscore2.default.map(columns, function(c) {
            var cc = _underscore2.default.isString(c) ? c : c.key;
            return cc;
        });

        if (scheme && !_underscore2.default.has(_colorbrewer2.default, scheme)) {
            throw new Error("Unknown scheme '" + scheme + "' supplied to Style constructor");
        }
        this.colorScheme = scheme;
    }

    _createClass(Styler, [
        {
            key: "numColumns",
            value: function numColumns() {
                return this.columnNames.length;
            }

            /**
             * Returns the color scheme with the appropiate number of colors.
             * If there are more columns than the largest set in the scheme then
             * just the largest scheme set will be returned.
             * If there are less columns than the smallest set in the scheme then
             * just the smallest scheme will be returned.
             * @param  {number} columnCount The number of columns to apply the scheme to
             * @return {array}              An array with the scheme colors in it.
             */
        },
        {
            key: "colorLookup",
            value: function colorLookup(columnCount) {
                var colorSchemeKeys = _underscore2.default.keys(
                    _colorbrewer2.default[this.colorScheme]
                );
                var minSchemeSize = _underscore2.default.min(colorSchemeKeys);
                var maxSchemeSize = _underscore2.default.max(colorSchemeKeys);
                var colorLookupSize = columnCount > maxSchemeSize ? maxSchemeSize : columnCount;
                colorLookupSize = _underscore2.default.max([colorLookupSize, minSchemeSize]);
                return this.colorScheme
                    ? _colorbrewer2.default[this.colorScheme][colorLookupSize]
                    : [];
            }

            /**
             */
        },
        {
            key: "legendStyle",
            value: function legendStyle(column, type) {
                var numColumns = this.numColumns();
                var colorLookup = this.colorLookup(numColumns);
                var i = _underscore2.default.indexOf(this.columnNames, column);
                var columnName = this.columnNames[i];
                var _columnStyles$columnN = this.columnStyles[columnName],
                    color = _columnStyles$columnN.color,
                    _columnStyles$columnN2 = _columnStyles$columnN.width,
                    width = _columnStyles$columnN2 === undefined ? 1 : _columnStyles$columnN2,
                    _columnStyles$columnN3 = _columnStyles$columnN.dashed,
                    dashed = _columnStyles$columnN3 === undefined ? false : _columnStyles$columnN3;

                var c = color || colorLookup[i % colorLookup.length];

                var styleSymbol = {};
                if (type === "swatch" || type === "dot") {
                    styleSymbol = {
                        fill: c,
                        opacity: 0.9,
                        stroke: c,
                        cursor: "pointer"
                    };
                } else if (type === "line") {
                    styleSymbol = {
                        opacity: 0.9,
                        stroke: c,
                        strokeWidth: width,
                        cursor: "pointer"
                    };
                    if (dashed) {
                        styleSymbol.strokeDasharray = "4,2";
                    }
                }

                var labelStyle = {
                    fontSize: "normal",
                    color: "#333",
                    paddingRight: 10,
                    cursor: "pointer"
                };
                var valueStyle = {
                    fontSize: "smaller",
                    color: "#999",
                    cursor: "pointer"
                };
                var legendStyle = {
                    symbol: {
                        normal: _extends({}, styleSymbol, { opacity: 0.7 }),
                        highlighted: _extends({}, styleSymbol, { opacity: 0.8 }),
                        selected: _extends({}, styleSymbol, { opacity: 0.8 }),
                        muted: _extends({}, styleSymbol, { opacity: 0.2 })
                    },
                    label: {
                        normal: _extends({}, labelStyle, { opacity: 0.7 }),
                        highlighted: _extends({}, labelStyle, { opacity: 0.8 }),
                        selected: _extends({}, labelStyle, { opacity: 0.8 }),
                        muted: _extends({}, labelStyle, { opacity: 0.5 })
                    },
                    value: {
                        normal: _extends({}, valueStyle, { opacity: 0.7 }),
                        highlighted: _extends({}, valueStyle, { opacity: 0.8 }),
                        selected: _extends({}, valueStyle, { opacity: 0.8 }),
                        muted: _extends({}, valueStyle, { opacity: 0.5 })
                    }
                };
                return legendStyle;
            }
        },
        {
            key: "areaChartStyle",
            value: function areaChartStyle() {
                var style = {};

                var numColumns = this.numColumns();
                var colorLookup = this.colorLookup(numColumns);

                var i = 0;
                _underscore2.default.forEach(this.columnStyles, function(_ref, column) {
                    var color = _ref.color,
                        selected = _ref.selected,
                        _ref$width = _ref.width,
                        width = _ref$width === undefined ? 1 : _ref$width,
                        _ref$dashed = _ref.dashed,
                        dashed = _ref$dashed === undefined ? false : _ref$dashed;

                    var c = color || colorLookup[i % colorLookup.length];
                    var styleLine = {
                        stroke: c,
                        fill: "none",
                        strokeWidth: width
                    };
                    var styleSelectedLine = {
                        stroke: selected || color,
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
                    var styleSelectedArea = {
                        fill: selected || color,
                        stroke: "none"
                    };
                    style[column] = {
                        line: {
                            normal: _extends({}, styleLine, { opacity: 0.9 }),
                            highlighted: _extends({}, styleLine, { opacity: 1.0 }),
                            selected: _extends({}, styleSelectedLine, { opacity: 1.0 }),
                            muted: _extends({}, styleLine, { opacity: 0.4 })
                        },
                        area: {
                            normal: _extends({}, styleArea, { opacity: 0.7 }),
                            highlighted: _extends({}, styleArea, { opacity: 0.8 }),
                            selected: _extends({}, styleSelectedArea, { opacity: 0.8 }),
                            muted: _extends({}, styleArea, { opacity: 0.2 })
                        }
                    };
                    i += 1;
                });
                return style;
            }
        },
        {
            key: "lineChartStyle",
            value: function lineChartStyle() {
                var _this2 = this;

                var numColumns = this.numColumns();
                var colorLookup = this.colorLookup(numColumns);
                var style = {};
                _underscore2.default.forEach(this.columnStyles, function(_ref2, column) {
                    var color = _ref2.color,
                        selected = _ref2.selected,
                        _ref2$width = _ref2.width,
                        width = _ref2$width === undefined ? 1 : _ref2$width,
                        _ref2$dashed = _ref2.dashed,
                        dashed = _ref2$dashed === undefined ? false : _ref2$dashed;

                    var i = _underscore2.default.indexOf(_this2.columnNames, column);
                    var c = color || colorLookup[i % colorLookup.length];
                    var styleLine = {
                        stroke: c,
                        strokeWidth: width,
                        fill: "none"
                    };
                    var styleSelectedLine = {
                        stroke: selected || c,
                        strokeWidth: width,
                        fill: "none"
                    };

                    if (dashed) {
                        styleLine.strokeDasharray = "4,2";
                    }
                    style[column] = {
                        normal: _extends({}, styleLine, { opacity: 0.8, strokeWidth: width }),
                        highlighted: _extends({}, styleLine, { opacity: 1.0, strokeWidth: width }),
                        selected: _extends({}, styleSelectedLine, {
                            opacity: 1.0,
                            strokeWidth: width
                        }),
                        muted: _extends({}, styleLine, { opacity: 0.2, strokeWidth: width })
                    };
                });
                return style;
            }
        },
        {
            key: "barChartStyle",
            value: function barChartStyle() {
                var _this3 = this;

                var numColumns = this.numColumns();
                var colorLookup = this.colorLookup(numColumns);
                var style = {};
                _underscore2.default.forEach(this.columnStyles, function(_ref3, column) {
                    var color = _ref3.color,
                        selected = _ref3.selected;

                    var i = _underscore2.default.indexOf(_this3.columnNames, column);
                    var c = color || colorLookup[i % colorLookup.length];
                    var fillStyle = {
                        fill: c
                    };
                    var selectedStyle = {
                        fill: selected || c
                    };
                    style[column] = {
                        normal: _extends({}, fillStyle, { opacity: 0.8 }),
                        highlighted: _extends({}, fillStyle, { opacity: 1.0 }),
                        selected: _extends({}, selectedStyle, { opacity: 1.0 }),
                        muted: _extends({}, fillStyle, { opacity: 0.2 })
                    };
                });
                return style;
            }
        },
        {
            key: "scatterChartStyle",
            value: function scatterChartStyle() {
                var _this4 = this;

                var numColumns = this.numColumns();
                var colorLookup = this.colorLookup(numColumns);
                var style = {};
                _underscore2.default.forEach(this.columnStyles, function(_ref4, column) {
                    var color = _ref4.color,
                        selected = _ref4.selected;

                    var i = _underscore2.default.indexOf(_this4.columnNames, column);
                    var c = color || colorLookup[i % colorLookup.length];
                    var fillStyle = {
                        fill: c
                    };
                    var selectedStyle = {
                        fill: selected || c
                    };
                    style[column] = {
                        normal: _extends({}, fillStyle, { opacity: 0.8 }),
                        highlighted: _extends({}, fillStyle, { opacity: 1.0 }),
                        selected: _extends({}, selectedStyle, { opacity: 1.0 }),
                        muted: _extends({}, fillStyle, { opacity: 0.2 })
                    };
                });
                return style;
            }
        },
        {
            key: "axisStyle",
            value: function axisStyle(column) {
                var numColumns = this.numColumns();
                var colorLookup = this.colorLookup(numColumns);
                var i = _underscore2.default.indexOf(this.columnNames, column);
                var columnName = this.columnNames[i];
                var color = this.columnStyles[columnName].color;

                var c = color || colorLookup[i % colorLookup.length];
                return {
                    label: {
                        fill: c
                    }
                };
            }
        },
        {
            key: "boxChartStyle",
            value: function boxChartStyle() {
                var style = {};

                var numColumns = this.numColumns();
                var colorLookup = this.colorLookup(numColumns);

                var i = 0;
                _underscore2.default.forEach(this.columnStyles, function(_ref5, column) {
                    var color = _ref5.color,
                        selected = _ref5.selected;

                    var c = color || colorLookup[i % colorLookup.length];
                    var styleArea = {
                        fill: c,
                        stroke: "none"
                    };
                    var styleSelectedArea = {
                        fill: selected || color,
                        stroke: "none"
                    };
                    style[column] = [
                        {
                            normal: _extends({}, styleArea, { opacity: 0.2 }),
                            highlighted: _extends({}, styleArea, { opacity: 0.3 }),
                            selected: _extends({}, styleSelectedArea, { opacity: 0.3 }),
                            muted: _extends({}, styleArea, { opacity: 0.1 })
                        },
                        {
                            normal: _extends({}, styleArea, { opacity: 0.5 }),
                            highlighted: _extends({}, styleArea, { opacity: 0.6 }),
                            selected: _extends({}, styleSelectedArea, { opacity: 0.6 }),
                            muted: _extends({}, styleArea, { opacity: 0.2 })
                        },
                        {
                            normal: _extends({}, styleArea, { opacity: 0.9 }),
                            highlighted: _extends({}, styleArea, { opacity: 1.0 }),
                            selected: _extends({}, styleSelectedArea, { opacity: 1.0 }),
                            muted: _extends({}, styleArea, { opacity: 0.2 })
                        }
                    ];
                    i += 1;
                });
                return style;
            }
        }
    ]);

    return Styler;
})());

function styler(columns, scheme) {
    return new Styler(columns, scheme);
}
