"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var defaultStyle = {
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
    }
};

/**
 *
 * The BaseLine component displays a simple horizontal line at a value.
 *
 * For example the following code overlays Baselines for the mean and stdev
 * of a series on top of another chart.
 *
 * ```
 * <ChartContainer timeRange={series.timerange()} >
 *     <ChartRow height="150">
 *         <YAxis id="price" label="Price ($)" min={series.min()} max={series.max()} width="60" format="$,.2f"/>
 *         <Charts>
 *             <LineChart axis="price" series={series} style={style}/>
 *             <Baseline axis="price" value={series.avg()} label="Avg" position="right"/>
 *             <Baseline axis="price" value={series.avg()-series.stdev()}/>
 *             <Baseline axis="price" value={series.avg()+series.stdev()}/>
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
exports.default = _react2.default.createClass({

    displayName: "Baseline",

    getDefaultProps: function getDefaultProps() {
        return {
            value: 0,
            label: "",
            position: "left",
            style: defaultStyle
        };
    },


    propTypes: {

        /**
         * Reference to the axis which provides the vertical scale for drawing. e.g.
         * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
         */
        axis: _react2.default.PropTypes.string.isRequired,

        /**
         * The y-value to display the line at.
         */
        value: _react2.default.PropTypes.number,

        /**
         * The label to display with the axis.
         */
        label: _react2.default.PropTypes.string,

        /**
         * Whether to display the label on the "left" or "right".
         */
        position: _react2.default.PropTypes.oneOf(["left", "right"])
    },

    render: function render() {
        if (!this.props.yScale || !this.props.value) {
            return null;
        }

        var y = this.props.yScale(this.props.value);
        var transform = "translate(0 " + y + ")";
        var points = void 0;
        var textAnchor = void 0;
        var textPositionX = void 0;
        var pts = [];

        var textPositionY = -3;

        if (this.props.position === "left") {
            textAnchor = "start";
            textPositionX = 5;
        }
        if (this.props.position === "right") {
            textAnchor = "end";
            textPositionX = this.props.width - 5;
        }

        pts.push("0 0");
        pts.push(this.props.width + " 0");
        points = pts.join(" ");

        //
        // Style
        //

        var labelStyle = (0, _merge2.default)(true, defaultStyle.label, this.props.style.label ? this.props.style.label : {});
        var lineStyle = (0, _merge2.default)(true, defaultStyle.line, this.props.style.line ? this.props.style.line : {});

        return _react2.default.createElement(
            "g",
            { className: "baseline", transform: transform },
            _react2.default.createElement("polyline", { points: points, style: lineStyle }),
            _react2.default.createElement(
                "text",
                {
                    style: labelStyle,
                    x: textPositionX,
                    y: textPositionY,
                    textAnchor: textAnchor },
                this.props.label
            )
        );
    }
});