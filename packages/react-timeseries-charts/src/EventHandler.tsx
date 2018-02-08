/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import * as React from "react";

import { ScaleTime } from "d3-scale";
import { timerange, TimeRange } from "pondjs";

// import "@types/d3-scale";

import { getElementOffset } from "./util";

export type EventHandlerProps = {
    enablePanZoom?: boolean;
    scale: ScaleTime<number, number>;
    width: number;
    height: number;
    minDuration?: number;
    minTime?: Date;
    maxTime?: Date;
    onZoom?: (timerange: TimeRange) => any;
    onMouseMove?: (d: Date) => any;
    onMouseOut?: () => any;
    onMouseClick?: () => any;
};

export type EventHandlerState = {
    isPanning: boolean;
    initialPanBegin: any;
    initialPanEnd: any;
    initialPanPosition: number[];
};

/**
 * Internal component which provides the top level event catcher for the charts.
 * This is a higher order component. It wraps a tree of SVG elements below it,
 * passed in as this.props.children, and catches events that they do not handle.
 *
 * The EventHandler is responsible for pan and zoom events as well as other click
 * and hover actions.
 */
export class EventHandler extends React.Component<EventHandlerProps, EventHandlerState> {
    static defaultProps: Partial<EventHandlerProps> = {
        enablePanZoom: false
    };

    eventRect: SVGRectElement;

    constructor(props: EventHandlerProps) {
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
    }
    // get the event mouse position relative to the event rect
    getOffsetMousePosition(e: React.MouseEvent<SVGGElement>) {
        const offset = getElementOffset(this.eventRect);
        const x = e.pageX - offset.left;
        const y = e.pageY - offset.top;
        return [Math.round(x), Math.round(y)];
    }

    //
    // Event handlers
    //

    handleScrollWheel(e: React.WheelEvent<SVGGElement>) {
        if (!this.props.enablePanZoom) {
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

        const d = this.props.scale.range()[0];

        const begin: number = this.props.scale.domain()[0].getTime();
        const end: number = this.props.scale.domain()[1].getTime();
        const center: number = this.props.scale.invert(xy[0]).getTime();

        let beginScaled = center - Math.round((center - +begin) * scale);
        let endScaled = center + Math.round((end - +center) * scale);

        // Duration constraint
        let duration = (end - begin) * scale;
        if (this.props.minDuration) {
            const minDuration = Math.round(this.props.minDuration);
            if (duration < this.props.minDuration) {
                beginScaled = center - (center - begin) / (end - begin) * minDuration;
                endScaled = center + (end - center) / (end - begin) * minDuration;
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
        const newTimeRange = timerange(newBegin, newEnd);
        if (this.props.onZoom) {
            this.props.onZoom(newTimeRange);
        }
    }

    handleMouseDown(e: React.MouseEvent<SVGGElement>) {
        if (!this.props.enablePanZoom) {
            return;
        }
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        const xy0 = [Math.round(x), Math.round(y)];
        const begin = this.props.scale.domain()[0].getTime();
        const end = this.props.scale.domain()[1].getTime();
        document.addEventListener("mouseover", this.handleMouseMove as any);
        document.addEventListener("mouseup", this.handleMouseUp as any);
        this.setState({
            isPanning: true,
            initialPanBegin: begin,
            initialPanEnd: end,
            initialPanPosition: xy0
        });
        return false;
    }

    handleMouseUp(e: React.MouseEvent<SVGGElement>) {
        if (!this.props.enablePanZoom) {
            return;
        }
        e.stopPropagation();
        document.removeEventListener("mouseover", this.handleMouseMove as any); //XXX
        document.removeEventListener("mouseup", this.handleMouseUp as any); //XXX
        const x = e.pageX;
        if (
            this.props.onMouseClick &&
            this.state.initialPanPosition &&
            Math.abs(x - this.state.initialPanPosition[0]) < 2
        ) {
            this.props.onMouseClick();
        }
        this.setState({
            isPanning: false,
            initialPanBegin: null,
            initialPanEnd: null,
            initialPanPosition: null
        });
    }

    handleMouseOut(e: React.MouseEvent<SVGGElement>) {
        e.preventDefault();
        if (this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }

    handleMouseMove(e: React.MouseEvent<SVGGElement>) {
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        const xy = [Math.round(x), Math.round(y)];
        if (this.state.isPanning) {
            const xy0 = this.state.initialPanPosition;
            const timeOffset =
                this.props.scale.invert(xy[0]).getTime() -
                this.props.scale.invert(xy0[0]).getTime();
            let newBegin = Math.round(this.state.initialPanBegin - timeOffset);
            let newEnd = Math.round(this.state.initialPanEnd - timeOffset);
            const duration = Math.round(this.state.initialPanEnd - this.state.initialPanBegin);
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
            const trackerPosition = this.getOffsetMousePosition(e)[0];
            const time: Date = this.props.scale.invert(trackerPosition);
            if (this.props.onMouseMove) {
                this.props.onMouseMove(time);
            }
        }
    }

    //
    // Render
    //

    render() {
        const cursor = this.state.isPanning ? "-webkit-grabbing" : "default";
        return (
            <g
                pointerEvents="all"
                onWheel={e => this.handleScrollWheel(e)}
                onMouseDown={e => this.handleMouseDown(e)}
                onMouseUp={e => this.handleMouseUp(e)}
                onMouseMove={e => this.handleMouseMove(e)}
                onMouseOut={e => this.handleMouseOut(e)}
            >
                <rect
                    key="handler-hit-rect"
                    ref={c => {
                        this.eventRect = c;
                    }}
                    style={{ opacity: 0.0, cursor }}
                    x={0}
                    y={0}
                    width={this.props.width}
                    height={this.props.height}
                />
                {this.props.children}
            </g>
        );
    }
}
