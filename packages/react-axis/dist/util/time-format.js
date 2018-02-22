"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment_timezone_1 = require("moment-timezone");
var formatterMap = {
    second: ":ss",
    minute: "h:mm a",
    hour: "h a",
    day: "ddd DD",
    week: "MMM DD",
    month: "MMM",
    year: "Y"
};
var majors = {
    second: "minute",
    minute: "hour",
    hour: "day",
    day: "month",
    week: "month",
    month: "year"
};
function default_1(type, timezone) {
    return function (date) {
        var t = type;
        while (t !== "year") {
            if (timezone) {
                if (moment_timezone_1.default(date)
                    .tz(timezone)
                    .startOf(majors[t])
                    .isSame(moment_timezone_1.default(date).tz(timezone))) {
                    t = majors[t];
                }
                else {
                    break;
                }
            }
            else {
                if (!timezone &&
                    moment_timezone_1.default(date)
                        .startOf(majors[t])
                        .isSame(moment_timezone_1.default(date))) {
                    t = majors[t];
                }
                else {
                    break;
                }
            }
        }
        var labelType = t !== type ? t : type;
        var label = timezone
            ? moment_timezone_1.default(date)
                .tz(timezone)
                .format(formatterMap[labelType])
            : moment_timezone_1.default(date).format(formatterMap[labelType]);
        var size = t !== type ? 25 : 15;
        var labelAlign = "adjacent";
        return { label: label, size: size, labelAlign: labelAlign };
    };
}
exports.default = default_1;
//# sourceMappingURL=time-format.js.map