/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import "@types/d3-shape";

import {
    curveBasisClosed,
    curveBasisOpen,
    curveBasis,
    curveBundle,
    curveCardinalClosed,
    curveCardinalOpen,
    curveCardinal,
    curveCatmullRomClosed,
    curveCatmullRomOpen,
    curveCatmullRom,
    curveLinearClosed,
    curveLinear,
    curveMonotoneX,
    curveMonotoneY,
    curveNatural,
    curveStep,
    curveStepAfter,
    curveStepBefore,
    CurveFactory,
    CurveGeneratorLineOnly,
    CurveBundleFactory
} from "d3-shape";

//type Curve = CurveFactory | CurveGeneratorLineOnly | CurveBundleFactory;

export type CurveLookup = { [name: string]: any };

const curves: CurveLookup = {
    curveBasisClosed,
    curveBasisOpen,
    curveBasis,
    curveBundle,
    curveCardinalClosed,
    curveCardinalOpen,
    curveCardinal,
    curveCatmullRomClosed,
    curveCatmullRomOpen,
    curveCatmullRom,
    curveLinearClosed,
    curveLinear,
    curveMonotoneX,
    curveMonotoneY,
    curveNatural,
    curveStep,
    curveStepAfter,
    curveStepBefore
};

export default curves;
