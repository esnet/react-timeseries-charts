"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}
exports.scaleAsString = scaleAsString;
function getElementOffset(element) {
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top + window.pageYOffset - de.clientTop;
    var left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
}
exports.getElementOffset = getElementOffset;
//# sourceMappingURL=util.js.map