"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScaleInterpolator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  Copyright (c) 2015, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScaleInterpolator = exports.ScaleInterpolator = function () {
    function ScaleInterpolator(transition, ease, observer) {
        _classCallCheck(this, ScaleInterpolator);

        this._ease = ease;
        this._transition = transition;
        this._observer = observer;

        this._t = 0;
        this._sourceScale = null;
        this._targetScale = null;
        this._cachedScaler = null;
        this._cacheKey = null;
    }

    _createClass(ScaleInterpolator, [{
        key: "update",
        value: function update() {
            var _this = this;

            var t = Math.min(this._t, 1.0);
            if (!this._targetScale) {
                return;
            }

            if (this._observer) {
                (function () {
                    var func1 = _this._sourceScale;
                    var func2 = _this._targetScale;
                    var te = _this._ease(_this._t);
                    var scaler = function scaler(x) {
                        var a = func1(x);
                        var b = func2(x);
                        return a + (b - a) * te;
                    };
                    _this._observer(scaler);
                })();
            }

            if (t < 1.0) {
                // keep animating
                this._t = t + 20 / this._transition;
                setTimeout(function () {
                    return _this.update();
                }, 20);
            } else {
                //reset
                this._t = 0;
                this._sourceScale = this._targetScale;
                this._targetScale = null;
            }
        }

        /**
         * A new (or initial) scale is set on the interpolator
         */

    }, {
        key: "setScale",
        value: function setScale(key, scale) {

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
                this._t = this._transition ? 0.0 : 1.0;
                this._targetScale = scale;
                this._cachedScaler = null;
                this.update();
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

    }, {
        key: "scaler",
        value: function scaler() {
            var _this2 = this;

            if (_underscore2.default.isNull(this._cachedScaler)) {
                this._cachedScaler = function (v) {
                    return _this2._sourceScale(v);
                };
            }
            return this._cachedScaler;
        }

        /**
         * Returns the d3 scale. It will return the target scale if present
         * otherwise the source scale. Note: this is the d3 internal scale. To
         * scale values, use the scaler.
         */

    }, {
        key: "latestScale",
        value: function latestScale() {
            return this._targetScale ? this._targetScale : this._sourceScale;
        }

        /**
         * Returns the transition, as set in the constructor
         */

    }, {
        key: "transition",
        value: function transition() {
            return this._transition;
        }
    }]);

    return ScaleInterpolator;
}();