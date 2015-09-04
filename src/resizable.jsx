/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react/addons";

/**
 * This takes a single child and inserts a prop 'width' on it that is the
 * current width of the this container. This is handy if you want to surround
 * a chart or other svg diagram and have this drive the chart width.
 */
export default React.createClass({
    getInitialState() {
        return {width: 0};
    },

    handleResize() {
        this.setState({width: this.refs.container.getDOMNode().offsetWidth});
    },

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);  //eslint-disable-line
        this.handleResize();
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);  //eslint-disable-line
    },

    render() {
        const props = {width: this.state.width};
        const child = React.Children.only(this.props.children);
        const childElement = this.state.width ?
            React.addons.cloneWithProps(child, props) : null;
        return (
            <div ref="container">
                {childElement}
            </div>
        );
    }
});
