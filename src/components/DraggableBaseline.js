/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import merge from "merge";
import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";

import { getElementOffset } from "../js/util";

const defaultStyle = {
    label: {
        fill: "#8B7E7E", // Default label color
        fontWeight: 100,
        fontSize: 11,
        pointerEvents: "none"
    },
    line: {
        stroke: "#626262",
        strokeWidth: 1,
        strokeDasharray: "5,3",
        pointerEvents: "none"
    },
    highlightedLine: {
        stroke: "#626262",
        strokeWidth: 2,
        strokeDasharray: "5,3",
        pointerEvents: "none"
    }
};

const defaultDraggingLabelFunc = (draggableBaseline, y) => {
    if (draggableBaseline.props.transition) {
        return draggableBaseline.props.transition.sourceScale.invert(y).toFixed(3)
    }
    return ""
}

/**
 *
 * The DraggableBaseline component displays a simple horizontal line at a value.
 *
 * For example the following code overlays DraggableBaselines for the mean and stdev
 * of a series on top of another chart.
 *
 * ```
 * <ChartContainer timeRange={series.timerange()} >
 *     <ChartRow height="150">
 *         <YAxis
 *           id="price"
 *           label="Price ($)"
 *           min={series.min()} max={series.max()}
 *           width="60" format="$,.2f"
 *         />
 *         <Charts>
 *             <LineChart axis="price" series={series} style={style} />
 *             <DraggableBaseline axis="price" value={series.avg()} label="Avg" position="right" />
 *             <DraggableBaseline axis="price" value={series.avg()-series.stdev()} />
 *             <DraggableBaseline axis="price" value={series.avg()+series.stdev()} />
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
export default class DraggableBaseline extends React.Component {

    constructor(props) {
        super(props);

        console.log("DraggableBaseline constructor")

        this.state = {
            isHovering: false,
            isDragging: false,
            draggingMouseX: 0,
            draggingMouseY: 0,
        };

        this.handleHover = this.handleHover.bind(this);
        this.handleHoverLeave = this.handleHoverLeave.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    //
    // Event handlers
    //

    
    handleHover(e) {
        e.preventDefault();
        console.log("handleHover")

        this.setState({
            isHovering: true,
        });
    }

    handleHoverLeave(e) {
        e.preventDefault();
        console.log("handleHoverLeave")

        this.setState({
            isHovering: false,
        });
    }

    handleMouseDown(e) {
        e.preventDefault();
        console.log("handleMouseDown")

        document.addEventListener("mouseup", this.handleMouseUp);

        const x = e.pageX;
        const y = e.pageY;
        this.setState({
            isDragging: true,
            draggingMouseX: x,
            draggingMouseY: y,
        });
    }

    handleMouseUp(e) {
        e.preventDefault();
        console.log("handleMouseUp")

        document.removeEventListener("mouseup", this.handleMouseUp);

        this.setState({
            isDragging: false,
        });
    }

    handleClick() {
        console.log("handleClick")

    }

    handleMouseMove(e) {
        e.preventDefault();
        const offset = getElementOffset(this.overlay);
        const mouseX = e.pageX - offset.left;
        const mouseY = e.pageY - offset.top;
        // console.log("handleMouseMove", mouseY)
        this.setState({
            draggingMouseX: mouseX,
            draggingMouseY: mouseY
        })
    }

    //
    // Render
    //

    /**
     * ドラッグ中のみ表示する. (表示するといっても透明なので見えない)
     * MouseMove Eventをfireするための透過 Overlay.
     * 何も存在しないと MouseMove Event が fire されないのでそれを防ぐため透明の rect を利用する.
     */
    renderOverlay() {
        if (!this.state.isDragging) {
            return <g />
        }

        const { width, height } = this.props;

        const overlayStyle = {
            fill: "white",
            opacity: 0,
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
                onMouseMove={this.handleMouseMove}
            />
        );
    }

    renderBaseline() {
        const { vposition, yScale, value, position, style, width } = this.props;

        if (!yScale || _.isUndefined(value)) {
            return null;
        }

        const y = yScale(value);
        const transform = `translate(0 ${y})`;
        let textAnchor;
        let textPositionX;
        const pts = [];

        const labelBelow = (vposition === "auto" && y < 15) || vposition === "below";
        const textPositionY = labelBelow ? 2 : -2;
        const alignmentDraggableBaseline = labelBelow ? "hanging" : "auto";

        if (position === "left") {
            textAnchor = "start";
            textPositionX = 5;
        }
        if (position === "right") {
            textAnchor = "end";
            textPositionX = width - 5;
        }

        pts.push("0 0");
        pts.push(`${width} 0`);
        const points = pts.join(" ");

        //
        // Style
        //

        const baseLabelStyle = { ...defaultStyle.label, alignmentDraggableBaseline };

        const labelStyle = merge(true, baseLabelStyle, style.label ? style.label : {});
        let lineStyle = {}

        // マウスが baseline 上にあるときは baseline を目立たせるため highlightedLine style を利用する
        if (!this.state.isHovering) {
            lineStyle = merge(true, defaultStyle.line, style.line ? style.line : {});
        } else {
            lineStyle = merge(true, defaultStyle.highlightedLine, style.highlightedLine ? style.highlightedLine : {});
        }

        const hitStyle = {
            stroke: "white",
            fill: "none",
            opacity: 0.0,
            strokeWidth: 6,
            cursor: "ns-resize",
            pointerEvents: "stroke"
        };

        return (
            <g className="DraggableBaseline" transform={transform}>
                <polyline points={points} style={lineStyle} />
                <text
                    style={labelStyle}
                    x={textPositionX}
                    y={textPositionY}
                    textAnchor={textAnchor}
                >
                    {this.props.label}
                </text>
                {/* hover, drag用の非表示 polyline */}
                <polyline
                    points={points}
                    style={hitStyle}
                    onMouseLeave={this.handleHoverLeave}
                    onMouseMove={this.handleHover}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onClick={this.handleClick}
                />
            </g>
        );
    }

    /**
     * ドラッグ中のみ表示するbaseline.
     * 視覚的にドラッグしているのを分かりやすくするため.
     */
    renderDraggingBaseline() {
        if (!this.state.isDragging) {
            return <g />
        }

        const { vposition, yScale, value, style, width } = this.props;

        if (!yScale || _.isUndefined(value)) {
            return null;
        }

        const mouseX = this.state.draggingMouseX;
        const mouseY = this.state.draggingMouseY;

        const transform = `translate(0 ${mouseY})`;
        let textAnchor = "start";
        let textPositionX = mouseX;
        const pts = [];

        const labelBelow = (vposition === "auto" && mouseY < 15) || vposition === "below";
        const textPositionY = labelBelow ? 2 : -2;
        const alignmentDraggableBaseline = labelBelow ? "hanging" : "auto";

        pts.push("0 0");
        pts.push(`${width} 0`);
        const points = pts.join(" ");

        const label = this.props.draggingLabelFunc ? this.props.draggingLabelFunc(this, mouseY) : defaultDraggingLabelFunc(this, mouseY)

        //
        // Style
        //

        const baseLabelStyle = { ...defaultStyle.label, alignmentDraggableBaseline };
        const labelStyle = merge(true, baseLabelStyle, style.label ? style.label : {});
        const lineStyle = merge(true, defaultStyle.line, style.line ? style.line : {});

        return (
            <g className="DraggableBaseline" transform={transform}>
                <polyline points={points} style={lineStyle} />
                <text
                    style={labelStyle}
                    x={textPositionX}
                    y={textPositionY}
                    textAnchor={textAnchor}
                >
                    {label}
                </text>
            </g>
        );
    }

    render() {
        return (
            <g>
                {this.renderOverlay()}
                {this.renderBaseline()}
                {this.renderDraggingBaseline()}
            </g>
        );
    }
}

DraggableBaseline.defaultProps = {
    visible: true,
    value: 0,
    label: "",
    position: "left",
    vposition: "auto",
    style: defaultStyle
};

DraggableBaseline.propTypes = {
    /**
     * Show or hide this chart
     */
    visible: PropTypes.bool,

    /**
     * Reference to the axis which provides the vertical scale for drawing. e.g.
     * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
     */
    axis: PropTypes.string.isRequired, // eslint-disable-line

    /**
     * An object describing the style of the DraggableBaseline of the form
     * { label, line, highlightedLine }. "label", "line" and "highlightedLine" are both objects containing
     * the inline CSS for that part of the DraggableBaseline.
     */
    style: PropTypes.shape({
        label: PropTypes.object, // eslint-disable-line
        line: PropTypes.object, // eslint-disable-line
        highlightedLine: PropTypes.object // eslint-disable-line
    }),

    /**
     * The y-value to display the line at.
     */
    value: PropTypes.number,

    /**
     * The label to display with the axis.
     */
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * The label being dragged to display with the axis.
     */
    draggingLabelFunc: PropTypes.func,

    /**
     * Whether to display the label on the "left" or "right".
     */
    position: PropTypes.oneOf(["left", "right"]),

    /**
     * Whether to display the label above or below the line. The default is "auto",
     * which will show it above the line unless the position is near to the top
     * of the chart.
     */
    vposition: PropTypes.oneOf(["above", "below", "auto"]),

    /**
     * [Internal] The yScale supplied by the associated YAxis
     */
    yScale: PropTypes.func,


    /**
     * [Internal] The transition supplied by the associated YAxis
     */
    transition: PropTypes.object,

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width: PropTypes.number,

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    height: PropTypes.number
};
