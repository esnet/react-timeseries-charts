/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import React from "react";
import { easeSinOut } from "d3-ease";
import { scaleLinear, scaleLog, scalePow } from "d3-scale";

import Brush from "./Brush";
import Charts from "./Charts";
import TimeMarker from "./TimeMarker";
import YAxis from "./YAxis";
import ScaleInterpolator from "../js/interpolators";

const AXIS_MARGIN = 5;

function createScale(yaxis, type, min, max, y0, y1) {
  let scale;
  if (_.isUndefined(min) || _.isUndefined(max)) {
    scale = null;
  } else if (type === "linear") {
    scale = scaleLinear().domain([min, max]).range([y0, y1]).nice();
  } else if (type === "log") {
    const base = yaxis.props.logBase || 10;
    scale = scaleLog().base(base).domain([min, max]).range([y0, y1]);
  } else if (type === "power") {
    const power = yaxis.props.powerExponent || 2;
    scale = scalePow().exponent(power).domain([min, max]).range([y0, y1]);
  }
  return scale;
}

/**
 * A ChartRow is a container for a set of YAxis and multiple charts
 * which are overlaid on each other in a central canvas.
 *
 * Here is an example where a single `<ChartRow>` is defined within
 * the `<ChartContainer>`. Of course you can have any number of rows.
 *
 * For this row we specify the one prop `height` as 200 pixels high.
 *
 * Within the `<ChartRow>` we add:
 *
 * * `<YAxis>` elements for axes to the left of the chart
 * * `<Chart>` block containing our central chart area
 * * `<YAxis>` elements for our axes to the right of the charts
 *
 * ```
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis />
 *         <YAxis />
 *         <Charts>
 *             charts...
 *        </Charts>
 *         <YAxis />
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
export default class ChartRow extends React.Component {
  constructor(props) {
    super(props);

    // id of clipping rectangle we will generate and use for each child
    // chart. Lives in state to ensure just one clipping rectangle and
    // id per chart row instance; we don't want a fresh id generated on
    // each render.
    const clipId = _.uniqueId("clip_");
    const clipPathURL = `url(#${clipId})`;
    this.state = {
      clipId,
      clipPathURL
    };
  }

  componentWillMount() {
    // Our chart scales are driven off a mapping between id of the axis
    // and the scale that axis represents. Depending on the transition time,
    // this scale will animate over time. The controller of this animation is
    // the ScaleInterpolator. We create new Scale Interpolators here for each
    // axis id.
    this.scaleMap = {};

    const innerHeight = +this.props.height - AXIS_MARGIN * 2;
    const rangeTop = AXIS_MARGIN;
    const rangeBottom = innerHeight - AXIS_MARGIN;
    React.Children.forEach(this.props.children, child => {
      if (
        (child.type === YAxis ||
          _.has(child.props, "min")) && _.has(child.props, "max")
      ) {
        const { id, max, min, transition = 0, type = "linear" } = child.props;
        const initialScale = createScale(
          child,
          type,
          min,
          max,
          rangeBottom,
          rangeTop
        );
        this.scaleMap[id] = new ScaleInterpolator(transition, easeSinOut, s => {
          const yAxisScalerMap = this.state.yAxisScalerMap;
          yAxisScalerMap[id] = s;
          this.setState(yAxisScalerMap);
        });
        const cacheKey = `${type}-${min}-${max}-${rangeBottom}-${rangeTop}`;
        this.scaleMap[id].setScale(cacheKey, initialScale);
      }
    });

    const scalerMap = {};
    _.forEach(this.scaleMap, (interpolator, id) => {
      scalerMap[id] = interpolator.scaler();
    });

    this.setState({ yAxisScalerMap: scalerMap });
  }

  /**
   * When we get changes to the row's props we update our map of
   * axis scales.
   */
  componentWillReceiveProps(nextProps) {
    const innerHeight = +nextProps.height - AXIS_MARGIN * 2;
    const rangeTop = AXIS_MARGIN;
    const rangeBottom = innerHeight - AXIS_MARGIN;

    // Loop over all the children who are YAxis. If this is our first
    // time here, we'll populate the scaleMap with new ScaleInterpolators.
    // If we already have a ScaleInterpolator then we can set a new scale
    // target on it.
    React.Children.forEach(nextProps.children, child => {
      if (
        (child.type === YAxis ||
          _.has(child.props, "min")) && _.has(child.props, "max")
      ) {
        const { id, max, min, transition = 0, type = "linear" } = child.props;

        const scale = createScale(child, type, min, max, rangeBottom, rangeTop);
        if (!_.has(this.scaleMap, id)) {
          // No scale map yet, create one on this.state.yAxisScalarMap
          this.scaleMap[
            id
          ] = new ScaleInterpolator(transition, easeSinOut, s => {
            const yAxisScalerMap = this.state.yAxisScalerMap;
            yAxisScalerMap[id] = s;
            this.setState(yAxisScalerMap);
          });
        }
        const cacheKey = `${type}-${min}-${max}-${rangeBottom}-${rangeTop}`;
        this.scaleMap[id].setScale(cacheKey, scale);
      }
    });

    const scalerMap = {};
    _.forEach(this.scaleMap, (interpolator, id) => {
      scalerMap[id] = interpolator.scaler();
    });

    this.setState({ yAxisScalerMap: scalerMap });
  }

  render() {
    const axes = []; // Contains all the yAxis elements used in the render
    const chartList = []; // Contains all the Chart elements used in the render
    // Dimensions
    const innerHeight = +this.props.height - AXIS_MARGIN * 2;

    //
    // Build a map of elements that occupy left or right slots next to the
    // chart.
    //
    // If an element has both and id and a min/max range, then we consider
    // it to be a y axis. For those we calculate a d3 scale that can be
    // reference by a chart. That scale will also be available to the axis
    // when it renders.
    //
    // For this row, we will need to know how many axis slots we are using.
    //

    const yAxisMap = {}; // Maps axis id -> axis element
    const leftAxisList = []; // Ordered list of left axes ids
    const rightAxisList = []; // Ordered list of right axes ids
    let alignLeft = true;
    React.Children.forEach(this.props.children, child => {
      if (child.type === Charts) {
        alignLeft = false;
      } else {
        const id = child.props.id;
        // Check to see if we think this 'axis' is actually an axis
        if (
          (child.type === YAxis ||
            _.has(child.props, "min")) && _.has(child.props, "max")
        ) {
          const yaxis = child;

          if (yaxis.props.id) {
            // Relate id to the axis
            yAxisMap[yaxis.props.id] = yaxis;
          }

          // Columns counts
          if (alignLeft) {
            leftAxisList.push(id);
          } else {
            rightAxisList.push(id);
          }
        }
      }
    });

    // Since we'll be building the left axis items from the
    // inside to the outside
    leftAxisList.reverse();

    //
    // Push each axis onto the axes, transforming each into its
    // column location
    //

    let transform;
    let id;
    let props;
    let axis;
    let posx = 0;

    // Space used by columns on left and right of charts
    const leftWidth = _.reduce(this.props.leftAxisWidths, (a, b) => a + b, 0);
    const rightWidth = _.reduce(this.props.rightAxisWidths, (a, b) => a + b, 0);

    posx = leftWidth;
    for (
      let leftColumnIndex = 0;
      leftColumnIndex < this.props.leftAxisWidths.length;
      leftColumnIndex += 1
    ) {
      const colWidth = this.props.leftAxisWidths[leftColumnIndex];

      posx -= colWidth;

      if (leftColumnIndex < leftAxisList.length) {
        id = leftAxisList[leftColumnIndex];
        transform = `translate(${posx},0)`;

        // Additional props for left aligned axes
        props = {
          width: colWidth,
          height: innerHeight,
          align: "left",
          scale: this.scaleMap[id].latestScale()
        };

        // Cloned left axis
        axis = React.cloneElement(yAxisMap[id], props);

        axes.push(
          <g key={`y-axis-left-${leftColumnIndex}`} transform={transform}>
            {axis}
          </g>
        );
      }
    }

    posx = this.props.width - rightWidth;
    for (
      let rightColumnIndex = 0;
      rightColumnIndex < this.props.rightAxisWidths.length;
      rightColumnIndex += 1
    ) {
      const colWidth = this.props.rightAxisWidths[rightColumnIndex];

      if (rightColumnIndex < rightAxisList.length) {
        id = rightAxisList[rightColumnIndex];
        transform = `translate(${posx},0)`;

        // Additional props for right aligned axes
        props = {
          width: colWidth,
          height: innerHeight,
          align: "right",
          scale: this.scaleMap[id].latestScale()
        };

        // Cloned right axis
        axis = React.cloneElement(yAxisMap[id], props);

        axes.push(
          <g key={`y-axis-right-${rightColumnIndex}`} transform={transform}>
            {axis}
          </g>
        );
      }

      posx += colWidth;
    }

    //
    // Push each chart onto the chartList, transforming each to the right
    // of the left axis slots and specifying its width. Each chart is passed
    // its time and y-scale. The y-scale is looked up in scaleMap, whose
    // current value is stored in the component state.
    //

    const chartWidth = this.props.width - leftWidth - rightWidth;
    const chartTransform = `translate(${leftWidth},0)`;

    let keyCount = 0;
    React.Children.forEach(this.props.children, child => {
      if (child.type === Charts) {
        const charts = child;
        React.Children.forEach(charts.props.children, chart => {
          let scale = null;
          if (_.has(this.state.yAxisScalerMap, chart.props.axis)) {
            scale = this.state.yAxisScalerMap[chart.props.axis];
          }

          let ytransition = null;
          if (_.has(this.scaleMap, chart.props.axis)) {
            ytransition = this.scaleMap[chart.props.axis];
          }

          const chartProps = {
            key: keyCount,
            width: chartWidth,
            height: innerHeight,
            timeScale: this.props.timeScale,
            timeFormat: this.props.timeFormat,
          };

          if (scale) {
            chartProps.yScale = scale;
          }

          if (ytransition) {
            chartProps.transition = ytransition;
          }

          chartList.push(React.cloneElement(chart, chartProps));
          keyCount += 1;
        });
      }
    });

    //
    // Push each child Brush on to the brush list.  We need brushed to be
    // rendered last (on top) of everything else in the Z order, both for
    // visual correctness and to ensure that the brush gets mouse events
    // before anything underneath
    //

    const brushList = [];
    keyCount = 0;
    React.Children.forEach(this.props.children, child => {
      if (child.type === Brush) {
        const brushProps = {
          key: `brush-${keyCount}`,
          width: chartWidth,
          height: innerHeight,
          timeScale: this.props.timeScale
        };
        brushList.push(React.cloneElement(child, brushProps));
      }
      keyCount += 1;
    });

    const charts = (
      <g transform={chartTransform} key="event-rect-group">
        <g key="charts" clipPath={this.state.clipPathURL}>
          {chartList}
        </g>
      </g>
    );

    //
    // Clipping
    //
    const clipper = (
      <defs>
        <clipPath id={this.state.clipId}>
          <rect x="0" y="0" width={chartWidth} height={innerHeight} />
        </clipPath>
      </defs>
    );

    //
    // Brush
    //
    const brushes = (
      <g transform={chartTransform} key="brush-group">
        {brushList}
      </g>
    );

    //
    // TimeMarker used as a tracker
    //
    let tracker;
    if (this.props.trackerTime) {
      const timeFormat = this.props.trackerTimeFormat || this.props.timeFormat;
      const timeMarkerProps = {
        timeFormat,
        showLine: false,
        showTime: this.props.trackerShowTime,
        time: this.props.trackerTime,
        timeScale: this.props.timeScale,
        width: chartWidth
      };
      if (this.props.trackerInfoValues) {
        timeMarkerProps.infoWidth = this.props.trackerInfoWidth;
        timeMarkerProps.infoHeight = this.props.trackerInfoHeight;
        timeMarkerProps.infoValues = this.props.trackerInfoValues;
        timeMarkerProps.timeFormat = this.props.trackerInfoTimeFormat;
      }
      const trackerStyle = {
        pointerEvents: "none"
      };
      const trackerTransform = `translate(${leftWidth},0)`;

      tracker = (
        <g
          key="tracker-group"
          style={trackerStyle}
          transform={trackerTransform}
        >
          <TimeMarker {...timeMarkerProps} />
        </g>
      );
    }

    return (
      <g>
        {clipper}
        {axes}
        {charts}
        {brushes}
        {tracker}
      </g>
    );
  }
}

ChartRow.defaultProps = {
  trackerTimeFormat: "%b %d %Y %X",
  enablePanZoom: false,
  height: 100
};

ChartRow.propTypes = {
  /**
   * The height of the row.
   */
  height: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  leftAxisWidths: React.PropTypes.arrayOf(React.PropTypes.number),
  rightAxisWidths: React.PropTypes.arrayOf(React.PropTypes.number),
  width: React.PropTypes.number,
  timeScale: React.PropTypes.func,
  trackerTimeFormat: React.PropTypes.string,
  timeFormat: React.PropTypes.string,
  trackerTime: React.PropTypes.instanceOf(Date),
  /**
   * Should the time be shown on top of the tracker info box
   */
  trackerShowTime: React.PropTypes.bool,
  /**
   * The width of the tracker info box
   */
  trackerInfoWidth: React.PropTypes.number,
  /**
   * The height of the tracker info box
   */
  trackerInfoHeight: React.PropTypes.number,
  /**
   * Info box value or values to place next to the tracker line
   * This is either an array of objects, with each object
   * specifying the label (a string) and value (also a string)
   * to be shown in the info box, or a simple string label.
   */
  trackerInfoValues: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.arrayOf(React.PropTypes.shape({
        label: React.PropTypes.string, // eslint-disable-line
        value: React.PropTypes.string // eslint-disable-line
      }))
  ])
};
