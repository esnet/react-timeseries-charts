import { Scale } from "./Charts";
export declare type ScalerFunction = (v: number) => number;
export declare type AnimationCallback = (f: ScalerFunction) => any;
export default class ScaleInterpolator {
    private initialTimestamp;
    private cacheKey;
    private cachedScaler;
    private targetScale;
    private sourceScale;
    private callback;
    private transitionTime;
    private ease;
    constructor(transition: number, ease: (x: number) => number, callback: AnimationCallback);
    update(): void;
    setScale(key: string, scale: Scale): void;
    scaler(): (v: number) => number;
    latestScale(): Scale;
    transition(): number;
}
