/** @jsx React.DOM */

"use strict";

var React = require("react");
var util = require("util");

require("./tracker.css");

var Tracker = React.createClass({

    displayName: "Tracker",

    render: function() {
        var posx = this.props.scale(this.props.position);
        if (posx) {
            return (
                <line className={"tracker-line"} x1={posx} y1={0} x2={posx} y2={this.props.height} />
            );
        } else {
            return null;
        }
    },
});

module.exports = Tracker;