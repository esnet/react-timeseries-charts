/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";

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
 * #### width
 *
 * A the width your chart will render into
 */
export default class Charts extends React.Component {
    render() {
        return `${this.constructor.name} elements are for configuration only
and should not be rendered`;
    }
}
