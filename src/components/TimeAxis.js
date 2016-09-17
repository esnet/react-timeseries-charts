/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import merge from 'merge';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';  // eslint-disable-line
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { timeDay, utcDay, timeMonth, utcMonth, timeYear, utcYear } from 'd3-time';
import { timeFormat } from 'd3-time-format';

import 'moment-duration-format';

function scaleAsString(scale) {
  return `${scale.domain().toString()}-${scale.range().toString()}`;
}

const defaultStyle = {
  labels: {
    labelColor: '#8B7E7E', // Default label color
    labelWeight: 100,
    labelSize: 11,
  },
  axis: {
    axisColor: '#C0C0C0',
  },
};

/**
 * Renders a horizontal time axis. This is used internally by the ChartContainer
 * as a result of you specifying the timerange for the chart. Please see the API
 * docs for ChartContainer for more information.
 */
export default class TimeAxis extends React.Component {

  componentDidMount() {
    this.renderTimeAxis(this.props.scale);
  }

  componentWillReceiveProps(nextProps) {
    const { scale, utc } = nextProps;
    if (scaleAsString(this.props.scale) !== scaleAsString(scale) ||
      this.props.utc !== utc) {
      this.renderTimeAxis(scale);
    }
  }

  // Force the component not to update because d3 will control the
  // DOM from this point down.
  shouldComponentUpdate() {  // eslint-disable-line
    return false;
  }

  renderTimeAxis(scale) {
    let axis;

    const tickSize = this.props.showGrid ? -this.props.gridHeight : 10;
    const utc = this.props.utc;

    if (this.props.format === 'day') {
      axis = axisBottom(scale)
        .tickArguments([utc ? utcDay : timeDay, 1])
        .tickFormat(timeFormat('%d'))
        .tickSizeOuter(0);
    } else if (this.props.format === 'month') {
      axis = axisBottom(scale)
        .tickArguments([utc ? utcMonth : timeMonth, 1])
        .tickFormat(timeFormat('%B'))
        .tickSizeOuter(0);
    } else if (this.props.format === 'year') {
      axis = axisBottom(scale)
        .tickArguments([utc ? utcYear : timeYear, 1])
        .tickFormat(timeFormat('%Y'))
        .tickSizeOuter(0);
    } else if (this.props.format === 'relative') {
      axis = axisBottom(scale)
        .tickFormat(d => moment.duration(+d).format())
        .tickSizeOuter(0);
    } else {
      axis = axisBottom(scale)
        .tickSize(0);
    }

    // Style

    const labelStyle = merge(true,
                 defaultStyle.labels,
                 this.props.style.labels ? this.props.style.labels : {});
    const axisStyle = merge(true,
                defaultStyle.axis,
                this.props.style.axis ? this.props.style.axis : {});
    const { axisColor } = axisStyle;
    const { labelColor, labelWeight, labelSize } = labelStyle;


    // Remove the old axis from under this DOM node
    select(ReactDOM.findDOMNode(this)).selectAll("*").remove(); // eslint-disable-line

    //
    // Draw the new axis
    //
                                        // XXX
    select(ReactDOM.findDOMNode(this))  // eslint-disable-line
      .append('g')
        .attr('class', 'x axis')
        .style('stroke', 'none')
        .style('fill', labelColor)
        .style('font-weight', labelWeight)
        .style('font-size', labelSize)
        .call(axis.tickSize(tickSize));
                                        // XXX
    select(ReactDOM.findDOMNode(this))  // eslint-disable-line
      .select('g')
      .selectAll('.tick')
      .select('text')
      .style('fill', axisColor)
      .style('stroke', 'none');
                                        // XXX
    select(ReactDOM.findDOMNode(this))  // eslint-disable-line
      .select('g')
      .selectAll('.tick')
      .select('line')
      .style('stroke', axisColor);
                                        // XXX
    select(ReactDOM.findDOMNode(this))  // eslint-disable-line
      .select('g')
      .select('path').remove();
  }

  render() {                            // eslint-disable-line
    return <g />;
  }
}

TimeAxis.defaultProps = {
  showGrid: false,
  style: defaultStyle,
};

TimeAxis.propTypes = {
  scale: React.PropTypes.func.isRequired,
  showGrid: React.PropTypes.boolean,
  gridHeight: React.PropTypes.number,
  format: React.PropTypes.string,
  utc: React.PropTypes.boolean,
  style: React.PropTypes.shape({
    labels: React.PropTypes.object,     // eslint-disable-line
    axis: React.PropTypes.object,       // eslint-disable-line
  }),
};
