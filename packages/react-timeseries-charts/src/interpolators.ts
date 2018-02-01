/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import { Scale } from "./Charts";

export type ScalerFunction = (number) => number;
export type AnimationCallback = (ScalerFunction) => any;

export default class ScaleInterpolator {

    private initialTimestamp: number;

    private cacheKey: string;
    private cachedScaler: (v: number) => number;

    private targetScale: Scale;
    private sourceScale: Scale;

    private callback: AnimationCallback;          // the callback when animating
    private transitionTime: number;               // time taken to transition to a new scale
    private ease: (x: number) => number;          // the ease curve

    constructor(transition: number, ease: (x: number) => number, callback: AnimationCallback) {
        this.ease = ease;
        this.transitionTime = transition;
        this.callback = callback;

        this.sourceScale = null;
        this.targetScale = null;
        this.cachedScaler = null;
        this.cacheKey = null;
    }

    update() {
        let animationTime = 0;

        if (!this.initialTimestamp) {
            this.initialTimestamp = window.performance.now();
        } else {
            animationTime = window.performance.now() - this.initialTimestamp;
        }

        const animationPosition = this.transitionTime ? Math.min(animationTime / this.transitionTime, 1.0) : 1.0;

        if (!this.targetScale) {
            return;
        }

        // Call the callback with a new scaler function composed together
        // from the source and target scales, along with the interpolation position
        // driven by the easing function. The supplier of the callback can use the
        // resulting ScalerFunction to scale charts of axes.
        if (this.callback) {
            const func1 = this.sourceScale;
            const func2 = this.targetScale;
            const te = this.ease(animationPosition);
            const scaler: ScalerFunction = x => {
                const a = func1(x);
                const b = func2(x);
                return a + (b - a) * te;
            };
            this.callback(scaler);
        }

        if (animationPosition < 1.0) {
            setTimeout(() => this.update(), 20); // keep animating
        } else {
            // reset
            this.sourceScale = this.targetScale;
            this.targetScale = null;
            this.initialTimestamp = null;
        }
    }

    /**
     * A new (or initial) scale is set on the interpolator
     */
    setScale(key: string, scale) {
        // Initial scale
        if (!this.sourceScale) {
            this.sourceScale = scale;
            return;
        }

        //
        // If there was already a scale, and a new scale is set
        // the this begins an animation across between the two
        // scales, assuming a transition time is provided. To do
        // this we set the new scale as the target and reset the
        // t to 0. (if there's no transition, jump to t = 1)
        //
        if (key !== this.cacheKey) {
            this.targetScale = scale;
            this.cachedScaler = null;
            this.initialTimestamp = null;
            setTimeout(() => this.update(), 0);
        }

        this.cacheKey = key;
    }

    /**
     * Returns a scaler, which is a function that scales the value
     * supplied to it. This returns the scaler corresponding to the
     * source scale. Note that if a target scale is defined and the
     * interpolator is animating towards that target, the supplied
     * callback will be called with the transitional scaler that can
     * be used to scale data to the intermediate state.
     */
    scaler() {
        if (_.isNull(this.cachedScaler)) {
            this.cachedScaler = v => this.sourceScale(v);
        }
        return this.cachedScaler;
    }

    /**
     * Returns the d3 scale. It will return the target scale if present
     * otherwise the source scale. Note: this is the d3 internal scale. To
     * scale values, use the scaler.
     */
    latestScale(): Scale {
        return this.targetScale ? this.targetScale : this.sourceScale;
    }

    /**
     * Returns the transition, as set in the constructor
     */
    transition(): number {
        return this.transitionTime;
    }
}
