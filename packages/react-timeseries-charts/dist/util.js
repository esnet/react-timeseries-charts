export function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}
export function getElementOffset(element) {
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top + window.pageYOffset - de.clientTop;
    var left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
}
//# sourceMappingURL=util.js.map