"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var ScaleType;
(function (ScaleType) {
    ScaleType["Linear"] = "LINEAR";
    ScaleType["Power"] = "POWER";
    ScaleType["Log"] = "LOG";
})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
var Charts = (function (_super) {
    tslib_1.__extends(Charts, _super);
    function Charts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Charts.prototype.render = function () {
        return (React.createElement("g", null,
            "`$",
            this.constructor.name,
            " elements are for configuration only and should not be rendered`"));
    };
    return Charts;
}(React.Component));
exports.Charts = Charts;
//# sourceMappingURL=Charts.js.map