"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var primaryColor = "steelblue";
var highlightColor = "#5a98cb";
var selectedColor = primaryColor;
var mutedColor = "grey";
var areaOpacity = 0.75;
var mutedLineOpacity = 0.4;
var mutedAreaOpacity = 0.2;
exports.defaultLineChartChannelStyle = {
    line: {
        normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
        selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
        muted: { stroke: "steelblue", fill: "none", opacity: mutedLineOpacity, strokeWidth: 1 }
    }
};
exports.defaultAreaChartStyle = {
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
exports.defaultBarChartChannelStyle = {
    bar: {
        normal: { fill: primaryColor, opacity: 0.8 },
        highlighted: { fill: highlightColor, opacity: 1.0 },
        selected: { fill: selectedColor, opacity: 1.0 },
        muted: { fill: primaryColor, opacity: 0.4 }
    }
};
var defaultBoxFillStyle = {
    fill: primaryColor,
    stroke: "none"
};
var defaultMutedBoxFillStyle = {
    fill: mutedColor,
    stroke: "none"
};
exports.defaultBoxChartStyle = [
    {
        normal: tslib_1.__assign({}, defaultBoxFillStyle, { opacity: 0.2 }),
        highlighted: tslib_1.__assign({}, defaultBoxFillStyle, { opacity: 0.3 }),
        selected: tslib_1.__assign({}, defaultBoxFillStyle, { opacity: 0.3 }),
        muted: tslib_1.__assign({}, defaultMutedBoxFillStyle, { opacity: 0.1 })
    },
    {
        normal: tslib_1.__assign({}, defaultBoxFillStyle, { opacity: 0.5 }),
        highlighted: tslib_1.__assign({}, defaultBoxFillStyle, { opacity: 0.6 }),
        selected: tslib_1.__assign({}, defaultBoxFillStyle, { opacity: 0.6 }),
        muted: tslib_1.__assign({}, defaultMutedBoxFillStyle, { opacity: 0.2 })
    },
    {
        normal: tslib_1.__assign({}, defaultBoxFillStyle, { opacity: 0.9 }),
        highlighted: tslib_1.__assign({}, defaultBoxFillStyle, { opacity: 1.0 }),
        selected: tslib_1.__assign({}, defaultBoxFillStyle, { opacity: 1.0 }),
        muted: tslib_1.__assign({}, defaultMutedBoxFillStyle, { opacity: 0.2 })
    }
];
exports.defaultScatterChartChannelStyle = {
    point: {
        normal: { fill: "steelblue", opacity: 0.8 },
        highlighted: { fill: "steelblue", opacity: 1.0 },
        selected: { fill: "steelblue", opacity: 1.0 },
        muted: { fill: "steelblue", opacity: 0.4 }
    }
};
exports.defaultBaselineStyle = {
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
exports.defaultInfoBoxStyle = {
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
exports.defaultEventMarkerStyle = tslib_1.__assign({ stem: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    }, marker: {
        fill: "#999"
    } }, exports.defaultInfoBoxStyle);
exports.defaultTimeMarkerStyle = tslib_1.__assign({ line: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    } }, exports.defaultInfoBoxStyle);
exports.defaultLegendCategoryStyle = {
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
exports.defaultTimeAxisStyle = {
    values: {
        stroke: "none",
        fill: "#8B7E7E",
        fontWeight: 100,
        fontSize: 11,
        font: '"Goudy Bookletter 1911", sans-serif"'
    },
    ticks: {
        fill: "none",
        stroke: "#C0C0C0"
    },
    axis: {
        stroke: "#AAA",
        strokeWidth: 1
    },
    label: {
        fill: "grey",
        stroke: "none",
        pointerEvents: "none"
    }
};
//# sourceMappingURL=style.js.map