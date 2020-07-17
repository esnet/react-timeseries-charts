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
import ReactDOM from "react-dom"; // eslint-disable-line
import PropTypes from "prop-types";

import { TimeRange } from "pondjs";

import { getElementOffset } from "../js/util";

/**
 * Internal component which provides the top level event catcher for the charts.
 * This is a higher order component. It wraps a tree of SVG elements below it,
 * passed in as this.props.children, and catches events that they do not handle.
 *
 * The EventHandler is responsible for pan and zoom events as well as other click
 * and hover actions.
 */
export default class EventHandler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPanning: false,
            initialPanBegin: null,
            initialPanEnd: null,
            initialPanPosition: null
        };

        this.handleScrollWheel = this.handleScrollWheel.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    componentDidMount() {
        this.eventHandlerRef.addEventListener("wheel", this.handleScrollWheel, { passive: false });
    }

    // get the event mouse position relative to the event rect
    getOffsetMousePosition(e) {
        const offset = getElementOffset(this.eventRect);
        const x = e.pageX - offset.left;
        const y = e.pageY - offset.top;
        return [Math.round(x), Math.round(y)];
    }

    //
    // Event handlers
    //

    handleScrollWheel(e) {
        if (
            this.props.disableWheelZoom ||
            (!this.props.enablePanZoom && !this.props.enableDragZoom)
        ) {
            return;
        }

        e.preventDefault();

        const SCALE_FACTOR = 0.001;
        let scale = 1 + e.deltaY * SCALE_FACTOR;
        if (scale > 3) {
            scale = 3;
        }
        if (scale < 0.1) {
            scale = 0.1;
        }

        const xy = this.getOffsetMousePosition(e);

        const begin = this.props.scale.domain()[0].getTime();
        const end = this.props.scale.domain()[1].getTime();
        const center = this.props.scale.invert(xy[0]).getTime();

        let beginScaled = center - parseInt((center - begin) * scale, 10);
        let endScaled = center + parseInt((end - center) * scale, 10);

        // Duration constraint
        let duration = (end - begin) * scale;

        if (this.props.minDuration) {
            const minDuration = parseInt(this.props.minDuration, 10);
            if (duration < this.props.minDuration) {
                beginScaled = center - ((center - begin) / (end - begin)) * minDuration;
                endScaled = center + ((end - center) / (end - begin)) * minDuration;
            }
        }

        if (this.props.minTime && this.props.maxTime) {
            const maxDuration = this.props.maxTime.getTime() - this.props.minTime.getTime();
            if (duration > maxDuration) {
                duration = maxDuration;
            }
        }

        // Range constraint
        if (this.props.minTime && beginScaled < this.props.minTime.getTime()) {
            beginScaled = this.props.minTime.getTime();
            endScaled = beginScaled + duration;
        }

        if (this.props.maxTime && endScaled > this.props.maxTime.getTime()) {
            endScaled = this.props.maxTime.getTime();
            beginScaled = endScaled - duration;
        }

        const newBegin = new Date(beginScaled);
        const newEnd = new Date(endScaled);

        const newTimeRange = new TimeRange(newBegin, newEnd);

        if (this.props.onZoom) {
            this.props.onZoom(newTimeRange);
        }
    }

    handleMouseDown(e) {
        if (!this.props.enablePanZoom && !this.props.enableDragZoom) {
            return;
        }

        if (e.button === 2) {
            return;
        }

        e.preventDefault();

        document.addEventListener("mouseover", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);

        if (this.props.enableDragZoom) {
            const offsetxy = this.getOffsetMousePosition(e);
            this.setState({
                isDragging: true,
                initialDragZoom: offsetxy[0],
                currentDragZoom: offsetxy[0]
            });
        }

        if (this.props.enablePanZoom) {
            const x = e.pageX;
            const y = e.pageY;
            const xy0 = [Math.round(x), Math.round(y)];

            const begin = this.props.scale.domain()[0].getTime();
            const end = this.props.scale.domain()[1].getTime();

            this.setState({
                isPanning: true,
                initialPanBegin: begin,
                initialPanEnd: end,
                initialPanPosition: xy0
            });
        }

        return false;
    }

    handleMouseUp(e) {
        if (!this.props.onMouseClick && !this.props.enablePanZoom && !this.props.enableDragZoom) {
            return;
        }

        e.stopPropagation();

        document.removeEventListener("mouseover", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);

        const offsetxy = this.getOffsetMousePosition(e);

        const x = e.pageX;
        const isPanning =
            this.state.initialPanPosition && Math.abs(x - this.state.initialPanPosition[0]) > 2;
        const isDragging =
            this.state.initialDragZoom && Math.abs(offsetxy[0] - this.state.initialDragZoom) > 2;

        if (this.props.onMouseClick && !isPanning && !isDragging) {
            this.props.onMouseClick(offsetxy[0], offsetxy[1]);
        }

        if (this.props.enableDragZoom) {
            if (isDragging) {
                const start = this.props.scale.invert(this.state.initialDragZoom).getTime();
                const end = this.props.scale.invert(this.state.currentDragZoom).getTime();

                let newBegin = parseInt(start, 10);
                let newEnd = parseInt(end, 10);

                if (this.props.minTime && newBegin < this.props.minTime.getTime()) {
                    newBegin = this.props.minTime.getTime();
                }

                if (this.props.maxTime && newEnd > this.props.maxTime.getTime()) {
                    newEnd = this.props.maxTime.getTime();
                }

                const newTimeRange = new TimeRange([newBegin, newEnd].sort());
                if (this.props.onZoom) {
                    this.props.onZoom(newTimeRange);
                }
            }

            this.setState({
                isDragging: false,
                initialDragZoom: null,
                initialPanEnd: null,
                currentDragZoom: null
            });
        }

        if (this.props.enablePanZoom) {
            this.setState({
                isPanning: false,
                initialPanBegin: null,
                initialPanEnd: null,
                initialPanPosition: null
            });
        }
    }

    handleMouseOut(e) {
        e.preventDefault();

        if (this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }

    handleMouseMove(e) {
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        const xy = [Math.round(x), Math.round(y)];
        const offsetxy = this.getOffsetMousePosition(e);
        if (this.state.isDragging) {
            this.setState({
                currentDragZoom: offsetxy[0]
            });
        }
        if (this.state.isPanning) {
            const xy0 = this.state.initialPanPosition;
            const timeOffset =
                this.props.scale.invert(xy[0]).getTime() -
                this.props.scale.invert(xy0[0]).getTime();

            let newBegin = parseInt(this.state.initialPanBegin - timeOffset, 10);
            let newEnd = parseInt(this.state.initialPanEnd - timeOffset, 10);
            const duration = parseInt(this.state.initialPanEnd - this.state.initialPanBegin, 10);

            if (this.props.minTime && newBegin < this.props.minTime.getTime()) {
                newBegin = this.props.minTime.getTime();
                newEnd = newBegin + duration;
            }

            if (this.props.maxTime && newEnd > this.props.maxTime.getTime()) {
                newEnd = this.props.maxTime.getTime();
                newBegin = newEnd - duration;
            }

            const newTimeRange = new TimeRange(newBegin, newEnd);
            if (this.props.onZoom) {
                this.props.onZoom(newTimeRange);
            }
        } else if (this.props.onMouseMove) {
            const mousePosition = this.getOffsetMousePosition(e);
            if (this.props.onMouseMove) {
                this.props.onMouseMove(mousePosition[0], mousePosition[1]);
            }
        }
    }

    handleContextMenu(e) {
        var x = e.pageX;
        var y = e.pageY;
        if (this.props.onContextMenu) {
            this.props.onContextMenu(x, y);
        }
    }

    //
    // Render
    //

    render() {
        const cursor = this.state.isPanning ? "-webkit-grabbing" : "default";
        const handlers = {
            onMouseDown: this.handleMouseDown,
            onMouseMove: this.handleMouseMove,
            onMouseOut: this.handleMouseOut,
            onMouseUp: this.handleMouseUp,
            onContextMenu: this.handleContextMenu
        };
        return (
            <g
                pointerEvents="all"
                ref={c => {
                    this.eventHandlerRef = c;
                }}
                {...handlers}
            >
                <rect
                    key="handler-hit-rect"
                    ref={c => {
                        this.eventRect = c;
                    }}
                    style={{ fill: "#000", opacity: 0.0, cursor }}
                    x={0}
                    y={0}
                    width={this.props.width}
                    height={this.props.height}
                />
                {this.props.children}
                {this.state.isDragging && (
                    <rect
                        style={{ opacity: 0.3, fill: "grey" }}
                        x={Math.min(this.state.currentDragZoom, this.state.initialDragZoom)}
                        y={0}
                        width={Math.abs(this.state.currentDragZoom - this.state.initialDragZoom)}
                        height={this.props.height}
                        pointerEvents="none"
                    />
                )}
            </g>
        );
    }
}

EventHandler.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    enablePanZoom: PropTypes.bool,
    enableDragZoom: PropTypes.bool,
    disableWheelZoom: PropTypes.bool,
    scale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    maxTime: PropTypes.instanceOf(Date),
    minTime: PropTypes.instanceOf(Date),
    minDuration: PropTypes.number,
    onZoom: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseClick: PropTypes.func,
    onContextMenu: PropTypes.func
};

EventHandler.defaultProps = {
    enablePanZoom: false,
    enableDragZoom: false,
    disableWheelZoom: false
};
