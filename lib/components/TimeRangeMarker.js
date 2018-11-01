"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _pondjs = require("pondjs");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
            "Super expression must either be null or a function, not " + typeof superClass
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
    });
    if (superClass)
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
}
/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/**
 * Renders a band with extents defined by the supplied TimeRange. This
 * is a super simple component right now which just renders a simple
 * rectangle, in the style of the prop `style` across the timerange
 * specified. However, this is useful for highlighting a timerange to
 * correspond with another part of the your UI.
 *
 * See also the Brush component for a TimeRange marker that you can
 * resize interactively.
 */
var TimeRangeMarker = (function(_React$Component) {
    _inherits(TimeRangeMarker, _React$Component);

    function TimeRangeMarker() {
        _classCallCheck(this, TimeRangeMarker);

        return _possibleConstructorReturn(
            this,
            (TimeRangeMarker.__proto__ || Object.getPrototypeOf(TimeRangeMarker)).apply(
                this,
                arguments
            )
        );
    }

    _createClass(TimeRangeMarker, [
        {
            key: "renderBand",
            value: function renderBand() {
                var timerange = this.props.timerange;
                var timeScale = this.props.timeScale;

                // Viewport bounds
                var viewBeginTime = timeScale.invert(0);
                var viewEndTime = timeScale.invert(this.props.width);
                var viewport = new _pondjs.TimeRange(viewBeginTime, viewEndTime);

                var bandStyle = void 0;
                if (this.props.style) {
                    bandStyle = this.props.style;
                } else {
                    bandStyle = { fill: "steelblue" };
                }

                if (!viewport.disjoint(timerange)) {
                    var range = timerange.intersection(viewport);
                    var begin = range.begin();
                    var end = range.end();
                    var beginPos = timeScale(begin);
                    var endPos = timeScale(end);
                    var width = endPos - beginPos;
                    if (width < 1) {
                        width = 1;
                    }
                    return _react2.default.createElement("rect", {
                        x: beginPos,
                        y: 0,
                        width: width,
                        height: this.props.height,
                        style: bandStyle
                    });
                }
                return _react2.default.createElement("g", null);
            }
        },
        {
            key: "render",
            value: function render() {
                return _react2.default.createElement("g", null, this.renderBand());
            }
        }
    ]);

    return TimeRangeMarker;
})(_react2.default.Component);

exports.default = TimeRangeMarker;

TimeRangeMarker.propTypes = {
    /**
     * Show or hide this marker
     */
    visible: _propTypes2.default.bool,

    /**
     * The timerange to mark. This is in the form of a
     * [Pond TimeRange](https://esnet-pondjs.appspot.com/#/timerange)
     */
    timerange: _propTypes2.default.instanceOf(_pondjs.TimeRange).isRequired,

    /**
     * The style of the rect that will be rendered as a SVG <Rect>. This
     * object is the inline CSS for that rect.
     */
    style: _propTypes2.default.object, // eslint-disable-line

    /**
     * [Internal] The timeScale supplied by the surrounding ChartContainer
     */
    timeScale: _propTypes2.default.func.isRequired,

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width: _propTypes2.default.number.isRequired,

    /**
     * [Internal] The height supplied by the surrounding ChartContainer
     */
    height: _propTypes2.default.number.isRequired
};

TimeRangeMarker.defaultProps = {
    visible: true,
    spacing: 1,
    offset: 0,
    style: { fill: "rgba(70, 130, 180, 0.25);" }
};
