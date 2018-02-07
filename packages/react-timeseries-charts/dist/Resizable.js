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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
var Resizable = (function (_super) {
    __extends(Resizable, _super);
    function Resizable(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { width: 0 };
        return _this;
    }
    Resizable.prototype.componentDidMount = function () {
        var _this = this;
        window.addEventListener("resize", function () { return _this.handleResize(); });
        this.handleResize();
    };
    Resizable.prototype.componentWillUnmount = function () {
        var _this = this;
        window.removeEventListener("resize", function () { return _this.handleResize(); });
    };
    Resizable.prototype.handleResize = function () {
        if (this.container) {
            this.setState({
                width: this.container.offsetWidth
            });
        }
    };
    Resizable.prototype.render = function () {
        var _this = this;
        var child = React.Children.only(this.props.children);
        var childElement = this.state.width
            ? React.cloneElement(child, { width: this.state.width })
            : null;
        return (React.createElement("div", __assign({ ref: function (c) {
                _this.container = c;
            } }, this.props), childElement));
    };
    return Resizable;
}(React.Component));
export { Resizable };
//# sourceMappingURL=Resizable.js.map