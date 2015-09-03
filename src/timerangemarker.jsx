/*
 * ESnet React Charts, Copyright (c) 2015, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
 *
 * If you have questions about your rights to use or distribute this
 * software, please contact Berkeley Lab's Technology Transfer
 * Department at TTD@lbl.gov.
 *
 * NOTICE.  This software is owned by the U.S. Department of Energy.
 * As such, the U.S. Government has been granted for itself and others
 * acting on its behalf a paid-up, nonexclusive, irrevocable,
 * worldwide license in the Software to reproduce, prepare derivative
 * works, and perform publicly and display publicly.  Beginning five
 * (5) years after the date permission to assert copyright is obtained
 * from the U.S. Department of Energy, and subject to any subsequent
 * five (5) year renewals, the U.S. Government is granted for itself
 * and others acting on its behalf a paid-up, nonexclusive,
 * irrevocable, worldwide license in the Software to reproduce,
 * prepare derivative works, distribute copies to the public, perform
 * publicly and display publicly, and to permit others to do so.
 *
 * This code is distributed under a BSD style license, see the LICENSE
 * file for complete information.
 */

import React from "react/addons";
import d3 from "d3";
import _ from "underscore";
import {TimeRange} from "@esnet/pond";

/**
 * Renders a band with extents defined by the supplied TimeRange.
 */
export default React.createClass({

    displayName: "TimeRangeMarker",

    propTypes: {
        timerange: React.PropTypes.instanceOf(TimeRange).isRequired,
        style: React.PropTypes.object,
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
        const yScale = this.props.yScale;

        //Viewport bounds
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
                <rect x={beginPos} y={0} width={width} height={this.props.height}
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
