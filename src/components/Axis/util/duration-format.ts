import * as moment from "moment";
import format from "./duration";

export default function() {
    return function(v) {
        return {
            label: format(moment.duration(+v)),
            size: 15,
            labelAlign: "adjacent"
        };
    };
}
