export declare type LabelValueList = {
    label?: string;
    value?: number | string;
}[];
export declare type LineData = {
    x: Date;
    y: number;
};
export interface AreaChartColumns {
    up: string[];
    down: string[];
}
export declare enum CurveInterpolation {
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
