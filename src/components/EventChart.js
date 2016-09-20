/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import merge from 'merge';
import React from 'react';
import { TimeSeries } from 'pondjs';

/**
 * Renders an event view that shows the supplied set of events along a time axis.
 * The events should be supplied as a Pond TimeSeries.
 * That series may contain regular Events, TimeRangeEvents or IndexedEvents.
 */
export default class EventChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hover: null,
    };
  }

  /**
   * Continues a hover event on a specific bar of the bar chart.
   */
  handleMouseMove(e, event) {
    this.setState({ hover: event });
  }

  /**
   * Handle click will call the onSelectionChange callback if one is provided
   * as a prop. It will be called with the event selected.
   */
  handleClick(e, event) {
    e.stopPropagation();
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(event);
    }
  }

  render() {
    const series = this.props.series;
    const scale = this.props.timeScale;
    const eventMarkers = [];

    // Create and array of markers, one for each event
    let markerKey = 0;
    for (const event of series.events()) {
      const begin = event.begin();
      const end = event.end();
      const beginPos = scale(begin) >= 0 ?
        scale(begin) : 0;
      const endPos = scale(end) <= this.props.width ?
        scale(end) : this.props.width;

      const transform = `translate(${beginPos},0)`;

      const isHover = this.state.hover ? event.data() === this.state.hover.data() : false;

      let state;
      if (isHover) {
        state = 'hover';
      } else {
        state = 'normal';
      }

      let barNormalStyle = {};
      let barStyle = {};
      if (this.props.style) {
        barNormalStyle = this.props.style(event, 'normal');
        barStyle = this.props.style(event, state);
      }

      const label = this.props.label(event);
      const x = this.props.spacing;
      const y = 0;
      const width = endPos - beginPos - (2 * this.props.spacing);
      const height = this.props.size;

      const eventLabelStyle = {
        fontWeight: 100,
        fontSize: 11,
      };

      let text = null;
      if (isHover) {
        text = (
          <g>
            <rect
              className="eventchart-marker"
              x={x} y={y} width={5} height={height + 4}
              style={merge(true, barNormalStyle, { pointerEvents: 'none' })}
            />
            <text
              style={{ pointerEvents: 'none', fill: '#444', ...eventLabelStyle }}
              x={8} y={15}
            >
              {label}
            </text>
          </g>
        );
      }

      markerKey += 1;
      eventMarkers.push(
        <g transform={transform} key={markerKey}>
          <rect
            className="eventchart-marker"
            x={x} y={y} width={width} height={height}
            style={barStyle}
            onClick={e => this.handleClick(e, event)}
            onMouseLeave={() => this.setState({ hover: null })}
            onMouseMove={e => this.handleMouseMove(e, event)}
          />
          {text}
        </g>
      );
    }

    return (
      <g>
        {eventMarkers}
      </g>
    );
  }
}

EventChart.defaultProps = {
  size: 30,
  spacing: 0,
};

EventChart.propTypes = {
  /**
   * What [Pond TimeSeries](http://software.es.net/pond#timeseries) data to visualize
   */
  series: React.PropTypes.instanceOf(TimeSeries).isRequired,

  /**
   * Label of each event. This is a function that will be called so that you
   * can return the label you want for the Event passed in.
   */
  label: React.PropTypes.func,

  /**
   * The height in pixels for the event bar
   */
  size: React.PropTypes.number,

  /**
   * Minimum width for an event
   */
  /**
   * The distance in pixels to inset the bar chart from its actual timerange
   */
  spacing: React.PropTypes.number,

  /**
   * A function that should return the style of the event box
   */
  style: React.PropTypes.func,

  /**
   * Callback called when the selection of an Event changes. Will be called
   * with the Event selected.
   */
  onSelectionChange: React.PropTypes.func,

  /**
   * [Internal] The timeScale supplied by the surrounding ChartContainer
   */
  timeScale: React.PropTypes.func,

  /**
   * [Internal] The width supplied by the surrounding ChartContainer
   */
  width: React.PropTypes.number,

};
