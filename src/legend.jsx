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
import _ from "underscore";
import merge from "merge";

/**
 * Legends are simple to define. First define the items you want in
 * it using an array as follows:
 *
 * ```
 * const categories = [
 *     {key: "aust", label: "AUD", disabled={true} style: {backgroundColor: "#1f77b4"}},
 *     {key: "usa", label: "USD", disabled={false} style: {backgroundColor: "#aec7e8"}}
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
 * if it should be displayed disabled or not. You may also provide a
 * style which will be merged in with the base style for that type and
 * a disabled boolean if it should be rendered with a disabled appearance.
 *
 * The legend can also be supplied with a callback function which will
 * tell you if the user has clicked on one of the legend items to
 * enable/disable that item. The callback will be called with the key and
 * the new enabled/disabled state. You can use this to hide or show the series
 * on the chart, for example. Note that you'll want to pass the state back
 * into the legend as that category's disabled value.
 */
export default React.createClass({

    displayName: "Legend",

    getDefaultProps() {
        return {
            style: {},
            labelStyle: {},
            type: "swatch" // or "line" or "dot"
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

    render() {

        const legendStyle = {
            listStyle: "none",
            paddingLeft: 0,
            cursor: "pointer"
        };

        const legendListStyle = {
            float: "left",
            marginRight: 10
        };

        const swatchStyle = {
            float: "left",
            width: 15,
            height: 15,
            margin: 2,
            borderRadius: 2,
            backgroundColor: "#EFEFEF"
        };

        const lineStyle = {
            float: "left",
            width: 15,
            height: 3,
            margin: 2,
            marginTop: 8,
            backgroundColor: "#EFEFEF"
        };

        const dotStyle = {
            float: "left",
            width: 8,
            height: 8,
            margin: 2,
            marginTop: 6,
            borderRadius: 4,
            backgroundColor: "#EFEFEF"
        };

        const baseLabelStyle = {
        };

        const items = [];
        _.each(this.props.categories, (category) => {
            let style;
            const categoryStyle = category.style || {};
            const categoryLabelStyle = category.labelStyle || {};
            const disabled = category.disabled || false;
            if (this.props.type === "swatch") {
                style = disabled ? swatchStyle : merge(true, swatchStyle, categoryStyle);
            } else if (this.props.type === "line") {
                style = disabled ? lineStyle : merge(true, lineStyle, categoryStyle);
            } else if (this.props.type === "dot") {
                style = disabled ? dotStyle : merge(true, dotStyle, categoryStyle);
            }

            const labelStyle = merge(true, baseLabelStyle, categoryLabelStyle);

            items.push(
                <li
                    key={`legend-item-${category.key}`}
                    style={legendListStyle}
                    onClick={() => this.handleClick(category.key, !disabled)}>
                    <span style={style}/>
                    <span style={labelStyle}> {category.label} </span>
                </li>
            );
        });

        return (
            <ul style={legendStyle}>{items}</ul>
        );
    }
});
