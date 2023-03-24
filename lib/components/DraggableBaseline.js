"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _merge = require("merge");

var _merge2 = _interopRequireDefault(_merge);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _util = require("../js/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2015-present, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var defaultStyle = {
    label: {
        fill: "#8B7E7E", // Default label color
        fontWeight: 100,
        fontSize: 11,
        pointerEvents: "none"
    },
    line: {
        stroke: "#626262",
        strokeWidth: 1,
        strokeDasharray: "5,3",
        pointerEvents: "none"
    },
    highlightedLine: {
        stroke: "#626262",
        strokeWidth: 2,
        strokeDasharray: "5,3",
        pointerEvents: "none"
    }
};

/**
 * ドラッグ中のlabelの値を返す
 * @param {*} valueOnYAxis Y軸上のマウスポインタ位置の値
 * @returns labelの文字列
 */
var defaultDraggingLabelFunc = function defaultDraggingLabelFunc(valueOnYAxis) {
    return valueOnYAxis.toFixed(3);
};

/**
 *
 * The DraggableBaseline component displays a simple horizontal line at a value.
 *
 * For example the following code overlays DraggableBaselines for the mean and stdev
 * of a series on top of another chart.
 *
 * ```
 * <ChartContainer timeRange={series.timerange()} >
 *     <ChartRow height="150">
 *         <YAxis
 *           id="price"
 *           label="Price ($)"
 *           min={series.min()} max={series.max()}
 *           width="60" format="$,.2f"
 *         />
 *         <Charts>
 *             <LineChart axis="price" series={series} style={style} />
 *             <DraggableBaseline axis="price" value={series.avg()} label="Avg" position="right" />
 *             <DraggableBaseline axis="price" value={series.avg()-series.stdev()} />
 *             <DraggableBaseline axis="price" value={series.avg()+series.stdev()} />
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */

var DraggableBaseline = function (_React$Component) {
    _inherits(DraggableBaseline, _React$Component);

    function DraggableBaseline(props) {
        _classCallCheck(this, DraggableBaseline);

        var _this = _possibleConstructorReturn(this, (DraggableBaseline.__proto__ || Object.getPrototypeOf(DraggableBaseline)).call(this, props));

        _this.state = {
            isHovering: false,
            isDragging: false,
            draggingMouseX: 0,
            draggingMouseY: 0
        };

        _this.handleHover = _this.handleHover.bind(_this);
        _this.handleHoverLeave = _this.handleHoverLeave.bind(_this);
        _this.handleMouseDown = _this.handleMouseDown.bind(_this);
        _this.handleMouseUp = _this.handleMouseUp.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        return _this;
    }

    //
    // Event handlers
    //


    _createClass(DraggableBaseline, [{
        key: "handleHover",
        value: function handleHover(e) {
            e.preventDefault();

            this.setState({
                isHovering: true
            });
        }
    }, {
        key: "handleHoverLeave",
        value: function handleHoverLeave(e) {
            e.preventDefault();

            this.setState({
                isHovering: false
            });
        }
    }, {
        key: "handleMouseDown",
        value: function handleMouseDown(e) {
            e.preventDefault();

            document.addEventListener("mouseup", this.handleMouseUp);

            var offset = (0, _util.getElementOffset)(this.overlay);
            var mouseX = e.pageX - offset.left;
            var mouseY = e.pageY - offset.top;
            // console.log("handleMouseMove", mouseY)
            this.setState({
                isDragging: true,
                draggingMouseX: mouseX,
                draggingMouseY: mouseY
            });
        }
    }, {
        key: "handleMouseUp",
        value: function handleMouseUp(e) {
            e.preventDefault();

            document.removeEventListener("mouseup", this.handleMouseUp);

            this.setState({
                isDragging: false
            });

            if (this.props.onValueChanged) {
                if (this.props.transition) {
                    var newValue = this.props.transition.sourceScale.invert(this.state.draggingMouseY);
                    this.props.onValueChanged(this.props.id, this.props.value, newValue);
                } else {
                    console.error("Cannot detect new value due to transition not found");
                }
            }
        }
    }, {
        key: "handleClick",
        value: function handleClick() {}
    }, {
        key: "handleMouseMove",
        value: function handleMouseMove(e) {
            e.preventDefault();
            if (!this.state.isDragging) {
                return;
            }
            var offset = (0, _util.getElementOffset)(this.overlay);
            var mouseX = e.pageX - offset.left;
            var mouseY = e.pageY - offset.top;
            this.setState({
                draggingMouseX: mouseX,
                draggingMouseY: mouseY
            });
        }

        //
        // Render
        //

        /**
         * ドラッグ中のみ表示する. (表示するといっても透明なので見えない)
         * MouseMove Eventをfireするための透過 Overlay.
         * 何も存在しないと MouseMove Event が fire されないのでそれを防ぐため透明の rect を利用する.
         */

    }, {
        key: "renderOverlay",
        value: function renderOverlay() {
            var _this2 = this;

            var _props = this.props,
                width = _props.width,
                height = _props.height;


            var overlayStyle = {
                fill: "white",
                opacity: 0
            };

            // 1つのチャートに複数のDraggableBaselineが存在すると一番上のレイヤーの rect だけが
            // マウスイベントを取得でき下のレイヤーは取得できなくなる.
            // それを避けるためにドラッグ中のみ pointerEvents = fill にしてマウスイベントを
            // 取得できるようにして、ドラッグ中ではない時は pointerEvents = none にしてマウスイベントが
            // 下のレイヤーに通過するようにしている.
            var pointerEvents = this.state.isDragging ? "fill" : "none";

            return _react2.default.createElement("rect", {
                ref: function ref(c) {
                    _this2.overlay = c;
                },
                x: 0,
                y: 0,
                width: width,
                height: height,
                style: overlayStyle,
                onMouseMove: this.handleMouseMove,
                pointerEvents: pointerEvents
            });
        }
    }, {
        key: "renderBaseline",
        value: function renderBaseline() {
            var _props2 = this.props,
                vposition = _props2.vposition,
                yScale = _props2.yScale,
                value = _props2.value,
                position = _props2.position,
                style = _props2.style,
                width = _props2.width;


            if (!yScale || _underscore2.default.isUndefined(value)) {
                return null;
            }

            var y = yScale(value);
            var transform = "translate(0 " + y + ")";
            var textAnchor = void 0;
            var textPositionX = void 0;
            var pts = [];

            var labelBelow = vposition === "auto" && y < 15 || vposition === "below";
            var textPositionY = labelBelow ? 2 : -2;
            var alignmentDraggableBaseline = labelBelow ? "hanging" : "auto";

            if (position === "left") {
                textAnchor = "start";
                textPositionX = 5;
            }
            if (position === "right") {
                textAnchor = "end";
                textPositionX = width - 5;
            }

            pts.push("0 0");
            pts.push(width + " 0");
            var points = pts.join(" ");

            //
            // Style
            //

            var baseLabelStyle = _extends({}, defaultStyle.label, { alignmentDraggableBaseline: alignmentDraggableBaseline });

            var labelStyle = (0, _merge2.default)(true, baseLabelStyle, style.label ? style.label : {});
            var lineStyle = {};

            // マウスが(ドラッグ中ではなくて) baseline 上にあるときは baseline を目立たせるため highlightedLine style を利用する
            if (this.state.isDragging || !this.state.isHovering) {
                lineStyle = (0, _merge2.default)(true, defaultStyle.line, style.line ? style.line : {});
            } else {
                lineStyle = (0, _merge2.default)(true, defaultStyle.highlightedLine, style.highlightedLine ? style.highlightedLine : {});
            }

            var hitStyle = {
                stroke: "white",
                fill: "none",
                opacity: 0.0,
                strokeWidth: 6,
                cursor: !this.state.isDragging ? "ns-resize" : "",
                pointerEvents: "stroke"
            };

            return _react2.default.createElement(
                "g",
                { className: "DraggableBaseline", transform: transform },
                _react2.default.createElement("polyline", { points: points, style: lineStyle }),
                _react2.default.createElement(
                    "text",
                    {
                        style: labelStyle,
                        x: textPositionX,
                        y: textPositionY,
                        textAnchor: textAnchor
                    },
                    this.props.label
                ),
                _react2.default.createElement("polyline", {
                    points: points,
                    style: hitStyle,
                    onMouseLeave: this.handleHoverLeave,
                    onMouseMove: this.handleHover,
                    onMouseDown: this.handleMouseDown,
                    onMouseUp: this.handleMouseUp,
                    onClick: this.handleClick
                })
            );
        }

        /**
         * ドラッグ中のみ表示するbaseline.
         * 視覚的にドラッグしているのを分かりやすくするため.
         */

    }, {
        key: "renderDraggingBaseline",
        value: function renderDraggingBaseline() {
            if (!this.state.isDragging) {
                return _react2.default.createElement("g", null);
            }

            var _props3 = this.props,
                vposition = _props3.vposition,
                yScale = _props3.yScale,
                style = _props3.style,
                width = _props3.width;


            if (!yScale) {
                return null;
            }

            var mouseX = this.state.draggingMouseX;
            var mouseY = this.state.draggingMouseY;

            var transform = "translate(0 " + mouseY + ")";
            var textAnchor = "start";
            var textPositionX = mouseX;
            var pts = [];

            var labelBelow = vposition === "auto" && mouseY < 15 || vposition === "below";
            var textPositionY = labelBelow ? 2 : -2;
            var alignmentDraggableBaseline = labelBelow ? "hanging" : "auto";

            pts.push("0 0");
            pts.push(width + " 0");
            var points = pts.join(" ");

            var value = null;
            if (this.props.transition) {
                value = this.props.transition.sourceScale.invert(mouseY);
            }

            var label = this.props.draggingLabelFunc ? this.props.draggingLabelFunc(value) : defaultDraggingLabelFunc(value);

            //
            // Style
            //

            var baseLabelStyle = _extends({}, defaultStyle.label, { alignmentDraggableBaseline: alignmentDraggableBaseline });
            var labelStyle = (0, _merge2.default)(true, baseLabelStyle, style.label ? style.label : {});
            var lineStyle = (0, _merge2.default)(true, defaultStyle.line, style.line ? style.line : {});

            return _react2.default.createElement(
                "g",
                { className: "DraggableBaseline", transform: transform },
                _react2.default.createElement("polyline", { points: points, style: lineStyle }),
                _react2.default.createElement(
                    "text",
                    {
                        style: labelStyle,
                        x: textPositionX,
                        y: textPositionY,
                        textAnchor: textAnchor
                    },
                    label
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "g",
                null,
                this.renderOverlay(),
                this.renderBaseline(),
                this.renderDraggingBaseline()
            );
        }
    }]);

    return DraggableBaseline;
}(_react2.default.Component);

exports.default = DraggableBaseline;


DraggableBaseline.defaultProps = {
    visible: true,
    value: 0,
    label: "",
    position: "left",
    vposition: "auto",
    style: defaultStyle,
    onValueChanged: null
};

DraggableBaseline.propTypes = {
    /**
     * Show or hide this chart
     */
    visible: _propTypes2.default.bool,

    /**
     * Reference to the axis which provides the vertical scale for drawing. e.g.
     * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
     */
    axis: _propTypes2.default.string.isRequired, // eslint-disable-line

    /**
     * An object describing the style of the DraggableBaseline of the form
     * { label, line, highlightedLine }. "label", "line" and "highlightedLine" are both objects containing
     * the inline CSS for that part of the DraggableBaseline.
     */
    style: _propTypes2.default.shape({
        label: _propTypes2.default.object, // eslint-disable-line
        line: _propTypes2.default.object, // eslint-disable-line
        highlightedLine: _propTypes2.default.object // eslint-disable-line
    }),

    /**
     * The unique id for identify data. 
     * This id is given in the first argument of the onValueChanged callback function.
     */
    id: _propTypes2.default.string,

    /**
     * The y-value to display the line at.
     */
    value: _propTypes2.default.number,

    /**
     * The label to display with the axis.
     */
    label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),

    /**
     * The label being dragged to display with the axis.
     */
    draggingLabelFunc: _propTypes2.default.func,

    /**
     * Callback called when the line is dragged.
     * 
     * onValueChanged(id, originalValue, newValue).
     */
    onValueChanged: _propTypes2.default.func,

    /**
     * Whether to display the label on the "left" or "right".
     */
    position: _propTypes2.default.oneOf(["left", "right"]),

    /**
     * Whether to display the label above or below the line. The default is "auto",
     * which will show it above the line unless the position is near to the top
     * of the chart.
     */
    vposition: _propTypes2.default.oneOf(["above", "below", "auto"]),

    /**
     * [Internal] The yScale supplied by the associated YAxis
     */
    yScale: _propTypes2.default.func,

    /**
     * [Internal] The transition supplied by the associated YAxis
     */
    transition: _propTypes2.default.object,

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    width: _propTypes2.default.number,

    /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
    height: _propTypes2.default.number
};