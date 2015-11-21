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

export default React.createClass({

    displayName: "Tracker",

    propTypes: {
        style: React.PropTypes.object,
        position: React.PropTypes.instanceOf(Date),
        height: React.PropTypes.number,
        timeScale: React.PropTypes.func.isRequired
    },

    getDefaultProps() {
        return {
            offset: 0,
            style: {stroke: "#AAA", cursor: "crosshair"}
        };
    },

    render() {
        const posx = this.props.timeScale(this.props.position);
        if (posx) {
            return (
                <line style={this.props.style} x1={posx} y1={0}
                      x2={posx} y2={this.props.height} />
            );
        }
        return null;
    }
});
