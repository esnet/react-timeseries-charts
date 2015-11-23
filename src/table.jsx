/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react/addons";
import _ from "underscore";
import d3 from "d3";
import Moment from "moment";

import { TimeSeries, IndexedEvent } from "pondjs";

export default React.createClass({

    displayName: "Table",

    propTypes() {
        return {
            series: React.PropTypes.instanceOf(TimeSeries).isRequired
        };
    },

    getDefaultProps() {
        return {
            timeFormat: undefined,
            width: 300
        };
    },

    renderCells(event) {
        const cells = [];

        if (this.props.columns) {
            _.each(this.props.columns, (column) => {
                let cell;
                if (this.props.renderCell) {
                    cell = this.props.renderCell(event, column.key);
                }

                if (cell) {
                    cells.push(
                        <td key={column.key}>{cell}</td>
                    );
                } else {
                    let formatter;
                    if (column.format) {
                        if (_.isFunction(column.format)) {
                            formatter = column.format;
                        } else if (_.isString(column.format)) {
                            formatter = d3.format(column.format);
                        }
                    }

                    if (column.key === "time") {
                        if (event instanceof IndexedEvent) {
                            const format = this.props.timeFormat;
                            const eventIndex =
                                event.index().toNiceString(format);
                            cells.push(
                                <td key={event.index().asString()}>
                                    {eventIndex}
                                </td>
                            );
                        } else {
                            const ts = Moment(event.timestamp());
                            cells.push(
                                <td key={ts.valueOf()}>
                                    {ts.format(this.props.timeFormat)}
                                </td>
                            );
                        }
                    } else {
                        let value = event.data().get(column.key);
                        if (formatter) {
                            value = formatter(parseFloat(value, 10));
                        }
                        cells.push(
                            <td key={column.key}>{value}</td>
                        );
                    }
                }
            });
        } else {
            if (event instanceof IndexedEvent) {
                cells.push(
                    <td key={event.index().asString()}>
                        {event.index().toNiceString(this.props.timeFormat)}
                    </td>
                );
            } else {
                const ts = Moment(event.timestamp());
                cells.push(
                    <td key={ts.valueOf()}>
                        {ts.format(this.props.timeFormat)}
                    </td>
                );
            }

            event.data().forEach((d, i) => {
                let cell;
                if (this.props.renderCell) {
                    cell = this.props.renderCell(event, i);
                }

                if (cell) {
                    cells.push(
                        <td key={i}>{cell}</td>
                    );
                } else {
                    cells.push(
                        <td key={i}>{d.toString()}</td>
                    );
                }
            });
        }

        return cells;
    },

    renderRows() {
        const rows = [];
        let i = 0;
        for (const event of this.props.series.events()) {
            rows.push(
                <tr key={i}>{this.renderCells(event)}</tr>
            );
            i++;
        }

        const summaryStyle = {
            backgroundColor: "#ECECEC",
            borderTop: "#E0E0E0",
            borderTopWidth: 1,
            borderTopStyle: "solid"
        };

        if (this.props.summary) {
            const cells = _.map(this.props.summary, (value, key) => (
                <td key={key}><b>{value}</b></td>
            ));
            rows.push(
                <tr key="summary" style={summaryStyle}>{cells}</tr>
            );
        }

        return rows;
    },

    renderHeader() {
        const headerCells = [];
        const headerStyle = {borderTop: "none"};
        if (this.props.columns) {
            _.each(this.props.columns, (column) => {
                headerCells.push(
                    <th key={column.label}
                        style={headerStyle}>{column.label}</th>
                );
            });
        } else {
            headerCells.push(
                <th key="time">time</th>
            );
            this.props.series._columns.forEach((column) => {
                headerCells.push(
                    <th key={column.label} style={headerStyle}>{column}</th>
                );
            });
        }

        return (
            <tr key="header">
                {headerCells}
            </tr>
        );
    },

    render() {
        const style = {marginBottom: 0};

        return (
            <table className="table table-condensed table-striped"
                   width={this.props.width}
                   style={style}>
                <tbody>
                    {this.renderHeader()}
                    {this.renderRows()}
                </tbody>
            </table>
        );
    }
});
