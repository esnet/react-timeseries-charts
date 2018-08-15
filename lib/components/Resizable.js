"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends =
    Object.assign ||
    function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
            "Super expression must either be null or a function, not " + typeof superClass
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
    });
    if (superClass)
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
} /**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/**
 * This takes a single child and inserts a prop 'width' on it that is the
 * current width of the this container. This is handy if you want to surround
 * a chart or other svg diagram and have this drive the chart width.
 */
var Resizable = (function(_React$Component) {
    _inherits(Resizable, _React$Component);

    function Resizable(props) {
        _classCallCheck(this, Resizable);

        var _this = _possibleConstructorReturn(
            this,
            (Resizable.__proto__ || Object.getPrototypeOf(Resizable)).call(this, props)
        );

        _this.state = { width: 0 };
        return _this;
    }

    _createClass(Resizable, [
        {
            key: "componentDidMount",
            value: function componentDidMount() {
                window.addEventListener("resize", this.handleResize);
                this.handleResize();
            }
        },
        {
            key: "componentWillUnmount",
            value: function componentWillUnmount() {
                window.removeEventListener("resize", this.handleResize);
            }
        },
        {
            key: "handleResize",
            value: function handleResize() {
                if (this.container) {
                    this.setState({
                        width: this.container.offsetWidth
                    });
                }
            }
        },
        {
            key: "render",
            value: function render() {
                var _this2 = this;

                var child = _react2.default.Children.only(this.props.children);
                var childElement = this.state.width
                    ? _react2.default.cloneElement(child, { width: this.state.width })
                    : null;
                return _react2.default.createElement(
                    "div",
                    _extends(
                        {
                            ref: function ref(c) {
                                _this2.container = c;
                            }
                        },
                        this.props
                    ),
                    childElement
                );
            }
        }
    ]);

    return Resizable;
})(_react2.default.Component);

exports.default = Resizable;

Resizable.propTypes = {
    children: _propTypes2.default.node
};
