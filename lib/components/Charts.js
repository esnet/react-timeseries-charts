"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * The `<Charts>` element is a grouping for charts within a row.
 * It takes no props. Each chart within the group will be overlaid
 * on top of each other.
 *
 * Here is an example of two line charts within a `<Charts>` group:
 *
 * ```xml
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis/>
 *         <Charts>
 *             <LineChart axis="aud" series={audSeries} style={audStyle}/>
 *             <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
 *         </Charts>
 *         <YAxis/>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 *
 * ## Making your own chart
 *
 * Anything within this grouping is considered a chart, meaning it will have
 * certain props injected into it. As a result you can easily implement your own chart
 * by simply expecting to have these props available and rendering as such.
 *
 * For your own chart, the render() method should return a SVG group `<g>` at the
 * top level, and then your chart rendering within that.
 *
 * In addition to any props you add to your chart, the following props are passed into
 * each chart automatically:
 *
 * #### timeScale
 *
 * A d3 scale for the time axis which you can use to transform your data in the x direction
 *
 * #### yScale
 *
 * A d3 scale for the y-axis which you can use to transform your data in the y direction
 *
 * #### transition
 *
 * The time in ms it is expected the code will take to move from one state to another
 *
 */
exports.default = _react2.default.createClass({

    displayName: "Charts",

    render: function render() {
        return this.constructor.name + " elements are for configuration only\nand should not be rendered";
    }
}); /**
     *  Copyright (c) 2015, The Regents of the University of California,
     *  through Lawrence Berkeley National Laboratory (subject to receipt
     *  of any required approvals from the U.S. Dept. of Energy).
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree.
     */