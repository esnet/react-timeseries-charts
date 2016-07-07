/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import colorbrewer from "colorbrewer";

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
class Style {

    constructor() {
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
    columns(columnStyles) {
        this._columnStyles = {};
        if (_.isArray(columnStyles)) {
            columnStyles.forEach(column => {
                if (_.isString(column)) {
                    this._columnStyles[column] = {};
                } else if (_.isObject(column)) {
                    this._columnStyles[column.key] = column;
                }
            });
        }
        return this;
    }

    usingColorScheme(color) {
        this._color = color;
        return this;
    }

    /**
     */
    legendStyle(column, type) {

        console.log("legendStyle", column, type);

        const numColumns = _.keys(this._columnStyles).length;
        const maxColorLookupSize = _.max(_.keys(colorbrewer[this._color]));
        const colorLookupSize = numColumns > maxColorLookupSize ? maxColorLookupSize : numColumns;
        const colorLookup = this._color ? colorbrewer[this._color][colorLookupSize] : [];
        //const c = color ? color : colorLookup[i % colorLookup.length];

        if (type === "swatch") {
            return {
                fill: colorsList[i],
                opacity: 0.9,
                stroke: colorsList[i]
            }
        }
    }

    areaChartStyle() {
        const style = {};

        const numColumns = _.keys(this._columnStyles).length;
        const maxColorLookupSize = _.max(_.keys(colorbrewer[this._color]));
        const colorLookupSize = numColumns > maxColorLookupSize ? maxColorLookupSize : numColumns;
        const colorLookup = this._color ? colorbrewer[this._color][colorLookupSize] : [];

        let i = 0;
        _.forEach(this._columnStyles,
            ({color, width = 1, dashed = false} , column) => {
                const c = color ? color : colorLookup[i % colorLookup.length];
                const styleLine = {
                    stroke: c,
                    fill: "none",
                    strokeWidth: width
                };
                if (dashed) {
                    styleLine.strokeDasharray = "4,2";
                }
                const styleArea = {
                    fill: c,
                    stroke: "none"
                };
                style[column] = {
                    line: {
                        normal: {...styleLine, opacity: 0.9},
                        highlighted: {...styleLine, opacity: 1.0},
                        selected: {...styleLine, opacity: 1.0},
                        muted: {...styleLine, opacity: 0.4}
                    },
                    area: {
                        normal: {...styleArea, opacity: 0.7},
                        highlighted: {...styleArea, opacity: 0.8},
                        selected: {...styleArea, opacity: 0.8},
                        muted: {...styleArea, opacity: 0.2}
                    }
                };
                i++;
            });
        return style;
    }

    lineChartStyle() {
        const style = {};
        _.forEach(this._columnStyles,
            ({color, width = 1, dashed = false} , column) => {
                const styleLine = {
                    stroke: color,
                    strokeWidth: width,
                    fill: "none"
                };
                if (dashed) {
                    styleLine.strokeDasharray = "4,2";
                }
                style[column] = {
                    normal: {...styleLine, opacity: 0.8, strokeWidth: width},
                    highlighted: {...styleLine, opacity: 1.0, strokeWidth: width},
                    selected: {...styleLine, opacity: 1.0, strokeWidth: width + 1},
                    muted: {...styleLine, opacity: 0.4, strokeWidth: width}
                };
            });
        return style;
    }
}

export default function style(styleMap) {
    return new Style(styleMap);
}
