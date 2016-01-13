/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("./baseline.css");

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
exports["default"] = _react2["default"].createClass({

    displayName: "Baseline",

    getDefaultProps: function getDefaultProps() {
        return {
            value: 0,
            label: "",
            position: "left"
        };
    },

    propTypes: {

        /**
         * Reference to the axis which provides the vertical scale for drawing. e.g.
         * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
         */
        axis: _react2["default"].PropTypes.string.isRequired,

        /**
         * The y-value to display the line at.
         */
        value: _react2["default"].PropTypes.number,

        /**
         * The label to display with the axis.
         */
        label: _react2["default"].PropTypes.string,

        /**
         * Whether to display the label on the "left" or "right".
         */
        position: _react2["default"].PropTypes.oneOf(["left", "right"])
    },

    render: function render() {
        if (!this.props.yScale || !this.props.value) {
            return null;
        }

        var ymin = Math.min(this.props.yScale.range()[0], this.props.yScale.range()[1]);
        var y = this.props.yScale(this.props.value);
        var transform = "translate(0 " + y + ")";
        var points = undefined;
        var textAnchor = undefined;
        var textPositionX = undefined;
        var pts = [];

        var textPositionY = -3;
        if (y < ymin + 10) {
            textPositionY = 12;
        }

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

        return _react2["default"].createElement(
            "g",
            { className: "baseline", transform: transform },
            _react2["default"].createElement("polyline", { points: points, style: { pointerEvents: "none" } }),
            _react2["default"].createElement(
                "text",
                { className: "baseline-label",
                    x: textPositionX,
                    y: textPositionY, textAnchor: textAnchor },
                this.props.label
            )
        );
    }
});
module.exports = exports["default"];