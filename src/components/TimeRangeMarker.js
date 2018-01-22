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
import PropTypes from "prop-types";
import { TimeRange } from "pondjs";

/**
 * Renders a band with extents defined by the supplied TimeRange. This
 * is a super simple component right now which just renders a simple
 * rectangle, in the style of the prop `style` across the timerange
 * specified. However, this is useful for highlighting a timerange to
 * correspond with another part of the your UI.
 *
 * See also the Brush component for a TimeRange marker that you can
 * resize interactively.
 */
export default class TimeRangeMarker extends React.Component {
    renderBand() {
        const timerange = this.props.timerange;
        const timeScale = this.props.timeScale;

        // Viewport bounds
        const viewBeginTime = timeScale.invert(0);
        const viewEndTime = timeScale.invert(this.props.width);
        const viewport = new TimeRange(viewBeginTime, viewEndTime);

        let bandStyle;
        if (this.props.style) {
            bandStyle = this.props.style;
        } else {
            bandStyle = { fill: "steelblue" };
        }

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
                <rect
                    x={beginPos}
                    y={0}
                    width={width}
                    height={this.props.height}
                    style={bandStyle}
                />
            );
        }
        return <g />;
    }

    render() {
        return <g>{this.renderBand()}</g>;
    }
}

TimeRangeMarker.propTypes = {
    /**
     * Show or hide this marker
     */
    visible: PropTypes.bool,

    /**
     * The timerange to mark. This is in the form of a
     * [Pond TimeRange](https://esnet-pondjs.appspot.com/#/timerange)
     */
    timerange: PropTypes.instanceOf(TimeRange).isRequired,

    /**
     * The style of the rect that will be rendered as a SVG <Rect>. This
     * object is the inline CSS for that rect.
     */
    style: PropTypes.object, // eslint-disable-line

    /**
     * [Internal] The timeScale supplied by the surrounding ChartContainer
     */
    timeScale: PropTypes.func.isRequired,

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width: PropTypes.number.isRequired,

    /**
     * [Internal] The height supplied by the surrounding ChartContainer
     */
    height: PropTypes.number.isRequired
};

TimeRangeMarker.defaultProps = {
    visible: true,
    spacing: 1,
    offset: 0,
    style: { fill: "rgba(70, 130, 180, 0.25);" }
};
