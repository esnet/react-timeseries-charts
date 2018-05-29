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

import { TimeRange, timerange } from "pondjs";

import { ChartProps } from "./Charts";
import { getElementOffset } from "./util";

export type MultiBrushProps = ChartProps & {
    /**
     * The timeranges for the brushes. Typically you would maintain this
     * as state on the surrounding page, since it would likely control
     * another page element, such as the range of the main chart. See
     * also `onTimeRangeChanged()` for receiving notification of the
     * brush range being changed by the user.
     *
     * Takes an array of Pond TimeRange object.
     */
    timeRanges?: TimeRange[];

    /**
     * The brush is rendered as an SVG rect. You can specify the style
     * of this rect using this prop. The brush style is a function that you
     * provide. It will be called with the index of the TimeRange, corresponding
     * to those in the `timeRanges` prop.
     */
    style?: any;

    /**
     * The size of the invisible side handles. Defaults to 6 pixels.
     */
    handleSize?: number;

    /**
     * If this prop is false, you will only be able to draw a new brush if the last position of the timeRanges
     * array is equal to null, otherwise it will allow the free drawing and the index passed to onTimeRangeChanged
     * will the equal to the length of the timeRanges array
     */
    allowFreeDrawing?: boolean;

    /**
     * A callback which will be called if the brush range is changed by
     * the user. It is called with a Pond TimeRange object and the index position of
     * the brush in the timeRanges prop.
     */
    onTimeRangeChanged?: (timeRange: TimeRange, brushIndex: number) => any;

    /**
     * when user stop drawing or dragging box
     */
    onUserMouseUp?: (brushIndex: number) => any;

    /**
     * When the user clicks one of the TimeRanges
     */
    onTimeRangeClicked?: (brushIndex: number) => any;
};

export type MultiBrushState = {
    isBrushing?: boolean;
    brushingInitializationSite?: string;
    initialBrushBeginTime?: number;
    initialBrushEndTime?: number;
    initialBrushXYPosition?: number[];
    brushIndex?: number;
};

/**
 * Renders a brush with the range defined in the prop `timeRange`.
 */
export class MultiBrush extends React.Component<MultiBrushProps, MultiBrushState> {
    static defaultProps: Partial<MultiBrushProps> = {
        handleSize: 6,
        allowFreeDrawing: true
    };

    overlay: SVGRectElement;

    constructor(props) {
        super(props);
        this.state = {
            isBrushing: false
        };

        this.handleBrushMouseDown = this.handleBrushMouseDown.bind(this);
        this.handleOverlayMouseDown = this.handleOverlayMouseDown.bind(this);
        this.handleHandleMouseDown = this.handleHandleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    viewport() {
        const { width, timeScale } = this.props;
        const viewBeginTime = timeScale.invert(0);
        const viewEndTime = timeScale.invert(width);
        return new TimeRange(viewBeginTime, viewEndTime);
    }

    //
    // Event handlers
    //

    handleBrushMouseDown(e: React.MouseEvent<SVGRectElement>, brushIndex: number) {
        e.preventDefault();

        const { pageX: x, pageY: y } = e;
        const xy0 = [Math.round(x), Math.round(y)];
        const begin = +this.props.timeRanges[brushIndex].begin();
        const end = +this.props.timeRanges[brushIndex].end();

        document.addEventListener("mouseup", this.handleMouseUp as any);

        this.setState({
            isBrushing: true,
            brushingInitializationSite: "brush",
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0,
            brushIndex: brushIndex
        });
    }

    handleOverlayMouseDown(e: React.MouseEvent<SVGRectElement>) {
        if (this.props.allowFreeDrawing || this.hasNullBrush()) {
            e.preventDefault();

            const offset = getElementOffset(this.overlay);
            const x = e.pageX - offset.left;
            const t = this.props.timeScale.invert(x).getTime();

            document.addEventListener("mouseup", this.handleMouseUp as any);

            const drawingPosition = this.props.allowFreeDrawing
                ? this.props.timeRanges.length
                : this.props.timeRanges.length - 1;

            this.setState({
                isBrushing: true,
                brushingInitializationSite: "overlay",
                initialBrushBeginTime: t,
                initialBrushEndTime: t,
                initialBrushXYPosition: null,
                brushIndex: drawingPosition
            });
        }
    }

    hasNullBrush() {
        return (
            (this.props.timeRanges || []).length > 0 &&
            this.props.timeRanges[this.props.timeRanges.length - 1] == null
        );
    };

    handleMouseClick(e: React.MouseEvent<SVGRectElement>, brushIndex: number) {
        if (this.props.onTimeRangeClicked) {
            this.props.onTimeRangeClicked(this.state.brushIndex);
        }
    };

    handleHandleMouseDown(e: React.MouseEvent<SVGRectElement>, handle: string, brushIndex: number) {
        e.preventDefault();

        const { pageX: x, pageY: y } = e;
        const xy0 = [Math.round(x), Math.round(y)];
        const begin = this.props.timeRanges[brushIndex].begin().getTime();
        const end = this.props.timeRanges[brushIndex].end().getTime();

        document.addEventListener("mouseover", this.handleMouseMove as any);
        document.addEventListener("mouseup", this.handleMouseUp as any);

        this.setState({
            isBrushing: true,
            brushingInitializationSite: `handle-${handle}`,
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0,
            brushIndex: brushIndex
        });
    }

    handleMouseUp(e: React.MouseEvent<SVGRectElement>) {
        e.preventDefault();

        document.removeEventListener("mouseover", this.handleMouseMove as any);
        document.removeEventListener("mouseup", this.handleMouseUp as any);

        const brushingIs = this.state.brushIndex;
        this.setState(
            {
                isBrushing: false,
                brushingInitializationSite: null,
                initialBrushBeginTime: null,
                initialBrushEndTime: null,
                initialBrushXYPosition: null,
                brushIndex: null
            },
            () => {
                if (this.props.onUserMouseUp) {
                    this.props.onUserMouseUp(brushingIs);
                }
            }
        );
    }

    handleMouseMove(e: React.MouseEvent<SVGRectElement>) {
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
                        ? Math.round(tb - startOffsetConstraint)
                        : tb;
                newEnd =
                    this.state.brushingInitializationSite === "brush" ||
                    this.state.brushingInitializationSite === "handle-right"
                        ? Math.round(te - endOffsetConstrain)
                        : te;

                // Swap if needed
                if (newBegin > newEnd) {
                    [newBegin, newEnd] = [newEnd, newBegin];
                }
            }

            if (this.props.onTimeRangeChanged) {
                this.props.onTimeRangeChanged(
                    new TimeRange(newBegin, newEnd),
                    this.state.brushIndex
                );
            }
        }
    }

    //
    // Render
    //

    renderOverlay() {
        const { width, height } = this.props;

        let cursor: string;
        switch (this.state.brushingInitializationSite) {
            case "handle-right":
            case "handle-left":
                cursor = "ew-resize";
                break;
            case "brush":
                cursor = "move";
                break;
            default:
                cursor =
                    this.props.allowFreeDrawing || this.hasNullBrush() ? "crosshair" : "default";
        }

        const overlayStyle: React.CSSProperties = {
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
                onClick={e => this.handleMouseClick}
                onMouseDown={this.handleOverlayMouseDown}
                onMouseUp={this.handleMouseUp}
            />
        );
    }

    renderBrush(timeRange: TimeRange, index: number) {
        const { timeScale, height } = this.props;

        if (!timeRange) {
            return <g />;
        }

        let cursor: string;
        switch (this.state.brushingInitializationSite) {
            case "handle-right":
            case "handle-left":
                cursor = "ew-resize";
                break;
            case "overlay":
                cursor =
                    this.props.allowFreeDrawing || this.hasNullBrush() ? "crosshair" : "default";
                break;
            default:
                cursor = "move";
        }

        // Style of the brush area
        const brushDefaultStyle: React.CSSProperties = {
            fill: "#777",
            fillOpacity: 0.3,
            stroke: "#fff",
            shapeRendering: "crispEdges",
            cursor
        };
        const userStyle = this.props.style ? this.props.style(index) : {};
        const brushStyle = _.merge(true, brushDefaultStyle, userStyle);

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
                    key={`${index}-${brushStyle}`}
                    style={brushStyle}
                    pointerEvents="all"
                    onClick={e => this.handleMouseClick(e, index)}
                    onMouseDown={e => this.handleBrushMouseDown(e, index)}
                    onMouseUp={this.handleMouseUp}
                />
            );
        }
        return <g />;
    }

    renderHandles(timeRange: TimeRange, index: number) {
        const { timeScale, height } = this.props;

        if (!timeRange) {
            return <g />;
        }

        // Style of the handles
        const handleStyle: React.CSSProperties = {
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
                        onMouseDown={e => this.handleHandleMouseDown(e, "left", index)}
                        onMouseUp={this.handleMouseUp}
                    />
                    <rect
                        {...rightHandleBounds}
                        style={handleStyle}
                        pointerEvents="all"
                        onMouseDown={e => this.handleHandleMouseDown(e, "right", index)}
                        onMouseUp={this.handleMouseUp}
                    />
                </g>
            );
        }
        return <g />;
    }

    render() {
        return (
            <g onMouseMove={this.handleMouseMove}>
                {this.renderOverlay()}
                {(this.props.timeRanges || []).map((timeRange, index) => {
                    return (
                        <g key={`multibrush_${index}`}>
                            {this.renderBrush(timeRange, index)}
                            {this.renderHandles(timeRange, index)}
                        </g>
                    );
                })}
            </g>
        );
    }
}