/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from 'underscore';
import merge from 'merge';
import React from 'react';
import { TimeSeries, IndexedEvent, Event, min, avg, max, percentile } from 'pondjs';

import EventMarker from './EventMarker';
import { Styler } from '../js/styler';

const defaultStyle = {
  normal: { fill: 'steelblue', opacity: 0.8 },
  highlighted: { fill: 'steelblue', opacity: 1.0 },
  selected: { fill: 'steelblue', opacity: 1.0 },
  muted: { fill: 'steelblue', opacity: 0.4 },
};

/**
 * Renders a boxplot chart.
 */
export default class BoxChart extends React.Component {

  handleHover(e, event, column) {
    const bar = { event, column };
    if (this.props.onHighlightChange) {
      this.props.onHighlightChange(bar);
    }
  }

  handleHoverLeave() {
    if (this.props.onHighlightChange) {
      this.props.onHighlightChange(null);
    }
  }

  handleClick(e, event, column) {
    const bar = { event, column };
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(bar);
    }
    e.stopPropagation();
  }

  providedStyleMap(column) {
    let style = {};
    if (this.props.style) {
      if (this.props.style instanceof Styler) {
        style = this.props.style.barChartStyle()[column];
      } else if (_.isFunction(this.props.style)) {
        style = this.props.style(column);
      } else if (_.isObject(this.props.style)) {
        style = this.props.style ? this.props.style[column] : defaultStyle;
      }
    }
    return style;
  }

  /**
   * Returns the style used for drawing the path
   */
  style(column, event) {
    let style;
    const styleMap = this.providedStyleMap(column);

    const isHighlighted =
      this.props.highlighted &&
      column === this.props.highlighted.column &&
      Event.is(this.props.highlighted.event, event);

    const isSelected =
      this.props.selected &&
      column === this.props.selected.column &&
      Event.is(this.props.selected.event, event);

    if (this.props.selected) {
      if (isSelected) {
        style = merge(true,
                defaultStyle.selected,
                styleMap.selected ? styleMap.selected : {});
      } else if (isHighlighted) {
        style = merge(true,
                defaultStyle.highlighted,
                styleMap.highlighted ? styleMap.highlighted : {});
      } else {
        style = merge(true,
                defaultStyle.muted,
                styleMap.muted ? styleMap.muted : {});
      }
    } else if (isHighlighted) {
      style = merge(true,
              defaultStyle.highlighted,
              styleMap.highlighted ? styleMap.highlighted : {});
    } else {
      style = merge(true,
              defaultStyle.normal,
              styleMap.normal ? styleMap.normal : {});
    }

    return style;
  }

  renderBars() {
    const spacing = +this.props.spacing;
    const offset = +this.props.offset;
    const timeSeries = this.props.series;
    const timeScale = this.props.timeScale;
    const yScale = this.props.yScale;
    const column = this.props.column || 'value';

    const bars = [];
    let eventMarker;

    //
    // Convert the series
    //

    const aggregation = {min: {}, p25: {}, median: {}, p75: {}, max: {}};
    aggregation.min[column] = min();
    aggregation.p25[column] = percentile(25);
    aggregation.median[column] = percentile(50);
    aggregation.p75[column] = percentile(75);
    aggregation.max[column] = max();
    
    const series = timeSeries.fixedWindowRollup({
      windowSize: "5m",
      aggregation
    });

    for (const event of series.events()) {
      const begin = event.begin();
      const end = event.end();
      const beginPos = timeScale(begin) + spacing;
      const endPos = timeScale(end) - spacing;

      let width;
      if (this.props.size) {
        width = this.props.size;
      } else {
        width = endPos - beginPos;
      }

      if (width < 1) {
        width = 1;
      }

      let x;
      if (this.props.size) {
        const center = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;
        x = center - (this.props.size / 2);
      } else {
        x = timeScale(begin) + spacing;
      }

      const index = event.index();

      const perc25Value = event.get("p25");
      const perc75Value = event.get("p75");
      const medianValue = event.get("median");
      const rangeMin = event.get("min");
      const rangeMax = event.get("max");

      const styleInner = {fill: "steelblue", opacity: 0.5}; //this.style(column, event);
      const styleOuter = {fill: "steelblue", opacity: 0.2};
      const styleMedian = {fill: "steelblue", opacity: 1};

      const y0 = yScale(perc25Value);
      const y1 = yScale(perc75Value);
      const ymin = yScale(rangeMin);
      const ymax = yScale(rangeMax);
      const ymedian = yScale(medianValue);

        // Event marker if info provided and hovering
        /*
        const isHighlighted = this.props.highlighted &&
                    column === this.props.highlighted.column &&
                    Event.is(this.props.highlighted.event, event);
        if (isHighlighted && this.props.info) {
          eventMarker = (
            <EventMarker
              {...this.props}
              offsetX={offset}
              offsetY={yBase - ypos}
              event={event}
              column={column}
            />
          );
        }
        */
      
      const key1 = `${series.name()}-${index}-inner`;
      const box1 = { x, y: y1, width: width, height: y0 - y1 };
      const barProps1 = { key: key1, ...box1, style: styleInner };

      const key2 = `${series.name()}-${index}-range`;
      const box2 = { x, y: ymax, width: width, height: ymin - ymax, rx: 2, ry: 2 };
      const barProps2 = { key: key2, ...box2, style: styleOuter };

      const key3 = `${series.name()}-${index}-median`;
      const box3 = { x, y: ymedian, width: width, height: 1 };
      const barMedianProps = { key: key3, ...box3, style: styleMedian };

      bars.push(
        <rect {...barProps1} />
      );

      bars.push(
        <rect {...barProps2} />
      );
      bars.push(
        <rect {...barMedianProps} />
      );

    }

    return (
      <g>
        {bars}
        {/*eventMarker*/}
      </g>
    );
  }

  render() {
    return (
      <g>
        {this.renderBars()}
      </g>
    );
  }
}

BoxChart.propTypes = {
  /**
   * What [Pond TimeSeries](http://software.es.net/pond#timeseries)
   * data to visualize
   */
  series: React.PropTypes.instanceOf(TimeSeries).isRequired,

  /**
   * The distance in pixels to inset the bar chart from its actual timerange
   */
  spacing: React.PropTypes.number,

  /**
   * The distance in pixels to offset the bar from its center position within the timerange
   * it represents
   */
  offset: React.PropTypes.number,

  /**
   * A list of columns within the series that will be stacked on top of each other
   */
  columns: React.PropTypes.arrayOf(
    React.PropTypes.string
  ),

  /**
   * The style of the bar chart drawing (using SVG CSS properties).
   * This is an object with a key for each column which is being drawn,
   * per the `columns` prop. For each column a style is defined for
   * each state the bar may be in. This style is the CSS properties for
   * the underlying SVG <Rect>, so most likely you'll define fill and
   * opacity.
   *
   * For example:
   * ```
   * style = {
   *     columnName: {
   *         normal: {
   *             fill: "steelblue",
   *             opacity: 0.8,
   *         },
   *         highlighted: {
   *             fill: "#a7c4dd",
   *             opacity: 1.0,
   *         },
   *         selected: {
   *             fill: "orange",
   *             opacity: 1.0,
   *         },
   *         muted: {
   *             fill: "grey",
   *             opacity: 0.5
   *         }
   *     }
   * }
   * ```
   *
   * You can also supply a function, which will be called with an event
   * and column. The function should return an object containing the
   * four states (normal, highlighted, selected and muted) and the corresponding
   * CSS properties.
   */
  style: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.func,
    React.PropTypes.instanceOf(Styler),
  ]),

  /**
   * The style of the info box and connecting lines
   */
  infoStyle: React.PropTypes.object,  //eslint-disable-line

  /**
   * The width of the hover info box
   */
  infoWidth: React.PropTypes.number,  //eslint-disable-line

  /**
   * The height of the hover info box
   */
  infoHeight: React.PropTypes.number,  //eslint-disable-line

  /**
   * The values to show in the info box. This is an array of
   * objects, with each object specifying the label and value
   * to be shown in the info box.
   */
  info: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.string,  //eslint-disable-line
      value: React.PropTypes.string,  //eslint-disable-line
    })
  ),

  /**
   * If size is specified, then the bar will be this number of pixels wide. This
   * prop takes priority over "spacing".
   */
  size: React.PropTypes.number,

  /**
   * The selected item, which will be rendered in the "selected" style.
   * If a bar is selected, all other bars will be rendered in the "muted" style.
   *
   * See also `onSelectionChange`
   */
  selected: React.PropTypes.shape({
    event: React.PropTypes.instanceOf(IndexedEvent),
    column: React.PropTypes.string,
  }),

  /**
   * A callback that will be called when the selection changes. It will be called
   * with an object containing the event and column.
   */
  onSelectionChange: React.PropTypes.func,

  /**
   * The highlighted item, which will be rendered in the "highlighted" style.
   *
   * See also `onHighlightChange`
   */
  highlighted: React.PropTypes.shape({
    event: React.PropTypes.instanceOf(IndexedEvent),
    column: React.PropTypes.string,
  }),

  /**
   * A callback that will be called when the hovered over bar changes.
   * It will be called with an object containing the event and column.
   */
  onHighlightChange: React.PropTypes.func,

  /**
   * [Internal] The timeScale supplied by the surrounding ChartContainer
   */
  timeScale: React.PropTypes.func,

  /**
   * [Internal] The yScale supplied by the associated YAxis
   */
  yScale: React.PropTypes.func,

};

BoxChart.defaultProps = {
  columns: ['value'],
  spacing: 1.0,
  offset: 0,
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
  infoWidth: 90,
  infoHeight: 30,
};
