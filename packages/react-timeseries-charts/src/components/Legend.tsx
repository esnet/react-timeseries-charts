/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import _ from "underscore";
import merge from "merge";
import React from "react";
import Flexbox from "flexbox-react";

import { Styler } from "../js/styler";

export type LegendItemProps = {
    itemKey: string;
    type: "swatch" | "line" | "dot";
    label: string;
    value: string;
    symbolWidth: number;
    symbolHeight: number;
    symbolStyle: object;
    labelStyle: object;
    valueStyle: object;
    onSelectionChange: (key: string) => any;
    onHighlightChange: (key: string) => any;
}

export class LegendItem extends React.Component<LegendItemProps> {
    handleClick(e, key) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(key);
        }
    }
    handleHover(e, key) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(key);
        }
    }
    handleHoverLeave() {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    }
    renderLine(style) {
        const { symbolWidth, symbolHeight } = this.props;
        return (
            <svg style={{ float: "left" }} width={symbolWidth} height={symbolHeight}>
                <line
                    style={style}
                    x1={0}
                    y1={Math.round(symbolWidth / 2)}
                    x2={symbolWidth}
                    y2={Math.round(symbolWidth / 2)}
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>
        );
    }
    renderSwatch(style) {
        const { symbolWidth, symbolHeight } = this.props;
        return (
            <svg style={{ float: "left" }} width={symbolWidth} height={symbolHeight}>
                <rect
                    style={style}
                    x={2}
                    y={2}
                    width={symbolWidth - 4}
                    height={symbolHeight - 4}
                    rx={2}
                    ry={2}
                />
            </svg>
        );
    }
    renderDot(style) {
        const { symbolWidth, symbolHeight } = this.props;
        return (
            <svg style={{ float: "left" }} width={symbolWidth} height={symbolHeight}>
                <ellipse
                    style={style}
                    cx={Math.round(symbolWidth / 2) + 2}
                    cy={Math.round(symbolHeight / 2) + 1}
                    rx={Math.round(symbolWidth / 2) - 2}
                    ry={Math.round(symbolHeight / 2) - 2}
                />
            </svg>
        );
    }
    render() {
        const { symbolStyle, labelStyle, valueStyle, itemKey } = this.props;
        let symbol;
        switch (this.props.type) {
            case "swatch":
                symbol = this.renderSwatch(symbolStyle);
                break;
            case "line":
                symbol = this.renderLine(symbolStyle);
                break;
            case "dot":
                symbol = this.renderDot(symbolStyle);
                break;
            default:
        }
        // TODO: We shouldn't be adding interactions to a element like this.
        //       The alternative it to put it on a <a> or something?
        return (
            <Flexbox flexDirection="column" key={itemKey}>
                <div
                    onClick={e => this.handleClick(e, itemKey)}
                    onMouseMove={e => this.handleHover(e, itemKey)}
                    onMouseLeave={() => this.handleHoverLeave()}
                >
                    <Flexbox flexDirection="row">
                        <Flexbox width="20px">{symbol}</Flexbox>
                        <Flexbox flexDirection="column">
                            <Flexbox>
                                <div style={labelStyle}>{this.props.label}</div>
                            </Flexbox>
                            <Flexbox>
                                <div style={valueStyle}>{this.props.value}</div>
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                </div>
            </Flexbox>
        );
    }
}

export type Category = {
    key: string,
    label: string,
    value: string,
    disabled?: boolean,
    style?: object,
    labelStyle?: object
}

export type CSSProperties = { [key: string]: any };

export type ModeStyle = {
    normal: CSSProperties;
    highlighted: CSSProperties;
    selected: CSSProperties;
    muted: CSSProperties;
}

export type CategoryStyle = {
    symbol: ModeStyle;
    label: ModeStyle;
    value: ModeStyle;
}

export type LegendStyle = { [key: string]: CategoryStyle }

const defaultStyle: CategoryStyle = {
    symbol: {
        normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
        selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
        muted: { stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1 }
    },
    label: {
        normal: { fontSize: "normal", color: "#333" },
        highlighted: { fontSize: "normal", color: "#222" },
        selected: { fontSize: "normal", color: "#333" },
        muted: { fontSize: "normal", color: "#333", opacity: 0.4 }
    },
    value: {
        normal: { fontSize: "normal", color: "#333" },
        highlighted: { fontSize: "normal", color: "#222" },
        selected: { fontSize: "normal", color: "#333" },
        muted: { fontSize: "normal", color: "#333", opacity: 0.4 }
    }
};

export type LegendProps = {
    type?: "swatch" | "line" | "dot",
    align?: "left" | "right",
    style?: LegendStyle | ((column: string) => CategoryStyle) | Styler,
    categories: Category[],
    symbolWidth?: number,
    symbolHeight?: number,
    highlight?: string,
    selection?: string,
    onSelectionChange?: (...args: any[]) => any,
    onHighlightChange?: (...args: any[]) => any
};

/**
 * Legends are simple to define.
 *
 * First specify the styles you want each item to have. This is either
 * the CSS that should be appied to rendered symbol. Or you can provide
 * a Styler object. See below for full styling details.
 *
 * ```
 * const style = Styler([
 *     {key: "aud", color: "steelblue", width: 1, dashed: true},
 *     {key: "euro", color: "#F68B24", width: 2}
 * ]);
 * ```
 *
 * Next build a list of categories you want in the legend.
 *
 * ```
 * const categories = [
 *     {key: "aust", label: "AUD", value: "1.52", disabled: true},
 *     {key: "usa", label: "USD", value: "1.43", disabled: false}
 * ];
 * ```
 * For each category to display you must provide a key, a label and
 * if it should be displayed disabled or not.
 *
 * Then render the legend, with type either "line", "swatch" or "dot":
 *
 * ```
 * <Legend type="line" style={style} categories={categories} />
 * ```
 *
 * Optionally you can also display a value below the label. This is
 * useful when hovering over another chart on the page, or to display
 * the current value of live data. You can see this defined in the
 * above categories.
 *
 * The legend can also be supplied with callback functions which will
 * tell you if the user has clicked or hovered over on one of the legend
 * items. You can use this to sync highlighting and selection to a
 * chart.
 *
 * ## Styling
 *
 * There are three methods of styling a legend:
 *  - using a Styler object
 *  - using an object containing inline styles
 *  - using a function which returns an inline style
 *
 * A Styler object can be supplied directly to the `style` prop
 * of the legend. This is the simplest approach, since you can
 * usually just use the same Styler as you use for your chart.
 *
 * Supplying an object to the `style` prop gives you more control
 * than the Styler, since you can provide the actual CSS properties
 * for each element of the legend. The format for the object is:
 *
 * ```
 * {
 *     columnName1: {
 *       symbol: {
 *         normal: {...styleSymbol},
 *         highlighted: {...styleSymbol},
 *         selected: {...styleSymbol},
 *         muted: {...styleSymbol}
 *       },
 *       label: {
 *         normal: {...labelStyle},
 *         highlighted: {...labelStyle},
 *         selected: {...labelStyle},
 *         muted: {...labelStyle}
 *       },
 *       value: {
 *         normal: {...valueStyle},
 *         highlighted: {...valueStyle},
 *         selected: {...valueStyle},
 *         muted: {...valueStyle}
 *       }
 *     },
 *     columnName2 : {
 *         ...
 *     },
 *     ...
 *  }
 *
 *  - symbolStyle is the CSS properties for the symbol, which
 * is either a swatch, dot or line. For a line, you'd want to
 * provide the SVG <line> properties, for a swatch you'd provide
 * the SVG <rect> properties and for a dot the <ellipse> properties.
 *  - labelStyle is the main label for the legend item. It is a
 *  SVG <text> element, so you can control the font properties.
 *  - valueStyle is the optional value. As with the labelStyle you
 *  this is an SVG <text> element.
 *
 * Finally, you can provide a function to the `style` prop. This
 * is similar to providing an object, except your function will
 * be called with the columnName and you should return the map
 * containing symbol, label and value styles.
 */
export class Legend extends React.Component<LegendProps, {}> {

    static defaultProps: Partial<LegendProps> = {
        style: {},
        type: "swatch",
        align: "left",
        symbolWidth: 16,
        symbolHeight: 16
    };

    handleClick(e, key) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(key);
        }
    }

    handleHover(e, key) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(key);
        }
    }

    handleHoverLeave() {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    }

    /**
     * For each category item we get the users stle preference. This
     * can be supplied in a number of ways:
     *  * Typically you would get the legend style from a `Style` instance;
     *  * Alternatively, you can pass in a style object which has your
     *    category in it mapped to the associated style;
     *  * Finally, the provided style can also be a function which will
     *    be passes a category and should return the associated style.
     *    i.e. (category: string) => CategoryStyle
     */
    providedStyle(category: Category, type: string): CategoryStyle {
        if (this.props.style) {
            if (this.props.style instanceof Styler) {
                return this.props.style.legendStyle(category.key, type);
            } else if (_.isObject(this.props.style)) {
                return this.props.style[category.key];
            } else {
                const fn = this.props.style as (category: string) => CategoryStyle;
                return fn(category.key);
            }
        }
    }

    /**
     * For each category this function takes the current
     * selected and highlighted item, along with the disabled
     * state of the item, and returns the mode it should be
     * rendered in: normal, selected, highlighted, or muted
     */
    styleMode(category) {
        const isHighlighted = this.props.highlight && category.key === this.props.highlight;
        const isSelected = this.props.selection && category.key === this.props.selection;
        const isDisabled = category.disabled;
        let mode = "normal";
        if (this.props.selection) {
            if (isSelected) {
                mode = "selected";
            } else if (isHighlighted) {
                mode = "highlighted";
            } else {
                mode = "muted";
            }
        } else if (isHighlighted) {
            mode = "highlighted";
        } else if (isDisabled) {
            mode = "muted";
        }
        return mode;
    }

    symbolStyle(category) {
        const styleMap = this.providedStyle(category, this.props.type);
        const styleMode = this.styleMode(category);
        return merge(
            true,
            defaultStyle[styleMode],
            styleMap.symbol[styleMode] ? styleMap.symbol[styleMode] : {}
        );
    }

    labelStyle(category) {
        const styleMap = this.providedStyle(category, this.props.type);
        const styleMode = this.styleMode(category);
        return merge(
            true,
            defaultStyle[styleMode],
            styleMap.label[styleMode] ? styleMap.label[styleMode] : {}
        );
    }

    valueStyle(category) {
        const styleMap = this.providedStyle(category, this.props.type);
        const styleMode = this.styleMode(category);
        return merge(
            true,
            defaultStyle[styleMode],
            styleMap.value[styleMode] ? styleMap.value[styleMode] : {}
        );
    }

    render() {
        const { type, symbolWidth, symbolHeight } = this.props;
        const items = this.props.categories.map(category => {
            const { key, label, value } = category;
            const symbolStyle = this.symbolStyle(category);
            const labelStyle = this.labelStyle(category);
            const valueStyle = this.valueStyle(category);
            return (
                <LegendItem
                    key={key}
                    type={type}
                    itemKey={key}
                    label={label}
                    value={value}
                    symbolWidth={symbolWidth}
                    symbolHeight={symbolHeight}
                    symbolStyle={symbolStyle}
                    labelStyle={labelStyle}
                    valueStyle={valueStyle}
                    onSelectionChange={this.props.onSelectionChange}
                    onHighlightChange={this.props.onHighlightChange}
                />
            );
        });
        const align = this.props.align === "left" ? "flex-start" : "flex-end";
        return (
            <Flexbox justifyContent={align}>
                {items}
            </Flexbox>
        );
    }
}
