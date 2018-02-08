/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import * as React from "react";

import { timerange, TimeRange } from "pondjs";
import { ScaleTime } from "d3-scale";

import { ChartProps } from "./Charts";
import { getElementOffset } from "./util";

export type BrushProps = ChartProps & {
    style?: object;
    timeRange?: TimeRange;
    handleSize?: number;
    allowSelectionClear?: boolean;
    onTimeRangeChanged?: (d?: TimeRange) => any;
};

export type BrushState = {
    isBrushing?: boolean;
    brushingInitializationSite?: string;
    initialBrushBeginTime?: number;
    initialBrushEndTime?: number;
    initialBrushXYPosition?: number[];
};

/**
 * Renders a brush with the range defined in the prop `timeRange`.
 */
export class Brush extends React.Component<BrushProps, BrushState> {
    static defaultProps: Partial<BrushProps> = {
        handleSize: 6,
        allowSelectionClear: false
    };

    overlay: SVGRectElement;

    constructor(props: BrushProps) {
        super(props);

        this.handleBrushMouseDown = this.handleBrushMouseDown.bind(this);
        this.handleOverlayMouseDown = this.handleOverlayMouseDown.bind(this);
        this.handleHandleMouseDown = this.handleHandleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.state = {
            isBrushing: false
        };
    }

    viewport() {
        const { width, timeScale } = this.props;
        const viewBeginTime = timeScale.invert(0);
        const viewEndTime = timeScale.invert(width);
        return new TimeRange(viewBeginTime, viewEndTime);
    }

    handleBrushMouseDown(e: React.MouseEvent<SVGRectElement>) {
        e.preventDefault();
        const { pageX: x, pageY: y } = e;
        const xy0 = [Math.round(x), Math.round(y)];
        const begin = +this.props.timeRange.begin();
        const end = +this.props.timeRange.end();
        this.setState({
            isBrushing: true,
            brushingInitializationSite: "brush",
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0
        });
    }

    handleOverlayMouseDown(e: React.MouseEvent<SVGRectElement>) {
        e.preventDefault();
        const offset = getElementOffset(this.overlay);
        const x = e.pageX - offset.left;
        const t = this.props.timeScale.invert(x).getTime();
        this.setState({
            isBrushing: true,
            brushingInitializationSite: "overlay",
            initialBrushBeginTime: t,
            initialBrushEndTime: t,
            initialBrushXYPosition: null
        });
    }

    handleHandleMouseDown(e: React.MouseEvent<SVGRectElement>, handle: string) {
        e.preventDefault();
        const { pageX: x, pageY: y } = e;
        const xy0 = [Math.round(x), Math.round(y)];
        const begin = this.props.timeRange.begin().getTime();
        const end = this.props.timeRange.end().getTime();
        document.addEventListener("mouseover", this.handleMouseMove as any); // XXX
        document.addEventListener("mouseup", this.handleMouseUp as any); // XXX
        this.setState({
            isBrushing: true,
            brushingInitializationSite: `handle-${handle}`,
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0
        });
    }

    handleMouseUp(e: React.MouseEvent<SVGRectElement>) {
        e.preventDefault();
        document.removeEventListener("mouseover", this.handleMouseMove as any); // XXX
        document.removeEventListener("mouseup", this.handleMouseUp as any); // XXX
        this.setState({
            isBrushing: false,
            brushingInitializationSite: null,
            initialBrushBeginTime: null,
            initialBrushEndTime: null,
            initialBrushXYPosition: null
        });
    }

    /**
     * Handles clearing the TimeRange if the user clicks on the overlay (but
     * doesn't drag to create a new brush). This will send a null as the
     * new TimeRange. The user of this code can react to that however they
     * see fit, but the most logical response is to reset the timerange to
     * some initial value. This behavior is optional.
     */
    handleClick() {
        if (this.props.allowSelectionClear && this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(null);
        }
    }

    handleMouseMove(e: React.MouseEvent<SVGGElement>): void {
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        const xy = [Math.round(x), Math.round(y)];
        const viewport = this.viewport();
        if (this.state.isBrushing) {
            let newBegin: number;
            let newEnd: number;
            const tb = this.state.initialBrushBeginTime;
            const te = this.state.initialBrushEndTime;
            if (this.state.brushingInitializationSite === "overlay") {
                const offset = getElementOffset(this.overlay);
                const xx = e.pageX - offset.left;
                const t = this.props.timeScale.invert(xx).getTime();
                if (t < tb) {
                    newBegin = t < viewport.begin().getTime() ? +viewport.begin() : t;
                    newEnd = tb > viewport.end().getTime() ? +viewport.end() : tb;
                } else {
                    newBegin = tb < viewport.begin().getTime() ? +viewport.begin() : tb;
                    newEnd = t > viewport.end().getTime() ? +viewport.end() : t;
                }
            } else {
                const xy0 = this.state.initialBrushXYPosition;
                let timeOffset =
                    this.props.timeScale.invert(xy0[0]).getTime() -
                    this.props.timeScale.invert(xy[0]).getTime();
                // Constrain
                let startOffsetConstraint = timeOffset;
                let endOffsetConstrain = timeOffset;
                if (tb - timeOffset < +viewport.begin()) {
                    startOffsetConstraint = tb - viewport.begin().getTime();
                }
                if (te - timeOffset > +viewport.end()) {
                    endOffsetConstrain = te - viewport.end().getTime();
                }
                newBegin =
                    this.state.brushingInitializationSite === "brush" ||
                    this.state.brushingInitializationSite === "handle-left"
                        ? tb - startOffsetConstraint
                        : tb;
                newEnd =
                    this.state.brushingInitializationSite === "brush" ||
                    this.state.brushingInitializationSite === "handle-right"
                        ? te - endOffsetConstrain
                        : te;

                // Swap if needed
                if (newBegin > newEnd) {
                    [newBegin, newEnd] = [newEnd, newBegin];
                }
            }
            if (this.props.onTimeRangeChanged) {
                this.props.onTimeRangeChanged(new TimeRange(newBegin, newEnd));
            }
        }
    }

    renderOverlay() {
        const { width, height } = this.props;
        let cursor;
        switch (this.state.brushingInitializationSite) {
            case "handle-right":
            case "handle-left":
                cursor = "ew-resize";
                break;
            case "brush":
                cursor = "move";
                break;
            default:
                cursor = "crosshair";
        }
        const overlayStyle = {
            fill: "white",
            opacity: 0,
            cursor
        };
        return (
            <rect
                ref={c => {
                    this.overlay = c;
                }}
                x={0}
                y={0}
                width={width}
                height={height}
                style={overlayStyle}
                onMouseDown={e => this.handleOverlayMouseDown(e)}
                onMouseUp={e => this.handleMouseUp(e)}
                onClick={this.handleClick}
            />
        );
    }

    renderBrush() {
        const { timeRange, timeScale, height, style } = this.props;
        console.log("render brush props ", this.props);
        console.log(this.viewport().disjoint(timeRange));
        if (!timeRange) {
            return <g />;
        }
        let cursor;
        switch (this.state.brushingInitializationSite) {
            case "handle-right":
            case "handle-left":
                cursor = "ew-resize";
                break;
            case "overlay":
                cursor = "crosshair";
                break;
            default:
                cursor = "move";
        }
        // Style of the brush area
        const brushDefaultStyle = {
            fill: "#777",
            fillOpacity: 0.3,
            stroke: "#fff",
            shapeRendering: "crispEdges",
            cursor
        };
        const brushStyle = _.merge(brushDefaultStyle, style);
        if (!this.viewport().disjoint(timeRange)) {
            const range = timeRange.intersection(this.viewport()) as TimeRange;
            const begin = range.begin();
            const end = range.end();
            const [x, y] = [timeScale(begin), 0];
            const endPos = timeScale(end);
            let width = endPos - x;
            if (width < 1) {
                width = 1;
            }
            const bounds = { x, y, width, height };
            return (
                <rect
                    {...bounds}
                    style={brushStyle}
                    pointerEvents="all"
                    onMouseDown={e => this.handleBrushMouseDown(e)}
                    onMouseUp={e => this.handleMouseUp(e)}
                />
            );
        }
        return <g />;
    }

    renderHandles() {
        const { timeRange, timeScale, height } = this.props;
        if (!timeRange) {
            return <g />;
        }
        // Style of the handles
        const handleStyle = {
            fill: "white",
            opacity: 0,
            cursor: "ew-resize"
        };
        if (!this.viewport().disjoint(timeRange)) {
            const range = timeRange.intersection(this.viewport()) as TimeRange;
            const begin = range.begin().getTime();
            const end = range.end().getTime();
            const [x, y] = [timeScale(begin), 0];
            const endPos = timeScale(end);
            let width = endPos - x;
            if (width < 1) {
                width = 1;
            }
            const handleSize = this.props.handleSize;
            const leftHandleBounds = { x: x - 1, y, width: handleSize, height };
            const rightHandleBounds = {
                x: x + (width - handleSize),
                y,
                width: handleSize + 1,
                height
            };
            return (
                <g>
                    <rect
                        {...leftHandleBounds}
                        style={handleStyle}
                        pointerEvents="all"
                        onMouseDown={e => this.handleHandleMouseDown(e, "left")}
                        onMouseUp={this.handleMouseUp}
                    />
                    <rect
                        {...rightHandleBounds}
                        style={handleStyle}
                        pointerEvents="all"
                        onMouseDown={e => this.handleHandleMouseDown(e, "right")}
                        onMouseUp={this.handleMouseUp}
                    />
                </g>
            );
        }
        return <g />;
    }

    render() {
        return (
            <g onMouseMove={e => this.handleMouseMove(e)}>
                {this.renderOverlay()}
                {this.renderBrush()}
                {this.renderHandles()}
            </g>
        );
    }
}
