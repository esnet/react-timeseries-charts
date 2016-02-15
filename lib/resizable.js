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

/**
 * This takes a single child and inserts a prop 'width' on it that is the
 * current width of the this container. This is handy if you want to surround
 * a chart or other svg diagram and have this drive the chart width.
 */
exports["default"] = _react2["default"].createClass({
    displayName: "resizable",

    getInitialState: function getInitialState() {
        return { width: 0 };
    },

    handleResize: function handleResize() {
        this.setState({ width: this.refs.container.offsetWidth });
    },

    componentDidMount: function componentDidMount() {
        window.addEventListener("resize", this.handleResize); //eslint-disable-line
        this.handleResize();
    },

    componentWillUnmount: function componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize); //eslint-disable-line
    },

    render: function render() {
        var props = { width: this.state.width };
        var child = _react2["default"].Children.only(this.props.children);
        var childElement = this.state.width ? _react2["default"].cloneElement(child, props) : null;
        return _react2["default"].createElement(
            "div",
            { ref: "container", style: this.props.style, className: this.props.className },
            childElement
        );
    }
});
module.exports = exports["default"];