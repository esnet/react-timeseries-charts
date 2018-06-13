/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import * as chroma from "chroma-js";
import * as colorbrewer from "colorbrewer";

import { LegendItemType } from "./LegendItem";
import {
    AreaChartStyle,
    BarChartStyle,
    CategoryStyle,
    ScatterChartStyle,
    BoxChartStyle,
    BandChartStyle,
    LineChartStyle
} from "./style";

export type KeyedStyle = {
    key: string;
};

export type StylerStyle = {
    key: string;
    style?: StylerStyle;
    color?: string;
    selected?: string;
    width?: number;
    dashed?: boolean;
};

export type Column = string | KeyedStyle;

/**
 * For our Style we want to represent two things:
 *
 *   1. The overall style of an AreaChart should be consistent across a site
 *   2. The specific style of a columnName (e.g. "pressure") should be consistent
 *
 * The overall style is implemented with methods specific to
 * each chart type or entity:
 *
 *   - `lineChartStyle()`
 *   - `areaChartStyle()`
 *   - `legendStyle()`
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
export class Styler {
    colorScheme: string;
    columnNames: any[];
    columnStyles: { [columnName: string]: StylerStyle };

    /**
     * The `column`s define the style associated with a particular
     * quantity, such as "inTraffic" or "temperature". The columns
     * are an array, with each element being either a `string`, or
     * and `object` defining the style.
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
    constructor(columns: Column[], scheme = "Paired") {
        this.columnStyles = {};
        if (_.isArray(columns)) {
            columns.forEach(column => {
                if (_.isString(column)) {
                    const c = column as string;
                    this.columnStyles[c] = { key: c };
                } else if (_.isObject(column)) {
                    const c = column as KeyedStyle;
                    const { key, ...style } = c;
                    this.columnStyles[key] = style as StylerStyle;
                }
            });
        }
        this.columnNames = columns.map(c => {
            const cc = _.isString(c) ? c : c.key;
            return cc;
        });

        if (scheme && !_.has(colorbrewer, scheme)) {
           throw new Error(`Unknown scheme '${scheme}' supplied to Style constructor`);
        }
        this.colorScheme = scheme;
    }

    numColumns() {
        return this.columnNames.length;
    }

    /**
     * Returns the color scheme with the appropiate number of colors.
     * If there are more columns than the largest set in the scheme then
     * just the largest scheme set will be returned.
     * If there are less columns than the smallest set in the scheme then
     * just the smallest scheme will be returned.
     */
    colorLookup(columnCount: number): string[] {
        const colorSchemeKeys = _.keys(colorbrewer[this.colorScheme]);
        const minSchemeSize = Number(_.min(colorSchemeKeys));
        const maxSchemeSize = Number(_.max(colorSchemeKeys));
        let colorLookupSize = columnCount > maxSchemeSize ? maxSchemeSize : columnCount;
        colorLookupSize = _.max([colorLookupSize, minSchemeSize]);
        return this.colorScheme ? colorbrewer[this.colorScheme][colorLookupSize] : [];
    }

    /**
     *
     */
    legendStyle(column: string, type: LegendItemType): CategoryStyle {
        const numColumns = this.numColumns();
        const colorLookup = this.colorLookup(numColumns);
        const i = _.indexOf(this.columnNames, column);
        const columnName = this.columnNames[i];
        const { color, width = 1, dashed = false } = this.columnStyles[columnName];
        const c = color || colorLookup[i % colorLookup.length];

        let styleSymbol: React.CSSProperties = {};
        if (type.toUpperCase() === LegendItemType.Swatch || type.toUpperCase() === LegendItemType.Dot) {
            styleSymbol = {
                fill: c,
                opacity: 0.9,
                stroke: c,
                cursor: "pointer"
            };
        } else if (type.toUpperCase() === LegendItemType.Line) {
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

        const labelStyle: React.CSSProperties = {
            fontSize: "normal",
            color: "#333",
            paddingRight: 10,
            cursor: "pointer"
        };
        const valueStyle: React.CSSProperties = {
            fontSize: "smaller",
            color: "#999",
            cursor: "pointer"
        };
        const legendStyle: CategoryStyle = {
            symbol: {
                normal: { ...styleSymbol, opacity: 0.7 },
                highlighted: { ...styleSymbol, opacity: 0.8 },
                selected: { ...styleSymbol, opacity: 0.8 },
                muted: { ...styleSymbol, opacity: 0.2 }
            },
            label: {
                normal: { ...labelStyle, opacity: 0.7 },
                highlighted: { ...labelStyle, opacity: 0.8 },
                selected: { ...labelStyle, opacity: 0.8 },
                muted: { ...labelStyle, opacity: 0.5 }
            },
            value: {
                normal: { ...valueStyle, opacity: 0.7 },
                highlighted: { ...valueStyle, opacity: 0.8 },
                selected: { ...valueStyle, opacity: 0.8 },
                muted: { ...valueStyle, opacity: 0.5 }
            }
        };
        return legendStyle;
    }

    areaChartStyle(): AreaChartStyle {
        const style: AreaChartStyle = {};

        const numColumns = this.numColumns();
        const colorLookup = this.colorLookup(numColumns);

        let i = 0;
        _.forEach(this.columnStyles, ({ color, selected, width = 1, dashed = false }, column) => {
            const c = color || colorLookup[i % colorLookup.length];
            const styleLine: React.CSSProperties = {
                stroke: c,
                fill: "none",
                strokeWidth: width
            };
            const styleSelectedLine: React.CSSProperties = {
                stroke: selected || color,
                fill: "none",
                strokeWidth: width
            };
            if (dashed) {
                styleLine.strokeDasharray = "4,2";
            }
            const styleArea: React.CSSProperties = {
                fill: c,
                stroke: "none"
            };
            const styleSelectedArea: React.CSSProperties = {
                fill: selected || color,
                stroke: "none"
            };
            style[column] = {
                line: {
                    normal: { ...styleLine, opacity: 0.9 },
                    highlighted: { ...styleLine, opacity: 1.0 },
                    selected: { ...styleSelectedLine, opacity: 1.0 },
                    muted: { ...styleLine, opacity: 0.4 }
                },
                area: {
                    normal: { ...styleArea, opacity: 0.7 },
                    highlighted: { ...styleArea, opacity: 0.8 },
                    selected: { ...styleSelectedArea, opacity: 0.8 },
                    muted: { ...styleArea, opacity: 0.2 }
                }
            };
            i += 1;
        });
        return style;
    }

    lineChartStyle(): LineChartStyle {
        const style: LineChartStyle = {};

        const numColumns = this.numColumns();
        const colorLookup = this.colorLookup(numColumns);

        _.forEach(this.columnStyles, ({ color, selected, width = 1, dashed = false }, column) => {
            const i = _.indexOf(this.columnNames, column);
            const c = color || colorLookup[i % colorLookup.length];
            const styleLine: React.CSSProperties = {
                stroke: c,
                strokeWidth: width,
                fill: "none"
            };
            const styleSelectedLine: React.CSSProperties = {
                stroke: selected || c,
                strokeWidth: width,
                fill: "none"
            };

            if (dashed) {
                styleLine.strokeDasharray = "4,2";
            }
            style[column] = {
                line: {
                    normal: { ...styleLine, opacity: 0.8, strokeWidth: width },
                    highlighted: { ...styleLine, opacity: 1.0, strokeWidth: width },
                    selected: { ...styleSelectedLine, opacity: 1.0, strokeWidth: width },
                    muted: { ...styleLine, opacity: 0.2, strokeWidth: width }
                }
            };
        });
        return style;
    }

    barChartStyle(): BarChartStyle {
        const style: BarChartStyle = {};

        const numColumns = this.numColumns();
        const colorLookup = this.colorLookup(numColumns);

        _.forEach(this.columnStyles, (s: StylerStyle, column: string) => {
            const { color, selected } = s;
            const i = _.indexOf(this.columnNames, column);
            const c = color || colorLookup[i % colorLookup.length];
            const fillStyle: React.CSSProperties = {
                fill: c
            };
            const selectedStyle: React.CSSProperties = {
                fill: selected || c
            };
            style[column] = {
                bar: {
                    normal: { ...fillStyle, opacity: 0.8 },
                    highlighted: { ...fillStyle, opacity: 1.0 },
                    selected: { ...selectedStyle, opacity: 1.0 },
                    muted: { ...fillStyle, opacity: 0.2 }
                }
            };
        });
        return style;
    }

    scatterChartStyle(): ScatterChartStyle {
        const style: ScatterChartStyle = {};

        const numColumns = this.numColumns();
        const colorLookup = this.colorLookup(numColumns);

        _.forEach(this.columnStyles, ({ color, selected }, column) => {
            const i = _.indexOf(this.columnNames, column);
            const c = color || colorLookup[i % colorLookup.length];
            const fillStyle: React.CSSProperties = {
                fill: c
            };
            const selectedStyle: React.CSSProperties = {
                fill: selected || c
            };
            style[column] = {
                point: {
                    normal: { ...fillStyle, opacity: 0.8 },
                    highlighted: { ...fillStyle, opacity: 1.0 },
                    selected: { ...selectedStyle, opacity: 1.0 },
                    muted: { ...fillStyle, opacity: 0.2 }
                }
            };
        });
        return style;
    }

    axisStyle(column: string) {
        const numColumns = this.numColumns();
        const colorLookup = this.colorLookup(numColumns);
        const i = _.indexOf(this.columnNames, column);
        const columnName = this.columnNames[i];
        const { color } = this.columnStyles[columnName];
        const c = color || colorLookup[i % colorLookup.length];
        return {
            fill: c
        };
    }

    boxChartStyle(): BoxChartStyle {
        const style: BoxChartStyle = {};

        const numColumns = this.numColumns();
        const colorLookup = this.colorLookup(numColumns);

        let i = 0;
        _.forEach(this.columnStyles, ({ color, selected }, column) => {
            const c = color || colorLookup[i % colorLookup.length];
            const styleArea: React.CSSProperties = {
                fill: c,
                stroke: "none"
            };
            const styleSelectedArea: React.CSSProperties = {
                fill: selected || color,
                stroke: "none"
            };
            style[column] = [
                {
                    normal: { ...styleArea, opacity: 0.2 },
                    highlighted: { ...styleArea, opacity: 0.3 },
                    selected: { ...styleSelectedArea, opacity: 0.3 },
                    muted: { ...styleArea, opacity: 0.1 }
                },
                {
                    normal: { ...styleArea, opacity: 0.5 },
                    highlighted: { ...styleArea, opacity: 0.6 },
                    selected: { ...styleSelectedArea, opacity: 0.6 },
                    muted: { ...styleArea, opacity: 0.2 }
                },
                {
                    normal: { ...styleArea, opacity: 0.9 },
                    highlighted: { ...styleArea, opacity: 1.0 },
                    selected: { ...styleSelectedArea, opacity: 1.0 },
                    muted: { ...styleArea, opacity: 0.2 }
                }
            ];
            i += 1;
        });
        return style;
    }

    bandChartStyle(): BandChartStyle {
        const style: BandChartStyle = {};

        const numColumns = this.numColumns();
        const colorLookup = this.colorLookup(numColumns);

        let i = 0;
        _.forEach(this.columnStyles, ({ color, selected }, column) => {
            const c = color || colorLookup[i % colorLookup.length];
            const styleArea: React.CSSProperties = {
                fill: c,
                stroke: "none"
            };
            const styleSelectedArea: React.CSSProperties = {
                fill: selected || color,
                stroke: "none"
            };
            style[column] = [
                {
                    normal: { ...styleArea, opacity: 0.2 },
                    highlighted: { ...styleArea, opacity: 0.3 },
                    selected: { ...styleSelectedArea, opacity: 0.3 },
                    muted: { ...styleArea, opacity: 0.1 }
                },
                {
                    normal: { ...styleArea, opacity: 0.5 },
                    highlighted: { ...styleArea, opacity: 0.6 },
                    selected: { ...styleSelectedArea, opacity: 0.6 },
                    muted: { ...styleArea, opacity: 0.2 }
                },
                {
                    normal: { ...styleArea, opacity: 0.9 },
                    highlighted: { ...styleArea, opacity: 1.0 },
                    selected: { ...styleSelectedArea, opacity: 1.0 },
                    muted: { ...styleArea, opacity: 0.2 }
                }
            ];
            i += 1;
        });
        return style;
    }
}

export function styler(columns: Column[], scheme?: string) {
    return new Styler(columns, scheme);
}
