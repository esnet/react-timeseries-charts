"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scaleAsString = scaleAsString;
exports.getElementOffset = getElementOffset;
/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

// http://stackoverflow.com/a/28857255
function getElementOffset(element) {
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top + window.pageYOffset - de.clientTop;
    var left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
}