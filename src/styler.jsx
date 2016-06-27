/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

class Styler {
    constructor(color, width = 1, dashed = false) {
        this._color = color;
        this._width = width;
        this._dashed = dashed;
    }

    areaChartStyle() {
        const styleLine = {
            stroke: this._color,
            fill: "none",
            strokeWidth: this._width
        };
        if (this._dashed) {
            styleLine.strokeDasharray = "4,2";
        }
        const styleArea = {
            fill: this._color,
            stroke: "none"
        };
        return {
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
    }

    lineChartStyle() {
        const styleLine = {
            stroke: this._color,
            fill: "none",
            strokeWidth: this._width
        };
        if (this._dashed) {
            styleLine.strokeDasharray = "4,2";
        }
        return {
            normal: {...styleLine, opacity: 0.8, strokeWidth: this._width},
            highlighted: {...styleLine, opacity: 1.0, strokeWidth: this._width},
            selected: {...styleLine, opacity: 1.0, strokeWidth: this._width + 1},
            muted: {...styleLine, opacity: 0.4, strokeWidth: this._width}
        };
    }
}

export default function styler(color) {
    return new Styler(color);
}
