"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var duration_1 = require("./duration");
function default_1() {
    return function (v) {
        return {
            label: duration_1.default(moment.duration(+v)),
            size: 15,
            labelAlign: "adjacent"
        };
    };
}
exports.default = default_1;
;
//# sourceMappingURL=duration-format.js.map