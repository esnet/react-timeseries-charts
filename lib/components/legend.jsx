/** @jsx React.DOM */

"use strict";

var React = require("react");
var _ = require("underscore");

require("./legend.css");

var Legend = React.createClass({

    displayName: "Legend",

    render: function() {
        var items = [];

        _.each(this.props.categories, function(categoryClass, categoryLabel) {
            var swatchClass = "legend-swatch " + categoryClass;
            var labelClass = "legend-label " + categoryClass;
            items.push(
                <li key={"legend-item-" + i} className="legend-list">
                    <span className={swatchClass} />
                    <span className={labelClass}> {categoryLabel} </span>
                </li>
            );
        });

        return (
            <ul className="horizontal-legend">{items}</ul>
        );
    }
});

module.exports = Legend;