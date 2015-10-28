/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactAddons = require("react/addons");

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _esnetPond = require("@esnet/pond");

// http://stackoverflow.com/a/28857255
function getElementOffset(element) {
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top + window.pageYOffset - de.clientTop;
    var left = box.left + window.pageXOffset - de.clientLeft;
    return {
        top: top,
        left: left
    };
}

exports["default"] = _reactAddons2["default"].createClass({

    displayName: "EventHandler",

    getInitialState: function getInitialState() {
        return {
            isPanning: false,
            initialPanBegin: null,
            initialPanEnd: null,
            initialPanPosition: null
        };
    },

    // get the event mouse position relative to the event rect
    getOffsetMousePosition: function getOffsetMousePosition(e) {
        var trackerRect = _reactAddons2["default"].findDOMNode(this.refs.eventrect);
        var offset = getElementOffset(trackerRect);
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        return [Math.round(x), Math.round(y)];
    },

    handleScrollWheel: function handleScrollWheel(e) {
        e.preventDefault();

        var SCALE_FACTOR = 0.001;
        var scale = 1 + e.deltaY * SCALE_FACTOR;
        if (scale > 3) {
            scale = 3;
        }
        if (scale < 0.1) {
            scale = 0.1;
        }

        var xy = this.getOffsetMousePosition(e);

        var begin = this.props.scale.domain()[0].getTime();
        var end = this.props.scale.domain()[1].getTime();

        var center = this.props.scale.invert(xy[0]).getTime();

        var beginScaled = center - parseInt((center - begin) * scale, 10);
        var endScaled = center + parseInt((end - center) * scale, 10);

        // Duration constraint
        var duration = (end - begin) * scale;

        if (this.props.minDuration) {
            var minDuration = parseInt(this.props.minDuration, 10);
            if (duration < this.props.minDuration) {
                beginScaled = center - (center - begin) / (end - begin) * minDuration;
                endScaled = center + (end - center) / (end - begin) * minDuration;
            }
        }

        if (this.props.minTime && this.props.maxTime) {
            var maxDuration = this.props.maxTime.getTime() - this.props.minTime.getTime();
            if (duration > maxDuration) {
                duration = maxDuration;
            }
        }

        // Range constraint
        if (this.props.minTime && beginScaled < this.props.minTime.getTime()) {
            beginScaled = this.props.minTime.getTime();
            endScaled = beginScaled + duration;
        }

        if (this.props.maxTime && endScaled > this.props.maxTime.getTime()) {
            endScaled = this.props.maxTime.getTime();
            beginScaled = endScaled - duration;
        }

        var newBegin = new Date(beginScaled);
        var newEnd = new Date(endScaled);

        var newTimeRange = new _esnetPond.TimeRange(newBegin, newEnd);

        if (this.props.onZoom) {
            this.props.onZoom(newTimeRange);
        }
    },

    handleMouseDown: function handleMouseDown(e) {
        e.preventDefault();

        var x = e.pageX;
        var y = e.pageY;
        var xy0 = [Math.round(x), Math.round(y)];

        var begin = this.props.scale.domain()[0].getTime();
        var end = this.props.scale.domain()[1].getTime();
        this.setState({ isPanning: true,
            initialPanBegin: begin,
            initialPanEnd: end,
            initialPanPosition: xy0 });
    },

    handleMouseUp: function handleMouseUp(e) {
        e.preventDefault();

        this.setState({ isPanning: false,
            initialPanBegin: null,
            initialPanEnd: null,
            initialPanPosition: null });
    },

    handleMouseOut: function handleMouseOut(e) {
        e.preventDefault();

        if (this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    },

    handleMouseMove: function handleMouseMove(e) {
        e.preventDefault();

        var x = e.pageX;
        var y = e.pageY;
        var xy = [Math.round(x), Math.round(y)];

        if (this.state.isPanning) {
            var xy0 = this.state.initialPanPosition;
            var timeOffset = this.props.scale.invert(xy[0]).getTime() - this.props.scale.invert(xy0[0]).getTime();

            var newBegin = parseInt(this.state.initialPanBegin - timeOffset, 10);
            var newEnd = parseInt(this.state.initialPanEnd - timeOffset, 10);
            var duration = parseInt(this.state.initialPanEnd - this.state.initialPanBegin, 10);

            // Range constraint
            if (this.props.minTime && newBegin < this.props.minTime.getTime()) {
                newBegin = this.props.minTime.getTime();
                newEnd = newBegin + duration;
            }

            if (this.props.maxTime && newEnd > this.props.maxTime.getTime()) {
                newEnd = this.props.maxTime.getTime();
                newBegin = newEnd - duration;
            }

            var newTimeRange = new _esnetPond.TimeRange(newBegin, newEnd);

            // onZoom callback
            if (this.props.onZoom) {
                this.props.onZoom(newTimeRange);
            }
        } else if (this.props.onMouseMove) {
            var trackerPosition = this.getOffsetMousePosition(e)[0];
            var time = this.props.scale.invert(trackerPosition);

            // onMouseMove callback
            if (this.props.onMouseMove) {
                this.props.onMouseMove(time);
            }
        }
    },

    render: function render() {
        var _this = this;

        var cursor = this.state.isPanning ? "-webkit-grabbing" : "default";
        var children = _reactAddons2["default"].Children.map(this.props.children, function (element) {
            return _reactAddons2["default"].addons.cloneWithProps(element, { isPanning: _this.state.isPanning });
        });
        return _reactAddons2["default"].createElement(
            "g",
            { pointerEvents: "all",
                onWheel: this.handleScrollWheel,
                onMouseDown: this.handleMouseDown,
                onMouseMove: this.handleMouseMove,
                onMouseOut: this.handleMouseOut,
                onMouseUp: this.handleMouseUp },
            _reactAddons2["default"].createElement("rect", { key: "handler-hit-rect",
                ref: "eventrect",
                style: { opacity: 0.0, cursor: cursor },
                x: 0, y: 0,
                width: this.props.width, height: this.props.height }),
            children
        );
    }
});
module.exports = exports["default"];