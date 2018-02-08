"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var Resizable = (function (_super) {
    tslib_1.__extends(Resizable, _super);
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
        return (React.createElement("div", tslib_1.__assign({ ref: function (c) {
                _this.container = c;
            } }, this.props), childElement));
    };
    return Resizable;
}(React.Component));
exports.Resizable = Resizable;
//# sourceMappingURL=Resizable.js.map