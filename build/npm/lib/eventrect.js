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

var React = require("react");
var d3 = require("d3");

//Returns a d3 scale as a string so we can determine if we have a new scale
function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

var EventRect = React.createClass({

    displayName: "EventRect",

    handleZoom: function handleZoom() {
        var t = d3.event.translate[0] - this.state.translate[0];
        var s = d3.event.scale;
        var mouse = d3.mouse(this.getDOMNode());

        var center = this.props.scale.invert(mouse[0]).getTime(); //mouse position in ms since 1970
        var begin = this.props.scale.domain()[0].getTime(); //begin of range in ms
        var end = this.props.scale.domain()[1].getTime(); //end of range in ms

        var offset = this.props.scale.invert(-t).getTime() - begin; //translation offset in ms

        var beforeDuration = center - begin; //ms before mouse position
        var afterDuration = end - center; //ms after mouse position

        var newBeforeDuration = parseInt(beforeDuration / this.state.scale * s); // scaled ms before mouse
        var newAfterDuration = parseInt(afterDuration / this.state.scale * s); // scaled ms after mouse

        var newBegin;
        var newEnd;
        if (s === this.state.scale) {
            newBegin = new Date(begin + offset);
            newEnd = new Date(end + offset);
        } else {
            newBegin = new Date(center - newBeforeDuration);
            newEnd = new Date(center + newAfterDuration);
        }

        // constrain newBegin and newEnd by minTime and maxTime:
        // If minTime or maxTime properties are present, ensure that
        // beginTime >= minTime
        // endTime <= maxTime
        var cBeginTime = newBegin;
        var cEndTime = newEnd;
        var requestedDurationMS = newEnd.getTime() - newBegin.getTime();

        var cDurationMS = requestedDurationMS;
        if (this.props.minTime && this.props.maxTime) {
            var maxDurationMS = this.props.maxTime.getTime() - this.props.minTime.getTime();
            cDurationMS = Math.min(maxDurationMS, requestedDurationMS);
        }

        var constraintsExceeded = false;
        if (this.props.minTime && cBeginTime < this.props.minTime) {
            constraintsExceeded = true;
            cBeginTime = this.props.minTime;
            cEndTime = new Date(cBeginTime.getTime() + cDurationMS);
        }

        if (this.props.maxTime && cEndTime > this.props.maxTime) {
            constraintsExceeded = true;
            cEndTime = this.props.maxTime;
            cBeginTime = new Date(cEndTime.getTime() - cDurationMS);
        }

        // Set the zoom behavior x axis to the constrained begin / end time
        // If omitted, user will need to spend considerable time zooming back to within
        // the constrained region if they zoom out past minTime / maxTime
        /*
         * Unfortunately this does not work as expected.  For some reason making this call 
         * to this.state.zoom.x results in the axis not being re-rendered.
        if (constraintsExceeded) {
            var d = this.props.scale.domain([cBeginTime,cEndTime]);
            this.state.zoom.x(d);
        }
        */

        if (this.props.onZoom) {
            this.props.onZoom(cBeginTime, cEndTime);
        }
    },

    renderEventSurface: function renderEventSurface(scale, width, height) {
        var self = this;

        //Remove the old touch rect from under this DOM node
        d3.select(this.getDOMNode()).selectAll("*").remove();

        //Construct a new overlay rect for catching events and attach a zoom behavior
        var overlayRect = d3.select(this.getDOMNode()).append("rect").style("fill", "none").attr("id", "chart-touch-surface").attr("width", width).attr("height", height).attr("pointer-events", "all");

        if (this.state.zoom) overlayRect.call(this.state.zoom);

        //Mouse move events
        d3.select(this.getDOMNode()).on("mousemove", function () {
            var xpos = d3.mouse(this)[0];
            var time = self.props.scale.invert(xpos);
            if (self.props.onMouseMove) {
                self.props.onMouseMove(time);
            }
        });
        d3.select(this.getDOMNode()).on("mouseout", function () {
            if (self.props.onMouseOut) {
                self.props.onMouseOut();
            }
        });
    },

    getInitialState: function getInitialState() {
        return { "translate": [0, 0],
            "scale": 1,
            "zoom": null };
    },

    componentWillMount: function componentWillMount() {
        if (this.props.enableZoom) {
            var zoom = d3.behavior.zoom().on("zoom", this.handleZoom);
            this.setState({ "zoom": zoom });
        }
    },

    componentDidMount: function componentDidMount() {
        this.renderEventSurface(this.props.scale, this.props.width, this.props.height);
        if (this.props.onResize) {
            this.props.onResize(this.props.width, this.props.height);
        }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var scale = nextProps.scale;
        var width = nextProps.width;
        var height = nextProps.height;

        //If the size changes we have to rebuild the event rect
        if (this.props.width !== width || this.props.height !== height) {
            this.renderEventSurface(scale, width, height);
            if (this.props.onResize) {
                this.props.onResize(width, height);
            }
        }

        //If the scale has changed, we can keep the rect, but reset the start point of
        //any zooming that might be in progress
        if (scaleAsString(this.props.scale) !== scaleAsString(scale) && this.state.zoom) {
            this.setState({ "translate": this.state.zoom.translate(),
                "scale": this.state.zoom.scale() });
        }

        // TODO: support dynamically modifying zoomEnabled
    },

    shouldComponentUpdate: function shouldComponentUpdate() {
        return false;
    },

    render: function render() {
        return React.createElement("g", null);
    } });

module.exports = EventRect;