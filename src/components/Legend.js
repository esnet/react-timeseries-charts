/**
 *  Copyright (c) 2015-2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from 'underscore';
import merge from 'merge';
import React from 'react';
import { Flexbox, FlexItem } from 'flexbox-react';

import { Styler } from '../js/styler';

const defaultStyle = {
  symbol: {
    normal: { stroke: 'steelblue', fill: 'none', strokeWidth: 1 },
    highlighted: { stroke: '#5a98cb', fill: 'none', strokeWidth: 1 },
    selected: { stroke: 'steelblue', fill: 'none', strokeWidth: 2 },
    muted: { stroke: 'steelblue', fill: 'none', opacity: 0.4, strokeWidth: 1 },
  },
  label: {
    normal: { fontSize: 'normal', color: '#333' },
    highlighted: { fontSize: 'normal', color: '#222' },
    selected: { fontSize: 'normal', color: '#333' },
    muted: { fontSize: 'normal', color: '#333', opacity: 0.4 },
  },
  value: {
    normal: { fontSize: 'normal', color: '#333' },
    highlighted: { fontSize: 'normal', color: '#222' },
    selected: { fontSize: 'normal', color: '#333' },
    muted: { fontSize: 'normal', color: '#333', opacity: 0.4 },
  },
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
      symbol: {
        normal: {...styleSymbol},
        highlighted: {...styleSymbol},
        selected: {...styleSymbol},
        muted: {...styleSymbol}
      },
      label: {
        normal: {...labelStyle},
        highlighted: {...labelStyle},
        selected: {...labelStyle},
        muted: {...labelStyle}
      },
      value: {
        normal: {...valueStyle},
        highlighted: {...valueStyle},
        selected: {...valueStyle},
        muted: {...valueStyle}
      }
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
export default class Legend extends React.Component {

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

  providedStyle(category) {
    let style = {};
    if (this.props.style) {
      if (this.props.style instanceof Styler) {
        style = this.props.style.legendStyle(category.key, this.props.type);
      } else if (_.isObject(this.props.style)) {
        style = this.props.style[category.key];
      } else if (_.isFunction(this.props.style)) {
        style = this.props.style(category.key);
      }
    }
    return style;
  }

  styleMode(category) {
    const isHighlighted = this.props.highlight && category.key === this.props.highlight;
    const isSelected = this.props.selection && category.key === this.props.selection;
    const isDisabled = category.disabled;

    let mode = 'normal';
    if (this.props.selection) {
      if (isSelected) {
        mode = 'selected';
      } else if (isHighlighted) {
        mode = 'highlighted';
      } else {
        mode = 'muted';
      }
    } else if (isHighlighted) {
      mode = 'highlighted';
    } else if (isDisabled) {
      mode = 'muted';
    }
    return mode;
  }

  symbolStyle(category) {
    const styleMap = this.providedStyle(category, this.props.type);
    const styleMode = this.styleMode(category);
    return merge(true,
           defaultStyle[styleMode],
           styleMap.symbol[styleMode] ? styleMap.symbol[styleMode] : {});
  }

  labelStyle(category) {
    const styleMap = this.providedStyle(category);
    const styleMode = this.styleMode(category);
    return merge(true,
           defaultStyle[styleMode],
           styleMap.label[styleMode] ? styleMap.label[styleMode] : {});
  }

  valueStyle(category) {
    const styleMap = this.providedStyle(category);
    const styleMode = this.styleMode(category);
    return merge(true,
           defaultStyle[styleMode],
           styleMap.value[styleMode] ? styleMap.value[styleMode] : {});
  }

  renderLine(style) {
    const { width, height } = this.props;
    return (
      <svg style={{ float: 'left' }} height={height} width={width} >
        <line
          style={style}
          x1={0} y1={parseInt(width / 2, 10)}
          x2={width} y2={parseInt(width / 2, 10)}
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    );
  }

  renderSwatch(style) {
    const { width, height } = this.props;
    return (
      <svg style={{ float: 'left' }} height={height} width={width} >
        <rect
          style={style}
          x={2}
          y={2}
          width={width - 4}
          height={height - 4}
          rx={2} ry={2}
        />
      </svg>
    );
  }

  renderDot(style) {
    const { width, height } = this.props;
    return (
      <svg style={{ float: 'left' }} height={height} width={width} >
        <ellipse
          style={style}
          cx={parseInt(width / 2, 10) + 2} cy={parseInt(height / 2, 10) + 1}
          rx={parseInt(width / 2, 10) - 2} ry={parseInt(height / 2, 10) - 2}
        />
      </svg>
    );
  }

  render() {
    const items = this.props.categories.map((category) => {
      const symbolStyle = this.symbolStyle(category);
      const labelStyle = this.labelStyle(category);
      const valueStyle = this.valueStyle(category);

      let symbol;
      if (this.props.type === 'swatch') {
        symbol = this.renderSwatch(symbolStyle);
      } else if (this.props.type === 'line') {
        symbol = this.renderLine(symbolStyle);
      } else if (this.props.type === 'dot') {
        symbol = this.renderDot(symbolStyle);
      }

      // TODO: We shouldn't be adding interactions to a element like this.
      //       The alternative it to put it on a <a> or something?

      return (
        <Flexbox flexDirection="column" key={category.key}>
          <div //eslint-disable-line
            onClick={e => this.handleClick(e, category.key)}
            onMouseMove={e => this.handleHover(e, category.key)}
            onMouseLeave={this.handleHoverLeave}
          >
            <Flexbox flexDirection="row">
              <FlexItem width="20px">
                {symbol}
              </FlexItem>
              <Flexbox flexDirection="column">
                <FlexItem>
                  <div style={labelStyle}>
                    {category.label}
                  </div>
                </FlexItem>
                <FlexItem>
                  <div style={valueStyle}>
                    {category.value}
                  </div>
                </FlexItem>
              </Flexbox>
            </Flexbox>
          </div>
        </Flexbox>
      );
    });

    const align = this.props.align === 'left' ? 'flex-start' : 'flex-end';

    return (
      <Flexbox justifyContent={align}>
        {items}
      </Flexbox>
    );
  }
}

Legend.propTypes = {

  /**
   * The overall style of the legend items, either a color "swatch", a
   * colored "line", or a "dot".
   */
  type: React.PropTypes.oneOf([
    'swatch',
    'line',
    'dot',
  ]),

  /**
   * Alignment of the legend within the available space. Either left or right.
   */
  align: React.PropTypes.oneOf([
    'left',
    'right',
  ]),

  style: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.func,
    React.PropTypes.instanceOf(Styler),
  ]).isRequired,

  /**
   * The categories array specifies details and style for each item in the legend. For each item:
   *  * "key" - (required) the name by which the legend will be known
   *  * "label" - (required) the displayed label
   *  * "style" - the swatch, dot, or line style. Typically you'd just
   *              specify {backgroundColor: "#1f77b4"}
   *  * "labelStyle" - the label style
   *  * "disabled" - a disabled state
   *
   * ```
   * const categories = [
   *    {key: "aust", label: "AUD", disabled: this.state.disabled["aust"],
   *      style: {backgroundColor: "#1f77b4"}},
   *    {key: "usa", label: "USD", disabled: this.state.disabled["usa"],
   *      style: {backgroundColor: "#aec7e8"}}
   * ];
   * ```
   */
  categories: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,    // eslint-disable-line
      label: React.PropTypes.string.isRequired,  // eslint-disable-line
      disabled: React.PropTypes.bool,            // eslint-disable-line
      style: React.PropTypes.object,             // eslint-disable-line
      labelStyle: React.PropTypes.object         // eslint-disable-line
    })
  ).isRequired,

  /**
   * The width of the legend symbol
   */
  width: React.PropTypes.number,

  /**
   * The height of the legend symbol
   */
  height: React.PropTypes.number,

  /**
   * Which item, specified by its key, should be rendered as highlighted
   */
  highlight: React.PropTypes.string,

  /**
   * Which item, specified by its key, should be rendered as selected
   */
  selection: React.PropTypes.string,

  /**
   * Callback will be called with a legend item is selected (i.e. it is clicked
   * on by the user)
   */
  onSelectionChange: React.PropTypes.func,

  /**
   * Callback will be called with a legend item is highlighted (i.e. it is hovered
   * over by the user)
   */
  onHighlightChange: React.PropTypes.func,
};

Legend.defaultProps = {
  style: {},
  labelStyle: {},
  type: 'swatch', // or "line" or "dot"
  align: 'left',
  width: 16,
  height: 16,
};
