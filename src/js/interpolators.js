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

export class ScaleInterpolator {

    constructor(transition, ease, observer) {
        this._id = _.uniqueId("scaler");
        this._ease = ease;
        this._transition = transition;
        this._observer = observer;

        this._sourceScale = null;
        this._targetScale = null;
        this._cachedScaler = null;
        this._cacheKey = null;
    }

    update() {
        let animationTime = 0;

        if (!this._initialTimestamp) {
            this._initialTimestamp = window.performance.now();
        } else {
            animationTime = (window.performance.now() - this._initialTimestamp);
        }

        const animationPosition = Math.min(animationTime / this._transition, 1.0);

        if (!this._targetScale) {
            return;
        }

        if (this._observer) {
            const func1 = this._sourceScale;
            const func2 = this._targetScale;
            const te = this._ease(animationPosition);
            const scaler = (x) => {
                const a = func1(x);
                const b = func2(x);
                return a + (b - a) * te;
            };
            this._observer(scaler);
        }

        if (animationPosition < 1.0) {
            // keep animating
            setTimeout(() => this.update(), 20);
        } else {
            //reset
            this._sourceScale = this._targetScale;
            this._targetScale = null;
            this._initialTimestamp = null;
        }
    }

    /**
     * A new (or initial) scale is set on the interpolator
     */
    setScale(key, scale) {

        // Initial scale
        if (!this._sourceScale) {
            this._sourceScale = scale;
            return;
        }

        //
        //  If there was already a scale, and a new scale is set
        // the this begins an animation across between the two
        // scales, assuming a transition time is provided. To do
        // this we set the new scale as the target and reset the
        // t to 0. (if there's no transition, jump to t = 1)
        //

        if (key !== this._cacheKey) {
            this._targetScale = scale;
            this._cachedScaler = null;
            this._initialTimestamp = null;
            setTimeout(() => this.update(), 0);
        }

        this._cacheKey = key;
    }

    /**
     * Returns a scaler, which is a function that scales the value
     * supplied to it. This return the scaler corresponding to the
     * source scale. Note that if a target scale is defined and the
     * interpolator is animating towards that target, the observer
     * callback will be called with the transitional scaler that can
     * be used to scale data to the intermediate state.
     */
    scaler() {
        if (_.isNull(this._cachedScaler)) {
            this._cachedScaler = (v) => {
                return this._sourceScale(v);
            };
        }
        return this._cachedScaler;
    }

    /**
     * Returns the d3 scale. It will return the target scale if present
     * otherwise the source scale. Note: this is the d3 internal scale. To
     * scale values, use the scaler.
     */
    latestScale() {
        return this._targetScale ? this._targetScale : this._sourceScale;
    }

    /**
     * Returns the transition, as set in the constructor
     */
    transition() {
        return this._transition;
    }
}
