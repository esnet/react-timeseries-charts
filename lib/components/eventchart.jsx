/** @jsx React.DOM */

"use strict";

var React = require("react");
var _ = require("underscore");

require("./eventchart.css");

/**
 * Renders an event view that shows the supplied set of
 * events along a time axis.
 */


var EventChart = React.createClass({

    displayName: "EventChart",

    render: function() {
        var scale = this.props.timeScale;
        // Create and array of markers, one for each event
        var markers = [];
        markers = _.map(this.props.events, function(event) {
            var posx = scale(new Date(event.time));
            var transform = "translate(" + posx + ",0)";
            return (
                <g transform={transform} >
                    <rect className="eventchart-marker"
                          x={0} y={0}
                          width={2} height={30}/>
                    <text  className="eventchart-marker-label"
                        x={4} y={10}>
                        {event.label}
                    </text>
                </g>
            );
        });

        return (
            <g>
                {markers}
            </g>
        );
    }
});

module.exports = EventChart;
