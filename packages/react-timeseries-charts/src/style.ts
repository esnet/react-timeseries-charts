/**
 *  Copyright (c) 2018, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import { Event, Key } from "pondjs"

// Default colors
const primaryColor = "steelblue";
const highlightColor = "#5a98cb";
const selectedColor = primaryColor;
const mutedColor = "grey";

// Default opacity
const areaOpacity = 0.75;
const mutedLineOpacity = 0.4;
const mutedAreaOpacity = 0.2;

/**
 * A single channel of data which can be rendered as:
 *  * normal
 *  * highlighted
 *  * selected
 *  * muted
 * has its style for those modes provided using this style object. Each
 * mode defines CSSProperties appropiate for the underlying svg elements
 * being rendered. For example in a LineChart you might set the normal style
 * to be "stroke": "grey" and the select style to "stroke": "yellow" while
 * in an area chart you might use "fill" instead.
 */
export type ChannelStyle = {
    normal: React.CSSProperties;
    highlighted: React.CSSProperties;
    selected: React.CSSProperties;
    muted: React.CSSProperties;
}

export type StyledChannels = { [channel: string]: ChannelStyle }


/**
 * The style of a `LineChart` is a mapping of `channel` name (corresponding
 * to the column of a `TimeSeries`) to the `ChannelStyle`.
 */
export type LineChartStyle = StyledChannels;

export const defaultLineChartStyle = {
    normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
    highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
    selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
    muted: { stroke: "steelblue", fill: "none", opacity: mutedLineOpacity, strokeWidth: 1 }
};

export type AreaChartStyle = {
    line: ChannelStyle;
    area: ChannelStyle;
}
export const defaultAreaChartStyle: AreaChartStyle = {
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
        muted: { fill: primaryColor, stroke: "none", opacity: mutedAreaOpacity },
    }
};

//
// BarChart
//

export type BarChartStyle = StyledChannels;
export const defaultBarChartStyle: ChannelStyle = {
    normal: { fill: primaryColor, opacity: 0.8 },
    highlighted: { fill: highlightColor, opacity: 1.0 },
    selected: { fill: selectedColor, opacity: 1.0 },
    muted: { fill: primaryColor, opacity: 0.4 }
};
export type LevelStyle = {
    normal: React.CSSProperties;
    highlighted: React.CSSProperties;
    selected: React.CSSProperties;
    muted: React.CSSProperties;
}
export type BoxChartChannelStyle = LevelStyle[];
export type BoxChartStyle = { [channel: string]: BoxChartChannelStyle }

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
        muted: { ...defaultMutedBoxFillStyle, opacity: 0.1 },
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
// ScatterChart
//
export type ScatterChartStyle = StyledChannels;

export const defaultScatterChartStyle: ChannelStyle = {
    normal: { fill: "steelblue", opacity: 0.8 },
    highlighted: { fill: "steelblue", opacity: 1.0 },
    selected: { fill: "steelblue", opacity: 1.0 },
    muted: { fill: "steelblue", opacity: 0.4 }
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
}

export const baselineDefaultStyle = {
    label: {
        fill: "#8B7E7E",
        fontSize: 11,
        pointerEvents: "none"
    },
    line: {
        stroke: "#626262",
        strokeWidth: 1,
        strokeDasharray: "5,3",
        pointerEvents: "none"
    }
};

//
// InfoBox is rendered by ValueList and Label
//

export type InfoBoxStyle = {
    text: React.CSSProperties;
    box: React.CSSProperties;
}

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
}

//
// EventMarker contains a stem, marker and infobox
//

export type EventMarkerStyle = InfoBoxStyle & {
    stem: React.CSSProperties;
    marker: React.CSSProperties;
}

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
}

//
// TimeMarker (info styles)
//

export type TimeMarkerStyle = InfoBoxStyle & {
    line: React.CSSProperties;
}

export const defaultTimeMarkerStyle = {
    line: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    },
    ...defaultInfoBoxStyle
}

//
// Legend
//

export type CategoryStyle = {
    symbol: ChannelStyle;
    label: ChannelStyle;
    value: ChannelStyle;
}

export type LegendStyle = { [key: string]: CategoryStyle }

export const defaultLegendStyle: CategoryStyle = {
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