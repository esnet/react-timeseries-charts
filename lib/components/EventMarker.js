'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pondjs = require('pondjs');

var _d3TimeFormat = require('d3-time-format');

var _Label = require('./Label');

var _Label2 = _interopRequireDefault(_Label);

var _ValueList = require('./ValueList');

var _ValueList2 = _interopRequireDefault(_ValueList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2016, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var EventTime = function EventTime(_ref) {
  var time = _ref.time;
  var format = _ref.format;

  var textStyle = {
    fontSize: 11,
    textAnchor: 'left',
    fill: '#bdbdbd',
    pointerEvents: 'none'
  };

  var fmt = (0, _d3TimeFormat.timeFormat)(format);
  var dateStr = fmt(time);

  return _react2.default.createElement(
    'text',
    { x: 0, y: 0, dy: '1.2em', style: textStyle },
    dateStr
  );
};
EventTime.propTypes = {
  time: _react2.default.PropTypes.instanceOf(Date),
  format: _react2.default.PropTypes.string
};

var EventTimeRange = function EventTimeRange(_ref2) {
  var timerange = _ref2.timerange;
  var format = _ref2.format;

  var textStyle = {
    fontSize: 11,
    textAnchor: 'left',
    fill: '#bdbdbd',
    pointerEvents: 'none'
  };
  var d1 = timerange.begin();
  var d2 = timerange.end();
  var fmt = (0, _d3TimeFormat.timeFormat)(format);
  return _react2.default.createElement(
    'text',
    { x: 0, y: 0, dy: '1.2em', style: textStyle },
    fmt(d1) + ' to ' + fmt(d2)
  );
};
EventTimeRange.propTypes = {
  timerange: _react2.default.PropTypes.instanceOf(_pondjs.TimeRange),
  format: _react2.default.PropTypes.string
};

var EventIndex = function EventIndex(_ref3) {
  var index = _ref3.index;

  var textStyle = {
    fontSize: 11,
    textAnchor: 'left',
    fill: '#bdbdbd',
    pointerEvents: 'none'
  };
  return _react2.default.createElement(
    'text',
    { x: 0, y: 0, dy: '1.2em', style: textStyle },
    index.toString()
  );
};
EventIndex.propTypes = {
  index: _react2.default.PropTypes.instanceOf(_pondjs.Index)
};

/**
 * Renders a marker at a specific event on the chart. You can also
 * override either the x or y position, so this allows you to position
 * a timestamped label or timestamped list of label/value pairs anywhere
 * on a chart.
 */

var EventMarker = function (_React$Component) {
  _inherits(EventMarker, _React$Component);

  function EventMarker() {
    _classCallCheck(this, EventMarker);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(EventMarker).apply(this, arguments));
  }

  _createClass(EventMarker, [{
    key: 'renderTime',
    value: function renderTime(event) {
      if (event instanceof _pondjs.Event) {
        return _react2.default.createElement(EventTime, { time: event.timestamp() });
      } else if (event instanceof _pondjs.IndexedEvent) {
        return _react2.default.createElement(EventIndex, { index: event.index() });
      } else if (event instanceof _pondjs.TimeRangeEvent) {
        return _react2.default.createElement(EventTimeRange, { timerange: event.timerange(), format: this.props.infoTimeFormat });
      }
      return _react2.default.createElement('g', null);
    }
  }, {
    key: 'renderMarker',
    value: function renderMarker(event, column, info) {
      var t = void 0;
      if (event instanceof _pondjs.Event) {
        t = event.timestamp();
      } else {
        t = new Date(event.begin().getTime() + (event.end().getTime() - event.begin().getTime()) / 2);
      }

      // Allow overrides on the x and y position. This is useful for the barchart
      // tracker because bars maybe be offset from their actual event position in
      // order to display them side by side.
      var posx = this.props.timeScale(t) + this.props.offsetX;
      var posy = this.props.yScale(event.get(column)) - this.props.offsetY;

      var infoBoxProps = {
        align: 'left',
        style: this.props.infoStyle.box,
        width: this.props.infoWidth,
        height: this.props.infoHeight
      };

      var w = this.props.infoWidth;
      var lineBottom = posy - 10;

      var verticalConnector = void 0;
      var horizontalConnector = void 0;
      var dot = void 0;
      var infoBox = void 0;
      var transform = void 0;

      if (info) {
        infoBox = _underscore2.default.isString(this.props.info) ? _react2.default.createElement(_Label2.default, _extends({}, infoBoxProps, { label: info })) : _react2.default.createElement(_ValueList2.default, _extends({}, infoBoxProps, { values: info }));
      }

      //
      // Marker on right of event
      //

      if (posx + 10 + w < this.props.width * 3 / 4) {
        if (info) {
          verticalConnector = _react2.default.createElement('line', {
            pointerEvents: 'none',
            style: this.props.infoStyle.line,
            x1: -10, y1: lineBottom,
            x2: -10, y2: 20
          });
          horizontalConnector = _react2.default.createElement('line', {
            pointerEvents: 'none',
            style: this.props.infoStyle.line,
            x1: -10, y1: 20,
            x2: -2, y2: 20
          });
        }
        dot = _react2.default.createElement('circle', {
          cx: -10,
          cy: lineBottom,
          r: this.props.markerRadius,
          pointerEvents: 'none',
          style: this.props.infoStyle.dot
        });
        transform = 'translate(' + (posx + 10) + ',' + 10 + ')';
      } else {
        if (info) {
          verticalConnector = _react2.default.createElement('line', {
            pointerEvents: 'none',
            style: this.props.infoStyle.line,
            x1: w + 10, y1: lineBottom,
            x2: w + 10, y2: 20
          });
          horizontalConnector = _react2.default.createElement('line', {
            pointerEvents: 'none',
            style: this.props.infoStyle.line,
            x1: w + 10, y1: 20,
            x2: w + 2, y2: 20
          });
        }
        dot = _react2.default.createElement('circle', {
          cx: w + 10,
          cy: lineBottom,
          r: this.props.markerRadius,
          pointerEvents: 'none',
          style: this.props.infoStyle.dot
        });
        transform = 'translate(' + (posx - w - 10) + ',' + 10 + ')';
      }

      return _react2.default.createElement(
        'g',
        { transform: transform },
        verticalConnector,
        horizontalConnector,
        dot,
        this.renderTime(event),
        _react2.default.createElement(
          'g',
          { transform: 'translate(0,' + 20 + ')' },
          infoBox
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var event = _props.event;
      var column = _props.column;
      var info = _props.info;

      return _react2.default.createElement(
        'g',
        null,
        this.renderMarker(event, column, info)
      );
    }
  }]);

  return EventMarker;
}(_react2.default.Component);

exports.default = EventMarker;


EventMarker.propTypes = {

  /**
   * What [Pond Event](http://software.es.net/pond#event) to mark
   */
  event: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.instanceOf(_pondjs.Event), _react2.default.PropTypes.instanceOf(_pondjs.IndexedEvent), _react2.default.PropTypes.instanceOf(_pondjs.TimeRangeEvent)]).isRequired,

  /**
   * Which column in the Event to use
   */
  column: _react2.default.PropTypes.string,

  /**
   * The style of the info box and connecting lines. The object
   * should contain the "line", "box" and "dot" properties. Each of those
   * is the inline CSS for that element.
   */
  infoStyle: _react2.default.PropTypes.shape({
    line: _react2.default.PropTypes.object, // eslint-disable-line
    box: _react2.default.PropTypes.object, // eslint-disable-line
    dot: _react2.default.PropTypes.object }),

  /**
   * The width of the hover info box
   */
  infoWidth: _react2.default.PropTypes.number,

  /**
   * The height of the hover info box
   */
  infoHeight: _react2.default.PropTypes.number,

  /**
   * The values to show in the info box. This is either an array of
   * objects, with each object specifying the label and value
   * to be shown in the info box, or a simple string label
   */
  info: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.string, // eslint-disable-line
    value: _react2.default.PropTypes.string }))]),

  infoTimeFormat: _react2.default.PropTypes.string,

  /**
   * The radius of the dot at the end of the marker
   */
  markerRadius: _react2.default.PropTypes.number,

  /**
   * Offset the marker position in the x direction.
   */
  offsetX: _react2.default.PropTypes.number,

  /**
   * Offset the marker position in the y direction
   */
  offsetY: _react2.default.PropTypes.number,

  /**
   * [Internal] The timeScale supplied by the surrounding ChartContainer
   */
  timeScale: _react2.default.PropTypes.func.isRequired,

  /**
   * [Internal] The yScale supplied by the associated YAxis
   */
  yScale: _react2.default.PropTypes.func.isRequired,

  /**
   * [Internal] The width supplied by the surrounding ChartContainer
   */
  width: _react2.default.PropTypes.number.isRequired

};

EventMarker.defaultProps = {
  column: 'value',
  infoStyle: {
    line: {
      stroke: '#999',
      cursor: 'crosshair',
      pointerEvents: 'none'
    },
    box: {
      fill: 'white',
      opacity: 0.90,
      stroke: '#999',
      pointerEvents: 'none'
    },
    dot: {
      fill: '#999'
    }
  },
  infoTimeFormat: '%m/%d/%y %X',
  infoWidth: 90,
  infoHeight: 25,
  markerRadius: 2,
  offsetX: 0,
  offsetY: 0
};