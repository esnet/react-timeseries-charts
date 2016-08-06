"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders a 'axis' that display a label for a current tracker value
 *
 *      ----+----------------+
 *          |     56.2G      |
 *          |      bps       |
 *          |                |
 *      ----+----------------+
 *
 *  EXPERIMENTAL
 */
exports.default = _react2.default.createClass({

    displayName: "ValueAxis",

    render: function render() {
        var labelStyle = {
            fill: "#666",
            fontSize: 20,
            textAnchor: "middle"
        };
        var detailStyle = {
            fontSize: 12,
            textAnchor: "middle",
            fill: "#9a9a9a"
        };
        return _react2.default.createElement(
            "g",
            null,
            _react2.default.createElement("rect", {
                key: "background",
                x: "0", y: "0",
                width: this.props.width,
                height: this.props.height,
                style: { fill: "none", stroke: "none" } }),
            _react2.default.createElement(
                "text",
                {
                    key: "value",
                    x: parseInt(this.props.width / 2, 10),
                    y: this.props.height / 2,
                    style: labelStyle },
                this.props.value
            ),
            _react2.default.createElement(
                "text",
                {
                    key: "detail",
                    x: parseInt(this.props.width / 2, 10),
                    y: this.props.height / 2, dy: "1.2em",
                    style: detailStyle },
                this.props.detail
            )
        );
    }
}); /**
     *  Copyright (c) 2015, The Regents of the University of California,
     *  through Lawrence Berkeley National Laboratory (subject to receipt
     *  of any required approvals from the U.S. Dept. of Energy).
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree.
     */