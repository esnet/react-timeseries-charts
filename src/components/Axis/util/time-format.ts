import * as moment from "moment";
import "moment-timezone";

// import moment from "moment-timezone";

const formatterMap = {
    second: ":ss",
    minute: "h:mm a",
    hour: "h a",
    day: "ddd DD",
    week: "MMM DD",
    month: "MMM",
    year: "Y"
};

const majors = {
    second: "minute",
    minute: "hour",
    hour: "day",
    day: "month",
    week: "month",
    month: "year"
};

export default function(type, timezone) {
    return function(date) {
        let t = type;
        while (t !== "year") {
            if (timezone) {
                if (
                    moment(date)
                        .tz(timezone)
                        .startOf(majors[t])
                        .isSame(moment(date).tz(timezone))
                ) {
                    t = majors[t];
                } else {
                    break;
                }
            } else {
                if (
                    !timezone &&
                    moment(date)
                        .startOf(majors[t])
                        .isSame(moment(date))
                ) {
                    t = majors[t];
                } else {
                    break;
                }
            }
        }

        const labelType = t !== type ? t : type;
        const label = timezone
            ? moment(date)
                  .tz(timezone)
                  .format(formatterMap[labelType])
            : moment(date).format(formatterMap[labelType]);
        const size = t !== type ? 25 : 15;
        const labelAlign = "adjacent";

        return { label, size, labelAlign };
    };
}
