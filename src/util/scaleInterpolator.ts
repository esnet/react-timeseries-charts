import _ from "lodash";
import { ScalerFunction } from "../components/ChartRow";
import { Scale, ScaleFunction } from "../types";

export type Remapper = (v: number) => number;
export type AnimationCallback = (f: ScalerFunction) => any;

export default class ScaleInterpolator {
    private initialTimestamp: number | null;
    private cacheKey?: string;
    private cachedScaler?: Remapper;
    private targetScale?: Scale;
    private sourceScale?: Scale;
    private callback: AnimationCallback; // the callback when animating
    private transitionTime: number; // time taken to transition to a new scale
    private ease: Remapper; // the ease curve

    constructor(transition: number, ease: Remapper, callback: AnimationCallback) {
        this.ease = ease;
        this.transitionTime = transition;
        this.callback = callback;
        this.sourceScale;
        this.targetScale;
        this.cachedScaler;
        this.cacheKey;
        console.log("ScaleInterpolator", this.transitionTime);
    }

    update() {
        if (!this.targetScale) {
            return;
        }

        // Animation position is between 0 and 1, normalized using
        // the initialTimestamp and the transitionTime
        let animationTime = 0;
        if (!this.initialTimestamp) {
            this.initialTimestamp = window.performance.now();
        } else {
            animationTime = window.performance.now() - this.initialTimestamp;
        }
        const animationPosition = this.transitionTime
            ? Math.min(animationTime / this.transitionTime, 1.0)
            : 1.0;

        console.log("...", animationPosition);
        // Call the callback with a new scaler function composed together
        // from the source and target scales, along with the interpolation position
        // driven by the easing function. The supplier of the callback can use the
        // resulting ScaleFunction to scale charts or axes.
        if (this.callback && this.sourceScale && this.targetScale) {
            const func1 = this.sourceScale;
            const func2 = this.targetScale;
            const te = this.ease(animationPosition);
            const scaler: ScaleFunction = x => {
                const a = func1(x);
                const b = func2(x);
                return a + (b - a) * te;
            };
            this.callback(scaler);
        }

        // If the animation position isn't at 1.0 yet, keep animating, otherwise
        // reset the animation, flipping the sourceScale to be the targetScale
        // and waiting for a new targetScale.
        if (animationPosition < 1.0) {
            setTimeout(() => this.update(), 20);
        } else {
            this.sourceScale = this.targetScale;
            this.targetScale = undefined;
            this.initialTimestamp = null;
        }
    }

    /**
     * A new (or initial) scale is set on the interpolator
     */
    setTargetScale(key: string, scale: Scale) {
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
            this.cachedScaler = undefined;
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
    scaler(): Remapper | undefined {
        console.log(
            "     called scaler on interpolation",
            this.sourceScale?.range(),
            " -->",
            this.sourceScale?.domain()
        );

        if (!this.sourceScale) {
            return;
        }

        if (_.isUndefined(this.cachedScaler)) {
            console.log("Cached scaler MISS");
            const scaled = this.sourceScale;
            const mapper = (v: number) => scaled(v);
            this.cachedScaler = mapper;
        } else {
            console.log("Cached scaler HIT", this.cachedScaler);
        }

        return this.cachedScaler;
    }

    /**
     * Returns the d3 scale. It will return the target scale if present
     * otherwise the source scale. Note: this is the d3 internal scale. To
     * scale values, use the scaler.
     */
    latestScale(): Scale | undefined {
        return this.targetScale ? this.targetScale : this.sourceScale;
    }

    /**
     * Accessor function that simply returns the transition, as set in the constructor
     */
    transition(): number {
        return this.transitionTime;
    }
}
