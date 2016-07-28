/**
 *  Copyright (c) 2016-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import baselines from "./baselines/index.jsx";
import baselines_docs from "raw!./baselines/docs.md";
import realtime from "./realtime/index.jsx";
import realtime_docs from "raw!./realtime/docs.md";
import continents from "./continents/index.jsx";
import continents_docs from "raw!./continents/docs.md";
import currency from "./currency/index.jsx";
import currency_docs from "raw!./currency/docs.md";
import cycling from "./cycling/index.jsx";
import cycling_docs from "raw!./cycling/docs.md";
import ddos from "./ddos/index.jsx";
import ddos_docs from "raw!./ddos/docs.md";
import interfaces from "./interfaces/index.jsx";
import interfaces_docs from "raw!./interfaces/docs.md";
import outages from "./outages/index.jsx";
import outages_docs from "raw!./outages/docs.md";
import stockchart from "./stockchart/index.jsx";
import stockchart_docs from "raw!./stockchart/docs.md";
import traffic from "./traffic/index.jsx";
import traffic_docs from "raw!./traffic/docs.md";
import weather from "./weather/index.jsx";
import weather_docs from "raw!./weather/docs.md";
import wind from "./wind/index.jsx";
import wind_docs from "raw!./wind/docs.md";
import volume from "./volume/index.jsx";
import volume_docs from "raw!./volume/docs.md";

export default {
    realtime,
    realtime_docs,
    baselines,
    baselines_docs,
    continents,
    continents_docs,
    currency,
    currency_docs,
    cycling,
    cycling_docs,
    ddos,
    ddos_docs,
    interfaces,
    interfaces_docs,
    outages,
    outages_docs,
    stockchart,
    stockchart_docs,
    traffic,
    traffic_docs,
    weather,
    weather_docs,
    wind,
    wind_docs,
    volume,
    volume_docs
};
