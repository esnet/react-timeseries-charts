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
import { TimeRange } from "pondjs";

/**
 * Renders a band with extents defined by the supplied TimeRange.
 */
export default React.createClass({

    displayName: "TimeRangeMarker",

    propTypes: {
        timeRange: React.PropTypes.instanceOf(TimeRange).isRequired,
        style: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            spacing: 1,
            offset: 0,
            style: {
                fill: "rgba(70, 130, 180, 0.25)"
            }
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

            const timeOffset =
                this.props.timeScale.invert(xy0[0]).getTime() -
                this.props.timeScale.invert(xy[0]).getTime();

            let newBegin =
                this.state.brushingInitializationSite === "brush" ||
                this.state.brushingInitializationSite === "handle-left" ?
                    parseInt(this.state.initialBrushBeginTime - timeOffset, 10) :
                    this.state.initialBrushBeginTime;

            let newEnd =
                this.state.brushingInitializationSite === "brush" ||
                this.state.brushingInitializationSite === "handle-right" ?
                    parseInt(this.state.initialBrushEndTime - timeOffset, 10) :
                    this.state.initialBrushEndTime;

            if (this.props.onTimeRangeChanged) {
                this.props.onTimeRangeChanged(new TimeRange(newBegin, newEnd));
            }
        }
    },

    renderOverlay() {
        const { width, height } = this.props;
        const overlayStyle = {fill: "red", opacity: 0.1};
        return (
            <rect
                x={0} y={0}
                width={width} height={height}
                style={overlayStyle}
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
        let brushStyle = style ? style : {fill: "steelblue"};
        brushStyle.cursor = "move";

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

        // Style of the brush area
        let handleStyle = {fill: "green", opacity: 0.1, cursor: "ew-resize"};

        if (!viewport.disjoint(timeRange)) {
            const range = timeRange.intersection(viewport);
            const [ begin, end ] = range.toJSON();
            const [ x, y ] = [timeScale(begin), 0];
            const endPos = timeScale(end);
            
            let width = endPos - x;
            if (width < 1) {
                width = 1;
            }

            const handleWidth = 6;

            const boundsHandleLeft = {x: x - handleWidth/2, y, width: handleWidth, height};
            const boundsHandleRight = {x: x + width - handleWidth/2, y, width: handleWidth, height};

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
