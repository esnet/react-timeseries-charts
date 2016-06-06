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
        };
    },

    viewport() {
        const { width, timeScale } = this.props;
        const viewBeginTime = timeScale.invert(0);
        const viewEndTime = timeScale.invert(width);
        return new TimeRange(viewBeginTime, viewEndTime);
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

        document.addEventListener("mouseover", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);

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

        document.addEventListener("mouseover", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);

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

        document.removeEventListener("mouseover", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);

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
        const viewport = this.viewport();

        if (this.state.isBrushing) {
            const xy0 = this.state.initialBrushXYPosition;
            const tb = this.state.initialBrushBeginTime;
            const te = this.state.initialBrushEndTime;

            let newBegin, newEnd;
            if (this.state.brushingInitializationSite === "overlay") {
                
                const offset = getElementOffset(this.refs.overlay);
                const xx = e.pageX - offset.left;
                const t = this.props.timeScale.invert(xx).getTime();

                if (t < tb) {
                    newBegin = t < viewport.begin().getTime() ? viewport.begin() : t;
                    newEnd = tb > viewport.end().getTime() ? viewport.end() : tb;
                } else {
                    newBegin = tb < viewport.begin().getTime() ? viewport.begin() : tb;
                    newEnd = t > viewport.end().getTime() ? viewport.end() : t;
                }

            } else {

                let timeOffset =
                    this.props.timeScale.invert(xy0[0]).getTime() -
                    this.props.timeScale.invert(xy[0]).getTime();

                if (tb - timeOffset < viewport.begin()) {
                    timeOffset = tb - viewport.begin().getTime();
                }

                if (te - timeOffset > viewport.end()) {
                    timeOffset = te - viewport.end().getTime();
                }

                newBegin =
                    this.state.brushingInitializationSite === "brush" ||
                    this.state.brushingInitializationSite === "handle-left" ?
                        parseInt(tb - timeOffset, 10) : tb;
                newEnd =
                    this.state.brushingInitializationSite === "brush" ||
                    this.state.brushingInitializationSite === "handle-right" ?
                        parseInt(te - timeOffset, 10) : te;

                if (newBegin > newEnd) [newBegin, newEnd] = [newEnd, newBegin];
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
        const { timeRange, timeScale, height, style } = this.props;

        // Style of the brush area
        const brushDefaultStyle = {
            fill: "#777",
            fillOpacity: 0.3,
            stroke: "#fff",
            shapeRendering: "crispEdges",
            cursor: "move"
        };
        const brushStyle = merge(true, brushDefaultStyle, style);

        if (!this.viewport().disjoint(timeRange)) {
            const range = timeRange.intersection(this.viewport());
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
        const { timeRange, timeScale, height } = this.props;

        // Style of the handles
        const handleStyle = {
            fill: "white",
            opacity: 0,
            cursor: "ew-resize"
        };

        if (!this.viewport().disjoint(timeRange)) {
            const range = timeRange.intersection(this.viewport());
            const [ begin, end ] = range.toJSON();
            const [ x, y ] = [timeScale(begin), 0];
            const endPos = timeScale(end);
            
            let width = endPos - x;
            if (width < 1) {
                width = 1;
            }

            const handleSize = this.props.handleSize;

            const leftHandleBounds =
                {x, y, width: handleSize, height};
            const rightHandleBounds =
                {x: x + width - handleSize, y, width: handleSize, height};

            return (
                <g>
                    <rect
                        {...leftHandleBounds}
                        style={handleStyle}
                        pointerEvents="all"
                        onMouseDown={this.handleLeftHandleMouseDown}
                        onMouseUp={this.handleMouseUp} />
                    <rect
                        {...rightHandleBounds}
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
