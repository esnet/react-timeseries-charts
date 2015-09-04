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
import _ from "underscore";
import Polygon from "paths-js/polygon";
import Bezier from "paths-js/bezier";

export default React.createClass({

    getDefaultProps() {
        return {
            smooth: true,
            showPoints: false,
            pointRadius: 1.0,
            style: {
                color: "#9DA3FF",
                width: 1
            }
        };
    },

    /**
     * Uses paths.js to generate an SVG element for a path passing
     * through the points passed in. May be smoothed or not, depending
     * on this.props.smooth.
     */
    generatePath(points) {
        const fn = this.props.smooth ? Bezier : Polygon;
        return fn({points: points, closed: false}).path.print();
    },

    /**
     * Checks if the passed in point is within the bounds of the drawing area
     */
    inBounds(p) {
        return p[0] > 0 && p[0] < this.props.width;
    },

    /**
     * Returns the style used for drawing the path
     */
    pathStyle() {
        return {
            fill: "none",
            pointerEvents: "none",
            stroke: this.props.style.color || "#9DA3FF",
            strokeWidth: `${this.props.style.width}px` || "1px"
        };
    },

    renderLine() {
        // Map series data to scaled points and filter to bounds of drawing area
        const points = _.filter(
            _.map(this.props.series.toJSON().points, d => {
                return [this.props.timeScale(d[0]), this.props.yScale(d[1])];
            }), p => this.inBounds(p));

        return (
            <path style={this.pathStyle()}
                  onMouseMove={this.handleMouseMove}
                  d={this.generatePath(points)}
                  clipPath={this.props.clipPathURL}/>
        );
    },

    render() {
        return (
            <g>
                {this.renderLine()}
            </g>
        );
    }
});
