"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("lodash");
var LegendItem_1 = require("./LegendItem");
var Styler = (function () {
    function Styler(columns, scheme) {
        if (scheme === void 0) { scheme = "Paired"; }
        var _this = this;
        console.log("this is ", this, columns, scheme);
        this.columnStyles = {};
        if (_.isArray(columns)) {
            columns.forEach(function (column) {
                if (_.isString(column)) {
                    var c = column;
                    _this.columnStyles[c] = { key: c };
                }
                else if (_.isObject(column)) {
                    var c = column;
                    var key = c.key, style = tslib_1.__rest(c, ["key"]);
                    _this.columnStyles[key] = style;
                }
            });
        }
        this.columnNames = columns.map(function (c) {
            var cc = _.isString(c) ? c : c.key;
            return cc;
        });
    }
    Styler.prototype.numColumns = function () {
        return this.columnNames.length;
    };
    Styler.prototype.colorLookup = function (columnCount) {
        return [];
    };
    Styler.prototype.legendStyle = function (column, type) {
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var i = _.indexOf(this.columnNames, column);
        var columnName = this.columnNames[i];
        var _a = this.columnStyles[columnName], color = _a.color, _b = _a.width, width = _b === void 0 ? 1 : _b, _c = _a.dashed, dashed = _c === void 0 ? false : _c;
        var c = color || colorLookup[i % colorLookup.length];
        var styleSymbol = {};
        if (type.toUpperCase() === LegendItem_1.LegendItemType.Swatch || type === LegendItem_1.LegendItemType.Dot) {
            styleSymbol = {
                fill: c,
                opacity: 0.9,
                stroke: c,
                cursor: "pointer"
            };
        }
        else if (type.toUpperCase() === LegendItem_1.LegendItemType.Line) {
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
                normal: tslib_1.__assign({}, styleSymbol, { opacity: 0.7 }),
                highlighted: tslib_1.__assign({}, styleSymbol, { opacity: 0.8 }),
                selected: tslib_1.__assign({}, styleSymbol, { opacity: 0.8 }),
                muted: tslib_1.__assign({}, styleSymbol, { opacity: 0.2 })
            },
            label: {
                normal: tslib_1.__assign({}, labelStyle, { opacity: 0.7 }),
                highlighted: tslib_1.__assign({}, labelStyle, { opacity: 0.8 }),
                selected: tslib_1.__assign({}, labelStyle, { opacity: 0.8 }),
                muted: tslib_1.__assign({}, labelStyle, { opacity: 0.5 })
            },
            value: {
                normal: tslib_1.__assign({}, valueStyle, { opacity: 0.7 }),
                highlighted: tslib_1.__assign({}, valueStyle, { opacity: 0.8 }),
                selected: tslib_1.__assign({}, valueStyle, { opacity: 0.8 }),
                muted: tslib_1.__assign({}, valueStyle, { opacity: 0.5 })
            }
        };
        return legendStyle;
    };
    Styler.prototype.areaChartStyle = function () {
        var style = {};
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var i = 0;
        _.forEach(this.columnStyles, function (_a, column) {
            var color = _a.color, selected = _a.selected, _b = _a.width, width = _b === void 0 ? 1 : _b, _c = _a.dashed, dashed = _c === void 0 ? false : _c;
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
                    normal: tslib_1.__assign({}, styleLine, { opacity: 0.9 }),
                    highlighted: tslib_1.__assign({}, styleLine, { opacity: 1.0 }),
                    selected: tslib_1.__assign({}, styleSelectedLine, { opacity: 1.0 }),
                    muted: tslib_1.__assign({}, styleLine, { opacity: 0.4 })
                },
                area: {
                    normal: tslib_1.__assign({}, styleArea, { opacity: 0.7 }),
                    highlighted: tslib_1.__assign({}, styleArea, { opacity: 0.8 }),
                    selected: tslib_1.__assign({}, styleSelectedArea, { opacity: 0.8 }),
                    muted: tslib_1.__assign({}, styleArea, { opacity: 0.2 })
                }
            };
            i += 1;
        });
        return style;
    };
    Styler.prototype.lineChartStyle = function () {
        var _this = this;
        var style = {};
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        _.forEach(this.columnStyles, function (_a, column) {
            var color = _a.color, selected = _a.selected, _b = _a.width, width = _b === void 0 ? 1 : _b, _c = _a.dashed, dashed = _c === void 0 ? false : _c;
            var i = _.indexOf(_this.columnNames, column);
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
                line: {
                    normal: tslib_1.__assign({}, styleLine, { opacity: 0.8, strokeWidth: width }),
                    highlighted: tslib_1.__assign({}, styleLine, { opacity: 1.0, strokeWidth: width }),
                    selected: tslib_1.__assign({}, styleSelectedLine, { opacity: 1.0, strokeWidth: width }),
                    muted: tslib_1.__assign({}, styleLine, { opacity: 0.2, strokeWidth: width })
                }
            };
        });
        return style;
    };
    Styler.prototype.barChartStyle = function () {
        var _this = this;
        var style = {};
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        _.forEach(this.columnStyles, function (s, column) {
            var color = s.color, selected = s.selected;
            var i = _.indexOf(_this.columnNames, column);
            var c = color || colorLookup[i % colorLookup.length];
            var fillStyle = {
                fill: c
            };
            var selectedStyle = {
                fill: selected || c
            };
            style[column] = {
                bar: {
                    normal: tslib_1.__assign({}, fillStyle, { opacity: 0.8 }),
                    highlighted: tslib_1.__assign({}, fillStyle, { opacity: 1.0 }),
                    selected: tslib_1.__assign({}, selectedStyle, { opacity: 1.0 }),
                    muted: tslib_1.__assign({}, fillStyle, { opacity: 0.2 })
                }
            };
        });
        return style;
    };
    Styler.prototype.scatterChartStyle = function () {
        var _this = this;
        var style = {};
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        _.forEach(this.columnStyles, function (_a, column) {
            var color = _a.color, selected = _a.selected;
            var i = _.indexOf(_this.columnNames, column);
            var c = color || colorLookup[i % colorLookup.length];
            var fillStyle = {
                fill: c
            };
            var selectedStyle = {
                fill: selected || c
            };
            style[column] = {
                point: {
                    normal: tslib_1.__assign({}, fillStyle, { opacity: 0.8 }),
                    highlighted: tslib_1.__assign({}, fillStyle, { opacity: 1.0 }),
                    selected: tslib_1.__assign({}, selectedStyle, { opacity: 1.0 }),
                    muted: tslib_1.__assign({}, fillStyle, { opacity: 0.2 })
                }
            };
        });
        return style;
    };
    Styler.prototype.axisStyle = function (column) {
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var i = _.indexOf(this.columnNames, column);
        var columnName = this.columnNames[i];
        var color = this.columnStyles[columnName].color;
        var c = color || colorLookup[i % colorLookup.length];
        return {
            fill: c
        };
    };
    Styler.prototype.boxChartStyle = function () {
        var style = {};
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var i = 0;
        _.forEach(this.columnStyles, function (_a, column) {
            var color = _a.color, selected = _a.selected;
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
                    normal: tslib_1.__assign({}, styleArea, { opacity: 0.2 }),
                    highlighted: tslib_1.__assign({}, styleArea, { opacity: 0.3 }),
                    selected: tslib_1.__assign({}, styleSelectedArea, { opacity: 0.3 }),
                    muted: tslib_1.__assign({}, styleArea, { opacity: 0.1 })
                },
                {
                    normal: tslib_1.__assign({}, styleArea, { opacity: 0.5 }),
                    highlighted: tslib_1.__assign({}, styleArea, { opacity: 0.6 }),
                    selected: tslib_1.__assign({}, styleSelectedArea, { opacity: 0.6 }),
                    muted: tslib_1.__assign({}, styleArea, { opacity: 0.2 })
                },
                {
                    normal: tslib_1.__assign({}, styleArea, { opacity: 0.9 }),
                    highlighted: tslib_1.__assign({}, styleArea, { opacity: 1.0 }),
                    selected: tslib_1.__assign({}, styleSelectedArea, { opacity: 1.0 }),
                    muted: tslib_1.__assign({}, styleArea, { opacity: 0.2 })
                }
            ];
            i += 1;
        });
        return style;
    };
    return Styler;
}());
exports.Styler = Styler;
function styler(columns, scheme) {
    return new Styler(columns, scheme);
}
exports.default = styler;
//# sourceMappingURL=styler.js.map