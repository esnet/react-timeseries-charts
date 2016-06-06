/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import merge from "merge";
import { TimeRange } from "pondjs";

// http://stackoverflow.com/a/28857255
function getElementOffset(element) {
    const de = document.documentElement;
    const box = element.getBoundingClientRect();
    const top = box.top + window.pageYOffset - de.clientTop;
    const left = box.left + window.pageXOffset - de.clientLeft;
    return {top, left};
}

/**
 * Renders a brush with the range defined in the prop `timeRange`.
 */
export default React.createClass({

    displayName: "Brush",

    propTypes: {
        timeRange: React.PropTypes.instanceOf(TimeRange).isRequired,
        style: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            handleSize: 6
        };
    },

    getInitialState() {
        return {
            isBrushing: false
        }
    },

    handleBrushMouseDown(e) {
        e.preventDefault();

        const x = e.pageX;
        const y = e.pageY;
        const xy0 = [Math.round(x), Math.round(y)];
        const begin = this.props.timeRange.begin().getTime();
        const end = this.props.timeRange.end().getTime();

        this.setState({
            isBrushing: true,
            brushingInitializationSite: "brush",
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0
        });
    },

    handleOverlayMouseDown(e) {
        e.preventDefault();

        const offset = getElementOffset(this.refs.overlay);
        const x = e.pageX - offset.left;
        const t = this.props.timeScale.invert(x).getTime();
        this.setState({
            isBrushing: true,
            brushingInitializationSite: "overlay",
            initialBrushBeginTime: t,
            initialBrushEndTime: t,
            initialBrushXYPosition: null
        });
    },

    handleLeftHandleMouseDown(e) {
        e.preventDefault();

        const x = e.pageX;
        const y = e.pageY;
        const xy0 = [Math.round(x), Math.round(y)];
        const begin = this.props.timeRange.begin().getTime();
        const end = this.props.timeRange.end().getTime();

        this.setState({
            isBrushing: true,
            brushingInitializationSite: "handle-left",
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0
        });
    },

    handleRightHandleMouseDown(e) {
        e.preventDefault();

        const x = e.pageX;
        const y = e.pageY;
        const xy0 = [Math.round(x), Math.round(y)];
        const begin = this.props.timeRange.begin().getTime();
        const end = this.props.timeRange.end().getTime();

        this.setState({
            isBrushing: true,
            brushingInitializationSite: "handle-right",
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0
        });
    },

    handleMouseUp(e) {
        e.preventDefault();
        this.setState({
            isBrushing: false,
            brushingInitializationSite: null,
            initialBrushBeginTime: null,
            initialBrushEndTime: null,
            initialBrushXYPosition: null
        });
    },

    handleMouseMove(e) {
        e.preventDefault();

        const x = e.pageX;
        const y = e.pageY;
        const xy = [Math.round(x), Math.round(y)];

        if (this.state.isBrushing) {
            const xy0 = this.state.initialBrushXYPosition;
            let newBegin, newEnd;
            if (this.state.brushingInitializationSite === "overlay") {
                const offset = getElementOffset(this.refs.overlay);
                const xx = e.pageX - offset.left;
                const t = this.props.timeScale.invert(xx).getTime();
                if (t < this.state.initialBrushBeginTime) {
                    newBegin = t;
                    newEnd = this.state.initialBrushBeginTime;
                } else {
                    newBegin = this.state.initialBrushBeginTime;
                    newEnd = t;
                }
            } else {
                const timeOffset =
                    this.props.timeScale.invert(xy0[0]).getTime() -
                    this.props.timeScale.invert(xy[0]).getTime();
                newBegin =
                    this.state.brushingInitializationSite === "brush" ||
                    this.state.brushingInitializationSite === "handle-left" ?
                        parseInt(this.state.initialBrushBeginTime - timeOffset, 10) :
                        this.state.initialBrushBeginTime;
                newEnd =
                    this.state.brushingInitializationSite === "brush" ||
                    this.state.brushingInitializationSite === "handle-right" ?
                        parseInt(this.state.initialBrushEndTime - timeOffset, 10) :
                        this.state.initialBrushEndTime;
            }


            if (this.props.onTimeRangeChanged) {
                this.props.onTimeRangeChanged(new TimeRange(newBegin, newEnd));
            }
        }
    },

    renderOverlay() {
        const { width, height } = this.props;
        const overlayStyle = {
            fill: "white",
            opacity: 0,
            cursor: "crosshair"
        };
        return (
            <rect
                ref="overlay"
                x={0} y={0}
                width={width} height={height}
                style={overlayStyle}
                onMouseDown={this.handleOverlayMouseDown}
                onMouseUp={this.handleMouseUp}
                clipPath={this.props.clipPathURL} />
        );
    },

    renderBrush() {
        const { timeRange, timeScale, width, height, style } = this.props;

        // Viewport bounds
        const viewBeginTime = timeScale.invert(0);
        const viewEndTime = timeScale.invert(width);
        const viewport = new TimeRange(viewBeginTime, viewEndTime);

        // Style of the brush area
        const brushDefaultStyle = {
            fill: "#777",
            fillOpacity: 0.3,
            stroke: "#fff",
            shapeRendering: "crispEdges",
            cursor: "move"
        };
        const brushStyle = merge(true, brushDefaultStyle, style);

        if (!viewport.disjoint(timeRange)) {
            const range = timeRange.intersection(viewport);
            const begin = range.begin();
            const end = range.end();
            const [ x, y ] = [timeScale(begin), 0];
            const endPos = timeScale(end);
            let width = endPos - x;
            if (width < 1) {
                width = 1;
            }

            const bounds = {x, y, width, height};

            return (
                <rect
                    {...bounds}
                    style={brushStyle}
                    pointerEvents="all"
                    onMouseDown={this.handleBrushMouseDown}
                    onMouseUp={this.handleMouseUp}
                    clipPath={this.props.clipPathURL} />
            );
        }
    },

    renderHandles() {
        const { timeRange, timeScale, width, height, style } = this.props;

        // Viewport bounds
        const viewBeginTime = timeScale.invert(0);
        const viewEndTime = timeScale.invert(width);
        const viewport = new TimeRange(viewBeginTime, viewEndTime);

        // Style of the handles
        const handleStyle = {
            fill: "white",
            opacity: 0,
            cursor: "ew-resize"
        };

        if (!viewport.disjoint(timeRange)) {
            const range = timeRange.intersection(viewport);
            const [ begin, end ] = range.toJSON();
            const [ x, y ] = [timeScale(begin), 0];
            const endPos = timeScale(end);
            
            let width = endPos - x;
            if (width < 1) {
                width = 1;
            }

            const handleSize = this.props.handleSize;

            const boundsHandleLeft = {x: x, y, width: handleSize, height};
            const boundsHandleRight = {x: x + width - handleSize, y, width: handleSize, height};

            return (
                <g>
                    <rect
                        {...boundsHandleLeft}
                        style={handleStyle}
                        pointerEvents="all"
                        onMouseDown={this.handleLeftHandleMouseDown}
                        onMouseUp={this.handleMouseUp} />
                    <rect
                        {...boundsHandleRight}
                        style={handleStyle}
                        pointerEvents="all"
                        onMouseDown={this.handleRightHandleMouseDown}
                        onMouseUp={this.handleMouseUp} />
                </g>
            );
        }
    },

    render() {
        return (
            <g onMouseMove={this.handleMouseMove}>
                {this.renderOverlay()}
                {this.renderBrush()}
                {this.renderHandles()}
            </g>
        );
    }
});
