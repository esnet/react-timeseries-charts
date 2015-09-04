/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react/addons";
import invariant from "react/lib/invariant";

/**
 * A Charts component is a grouping of charts which will be composited on top of
 * each other. It does no actual rendering itself, but instead is used for
 * organizing ChartRow children. There must be one, and only one, Charts
 * grouping within a ChartRow. All children of a ChartRow, for which there must
 * be at least one, are considered a chart. They should return an SVG <g>
 * containing their render.
 */
export default React.createClass({

    displayName: "Charts",

    render() {
        invariant(false,
            `${this.constructor.name} elements are for schema configuration only
and should not be rendered`
        );
    }
});
