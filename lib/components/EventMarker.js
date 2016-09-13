"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   *  Copyright (c) 2016, The Regents of the University of California,
                                                                                                                                                                                                                                                                   *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                   *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                   *  All rights reserved.
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                   *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                   */

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _d3TimeFormat = require("d3-time-format");

var _pondjs = require("pondjs");

var _ValueList = require("./ValueList");

var _ValueList2 = _interopRequireDefault(_ValueList);

var _Label = require("./Label");

var _Label2 = _interopRequireDefault(_Label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders a marker at a specific event on the chart. You can also
 * override either the x or y position, so this allows you to position
 * a timestamped label or timestamped list of label/value pairs anywhere
 * on a chart.
 */
exports.default = _react2.default.createClass({

    displayName: "EventMarker",

    getDefaultProps: function getDefaultProps() {
        return {
            column: "value",
            infoStyle: {
                line: {
                    stroke: "#999",
                    cursor: "crosshair",
                    pointerEvents: "none"
                },
                box: {
                    fill: "white",
                    opacity: 0.90,
                    stroke: "#999",
                    pointerEvents: "none"
                },
                dot: {
                    fill: "#999"
                }
            },
            infoWidth: 90,
            infoHeight: 25,
            markerRadius: 2,
            offsetX: 0,
            offsetY: 0
        };
    },


    propTypes: {

        /**
         * What [Pond Event](http://software.es.net/pond#event) to mark
         */
        event: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.instanceOf(_pondjs.Event), _react2.default.PropTypes.instanceOf(_pondjs.IndexedEvent), _react2.default.PropTypes.instanceOf(_pondjs.TimeRangeEvent)]).isRequired,

        /**
         * Which column in the Event to use
         */
        column: _react2.default.PropTypes.string,

        /**
         * The style of the info box and connecting lines
         */
        infoStyle: _react2.default.PropTypes.object,

        /**
         * The width of the hover info box
         */
        infoWidth: _react2.default.PropTypes.number,

        /**
         * The height of the hover info box
         */
        infoHeight: _react2.default.PropTypes.number,

        /**
         * The values to show in the info box. This is either an array of
         * objects, with each object specifying the label and value
         * to be shown in the info box, or a simple string label
         */
        info: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
            label: _react2.default.PropTypes.string,
            value: _react2.default.PropTypes.string
        }))])
    },

    renderTime: function renderTime(event) {
        if (event instanceof _pondjs.Event) {
            return this.renderEventTime(event.timestamp());
        } else if (event instanceof _pondjs.IndexedEvent) {
            return this.renderEventIndex(event.index());
        } else if (event instanceof _pondjs.TimeRangeEvent) {
            return this.renderEventTimeRange(event.timerange());
        }
    },
    renderEventTime: function renderEventTime(d) {
        var textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd",
            pointerEvents: "none"
        };

        // Use the infoTimeFormat if supplied, otherwise the timeline format
        var fmt = this.props.infoTimeFormat || "%m/%d/%y %X";
        var format = (0, _d3TimeFormat.timeFormat)(fmt);
        var dateStr = format(d);

        return _react2.default.createElement(
            "text",
            { x: 0, y: 0, dy: "1.2em", style: textStyle },
            dateStr
        );
    },
    renderEventIndex: function renderEventIndex(index) {
        var textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd",
            pointerEvents: "none"
        };

        return _react2.default.createElement(
            "text",
            { x: 0, y: 0, dy: "1.2em", style: textStyle },
            index.toString()
        );
    },
    renderEventTimeRange: function renderEventTimeRange(timerange) {
        var textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd",
            pointerEvents: "none"
        };

        var d1 = timerange.begin();
        var d2 = timerange.end();

        // Use the infoTimeFormat if supplied, otherwise the timeline format
        var fmt = this.props.infoTimeFormat || "%m/%d/%y %X";
        var format = (0, _d3TimeFormat.timeFormat)(fmt);
        var dateStr = format(d1) + " to " + format(d2);

        return _react2.default.createElement(
            "text",
            { x: 0, y: 0, dy: "1.2em", style: textStyle },
            dateStr
        );
    },
    renderMarker: function renderMarker(event, column, info) {

        //
        // Position the marker
        //

        var t = void 0;
        if (event instanceof _pondjs.Event) {
            t = event.timestamp();
        } else {
            t = new Date(event.begin().getTime() + (event.end().getTime() - event.begin().getTime()) / 2);
        }

        // Allow overrides on the x and y position
        var posx = this.props.timeScale(t) + this.props.offsetX;
        var posy = this.props.yScale(event.get(column)) - this.props.offsetY;

        //
        // Build the info box
        //

        var infoBoxProps = {
            align: "left",
            style: this.props.infoStyle.box,
            width: this.props.infoWidth,
            height: this.props.infoHeight
        };

        var w = this.props.infoWidth;
        var lineBottom = posy - 10;

        var verticalConnector = void 0;
        var horizontalConnector = void 0;
        var dot = void 0;
        var infoBox = void 0;
        var transform = void 0;

        if (info) {
            infoBox = _underscore2.default.isString(this.props.info) ? _react2.default.createElement(_Label2.default, _extends({}, infoBoxProps, { label: info })) : _react2.default.createElement(_ValueList2.default, _extends({}, infoBoxProps, { values: info }));
        }

        //
        // Marker on right of event
        //

        if (posx + 10 + w < this.props.width * 3 / 4) {
            if (info) {
                verticalConnector = _react2.default.createElement("line", {
                    pointerEvents: "none",
                    style: this.props.infoStyle.line,
                    x1: -10, y1: lineBottom,
                    x2: -10, y2: 20 });
                horizontalConnector = _react2.default.createElement("line", {
                    pointerEvents: "none",
                    style: this.props.infoStyle.line,
                    x1: -10, y1: 20,
                    x2: -2, y2: 20 });
            }
            dot = _react2.default.createElement("circle", {
                cx: -10,
                cy: lineBottom,
                r: this.props.markerRadius,
                pointerEvents: "none",
                style: this.props.infoStyle.dot });
            transform = "translate(" + (posx + 10) + "," + 10 + ")";
        } else {
            if (info) {
                verticalConnector = _react2.default.createElement("line", {
                    pointerEvents: "none",
                    style: this.props.infoStyle.line,
                    x1: w + 10, y1: lineBottom,
                    x2: w + 10, y2: 20 });
                horizontalConnector = _react2.default.createElement("line", {
                    pointerEvents: "none",
                    style: this.props.infoStyle.line,
                    x1: w + 10, y1: 20,
                    x2: w + 2, y2: 20 });
            }
            dot = _react2.default.createElement("circle", {
                cx: w + 10,
                cy: lineBottom,
                r: this.props.markerRadius,
                pointerEvents: "none",
                style: this.props.infoStyle.dot });
            transform = "translate(" + (posx - w - 10) + "," + 10 + ")";
        }

        return _react2.default.createElement(
            "g",
            { transform: transform },
            verticalConnector,
            horizontalConnector,
            dot,
            this.renderTime(event),
            _react2.default.createElement(
                "g",
                { transform: "translate(0," + 20 + ")" },
                infoBox
            )
        );
    },
    render: function render() {
        var _props = this.props;
        var event = _props.event;
        var column = _props.column;
        var info = _props.info;

        return _react2.default.createElement(
            "g",
            null,
            this.renderMarker(event, column, info)
        );
    }
});