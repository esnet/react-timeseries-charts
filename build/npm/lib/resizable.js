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

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

/**
 * This takes a single child and inserts a prop 'width' on it that is the
 * current width of the this container. This is handy if you want to surround
 * a chart or other svg diagram and have this drive the chart width.
 */
exports['default'] = _reactAddons2['default'].createClass({
    displayName: 'resizable',

    getInitialState: function getInitialState() {
        return { width: 0 };
    },

    handleResize: function handleResize(e) {
        this.setState({ width: this.refs.container.getDOMNode().offsetWidth });
    },

    componentDidMount: function componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },

    componentWillUnmount: function componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },

    render: function render() {
        var props = { 'width': this.state.width };
        var child = _reactAddons2['default'].Children.only(this.props.children);
        var childElement = this.state.width ? _reactAddons2['default'].addons.cloneWithProps(child, props) : null;
        return _reactAddons2['default'].createElement(
            'div',
            { ref: 'container' },
            childElement
        );
    }
});
module.exports = exports['default'];