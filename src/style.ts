/**
 *  Copyright (c) 2020, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

//
// TimeAxis styling
//

export type TimeAxisChannelStyle = {
    values: React.CSSProperties;
    ticks: React.CSSProperties;
    axis: React.CSSProperties;
    label: React.CSSProperties;
};

export type TimeAxisStyle = { [channel: string]: TimeAxisChannelStyle };

export const defaultTimeAxisStyle: TimeAxisChannelStyle = {
    values: {
        stroke: "none",
        fill: "#8B7E7E", // Default value color
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
