/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from 'react';
import _ from 'underscore';

// Pond
import { TimeSeries } from 'pondjs';

// Imports from the charts library
import Baseline from '../../../components/Baseline';
import ChartContainer from '../../../components/ChartContainer';
import ChartRow from '../../../components/ChartRow';
import Charts from '../../../components/Charts';
import YAxis from '../../../components/YAxis';
import LineChart from '../../../components/LineChart';
import Resizable from '../../../components/Resizable';
import ScatterChart from '../../../components/ScatterChart';
import styler from '../../../js/styler';

// Data
const temperatures = require('./climate_data');

const points = [];
_.each(temperatures, (val) => {
  const index = `${val.year}`;
  const temperature = val.value;
  const fiveyear = val.fiveyr;
  points.push([index, temperature, fiveyear]);
});

console.log('CLIMATE', points);


const temperatureSeries = new TimeSeries({
  name: 'temperature anomoly',
  columns: ['index', 'temperature', 'five_year'],
  points,
});


//
// Styles
//

const baselineStyle = {
  line: {
    stroke: 'gray',
    strokeWidth: 1,
  },
};

const style = styler([
  { key: 'temperature', color: '#ccc', width: 1 },
  { key: 'five_year', color: 'black', width: 2 },
]);

const climate = React.createClass({

  renderChart() {
    const min = -0.5;
    const max = 1.0;

    const axisStyle = {
      labels: {
        labelColor: 'grey', // Default label color
        labelWeight: 100,
        labelSize: 11,
      },
      axis: {
        axisColor: 'grey',
        axisWidth: 1,
      },
    };

    return (
      <ChartContainer timeRange={temperatureSeries.range()} timeAxisStyle={axisStyle}>
        <ChartRow height="300">
          <YAxis
            id="axis"
            label="Temperature Anomaly (°C)"
            transition={300}
            style={axisStyle}
            labelOffset={0}
            min={min}
            max={max}
            format=",.1f"
            width="60"
            type="linear"
          />
          <Charts>
            <LineChart
              axis="axis"
              series={temperatureSeries}
              columns={['temperature']}
              style={style}
            />
            <ScatterChart
              axis="axis"
              series={temperatureSeries}
              columns={['temperature']}
              style={style}
            />
            <LineChart
              axis="axis"
              series={temperatureSeries}
              columns={['five_year']}
              style={style}
              interpolation="curveBasis"
            />
            <Baseline
              axis="axis"
              value={0.0}
              label="1951-1980 average"
              style={baselineStyle}
            />
          </Charts>
        </ChartRow>
      </ChartContainer>
    );
  },

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <Resizable>
              {this.renderChart()}
            </Resizable>
          </div>
        </div>
      </div>
    );
  },
});

// Export example
import climate_docs from "raw!./climate_docs.md";
import climate_thumbnail from "./climate_thumbnail.png";
export default {climate, climate_docs, climate_thumbnail};