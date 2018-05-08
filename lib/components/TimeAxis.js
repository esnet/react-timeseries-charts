"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Axis = require("d3-axis");

var _d3Selection = require("d3-selection");

var _d3Time = require("d3-time");

var _d3TimeFormat = require("d3-time-format");

require("moment-duration-format");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
            "Super expression must either be null or a function, not " + typeof superClass
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
    });
    if (superClass)
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
} /**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

// eslint-disable-line

function scaleAsString(scale) {
    return scale.domain().toString() + "-" + scale.range().toString();
}

var defaultStyle = {
    labels: {
        labelColor: "#8B7E7E", // Default label color
        labelWeight: 100,
        labelSize: 11
    },
    axis: {
        axisColor: "#C0C0C0"
    }
};

/**
 * Renders a horizontal time axis. This is used internally by the ChartContainer
 * as a result of you specifying the timerange for the chart. Please see the API
 * docs for ChartContainer for more information.
 */

var TimeAxis = (function(_React$Component) {
    _inherits(TimeAxis, _React$Component);

    function TimeAxis() {
        _classCallCheck(this, TimeAxis);

        return _possibleConstructorReturn(
            this,
            (TimeAxis.__proto__ || Object.getPrototypeOf(TimeAxis)).apply(this, arguments)
        );
    }

    _createClass(TimeAxis, [
        {
            key: "componentDidMount",
            value: function componentDidMount() {
                this.renderTimeAxis(this.props.scale, this.props.format);
            }
        },
        {
            key: "componentWillReceiveProps",
            value: function componentWillReceiveProps(nextProps) {
                var scale = nextProps.scale,
                    utc = nextProps.utc,
                    format = nextProps.format;

                if (
                    scaleAsString(this.props.scale) !== scaleAsString(scale) ||
                    this.props.utc !== utc
                ) {
                    this.renderTimeAxis(scale, format);
                }
            }

            // Force the component not to update because d3 will control the
            // DOM from this point down.
        },
        {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate() {
                // eslint-disable-line
                return false;
            }
        },
        {
            key: "renderTimeAxis",
            value: function renderTimeAxis(scale, format) {
                var axis = void 0;

                var tickSize = this.props.showGrid ? -this.props.gridHeight : 10;
                var utc = this.props.utc;
                var tickCount = this.props.tickCount;

                if (tickCount > 0) {
                    if (format === "day") {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .tickArguments([utc ? _d3Time.utcDay : _d3Time.timeDay, 1, tickCount])
                            .tickFormat((0, _d3TimeFormat.timeFormat)("%d"))
                            .tickSizeOuter(0);
                    } else if (format === "month") {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .tickArguments([
                                utc ? _d3Time.utcMonth : _d3Time.timeMonth,
                                1,
                                tickCount
                            ])
                            .tickFormat((0, _d3TimeFormat.timeFormat)("%B"))
                            .tickSizeOuter(0);
                    } else if (format === "year") {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .tickArguments([utc ? _d3Time.utcYear : _d3Time.timeYear, 1, tickCount])
                            .tickFormat((0, _d3TimeFormat.timeFormat)("%Y"))
                            .tickSizeOuter(0);
                    } else if (format === "relative") {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .ticks(tickCount)
                            .tickFormat(function(d) {
                                return _moment2.default.duration(+d).format();
                            })
                            .tickSizeOuter(0);
                    } else if (_underscore2.default.isString(format)) {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .ticks(tickCount)
                            .tickFormat((0, _d3TimeFormat.timeFormat)(format))
                            .tickSizeOuter(0);
                    } else if (_underscore2.default.isFunction(format)) {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .ticks(tickCount)
                            .tickFormat(format)
                            .tickSizeOuter(0);
                    } else {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .ticks(tickCount)
                            .tickSize(0);
                    }
                } else {
                    if (format === "day") {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .tickArguments([utc ? _d3Time.utcDay : _d3Time.timeDay, 1])
                            .tickFormat((0, _d3TimeFormat.timeFormat)("%d"))
                            .tickSizeOuter(0);
                    } else if (format === "month") {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .tickArguments([utc ? _d3Time.utcMonth : _d3Time.timeMonth, 1])
                            .tickFormat((0, _d3TimeFormat.timeFormat)("%B"))
                            .tickSizeOuter(0);
                    } else if (format === "year") {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .tickArguments([utc ? _d3Time.utcYear : _d3Time.timeYear, 1])
                            .tickFormat((0, _d3TimeFormat.timeFormat)("%Y"))
                            .tickSizeOuter(0);
                    } else if (format === "relative") {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .tickFormat(function(d) {
                                return _moment2.default.duration(+d).format();
                            })
                            .tickSizeOuter(0);
                    } else if (_underscore2.default.isString(format)) {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .tickFormat((0, _d3TimeFormat.timeFormat)(format))
                            .tickSizeOuter(0);
                    } else if (_underscore2.default.isFunction(format)) {
                        axis = (0, _d3Axis.axisBottom)(scale)
                            .tickFormat(format)
                            .tickSizeOuter(0);
                    } else {
                        axis = (0, _d3Axis.axisBottom)(scale).tickSize(0);
                    }
                }

                // Style

                var labelStyle = (0, _merge2.default)(
                    true,
                    defaultStyle.labels,
                    this.props.style.labels ? this.props.style.labels : {}
                );
                var axisStyle = (0, _merge2.default)(
                    true,
                    defaultStyle.axis,
                    this.props.style.axis ? this.props.style.axis : {}
                );
                var axisColor = axisStyle.axisColor;
                var labelColor = labelStyle.labelColor,
                    labelWeight = labelStyle.labelWeight,
                    labelSize = labelStyle.labelSize;

                // Remove the old axis from under this DOM node

                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                    .selectAll("*")
                    .remove(); // eslint-disable-line
                //
                // Draw the new axis
                //
                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)) // eslint-disable-line
                    .append("g")
                    .attr("class", "x axis")
                    .style("stroke", "none")
                    .style("fill", labelColor)
                    .style("font-weight", labelWeight)
                    .style("font-size", labelSize)
                    .call(axis.tickSize(tickSize));

                if (this.props.angled) {
                    (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)) // eslint-disable-line
                        .select("g")
                        .selectAll(".tick")
                        .select("text")
                        .style("fill", labelColor)
                        .style("stroke", "none")
                        .style("text-anchor", "end")
                        .attr("dx", "-1.2em")
                        .attr("dy", "0em")
                        .attr("transform", function(d) {
                            return "rotate(-65)";
                        });
                } else {
                    (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)) // eslint-disable-line
                        .select("g")
                        .selectAll(".tick")
                        .select("text")
                        .style("fill", labelColor)
                        .style("stroke", "none");
                }
                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this)) // eslint-disable-line
                    .select("g")
                    .selectAll(".tick")
                    .select("line")
                    .style("stroke", axisColor);
                (0, _d3Selection.select)(_reactDom2.default.findDOMNode(this))
                    .select("g")
                    .select("path")
                    .remove(); // eslint-disable-line
            }
        },
        {
            key: "render",
            value: function render() {
                // eslint-disable-line
                return _react2.default.createElement("g", null);
            }
        }
    ]);

    return TimeAxis;
})(_react2.default.Component);

exports.default = TimeAxis;

TimeAxis.defaultProps = {
    showGrid: false,
    style: defaultStyle,
    angled: false
};

TimeAxis.propTypes = {
    scale: _propTypes2.default.func.isRequired,
    showGrid: _propTypes2.default.bool,
    angled: _propTypes2.default.bool,
    gridHeight: _propTypes2.default.number,
    format: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
    utc: _propTypes2.default.bool,
    style: _propTypes2.default.shape({
        labels: _propTypes2.default.object, // eslint-disable-line
        axis: _propTypes2.default.object // eslint-disable-line
    }),
    tickCount: _propTypes2.default.number
};
