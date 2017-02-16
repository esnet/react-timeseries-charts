"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _pondjs = require("pondjs");

var _util = require("../js/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2015-present, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// eslint-disable-line


/**
 * Internal component which provides the top level event catcher for the charts.
 * This is a higher order component. It wraps a tree of SVG elements below it,
 * passed in as this.props.children, and catches events that they do not handle.
 *
 * The EventHandler is responsible for pan and zoom events as well as other click
 * and hover actions.
 */
var EventHandler = function (_React$Component) {
  _inherits(EventHandler, _React$Component);

  function EventHandler(props) {
    _classCallCheck(this, EventHandler);

    var _this = _possibleConstructorReturn(this, (EventHandler.__proto__ || Object.getPrototypeOf(EventHandler)).call(this, props));

    _this.state = {
      isPanning: false,
      initialPanBegin: null,
      initialPanEnd: null,
      initialPanPosition: null
    };

    _this.handleScrollWheel = _this.handleScrollWheel.bind(_this);
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    _this.handleMouseOut = _this.handleMouseOut.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    return _this;
  }

  // get the event mouse position relative to the event rect


  _createClass(EventHandler, [{
    key: "getOffsetMousePosition",
    value: function getOffsetMousePosition(e) {
      var offset = (0, _util.getElementOffset)(this.eventRect);
      var x = e.pageX - offset.left;
      var y = e.pageY - offset.top;
      return [Math.round(x), Math.round(y)];
    }

    //
    // Event handlers
    //

  }, {
    key: "handleScrollWheel",
    value: function handleScrollWheel(e) {
      if (!this.props.enablePanZoom) {
        return;
      }

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

      var newTimeRange = new _pondjs.TimeRange(newBegin, newEnd);

      if (this.props.onZoom) {
        this.props.onZoom(newTimeRange);
      }
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(e) {
      if (!this.props.enablePanZoom) {
        return;
      }

      e.preventDefault();

      var x = e.pageX;
      var y = e.pageY;
      var xy0 = [Math.round(x), Math.round(y)];

      var begin = this.props.scale.domain()[0].getTime();
      var end = this.props.scale.domain()[1].getTime();

      document.addEventListener("mouseover", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);

      this.setState({
        isPanning: true,
        initialPanBegin: begin,
        initialPanEnd: end,
        initialPanPosition: xy0
      });

      return false;
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(e) {
      if (!this.props.enablePanZoom) {
        return;
      }

      e.stopPropagation();

      document.removeEventListener("mouseover", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);

      var x = e.pageX;
      if (this.props.onMouseClick && this.state.initialPanPosition && Math.abs(x - this.state.initialPanPosition[0]) < 2) {
        this.props.onMouseClick();
      }

      this.setState({
        isPanning: false,
        initialPanBegin: null,
        initialPanEnd: null,
        initialPanPosition: null
      });
    }
  }, {
    key: "handleMouseOut",
    value: function handleMouseOut(e) {
      if (!this.props.enablePanZoom) {
        return;
      }

      e.preventDefault();

      if (this.props.onMouseOut) {
        this.props.onMouseOut();
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(e) {
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

        if (this.props.minTime && newBegin < this.props.minTime.getTime()) {
          newBegin = this.props.minTime.getTime();
          newEnd = newBegin + duration;
        }

        if (this.props.maxTime && newEnd > this.props.maxTime.getTime()) {
          newEnd = this.props.maxTime.getTime();
          newBegin = newEnd - duration;
        }

        var newTimeRange = new _pondjs.TimeRange(newBegin, newEnd);
        if (this.props.onZoom) {
          this.props.onZoom(newTimeRange);
        }
      } else if (this.props.onMouseMove) {
        var trackerPosition = this.getOffsetMousePosition(e)[0];
        var time = this.props.scale.invert(trackerPosition);
        if (this.props.onMouseMove) {
          this.props.onMouseMove(time);
        }
      }
    }

    //
    // Render
    //

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var cursor = this.state.isPanning ? "-webkit-grabbing" : "default";
      var handlers = {
        onWheel: this.handleScrollWheel,
        onMouseDown: this.handleMouseDown,
        onMouseMove: this.handleMouseMove,
        onMouseOut: this.handleMouseOut,
        onMouseUp: this.handleMouseUp
      };
      return _react2.default.createElement(
        "g",
        _extends({ pointerEvents: "all" }, handlers),
        _react2.default.createElement("rect", {
          key: "handler-hit-rect",
          ref: function ref(c) {
            _this2.eventRect = c;
          },
          style: { opacity: 0.0, cursor: cursor },
          x: 0,
          y: 0,
          width: this.props.width,
          height: this.props.height
        }),
        this.props.children
      );
    }
  }]);

  return EventHandler;
}(_react2.default.Component);

exports.default = EventHandler;


EventHandler.propTypes = {
  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.arrayOf(_react2.default.PropTypes.node), _react2.default.PropTypes.node]),
  enablePanZoom: _react2.default.PropTypes.bool,
  scale: _react2.default.PropTypes.func.isRequired,
  width: _react2.default.PropTypes.number.isRequired,
  height: _react2.default.PropTypes.number.isRequired,
  maxTime: _react2.default.PropTypes.instanceOf(Date),
  minTime: _react2.default.PropTypes.instanceOf(Date),
  minDuration: _react2.default.PropTypes.number,
  onZoom: _react2.default.PropTypes.func,
  onMouseMove: _react2.default.PropTypes.func,
  onMouseOut: _react2.default.PropTypes.func,
  onMouseClick: _react2.default.PropTypes.func
};

EventHandler.defaultProps = {
  enablePanZoom: false
};