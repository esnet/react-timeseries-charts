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
import _ from "underscore";
import "./eventchart.css";

/**
 * Renders an event view that shows the supplied set of
 * events along a time axis.
 */
export default React.createClass({

    displayName: "EventChart",

    render() {
        var scale = this.props.timeScale;
        // Create and array of markers, one for each event
        var markers = [];
        markers = _.map(this.props.events, event => {
            var posx = scale(new Date(event.time));
            var transform = "translate(" + posx + ",0)";
            return (
                <g transform={transform} >
                    <rect className="eventchart-marker"
                          x={0} y={0}
                          width={2} height={30}/>
                    <text className="eventchart-marker-label"
                        x={4} y={10}>
                        {event.label}
                    </text>
                </g>
            );
        });

        return (
            <g>
                {markers}
            </g>
        );
    }
});
