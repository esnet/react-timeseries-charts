/**
 *  Copyright (c) 2016-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

//
// Export all of the examples
//

import baselines from "./baselines/Index";
import barchart from "./barchart/Index";
import realtime from "./realtime/Index";
import continents from "./continents/Index";
import currency from "./currency/Index";
import cycling from "./cycling/Index";
import ddos from "./ddos/Index";
import outages from "./outages/Index";
import stockchart from "./stockchart/Index";
import traffic from "./traffic/Index";
import weather from "./weather/Index";
import wind from "./wind/Index";
import volume from "./volume/Index";
import nyc from "./nyc/Index";
import climate from "./climate/Index";
import trend from "./trend/Index";

export default {
    ...realtime,
    ...baselines,
    ...barchart,
    ...continents,
    ...currency,
    ...cycling,
    ...ddos,
    ...outages,
    ...stockchart,
    ...traffic,
    ...weather,
    ...wind,
    ...volume,
    ...nyc,
    ...climate,
    ...trend
};
