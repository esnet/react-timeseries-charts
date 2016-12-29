'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _merge = require('merge');

var _merge2 = _interopRequireDefault(_merge);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

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

var defaultStyle = {
  label: {
    fill: '#8B7E7E', // Default label color
    fontWeight: 100,
    fontSize: 11,
    pointerEvents: 'none'
  },
  line: {
    stroke: '#626262',
    strokeWidth: 1,
    strokeDasharray: '5,3',
    pointerEvents: 'none'
  }
};

/**
 *
 * The BaseLine component displays a simple horizontal line at a value.
 *
 * For example the following code overlays Baselines for the mean and stdev
 * of a series on top of another chart.
 *
 * ```
 * <ChartContainer timeRange={series.timerange()} >
 *     <ChartRow height="150">
 *         <YAxis
 *           id="price"
 *           label="Price ($)"
 *           min={series.min()} max={series.max()}
 *           width="60" format="$,.2f"
 *         />
 *         <Charts>
 *             <LineChart axis="price" series={series} style={style} />
 *             <Baseline axis="price" value={series.avg()} label="Avg" position="right" />
 *             <Baseline axis="price" value={series.avg()-series.stdev()} />
 *             <Baseline axis="price" value={series.avg()+series.stdev()} />
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */

var Baseline = function (_React$Component) {
  _inherits(Baseline, _React$Component);

  function Baseline() {
    _classCallCheck(this, Baseline);

    return _possibleConstructorReturn(this, (Baseline.__proto__ || Object.getPrototypeOf(Baseline)).apply(this, arguments));
  }

  _createClass(Baseline, [{
    key: 'render',
    value: function render() {
      if (!this.props.yScale || _underscore2.default.isUndefined(this.props.value)) {
        return null;
      }

      var y = this.props.yScale(this.props.value);
      var transform = 'translate(0 ' + y + ')';
      var textAnchor = void 0;
      var textPositionX = void 0;
      var pts = [];

      var textPositionY = -3;

      if (this.props.position === 'left') {
        textAnchor = 'start';
        textPositionX = 5;
      }
      if (this.props.position === 'right') {
        textAnchor = 'end';
        textPositionX = this.props.width - 5;
      }

      pts.push('0 0');
      pts.push(this.props.width + ' 0');
      var points = pts.join(' ');

      //
      // Style
      //

      var labelStyle = (0, _merge2.default)(true, defaultStyle.label, this.props.style.label ? this.props.style.label : {});
      var lineStyle = (0, _merge2.default)(true, defaultStyle.line, this.props.style.line ? this.props.style.line : {});

      return _react2.default.createElement(
        'g',
        { className: 'baseline', transform: transform },
        _react2.default.createElement('polyline', { points: points, style: lineStyle }),
        _react2.default.createElement(
          'text',
          { style: labelStyle, x: textPositionX, y: textPositionY, textAnchor: textAnchor },
          this.props.label
        )
      );
    }
  }]);

  return Baseline;
}(_react2.default.Component);

exports.default = Baseline;


Baseline.defaultProps = {
  value: 0,
  label: '',
  position: 'left',
  style: defaultStyle
};

Baseline.propTypes = {
  /**
   * Reference to the axis which provides the vertical scale for drawing. e.g.
   * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
   */
  axis: _react2.default.PropTypes.string.isRequired, // eslint-disable-line

  /**
   * An object describing the style of the baseline of the form
   * { label, line }. "label" and "line" are both objects containing
   * the inline CSS for that part of the baseline.
   */
  style: _react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.object, // eslint-disable-line
    line: _react2.default.PropTypes.object }),

  /**
   * The y-value to display the line at.
   */
  value: _react2.default.PropTypes.number,

  /**
   * The label to display with the axis.
   */
  label: _react2.default.PropTypes.string,

  /**
   * Whether to display the label on the "left" or "right".
   */
  position: _react2.default.PropTypes.oneOf(['left', 'right']),

  /**
   * [Internal] The yScale supplied by the associated YAxis
   */
  yScale: _react2.default.PropTypes.func,

  /**
   * [Internal] The width supplied by the surrounding ChartContainer
   */
  width: _react2.default.PropTypes.number
};