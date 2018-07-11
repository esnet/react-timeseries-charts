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
import PropTypes from "prop-types";
import { format } from "d3-format";
import merge from "merge";

import ValueList from "./ValueList";

/**
 * Renders a 'axis' that display a label for a data channel and a
 * max and average value:
 * ```
 *      +----------------+-----+------- ...
 *      | Traffic        | 120 |
 *      | Max 100 Gbps   |     | Chart  ...
 *      | Avg 26 Gbps    | 0   |
 *      +----------------+-----+------- ...
 * ```
 *
 * This can be used for data channel style displays where the user will see many
 * rows of data stacked on top of each other and will need to interact with the
 * data to see actual values. You can combine this with the `ValueAxis` to help
 * do that. See the Cycling example for exactly how to arrange that.
 *
 */

const defaultStyle = {
    label: {
        fontSize: 12,
        textAnchor: "middle",
        fill: "#838383"
    },
    valueList: {
        fill: "none",
        stroke: "none"
    },
    axisLabel: {
         fontSize: 11,
         textAnchor: "left",
         fill: "#bdbdbd"
    }
};

export default class LabelAxis extends React.Component {

    mergeStyles(style) {
        return {
            labelStyle: merge(
                true,
                defaultStyle.label,
                this.props.style.label ? this.props.style.label : {}
            ),
            valueListStyle: merge(
                true,
                defaultStyle.valueList,
                this.props.style.valueList ? this.props.style.valueList : {}
            ),
            axisLabelStyle: merge(
                true,
                defaultStyle.ticks,
                this.props.style.axisLabel ? this.props.style.axisLabel : {}
            )
        };
    }
    
    renderAxis(axisLabelStyle) {
        const valueWidth = this.props.valWidth;
        const rectWidth = this.props.width - valueWidth;

        if (this.props.hideScale) {
            return <g />;
        }
        const valXPos = rectWidth + 3; // padding
        const fmt = this.props.format;
        const maxStr = format(fmt)(this.props.max);
        const minStr = format(fmt)(this.props.min);

        return (
            <g>
                <text x={valXPos} y={0} dy="1.2em" style={axisLabelStyle}>
                    {maxStr}
                </text>
                <text x={valXPos} y={this.props.height} style={axisLabelStyle}>
                    {minStr}
                </text>
            </g>
        );
    }

    render() {
        const valueWidth = this.props.valWidth;
        const rectWidth = this.props.width - valueWidth;
        const style = this.mergeStyles(this.props.style);
        
        const { valueListStyle, labelStyle, axisLabelStyle } = style;

        let valueList = null;
        let labelYPos;
        if (this.props.values) {
            labelYPos = Math.max(parseInt(this.props.height / 4, 10), 10);
            valueList = (
                <ValueList
                    style={valueListStyle}
                    values={this.props.values}
                    width={rectWidth}
                />
            );
        } else {
            labelYPos = parseInt(this.props.height / 2, 10);
        }

        return (
            <g>
                <rect
                    x="0"
                    y="0"
                    width={rectWidth}
                    height={this.props.height}
                    style={{ fill: "none", stroke: "none" }}
                />
                <text x={parseInt(rectWidth / 2, 10)} y={labelYPos} style={labelStyle}>
                    {this.props.label}
                </text>
                <g transform={`translate(0,${labelYPos + 2})`}>{valueList}</g>

                {this.renderAxis(axisLabelStyle)}
            </g>
        );
    }
}

LabelAxis.propTypes = {
    /**
     * The label to show as the axis.
     */
    label: PropTypes.string.isRequired,

    /**
     * Show or hide the max/min values that appear alongside the label
     */
    hideScale: PropTypes.bool,

    /**
     * Supply a list of label value pairs to render within the LabelAxis.
     * This expects an array of objects. Each object is of the form:
     *     {label: "Speed", value: "26.2 mph"}.
     */
    values: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string, // eslint-disable-line
            value: PropTypes.oneOfType([
                // eslint-disable-line
                PropTypes.number,
                PropTypes.string
            ])
        })
    ).isRequired,

    /**
     * Width to provide the values
     */
    valWidth: PropTypes.number,

    /**
     * Max value of the axis scale
     */
    max: PropTypes.number.isRequired,

    /**
     * Min value of the axis scale
     */
    min: PropTypes.number.isRequired,

    /**
     * If values are numbers, use this format string
     */
    format: PropTypes.string,

    /**
     * The width of the axis
     */
    width: PropTypes.number,

    /**
     * The height of the axis
     */
    height: PropTypes.number,

    /**
     * Object specifying the CSS by which the axis can be styled. The object can contain:
     * "label", "values", "axis" and "ticks". Each of these is an inline CSS style applied
     * to the axis label, axis values, axis line and ticks respectively.
     *
     * Note that these are passed into d3's styling, so are regular CSS property names
     * and not React's camel case names (e.g. "stroke-dasharray" not strokeDasharray).
     */
    style: PropTypes.shape({
        axisLabel: PropTypes.object, // eslint-disable-line
        valueListStyle: PropTypes.object, // eslint-disable-line
        labelStyle: PropTypes.object // esline-disable-line
    }),
};

LabelAxis.defaultProps = {
    hideScale: false,
    values: [],
    valWidth: 40,
    format: ".2f"
};
