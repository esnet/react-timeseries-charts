'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders a 'axis' that display a label for a current tracker value
 *
 *      ----+----------------+
 *          |     56.2G      |
 *          |      bps       |
 *          |                |
 *      ----+----------------+
 */
var ValueAxis = function ValueAxis(_ref) {
  var width = _ref.width,
      height = _ref.height,
      value = _ref.value,
      detail = _ref.detail;

  var labelStyle = {
    fill: '#666',
    fontSize: 20,
    textAnchor: 'middle'
  };
  var detailStyle = {
    fontSize: 12,
    textAnchor: 'middle',
    fill: '#9a9a9a'
  };
  return _react2.default.createElement(
    'g',
    null,
    _react2.default.createElement('rect', {
      key: 'background',
      x: '0', y: '0',
      width: width,
      height: height,
      style: { fill: 'none', stroke: 'none' }
    }),
    _react2.default.createElement(
      'text',
      {
        key: 'value',
        x: parseInt(width / 2, 10),
        y: height / 2,
        style: labelStyle
      },
      value
    ),
    _react2.default.createElement(
      'text',
      {
        key: 'detail',
        x: parseInt(width / 2, 10),
        y: height / 2, dy: '1.2em',
        style: detailStyle
      },
      detail
    )
  );
}; /**
    *  Copyright (c) 2015-present, The Regents of the University of California,
    *  through Lawrence Berkeley National Laboratory (subject to receipt
    *  of any required approvals from the U.S. Dept. of Energy).
    *  All rights reserved.
    *
    *  This source code is licensed under the BSD-style license found in the
    *  LICENSE file in the root directory of this source tree.
    */

ValueAxis.propTypes = {
  /**
   * If values are numbers, use this format string
   */
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),

  /**
   * If values are numbers, use this format string
   */
  detail: _react2.default.PropTypes.string,

  /**
   * The width of the axis
   */
  width: _react2.default.PropTypes.number,

  /**
   * The height of the axis
   */
  height: _react2.default.PropTypes.number

};

exports.default = ValueAxis;