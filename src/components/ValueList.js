/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react';

/**
 * Renders a list of values in svg
 *
 *      +----------------+
 *      | Max 100 Gbps   |
 *      | Avg 26 Gbps    |
 *      +----------------+
 */
const ValueList = (props) => {
  const { align, style, width, height } = props;

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

  const values = props.values.map((item, i) => {
    if (align === 'left') {
      return (
        <g key={i}>
          <text x={10} y={5} dy={`${(i + 1) * 1.2}em`} style={textStyle}>
            <tspan style={{ fontWeight: 700 }}>{`${item.label}: `}</tspan>
            <tspan>{`${item.value}`}</tspan>
          </text>
        </g>
      );
    }

    const posx = parseInt(props.width / 2, 10);
    return (
      <g key={i}>
        <text x={posx} y={5} dy={`${(i + 1) * 1.2}em`} style={textStyleCentered}>
          <tspan style={{ fontWeight: 700 }}>{`${item.label}: `}</tspan>
          <tspan>{`${item.value}`}</tspan>
        </text>
      </g>
    );
  });

  const box = (
    <rect style={style} x={0} y={0} width={width} height={height} />
  );

  return (
    <g>
      {box}
      {values}
    </g>
  );
};

ValueList.defaultProps = {
  align: 'center',
  width: 100,
  height: 100,
  pointerEvents: 'none',
  style: { fill: '#FEFEFE', stroke: '#DDD', opacity: 0.8 },
};

ValueList.propTypes = {

  align: React.PropTypes.oneOf(['center', 'left']),

  /**
   * An array of label value pairs to render
   */
  values: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.string,      // eslint-disable-line
      value: React.PropTypes.oneOfType([  // eslint-disable-line
        React.PropTypes.number,
        React.PropTypes.string,
      ]),
    })
  ).isRequired,

  /**
   * CSS object to be applied to the ValueList surrounding box
   */
  style: React.PropTypes.object,          // eslint-disable-line

  /**
   * The width of the rectangle to render into
   */
  width: React.PropTypes.number,

  /**
   * The height of the rectangle to render into
   */
  height: React.PropTypes.number,
};

export default ValueList;
