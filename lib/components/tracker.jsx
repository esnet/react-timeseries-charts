/** @jsx React.DOM */

"use strict";

var React = require("react");
var util = require("util");

var Tracker = React.createClass({

    displayName: "Tracker",

    render: function() {
        var posx = this.props.scale(this.props.position);

        //Points for the svg path
        var pts = [];
        pts.push(util.format("%d,%d", posx, 0));
        pts.push(util.format("%d,%d", posx, this.props.height));
        var points = pts.join(" ");

        return (
            <polyline points={points}
                      className={"chart tracker line"} />
        );
    },
});

module.exports = Tracker;