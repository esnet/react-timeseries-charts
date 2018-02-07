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
import * as React from "react";
import "@types/d3-scale";
export var ScaleType;
(function (ScaleType) {
    ScaleType["Linear"] = "LINEAR";
    ScaleType["Power"] = "POWER";
    ScaleType["Log"] = "LOG";
})(ScaleType || (ScaleType = {}));
var Charts = (function (_super) {
    __extends(Charts, _super);
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
export { Charts };
//# sourceMappingURL=Charts.js.map