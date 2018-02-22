"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pondjs_1 = require("pondjs");
var TimeRangeMarker = (function (_super) {
    __extends(TimeRangeMarker, _super);
    function TimeRangeMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeRangeMarker.prototype.renderBand = function () {
        var timerange = this.props.timerange;
        var timeScale = this.props.timeScale;
        var viewBeginTime = timeScale.invert(0);
        var viewEndTime = timeScale.invert(this.props.width);
        var viewport = new pondjs_1.TimeRange(viewBeginTime, viewEndTime);
        var bandStyle;
        if (this.props.style) {
            bandStyle = this.props.style;
        }
        else {
            bandStyle = { fill: "steelblue" };
        }
        if (!viewport.disjoint(timerange)) {
            var range = timerange.intersection(viewport);
            var begin = range.begin();
            var end = range.end();
            var beginPos = timeScale(begin);
            var endPos = timeScale(end);
            var width = endPos - beginPos;
            if (width < 1) {
                width = 1;
            }
            return (React.createElement("rect", { x: beginPos, y: 0, width: width, height: this.props.height, style: bandStyle }));
        }
        return React.createElement("g", null);
    };
    TimeRangeMarker.prototype.render = function () {
        return React.createElement("g", null, this.renderBand());
    };
    TimeRangeMarker.defaultProps = {
        style: { fill: "rgba(70, 130, 180, 0.25);" }
    };
    return TimeRangeMarker;
}(React.Component));
exports.TimeRangeMarker = TimeRangeMarker;
//# sourceMappingURL=TimeRangeMarker.js.map