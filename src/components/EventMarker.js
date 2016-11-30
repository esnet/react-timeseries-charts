/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from 'underscore';
import React from 'react';
import { Event, TimeRangeEvent, IndexedEvent, Index, TimeRange } from 'pondjs';
import { timeFormat } from 'd3-time-format';

import Label from './Label';
import ValueList from './ValueList';

const EventTime = ({ time, format }) => {
  const textStyle = {
    fontSize: 11,
    textAnchor: 'left',
    fill: '#bdbdbd',
    pointerEvents: 'none',
  };

  const fmt = timeFormat(format);
  const dateStr = fmt(time);

  return (
    <text x={0} y={0} dy="1.2em" style={textStyle}>
      {dateStr}
    </text>
  );
};
EventTime.propTypes = {
  time: React.PropTypes.instanceOf(Date),
  format: React.PropTypes.string,
};

const EventTimeRange = ({ timerange, format }) => {
  const textStyle = {
    fontSize: 11,
    textAnchor: 'left',
    fill: '#bdbdbd',
    pointerEvents: 'none',
  };
  const d1 = timerange.begin();
  const d2 = timerange.end();
  const fmt = timeFormat(format);
  return (
    <text x={0} y={0} dy="1.2em" style={textStyle}>
      {`${fmt(d1)} to ${fmt(d2)}`}
    </text>
  );
};
EventTimeRange.propTypes = {
  timerange: React.PropTypes.instanceOf(TimeRange),
  format: React.PropTypes.string,
};

const EventIndex = ({ index }) => {
  const textStyle = {
    fontSize: 11,
    textAnchor: 'left',
    fill: '#bdbdbd',
    pointerEvents: 'none',
  };
  return (
    <text x={0} y={0} dy="1.2em" style={textStyle}>
      {index.toString()}
    </text>
  );
};
EventIndex.propTypes = {
  index: React.PropTypes.instanceOf(Index),
};

/**
 * Renders a marker at a specific event on the chart. You can also
 * override either the x or y position, so this allows you to position
 * a timestamped label or timestamped list of label/value pairs anywhere
 * on a chart.
 */
export default class EventMarker extends React.Component {

  renderTime(event) {
    if (event instanceof Event) {
      return <EventTime time={event.timestamp()} format={this.props.infoTimeFormat} />;
    } else if (event instanceof IndexedEvent) {
      return <EventIndex index={event.index()} />;
    } else if (event instanceof TimeRangeEvent) {
      return <EventTimeRange timerange={event.timerange()} format={this.props.infoTimeFormat} />;
    }
    return (
      <g />
    );
  }

  renderMarker(event, column, info) {
    let t;
    if (event instanceof Event) {
      t = event.timestamp();
    } else {
      t = new Date(event.begin().getTime() +
        (event.end().getTime() - event.begin().getTime()) / 2);
    }

    let value;
    if (this.props.yValueFunc) {
      value = this.props.yValueFunc(event, column);
    } else {
      value = event.get(column);
    }

    // Allow overrides on the x and y position. This is useful for the barchart
    // tracker because bars maybe be offset from their actual event position in
    // order to display them side by side.
    const posx = this.props.timeScale(t) + this.props.offsetX;
    const posy = this.props.yScale(value) - this.props.offsetY;

    const infoBoxProps = {
      align: 'left',
      style: this.props.infoStyle.box,
      width: this.props.infoWidth,
      height: this.props.infoHeight,
    };

    const w = this.props.infoWidth;
    const lineBottom = posy - 10;

    let verticalConnector;
    let horizontalConnector;
    let dot;
    let infoBox;
    let transform;

    if (info) {
      infoBox = _.isString(this.props.info) ? (
        <Label {...infoBoxProps} label={info} />
      ) : (
        <ValueList {...infoBoxProps} values={info} />
      );
    }

    //
    // Marker on right of event
    //

    if (posx + 10 + w < this.props.width * 3 / 4) {
      if (info) {
        verticalConnector = (
          <line
            pointerEvents="none"
            style={this.props.infoStyle.line}
            x1={-10} y1={lineBottom}
            x2={-10} y2={20}
          />
        );
        horizontalConnector = (
          <line
            pointerEvents="none"
            style={this.props.infoStyle.line}
            x1={-10} y1={20}
            x2={-2} y2={20}
          />
        );
      }
      dot = (
        <circle
          cx={-10}
          cy={lineBottom}
          r={this.props.markerRadius}
          pointerEvents="none"
          style={this.props.infoStyle.dot}
        />
      );
      transform = `translate(${posx + 10},${10})`;
    } else {
      if (info) {
        verticalConnector = (
          <line
            pointerEvents="none"
            style={this.props.infoStyle.line}
            x1={w + 10} y1={lineBottom}
            x2={w + 10} y2={20}
          />
        );
        horizontalConnector = (
          <line
            pointerEvents="none"
            style={this.props.infoStyle.line}
            x1={w + 10} y1={20}
            x2={w + 2} y2={20}
          />
        );
      }
      dot = (
        <circle
          cx={w + 10}
          cy={lineBottom}
          r={this.props.markerRadius}
          pointerEvents="none"
          style={this.props.infoStyle.dot}
        />
      );
      transform = `translate(${posx - w - 10},${10})`;
    }

    return (
      <g transform={transform} >
        {verticalConnector}
        {horizontalConnector}
        {dot}
        {this.renderTime(event)}
        <g transform={`translate(0,${20})`}>
          {infoBox}
        </g>
      </g>
    );
  }

  render() {
    const { event, column, info } = this.props;
    return (
      <g>
        {this.renderMarker(event, column, info)}
      </g>
    );
  }
}

EventMarker.propTypes = {

  /**
   * What [Pond Event](http://software.es.net/pond#event) to mark
   */
  event: React.PropTypes.oneOfType([
    React.PropTypes.instanceOf(Event),
    React.PropTypes.instanceOf(IndexedEvent),
    React.PropTypes.instanceOf(TimeRangeEvent),
  ]).isRequired,

  /**
   * Which column in the Event to use
   */
  column: React.PropTypes.string,

  /**
   * The style of the info box and connecting lines. The object
   * should contain the "line", "box" and "dot" properties. Each of those
   * is the inline CSS for that element.
   */
  infoStyle: React.PropTypes.shape({
    line: React.PropTypes.object, // eslint-disable-line
    box: React.PropTypes.object,  // eslint-disable-line
    dot: React.PropTypes.object,  // eslint-disable-line
  }),

  /**
   * The width of the hover info box
   */
  infoWidth: React.PropTypes.number,

  /**
   * The height of the hover info box
   */
  infoHeight: React.PropTypes.number,

  /**
   * The values to show in the info box. This is either an array of
   * objects, with each object specifying the label and value
   * to be shown in the info box, or a simple string label
   */
  info: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.arrayOf(
      React.PropTypes.shape({
        label: React.PropTypes.string, // eslint-disable-line
        value: React.PropTypes.string, // eslint-disable-line
      })
    )]),

  infoTimeFormat: React.PropTypes.string,

  /**
   * The radius of the dot at the end of the marker
   */
  markerRadius: React.PropTypes.number,

  /**
   * The y value is calculated by the column and event, but if
   * this prop is provided this will be used instead.
   */
  yValueFunc: React.PropTypes.func,

  /**
   * Offset the marker position in the x direction.
   */
  offsetX: React.PropTypes.number,

  /**
   * Offset the marker position in the y direction
   */
  offsetY: React.PropTypes.number,

  /**
   * [Internal] The timeScale supplied by the surrounding ChartContainer
   */
  timeScale: React.PropTypes.func.isRequired,

  /**
   * [Internal] The yScale supplied by the associated YAxis
   */
  yScale: React.PropTypes.func.isRequired,

  /**
   * [Internal] The width supplied by the surrounding ChartContainer
   */
  width: React.PropTypes.number.isRequired,

};

EventMarker.defaultProps = {
  column: 'value',
  infoStyle: {
    line: {
      stroke: '#999',
      cursor: 'crosshair',
      pointerEvents: 'none',
    },
    box: {
      fill: 'white',
      opacity: 0.90,
      stroke: '#999',
      pointerEvents: 'none',
    },
    dot: {
      fill: '#999',
    },
  },
  infoTimeFormat: '%m/%d/%y %X',
  infoWidth: 90,
  infoHeight: 25,
  markerRadius: 2,
  offsetX: 0,
  offsetY: 0,
};
