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

export default class ScaleInterpolator {
    constructor(transition, ease, observer) {
        this.id = _.uniqueId("scaler");
        this.ease = ease;
        this.transitionTime = transition;
        this.observer = observer;

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

        const animationPosition = this.transitionTime
            ? Math.min(animationTime / this.transitionTime, 1.0)
            : 1.0;

        if (!this.targetScale) {
            return;
        }

        if (this.observer) {
            const func1 = this.sourceScale;
            const func2 = this.targetScale;
            const te = this.ease(animationPosition);
            const scaler = x => {
                const a = func1(x);
                const b = func2(x);
                return a + (b - a) * te;
            };
            this.observer(scaler);
        }

        if (animationPosition < 1.0) {
            // keep animating
            setTimeout(() => this.update(), 20);
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
    setScale(key, scale) {
        // Initial scale
        if (!this.sourceScale) {
            this.sourceScale = scale;
            return;
        }

        //
        //  If there was already a scale, and a new scale is set
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
   * supplied to it. This return the scaler corresponding to the
   * source scale. Note that if a target scale is defined and the
   * interpolator is animating towards that target, the observer
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
    latestScale() {
        return this.targetScale ? this.targetScale : this.sourceScale;
    }

    /**
   * Returns the transition, as set in the constructor
   */
    transition() {
        return this.transitionTime;
    }
}
