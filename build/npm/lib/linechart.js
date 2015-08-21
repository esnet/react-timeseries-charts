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

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _reactAddons = require("react/addons");

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _d3 = require("d3");

var _d32 = _interopRequireDefault(_d3);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

exports["default"] = _reactAddons2["default"].createClass({
    displayName: "linechart",

    getDefaultProps: function getDefaultProps() {
        return {
            "interpolate": "basis",
            //"showDataPoints": false,
            //"dataPointRadius": 1.0,
            "style": {
                "color": "#9DA3FF",
                "width": 1
            }
        };
    },

    renderLineChart: function renderLineChart(series, timeScale, yScale, interpolate,
    /*showDataPoints, dataPointRadius,*/classed) {
        var data = series.toJSON().points;

        if (!yScale || !data[0]) {
            return null;
        }

        var style = {
            "fill": "none",
            "stroke": this.props.style.color || "#9DA3FF",
            "stroke-width": this.props.style.width + "px" || "1px"
        };

        _d32["default"].select(this.getDOMNode()).selectAll("*").remove();

        var line = _d32["default"].svg.line().interpolate(interpolate).x(function (d) {
            return timeScale(d[0]);
        }).y(function (d) {
            return yScale(d[1]);
        });

        this.path = _d32["default"].select(this.getDOMNode()).append("path").datum(data).style(style).attr("d", line).attr("clip-path", this.props.clipPathURL);

        /*
        if (showDataPoints) {
            d3.select(this.getDOMNode()).selectAll("dot")
                .data(data)
                .enter().append("circle")
                    .attr("r", dataPointRadius)
                    .attr("cx", d => timeScale(d.time))
                    .attr("cy", d => yScale(d.value))
        }
        */
    },

    updateLineChart: function updateLineChart(series, timeScale, yScale, interpolate,
    /*showDataPoints, dataPointRadius,*/classed) {
        var data = series.toJSON().points;

        var line = _d32["default"].svg.line().interpolate(interpolate).x(function (d) {
            return timeScale(d[0]);
        }).y(function (d) {
            return yScale(d[1]);
        });

        this.path.datum(data).transition().duration(this.props.transition).ease("sin-in-out").attr("d", line);
    },

    componentDidMount: function componentDidMount() {
        this.renderLineChart(this.props.series, this.props.timeScale, this.props.yScale, this.props.interpolate,
        //this.props.showDataPoints,
        //this.props.dataPointRadius,
        this.props.classed);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var series = nextProps.series;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var classed = nextProps.classed;
        var interpolate = nextProps.interpolate;

        //var showDataPoints = nextProps.showDataPoints;
        //var dataPointRadius = nextProps.dataPointRadius;

        if (this.props.series !== nextProps.series || this.props.time !== nextProps.time || this.interpolate !== interpolate ||
        //this.showDataPoints !== showDataPoints ||
        //this.dataPointRadius !== dataPointRadius ||
        scaleAsString(this.props.timeScale) !== scaleAsString(timeScale) || scaleAsString(this.props.yScale) !== scaleAsString(yScale)) {
            this.updateLineChart(series, timeScale, yScale, interpolate,
            /*showDataPoints, dataPointRadius,*/classed);
        }
    },

    shouldComponentUpdate: function shouldComponentUpdate() {
        return false;
    },

    handleMouseMove: function handleMouseMove(e) {
        console.log(e);
    },

    render: function render() {
        return _reactAddons2["default"].createElement("g", null);
    }
});
module.exports = exports["default"];