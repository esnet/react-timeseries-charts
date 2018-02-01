/**
 *  Copyright (c) 2018, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

export type LabelValueList = {
    label?: string,
    value?: number | string
}[];

export type LineData = {
    x: Date,
    y: number
}

export interface AreaChartColumns {
    up: string[];
    down: string[];
}

export enum CurveInterpolation {
    curveBasis = "curveBasis",
    curveBasisOpen = "curveBasisOpen",
    curveBundle = "curveBundle",
    curveCardinal = "curveCardinal",
    curveCardinalOpen = "curveCardinalOpen",
    curveCatmullRom = "curveCatmullRom",
    curveCatmullRomOpen = "curveCatmullRomOpen",
    curveLinear = "curveLinear",
    curveMonotoneX = "curveMonotoneX",
    curveMonotoneY = "curveMonotoneY",
    curveNatural = "curveNatural",
    curveRadial = "curveRadial",
    curveStep = "curveStep",
    curveStepAfter = "curveStepAfter",
    curveStepBefore = "curveStepBefore"
}
