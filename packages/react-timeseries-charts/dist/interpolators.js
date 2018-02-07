import * as _ from "lodash";
var ScaleInterpolator = (function () {
    function ScaleInterpolator(transition, ease, callback) {
        this.ease = ease;
        this.transitionTime = transition;
        this.callback = callback;
        this.sourceScale = null;
        this.targetScale = null;
        this.cachedScaler = null;
        this.cacheKey = null;
    }
    ScaleInterpolator.prototype.update = function () {
        var _this = this;
        var animationTime = 0;
        if (!this.initialTimestamp) {
            this.initialTimestamp = window.performance.now();
        }
        else {
            animationTime = window.performance.now() - this.initialTimestamp;
        }
        var animationPosition = this.transitionTime
            ? Math.min(animationTime / this.transitionTime, 1.0)
            : 1.0;
        if (!this.targetScale) {
            return;
        }
        if (this.callback) {
            var func1_1 = this.sourceScale;
            var func2_1 = this.targetScale;
            var te_1 = this.ease(animationPosition);
            var scaler = function (x) {
                var a = func1_1(x);
                var b = func2_1(x);
                return a + (b - a) * te_1;
            };
            this.callback(scaler);
        }
        if (animationPosition < 1.0) {
            setTimeout(function () { return _this.update(); }, 20);
        }
        else {
            this.sourceScale = this.targetScale;
            this.targetScale = null;
            this.initialTimestamp = null;
        }
    };
    ScaleInterpolator.prototype.setScale = function (key, scale) {
        var _this = this;
        if (!this.sourceScale) {
            this.sourceScale = scale;
            return;
        }
        if (key !== this.cacheKey) {
            this.targetScale = scale;
            this.cachedScaler = null;
            this.initialTimestamp = null;
            setTimeout(function () { return _this.update(); }, 0);
        }
        this.cacheKey = key;
    };
    ScaleInterpolator.prototype.scaler = function () {
        var _this = this;
        if (_.isNull(this.cachedScaler)) {
            this.cachedScaler = function (v) { return _this.sourceScale(v); };
        }
        return this.cachedScaler;
    };
    ScaleInterpolator.prototype.latestScale = function () {
        return this.targetScale ? this.targetScale : this.sourceScale;
    };
    ScaleInterpolator.prototype.transition = function () {
        return this.transitionTime;
    };
    return ScaleInterpolator;
}());
export default ScaleInterpolator;
//# sourceMappingURL=interpolators.js.map