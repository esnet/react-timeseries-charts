/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react';

/**
 * Renders a simple label surrounded by a box within in svg
 *
 *      +----------------+
 *      | My label       |
 *      |                |
 *      +----------------+
 */

const Label = ({ label, style, align, width, height }) => {
  const textStyle = {
    fontSize: 11,
    textAnchor: 'left',
    fill: '#b0b0b0',
    pointerEvents: 'none',
  };

  const textStyleCentered = {
    fontSize: 11,
    textAnchor: 'middle',
    fill: '#bdbdbd',
    pointerEvents: 'none',
  };

  const tstyle = align === 'center' ? textStyleCentered : textStyle;
  const posx = align === 'center' ? parseInt(width / 2, 10) : 10;

  const text = (
    <text x={posx} y={5} dy="1.2em" style={tstyle}>{label}</text>
  );

  const box = (
    <rect
      x={0}
      y={0}
      style={style}
      width={width}
      height={height}
    />
  );

  return (
    <g>
      {box}
      {text}
    </g>
  );
};

Label.defaultProps = {
  align: 'center',
  width: 100,
  height: 100,
  pointerEvents: 'none',
  style: { fill: '#FEFEFE', stroke: '#DDD', opacity: 0.8 },
};

Label.propTypes = {

  align: React.PropTypes.oneOf(['center', 'left']),

  /**
   * The label to render
   */
  label: React.PropTypes.string.isRequired,

  /**
   * The style of the label. This is the inline CSS applied directly
   * to the label box
   */
  style: React.PropTypes.object,  // eslint-disable-line

  /**
   * The width of the rectangle to render into
   */
  width: React.PropTypes.number,

  /**
   * The height of the rectangle to render into
   */
  height: React.PropTypes.number,

};

export default Label;
