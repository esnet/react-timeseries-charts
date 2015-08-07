/*
 * ESnet React Charts, Copyright (c) 2014, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
 *
 * If you have questions about your rights to use or distribute this
 * software, please contact Berkeley Lab's Technology Transfer
 * Department at TTD@lbl.gov.
 *
 * NOTICE.  This software is owned by the U.S. Department of Energy.
 * As such, the U.S. Government has been granted for itself and others
 * acting on its behalf a paid-up, nonexclusive, irrevocable,
 * worldwide license in the Software to reproduce, prepare derivative
 * works, and perform publicly and display publicly.  Beginning five
 * (5) years after the date permission to assert copyright is obtained
 * from the U.S. Department of Energy, and subject to any subsequent
 * five (5) year renewals, the U.S. Government is granted for itself
 * and others acting on its behalf a paid-up, nonexclusive,
 * irrevocable, worldwide license in the Software to reproduce,
 * prepare derivative works, distribute copies to the public, perform
 * publicly and display publicly, and to permit others to do so.
 *
 * This code is distributed under a BSD style license, see the LICENSE
 * file for complete information.
 */

import React from "react/addons";
import _ from "underscore";
import {TimeSeries} from "pond";

const TooltipArrowStyle = {
  position: 'absolute',
  width: 0, height: 0,
  borderRightColor: 'transparent',
  borderLeftColor: 'transparent',
  borderTopColor: 'transparent',
  borderBottomColor: 'transparent',
  borderStyle: 'solid',
  opacity: .75
};

const PlacementStyles = {
  left: {
    tooltip: { marginLeft: -3, padding: '0 5px' },
    arrow: {
      right: 0, marginTop: -5, borderWidth: '5px 0 5px 5px', borderLeftColor: '#000'
    }
  },
  right: {
    tooltip: { marginRight: 3, padding: '0 5px' },
    arrow: { left: 0, marginTop: -5, borderWidth: '5px 5px 5px 0', borderRightColor: '#000' }
  },
  top: {
    tooltip: { marginTop: -3, padding: '5px 0' },
    arrow: { bottom: 0, marginLeft: -5, borderWidth: '5px 5px 0', borderTopColor: '#000' }
  },
  bottom: {
    tooltip: { marginBottom: 3, padding: '5px 0' },
    arrow: { top: 0, marginLeft: -5, borderWidth: '0 5px 5px', borderBottomColor: '#000' }
  }
};

class ToolTip {
  render(){
    let placementStyle = PlacementStyles[this.props.placement];

    let {
      style,
      arrowOffsetLeft: left = placementStyle.arrow.left,
      arrowOffsetTop: top = placementStyle.arrow.top,
      ...props } = this.props;

    return (
      <div style={{...TooltipStyle, ...placementStyle.tooltip, ...style}}>
        <div style={{...TooltipArrowStyle, ...placementStyle.arrow, left, top }}/>
        <div style={TooltipInnerStyle}>
          { props.children }
        </div>
      </div>
    );
  }
}


/**
 * Renders a barchart. This BarChart implementation is a little different
 * in that it will render onto a time axis, rather than rendering to
 * specific values. As a result, an Aug 2014 bar will render between the
 * Aug 2014 tick mark and the Sept 2014 tickmark.
 */
export default React.createClass({

    propTypes: {
        series: React.PropTypes.instanceOf(TimeSeries),
        /**
         * The width of each bar is the width determined by the time range - spacing x 2
         */
        spacing: React.PropTypes.number,

        /**
         * The position of the bar is then offset by this value.
         */
        offset: React.PropTypes.number,

        /**
         * Which columns to display stacked on top of each other. If you don't supply
         * a columns prop then all columns will be stacked.
         */
        columns: React.PropTypes.array,

        /**
         * The style of each column e.g. {"traffic": {fill: "#FF0"}}
         */
        style: React.PropTypes.object
    },

    getDefaultProps: function() {
        return {
            spacing: 1,
            offset: 0,
            style: {"value": {fill: "#619F3A"}}
        };
    },

    handleEvent: function(e) {
        console.log("hover rect", e);
    },

    renderBars: function() {
        const spacing = Number(this.props.spacing);
        const offset = Number(this.props.offset);
        const series = this.props.series;
        const timeScale = this.props.timeScale;
        const yScale = this.props.yScale;
        const columns = this.props.columns || series._columns;

        let rects = [];
        for (event of series.events()) {
            const begin = event.begin();
            const end = event.end();

            const beginPos = timeScale(begin) + spacing;
            const endPos = timeScale(end) - spacing;

            let width;
            if (this.props.size) {
                width = this.props.size;
            } else {
                width = endPos - beginPos;
            }

            if (width < 1) {
                width = 1;
            }

            let x;
            if (this.props.size) {
                const center = timeScale(begin) + (timeScale(end) - timeScale(begin))/2;
                x = center - this.props.size/2 + offset;
            } else {
                x = timeScale(begin) + spacing + offset;
            }
            
            let ypos = yScale(0);
            for (let column of columns) {
                const value = event.get(column);
                
                let height = yScale(0) - yScale(value);
                if (height < 1) {
                    height = 1;
                }

                const y = ypos - height;
                const barStyle = this.props.style[column] ? this.props.style[column] : {fill: "steelblue"};
                
                rects.push(
                    <rect x={x} y={y} width={width} height={height}
                          style={barStyle}
                          clipPath={this.props.clipPathURL}
                          onClick={this.handleEvent}/>
                );

                ypos -= height;
            }
        }
        return rects;
    },

    render: function() {
        return (
            <g>
                {this.renderBars()}
            </g>
        );
    }
});
