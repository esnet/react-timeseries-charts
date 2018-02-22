/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as moment from "moment";
import format from "./duration";

export default function() {
    return function(v) {
        return {
            label: format(moment.duration(+v)),
            size: 15,
            labelAlign: "adjacent"
        };
    }
};
