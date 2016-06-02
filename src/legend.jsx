/**
 *  Copyright (c) 2015-2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import FlexBox from "react-flexbox";
import merge from "merge";

/**
 * Legends are simple to define.
 *
 * First specify the styles you want each item to have. This is the CSS that should
 * be appied to rendered symbol.
 *
 * Next build a list of categories you want in it
 *
 * For example:
 *
 * ```
 * const audStyle = {stroke: "#1f77b4"};
 * const usdStyle = {stroke: "#aec7e8"};
 *
 * const categories = [
 *     {key: "aust", label: "AUD", value: "1.52", disabled={true} style: audStyle},
 *     {key: "usa", label: "USD", value: "1.43", disabled={false} style: usdStyle}
 * ];
 * ```
 *
 * Then render the legend as either "line", "swatch" or "dot" style:
 *
 * ```
 * <Legend type="line" categories={categories} onChange={this.handleLegendChange}/>
 * ```
 *
 * For each category to display you must provide a key, a label and
 * if it should be displayed disabled or not. As mentioned above, you also
 * provide a style.
 *
 * Optionally you can also display a value below the label. This is
 * useful when hovering over another chart on the page, or to display
 * the current value of live data.
 *
 * The legend can also be supplied with a callback function which will
 * tell you if the user has clicked on one of the legend items to
 * enable/disable that item. The callback will be called with the key and
 * the new enabled/disabled state. You can use this to hide or show a series
 * on the chart, for example. Note that you'll want to pass the state back
 * into the legend as that category's disabled value.
 */
export default React.createClass({

    displayName: "Legend",

    getDefaultProps() {
        return {
            style: {},
            labelStyle: {},
            type: "swatch", // or "line" or "dot"
            align: "left",
            width: 16,
            height: 16
        };
    },

    propTypes: {

        /**
         * The overall style of the legend items, either a color "swatch", a
         * colored "line", or a "dot".
         */
        type: React.PropTypes.oneOf([
            "swatch",
            "line",
            "dot"
        ]),

        /**
         * Alignment of the legend within the available space. Either left or right.
         */
        align: React.PropTypes.oneOf([
            "left",
            "right"
        ]),

        /**
         * The categories array specifies details and style for each item in the legend. For each item:
         *  * "key" - (required) the name by which the legend will be known
         *  * "label" - (required) the displayed label
         *  * "style" - the swatch, dot, or line style. Typically you'd just specify {backgroundColor: "#1f77b4"}
         *  * "labelStyle" - the label style
         *  * "disabled" - a disabled state
         *
         * ```
         * const categories = [
         *    {key: "aust", label: "AUD", disabled: this.state.disabled["aust"], style: {backgroundColor: "#1f77b4"}},
         *    {key: "usa", label: "USD", disabled: this.state.disabled["usa"], style: {backgroundColor: "#aec7e8"}}
         * ];
         * ```
         */
        categories: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                key: React.PropTypes.string.isRequired,
                label: React.PropTypes.string.isRequired,
                disabled: React.PropTypes.bool,
                style: React.PropTypes.object,
                labelStyle: React.PropTypes.object
            })
        ).isRequired,

        /**
         * Callback which will be called when the use enables/disables the legend item
         * by clicking on it. The callback will be called with the key and the new
         * disabled state.
         */
        onChange: React.PropTypes.func
    },

    handleClick(key, disabled) {
        if (this.props.onChange) {
            this.props.onChange(key, disabled);
        }
    },

    renderLine(style) {
        const { width, height } = this.props;
        return (
            <svg style={{float: "left"}} height={height} width={width} >
                <line
                    style={style}
                    x1={0} y1={parseInt(width / 2)}
                    x2={width} y2={parseInt(width / 2)}
                    stroke="black"
                    strokeWidth="2"/>
            </svg>
        );
    },

    renderSwatch(style) {
        const { width, height } = this.props;
        return (
            <svg style={{float: "left"}} height={height} width={width} >
                <rect
                    style={style}
                    x={2} y={2}
                    width={width-4} height={height-4}
                    rx={2} ry={2} />

            </svg>
        );
    },

    renderDot(style) {
        const { width, height } = this.props;
        return (
            <svg style={{float: "left"}} height={height} width={width} >
                <ellipse
                    style={style}
                    cx={parseInt(width/2) + 2} cy={parseInt(height/2) + 1}
                    rx={parseInt(width/2) - 2} ry={parseInt(height/2) - 2} />
            </svg>
        );
    },

    render() {

        const baseLabelStyle = {
            paddingRight: 15,
            cursor: this.props.onChange ? "pointer" : "hand"
        };

        const baseValueStyle = {
            fontSize: "1.2rem",
            color: "#999"
        };

        const items = this.props.categories.map(category => {
            const categoryStyle = merge(true, {}, category.style);

            const categoryLabelStyle = category.labelStyle || {};
            const categoryValueStyle = category.valueStyle || {};
            const disabled = category.disabled || false;

            if (disabled) {
                categoryStyle.opacity = 0.25;
            }

            let symbol;
            if (this.props.type === "swatch") {
                symbol = this.renderSwatch(categoryStyle);
            } else if (this.props.type === "line") {
                symbol = this.renderLine(categoryStyle);
            } else if (this.props.type === "dot") {
                symbol = this.renderDot(categoryStyle);
            }

            const labelStyle = merge(true, baseLabelStyle, categoryLabelStyle);
            const valueStyle = merge(true, baseValueStyle, categoryValueStyle);

            return (
                <FlexBox
                    column
                    width={0}
                    key={category.key}
                    style={this.props.onChange ? {cursor: "pointer"} : {}}
                    onClick={() => this.handleClick(category.key, !disabled)}>
                    <FlexBox row>
                        <FlexBox column style={{marginTop: 2}} width="20px">
                            {symbol}
                        </FlexBox>
                        <FlexBox column>
                            <FlexBox row style={labelStyle}>
                                {category.label}
                            </FlexBox>
                            <FlexBox row style={valueStyle}>
                                {category.value}
                            </FlexBox>
                        </FlexBox>
                    </FlexBox>
                </FlexBox>
            );
        });

        const align = this.props.align === "left" ? "flex-start" : "flex-end";

        return (
            <FlexBox style={{justifyContent: align}}>
                {items}
            </FlexBox>
        );
    }
});
