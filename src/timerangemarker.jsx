/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { TimeRange } from "pondjs";

/**
 * Renders a band with extents defined by the supplied TimeRange.
 */
export default React.createClass({

    displayName: "TimeRangeMarker",

    propTypes: {
        timerange: React.PropTypes.instanceOf(TimeRange).isRequired,
        style: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            spacing: 1,
            offset: 0,
            style: {fill: "rgba(70, 130, 180, 0.25);"}
        };
    },

    renderBand() {
        const timerange = this.props.timerange;
        const timeScale = this.props.timeScale;

        // Viewport bounds
        const viewBeginTime = timeScale.invert(0);
        const viewEndTime = timeScale.invert(this.props.width);
        const viewport = new TimeRange(viewBeginTime, viewEndTime);

        const cursor = this.props.isPanning ? "-webkit-grabbing" : "default";

        let bandStyle;
        if (this.props.style) {
            bandStyle = this.props.style;
        } else {
            bandStyle = {fill: "steelblue"};
        }

        bandStyle.cursor = cursor;

        if (!viewport.disjoint(timerange)) {
            const range = timerange.intersection(viewport);
            const begin = range.begin();
            const end = range.end();
            const beginPos = timeScale(begin);
            const endPos = timeScale(end);
            let width = endPos - beginPos;
            if (width < 1) {
                width = 1;
            }
            return (
                <rect x={beginPos} y={0}
                      width={width} height={this.props.height}
                      style={bandStyle}
                      clipPath={this.props.clipPathURL}/>
            );
        }
    },

    render() {
        return (
            <g>
                {this.renderBand()}
            </g>
        );
    }
});
