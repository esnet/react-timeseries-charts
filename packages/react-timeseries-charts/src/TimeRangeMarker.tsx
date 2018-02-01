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
import { TimeRange } from "pondjs";
import { ChartProps } from "./Charts";

type TimeRangeMarkerProps = ChartProps & {
    timerange: TimeRange,
    style?: React.CSSProperties,
    timeScale: (...args: any[]) => any,
    width: number,
    height: number
};

/**
 * Renders a band with extents defined by the supplied `TimeRange`. This
 * is a super simple component right now which just renders a simple
 * rectangle, in the style of the prop `style` across the timerange
 * specified. However, this is useful for highlighting a timerange to
 * correspond with another part of the your UI.
 *
 * See also the Brush component for a `TimeRange` marker that you can
 * resize interactively.
 */
export default class TimeRangeMarker extends React.Component<TimeRangeMarkerProps> {

    static defaultProps: Partial<TimeRangeMarkerProps> = {
        style: { fill: "rgba(70, 130, 180, 0.25);" }
    };

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
            const range = timerange.intersection(viewport) as TimeRange;
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
