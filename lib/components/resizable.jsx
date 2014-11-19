/** @jsx React.DOM */

"use strict";

var React = require("react");

/**
 * This takes a single child and inserts a prop 'width' on it that is the
 * current width of the this container. This is handy if you want to surround
 * a chart or other svg diagram and have this drive the chart width.
 */
var Resizable = React.createClass({
    getInitialState: function() {
        return {width: 0};
    },

    handleResize: function(e) {
        this.setState({width: this.refs.container.getDOMNode().offsetWidth});
    },

    componentDidMount: function() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    },

    render: function() {
        var props = {"width": this.state.width};
        var child = React.Children.only(this.props.children);
        var childElement = this.state.width ? React.addons.cloneWithProps(child, props) : null;
        return (
            <div ref="container">
                {childElement}
            </div>
        );
    }
});

module.exports = Resizable;