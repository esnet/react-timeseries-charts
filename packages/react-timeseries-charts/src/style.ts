/**
 *  Copyright (c) 2018, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import { Event, Key } from "pondjs";

// Default colors
const primaryColor = "steelblue";
const highlightColor = "#5a98cb";
const selectedColor = primaryColor;
const mutedColor = "grey";

// Default opacity
const areaOpacity = 0.75;
const mutedLineOpacity = 0.4;
const mutedAreaOpacity = 0.2;

export type StyleMode = "normal" | "selected" | "highlighted" | "muted";

/**
 * A single element which can be interactive with may be in 4 different modes:
 *  * normal
 *  * highlighted
 *  * selected
 *  * muted
 *
 * Its style for those modes are provided using this style object. Each
 * mode defines `CSSProperties` appropiate for the underlying svg elements
 * being rendered.
 */
export type ElementStyle = {
    normal: React.CSSProperties;
    highlighted: React.CSSProperties;
    selected: React.CSSProperties;
    muted: React.CSSProperties;
    [mode: string]: React.CSSProperties;
};

//
// --------------------------------------------------------------------------------------------------------------
// LineChart
// --------------------------------------------------------------------------------------------------------------
//

/**
 * A single channel of a `LineChart` maps the single property "line" to
 * the `ElementStyle` for the rendered line.
 *
 * Example:
 * ```
 * {
 *     line: {
 *         normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
 *         highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
 *         selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
 *         muted: { stroke: "steelblue", fill: "none", opacity: 0.5, strokeWidth: 1 }
 *     }
 * }
 * ```
 */
export type LineChartChannelStyle = {
    line: ElementStyle;
    [elem: string]: ElementStyle;
};

/**
 * The style of a `LineChart` is a mapping of `channel` name (corresponding
 * to the column of a `TimeSeries`) to the `LineChartChannelStyle`.
 *
 * Example:
 * ```
 * {
 *     temperature: {
 *         line: {
 *             normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
 *             highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
 *             selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
 *             muted: { stroke: "steelblue", fill: "none", opacity: 0.5, strokeWidth: 1 }
 *         }
 *     }
 * }
 * ```
 */
export type LineChartStyle = { [channel: string]: LineChartChannelStyle };

export const defaultLineChartChannelStyle = {
    line: {
        normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
        selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
        muted: { stroke: "steelblue", fill: "none", opacity: mutedLineOpacity, strokeWidth: 1 }
    }
};

//
// --------------------------------------------------------------------------------------------------------------
// AreaChart
// --------------------------------------------------------------------------------------------------------------
//

/**
 * A single channel of a `AreaChart` maps the properties "area" and "line" to
 * the `ElementStyle` for the rendered area and outline respectively.
 *
 * Example:
 * ```
 * {
 *     line: {
 *         normal: { stroke: primaryColor, fill: "none", strokeWidth: 1 },
 *         highlighted: { stroke: highlightColor, fill: "none", strokeWidth: 1 },
 *         selected: { stroke: selectedColor, fill: "none", strokeWidth: 1 },
 *         muted: { stroke: primaryColor, fill: "none", opacity: mutedLineOpacity, strokeWidth: 1 }
 *     },
 *     area: {
 *         normal: { fill: primaryColor, stroke: "none", opacity: areaOpacity },
 *         highlighted: { fill: highlightColor, stroke: "none", opacity: areaOpacity },
 *         selected: { fill: selectedColor, stroke: "none", opacity: areaOpacity },
 *         muted: { fill: primaryColor, stroke: "none", opacity: mutedAreaOpacity },
 *     }
 * }
 * ```
 */
export type AreaChartChannelStyle = {
    line: ElementStyle;
    area: ElementStyle;
};

/**
 * The style of a `AreaChart` is a mapping of `channel` name (corresponding
 * to the column of a `TimeSeries`) to the `AreaChartChannelStyle`.
 *
 * Example:
 * ```
 * {
 *     temperature: {
 *         line: {
 *             normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
 *             highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
 *             selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
 *             muted: { stroke: "steelblue", fill: "none", opacity: 0.5, strokeWidth: 1 }
 *         }
 *     }
 * }
 * ```
 */
export type AreaChartStyle = { [channel: string]: AreaChartChannelStyle };

export const defaultAreaChartStyle: AreaChartChannelStyle = {
    line: {
        normal: { stroke: primaryColor, fill: "none", strokeWidth: 1 },
        highlighted: { stroke: highlightColor, fill: "none", strokeWidth: 1 },
        selected: { stroke: selectedColor, fill: "none", strokeWidth: 1 },
        muted: { stroke: primaryColor, fill: "none", opacity: mutedLineOpacity, strokeWidth: 1 }
    },
    area: {
        normal: { fill: primaryColor, stroke: "none", opacity: areaOpacity },
        highlighted: { fill: highlightColor, stroke: "none", opacity: areaOpacity },
        selected: { fill: selectedColor, stroke: "none", opacity: areaOpacity },
        muted: { fill: primaryColor, stroke: "none", opacity: mutedAreaOpacity }
    }
};

//
// --------------------------------------------------------------------------------------------------------------
// BarChart
// --------------------------------------------------------------------------------------------------------------
//

export interface BarChartChannelStyle {
    bar: ElementStyle;
    [key: string]: ElementStyle;
}

/**
 * The style of a `BarChart` is a mapping of `channel` name (corresponding
 * to the column of a `TimeSeries`) to the `BarChartChannelStyle`.
 *
 * Example:
 * ```
 * {
 *     temperature: {
 *         bar: {
 *             normal: { fill: "steelblue", opacity: 0.8 },
 *             highlighted: { fill: "#5a98cb", opacity: 1.0 },
 *             selected: { fill: "orange", opacity: 1.0 },
 *             muted: { fill: "steelblue", opacity: 0.4 }
 *         }
 *     }
 * }
 * ```
 */
export type BarChartStyle = { [channel: string]: BarChartChannelStyle };

export const defaultBarChartChannelStyle: BarChartChannelStyle = {
    bar: {
        normal: { fill: primaryColor, opacity: 0.8 },
        highlighted: { fill: highlightColor, opacity: 1.0 },
        selected: { fill: selectedColor, opacity: 1.0 },
        muted: { fill: primaryColor, opacity: 0.4 }
    }
};

//
// --------------------------------------------------------------------------------------------------------------
// BoxChart
// --------------------------------------------------------------------------------------------------------------
//

export type LevelStyle = {
    normal: React.CSSProperties;
    highlighted: React.CSSProperties;
    selected: React.CSSProperties;
    muted: React.CSSProperties;
};

export type BoxChartChannelStyle = LevelStyle[];
export type BoxChartStyle = { [channel: string]: BoxChartChannelStyle };

const defaultBoxFillStyle = {
    fill: primaryColor,
    stroke: "none"
};
const defaultMutedBoxFillStyle = {
    fill: mutedColor,
    stroke: "none"
};
export const defaultBoxChartStyle: BoxChartChannelStyle = [
    {
        normal: { ...defaultBoxFillStyle, opacity: 0.2 },
        highlighted: { ...defaultBoxFillStyle, opacity: 0.3 },
        selected: { ...defaultBoxFillStyle, opacity: 0.3 },
        muted: { ...defaultMutedBoxFillStyle, opacity: 0.1 }
    },
    {
        normal: { ...defaultBoxFillStyle, opacity: 0.5 },
        highlighted: { ...defaultBoxFillStyle, opacity: 0.6 },
        selected: { ...defaultBoxFillStyle, opacity: 0.6 },
        muted: { ...defaultMutedBoxFillStyle, opacity: 0.2 }
    },
    {
        normal: { ...defaultBoxFillStyle, opacity: 0.9 },
        highlighted: { ...defaultBoxFillStyle, opacity: 1.0 },
        selected: { ...defaultBoxFillStyle, opacity: 1.0 },
        muted: { ...defaultMutedBoxFillStyle, opacity: 0.2 }
    }
];

//
// --------------------------------------------------------------------------------------------------------------
// ScatterChart
// --------------------------------------------------------------------------------------------------------------
//

/**
 * A single channel of a `ScatterChart` maps the single property "point" to
 * the `ElementStyle` for the rendered dot.
 *
 * Example:
 * ```
 * {
 *     point: {
 *         normal: { fill: "steelblue" },
 *         highlighted: { fill: "lightsteelblue" },
 *         selected: { fill: "yellow" },
 *         muted: { fill: "steelblue", pacity: 0.5 }
 *     }
 * }
 * ```
 */
export type ScatterChartChannelStyle = {
    point: ElementStyle;
    [elem: string]: ElementStyle;
};

/**
 * The style of a `ScatterChart` is a mapping of `channel` name (corresponding
 * to the column of a `TimeSeries`) to the `ScatterChartChannelStyle`.
 *
 * Example:
 * ```
 * {
 *     temperature: {
 *         point: {
 *             normal: { fill: "steelblue" },
 *             highlighted: { fill: "#5a98cb" },
 *             selected: { fill: "steelblue" },
 *             muted: { fill: "steelblue" }
 *         }
 *     }
 * }
 * ```
 */
export type ScatterChartStyle = { [channel: string]: ScatterChartChannelStyle };

export const defaultScatterChartChannelStyle = {
    point: {
        normal: { fill: "steelblue", opacity: 0.8 },
        highlighted: { fill: "steelblue", opacity: 1.0 },
        selected: { fill: "steelblue", opacity: 1.0 },
        muted: { fill: "steelblue", opacity: 0.4 }
    }
};

//
// EventChart
//

export type EventChartStyle = (event: Event<Key>, mode: string) => React.CSSProperties;

//
// Baseline
//

export type BaselineStyle = {
    label: React.CSSProperties;
    line: React.CSSProperties;
};

export const baselineDefaultStyle = {
    label: {
        fill: "#8B7E7E",
        fontSize: 11,
        pointerEvents: "none" as "none"
    },
    line: {
        stroke: "#626262",
        strokeWidth: 1,
        strokeDasharray: "5,3",
        pointerEvents: "none" as "none"
    }
};

//
// InfoBox
//

export type InfoBoxStyle = {
    text: React.CSSProperties;
    box: React.CSSProperties;
};

export const defaultInfoBoxStyle: InfoBoxStyle = {
    box: {
        fill: "#FEFEFE",
        stroke: "#DDD",
        opacity: 0.8,
        pointerEvents: "none"
    },
    text: {
        fontSize: 11,
        fill: "#bdbdbd",
        pointerEvents: "none"
    }
};

//
// EventMarker contains a stem, marker and infobox
//

export type EventMarkerStyle = InfoBoxStyle & {
    stem: React.CSSProperties;
    marker: React.CSSProperties;
};

export const defaultEventMarkerStyle: EventMarkerStyle = {
    stem: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    },
    marker: {
        fill: "#999"
    },
    ...defaultInfoBoxStyle
};

//
// TimeMarker
//

export type TimeMarkerStyle = InfoBoxStyle & {
    line: React.CSSProperties;
};

export const defaultTimeMarkerStyle: TimeMarkerStyle = {
    line: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    },
    ...defaultInfoBoxStyle
};

//
// Legend
//

export type CategoryStyle = {
    symbol: ElementStyle;
    label: ElementStyle;
    value: ElementStyle;
    [elem: string]: ElementStyle;
};

export type LegendStyle = { [key: string]: CategoryStyle };

export const defaultLegendCategoryStyle: CategoryStyle = {
    symbol: {
        normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
        selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
        muted: { stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1 }
    },
    label: {
        normal: { fontSize: "normal", color: "#333" },
        highlighted: { fontSize: "normal", color: "#222" },
        selected: { fontSize: "normal", color: "#333" },
        muted: { fontSize: "normal", color: "#333", opacity: 0.4 }
    },
    value: {
        normal: { fontSize: "normal", color: "#333" },
        highlighted: { fontSize: "normal", color: "#222" },
        selected: { fontSize: "normal", color: "#333" },
        muted: { fontSize: "normal", color: "#333", opacity: 0.4 }
    }
};
