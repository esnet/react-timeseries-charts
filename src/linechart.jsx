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
import { TimeSeries } from "pondjs";

function scaleAsString(scale) {
    return `${scale.domain()}-${scale.range()}`;
}

export default React.createClass({

    getDefaultProps() {
        return {
            smooth: true,
            style: {
                color: "#9DA3FF",
                width: 1
            },
            breakLine: true
        };
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

    /**
     * Uses paths.js to generate an SVG element for a path passing
     * through the points passed in. May be smoothed or not, depending
     * on this.props.smooth.
     */
    generatePath(points) {
        const fn = !this.props.smooth || points.length < 3 ? Polygon : Bezier;
        return fn({points, closed: false}).path.print();
    },

    renderPath(points, key) {
        return (
            <path
                key={key}
                style={this.pathStyle()}
                d={this.generatePath(points)}
                clipPath={this.props.clipPathURL} />
        );
    },

    renderLines() {
        const pathLines = [];
        let count = 1;
        if (this.props.breakLine) {
            // Remove nulls and NaNs from the line
            let currentPoints = null;
            _.each(this.props.series.toJSON().points, d => {
                const value = d[1];
                const badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                if (!badPoint) {
                    if (!currentPoints) {
                        currentPoints = [];
                    }
                    currentPoints.push([d[0], d[1]]);
                } else {
                    if (currentPoints) {
                        const points = _.map(currentPoints,
                            d => [this.props.timeScale(d[0]), this.props.yScale(d[1])]
                        );
                        if (points.length > 1) {
                            pathLines.push(this.renderPath(points, count++));
                        }
                        currentPoints = null;
                    }
                }
            });
            if (currentPoints) {
                const points = _.map(currentPoints,
                    d => [this.props.timeScale(d[0]), this.props.yScale(d[1])]
                );
                if (points.length > 1) {
                    pathLines.push(this.renderPath(points, count));
                }
            }
        } else {
            // Remove nulls and NaNs from the line
            const cleanedPoints = [];
            _.each(this.props.series.toJSON().points, d => {
                const value = d[1];
                const badPoint = _.isNull(value) || _.isNaN(value) || !_.isFinite(value);
                if (!badPoint) {
                    cleanedPoints.push([d[0], d[1]]);
                }
            });

            // Map series data to scaled points and filter to bounds of drawing area
            const points = _.map(cleanedPoints,
                d => [this.props.timeScale(d[0]), this.props.yScale(d[1])]
            );

            pathLines.push(this.renderPath(points, count));
        }
        return (
            <g>
                {pathLines}
            </g>
        );
    },

    shouldComponentUpdate(nextProps) {
        const newSeries = nextProps.series;
        const oldSeries = this.props.series;

        const timeScale = nextProps.timeScale;
        const yScale = nextProps.yScale;
        const interpolate = nextProps.interpolate;
        const isPanning = nextProps.isPanning;

        // What changed?
        const timeScaleChanged =
            (scaleAsString(this.props.timeScale) !== scaleAsString(timeScale));
        const yAxisScaleChanged =
            (scaleAsString(this.props.yScale) !== scaleAsString(yScale));
        const interpolateChanged =
            (this.props.interpolate !== interpolate);
        const isPanningChanged =
            (this.props.isPanning !== isPanning);

        let seriesChanged = false;
        if (oldSeries.length !== newSeries.length) {
            seriesChanged = true;
        } else {
            seriesChanged = !TimeSeries.is(oldSeries, newSeries);
        }

        return (
            seriesChanged ||
            timeScaleChanged ||
            interpolateChanged ||
            isPanningChanged ||
            yAxisScaleChanged);
    },

    render() {
        return (
            <g >
                {this.renderLines()}
            </g>
        );
    }
});
