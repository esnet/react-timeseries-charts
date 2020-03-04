import { ScaleLinear, ScaleLogarithmic, ScalePower } from "d3-scale";

/**
 *  Copyright (c) 2020, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/**
 * A list of mappings from string label to either a number or string (or undefined)
 */
export type LabelValueList = {
    label?: string;
    value?: number | string;
}[];

/**
 * Enum to define where to show a grid on top (Over) or underneath (Under) the ChartContainer
 */
export enum ShowGridPosition {
    Over = "OVER",
    Under = "UNDER"
}

/**
 * A scale passed to an axis can be a Log scale, Power scale or Linear scale
 */
export type Scale =
    | ScaleLogarithmic<number, number>
    | ScaleLinear<number, number>
    | ScalePower<number, number>;

/**
 * Emum for the scale types
 */
export enum ScaleType {
    Linear = "LINEAR",
    Power = "POWER",
    Log = "LOG"
}

export type ScaleFunction = (v: number) => number;

/**
 * Map from a string key to a function that remaps one value to another value
 */
export type ScalarMap = { [id: string]: (v: number) => number };

/**
 * Map from a string key to a ReactElement
 */
export type ElementMap = { [id: string]: React.ReactElement<any> };
