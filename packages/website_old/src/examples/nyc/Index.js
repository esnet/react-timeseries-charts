/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import * as Immutable from "immutable";
import { TimeSeries, Collection, timerange, index, indexedEvent, indexedSeries, SortedCollection } from "pondjs";
import styler, { ChartContainer, ChartRow, Charts, YAxis, BoxChart, Resizable } from "react-timeseries-charts";

import nyc_docs from "./nyc_docs.md";
import nyc_thumbnail from "./nyc_thumbnail.png";

// Data
import weather from "./knyc.json";

const style = styler([{ key: "temp", color: "steelblue", width: 1, opacity: 0.5 }]);

//
// Extract data from CSV file
//

const name = "KNYC";
const w = Immutable.List(weather);
const events = w.map(item => {
    const {
        date,
        actual_min_temp,
        actual_max_temp,
        record_min_temp,
        record_max_temp
    } = item;
    return indexedEvent(
        index(date),
        Immutable.Map({
            temp: [
                +record_min_temp, //eslint-disable-line
                +actual_min_temp, //eslint-disable-line
                +actual_max_temp, //eslint-disable-line
                +record_max_temp //eslint-disable-line
            ]
        })
    );
});

const c = new Collection(events);
const series = new TimeSeries({ name, collection: c });

//
// Styles
//

const nyc = React.createClass({
    //eslint-disable-line
    getInitialState() {
        return {
            timerange: timerange(1425168000000, 1433116800000),
            selection: null
        };
    },
    handleTimeRangeChange(timerange) {
        this.setState({ timerange });
    },
    infoValues() {
        if (this.state.highlight) {
            return [
                {
                    label: "day min",
                    value: `${this.state.highlight.get("innerMin")}°F`
                },
                {
                    label: "day max",
                    value: `${this.state.highlight.get("innerMax")}°F`
                },
                {
                    label: "all-time min",
                    value: `${this.state.highlight.get("outerMin")}°F`
                },
                {
                    label: "all-time max",
                    value: `${this.state.highlight.get("outerMax")}°F`
                }
            ];
        }
        return null;
    },
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                utc={false}
                                timeRange={this.state.timerange}
                                enablePanZoom={true}
                                onBackgroundClick={() => this.setState({ selection: null })}
                                onTimeRangeChanged={this.handleTimeRangeChange}
                            >
                                <ChartRow height="300">
                                    <Charts>
                                        <BoxChart
                                            axis="temp"
                                            style={style}
                                            column="temp"
                                            series={series}
                                            info={this.infoValues()}
                                            infoWidth={130}
                                            infoHeight={75}
                                            highlighted={this.state.highlight}
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })}
                                            selected={this.state.selection}
                                            onSelectionChange={selection =>
                                                this.setState({ selection })}
                                        />
                                    </Charts>
                                    <YAxis
                                        id="temp"
                                        label="Temperature"
                                        min={0}
                                        max={120}
                                        width="70"
                                    />
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
});

// Export example
export default { nyc, nyc_docs, nyc_thumbnail };
