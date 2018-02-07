var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var primaryColor = "steelblue";
var highlightColor = "#5a98cb";
var selectedColor = primaryColor;
var mutedColor = "grey";
var areaOpacity = 0.75;
var mutedLineOpacity = 0.4;
var mutedAreaOpacity = 0.2;
export var defaultLineChartChannelStyle = {
    line: {
        normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
        selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
        muted: { stroke: "steelblue", fill: "none", opacity: mutedLineOpacity, strokeWidth: 1 }
    }
};
export var defaultAreaChartStyle = {
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
export var defaultBarChartChannelStyle = {
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
export var defaultBoxChartStyle = [
    {
        normal: __assign({}, defaultBoxFillStyle, { opacity: 0.2 }),
        highlighted: __assign({}, defaultBoxFillStyle, { opacity: 0.3 }),
        selected: __assign({}, defaultBoxFillStyle, { opacity: 0.3 }),
        muted: __assign({}, defaultMutedBoxFillStyle, { opacity: 0.1 })
    },
    {
        normal: __assign({}, defaultBoxFillStyle, { opacity: 0.5 }),
        highlighted: __assign({}, defaultBoxFillStyle, { opacity: 0.6 }),
        selected: __assign({}, defaultBoxFillStyle, { opacity: 0.6 }),
        muted: __assign({}, defaultMutedBoxFillStyle, { opacity: 0.2 })
    },
    {
        normal: __assign({}, defaultBoxFillStyle, { opacity: 0.9 }),
        highlighted: __assign({}, defaultBoxFillStyle, { opacity: 1.0 }),
        selected: __assign({}, defaultBoxFillStyle, { opacity: 1.0 }),
        muted: __assign({}, defaultMutedBoxFillStyle, { opacity: 0.2 })
    }
];
export var defaultScatterChartChannelStyle = {
    point: {
        normal: { fill: "steelblue", opacity: 0.8 },
        highlighted: { fill: "steelblue", opacity: 1.0 },
        selected: { fill: "steelblue", opacity: 1.0 },
        muted: { fill: "steelblue", opacity: 0.4 }
    }
};
export var baselineDefaultStyle = {
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
export var defaultInfoBoxStyle = {
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
export var defaultEventMarkerStyle = __assign({ stem: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    }, marker: {
        fill: "#999"
    } }, defaultInfoBoxStyle);
export var defaultTimeMarkerStyle = __assign({ line: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    } }, defaultInfoBoxStyle);
export var defaultLegendCategoryStyle = {
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
//# sourceMappingURL=style.js.map