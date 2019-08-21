import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Welcome } from "@storybook/react/demo";

import { TimeSeries, Index } from "pondjs";

import Label from "../components/Label";
import ValueList from "../components/ValueList";
import TimeMarker from "../components/TimeMarker";

import ChartContainer from "../components/ChartContainer";
import ChartRow from "../components/ChartRow";
import Charts from "../components/Charts";
import YAxis from "../components/YAxis";

import BarChart from "../components/BarChart";

import styler from "../js/styler";

storiesOf("Welcome", module).add("to Storybook", () => <Welcome showApp={linkTo("Button")} />);

storiesOf("Labels", module)
    .add("a basic label", () => (
        <svg width={500} height={500}>
            <Label label="My basic label" width={200} height={30} />
        </svg>
    ))
    .add("a left aligned label", () => (
        <svg width={500} height={500}>
            <Label label="My centered label" width={200} height={30} align="left" />
        </svg>
    ))
    .add("a label with custom box style", () => (
        <svg width={500} height={500}>
            <Label
                label="My label"
                width={200}
                height={30}
                align="left"
                style={{ box: { fill: "#FEFEFE", stroke: "steelblue" } }}
            />
        </svg>
    ))
    .add("a label with custom label style", () => (
        <svg width={500} height={500}>
            <Label
                label="My label"
                width={200}
                height={30}
                align="left"
                style={{
                    box: { fill: "#FEFEFE", stroke: "steelblue" },
                    label: { fontSize: 14, fill: "steelblue" }
                }}
            />
        </svg>
    ))
    .add("a label with rounded corner box ", () => (
        <div style={{ margin: 10 }}>
            <svg width={500} height={500}>
                <g transform="translate(10 10)">
                    <Label
                        label="My centered label"
                        width={200}
                        height={35}
                        rx={5}
                        style={{
                            box: { fill: "#5f5f5f", stroke: "#232323", strokeWidth: 2 },
                            label: { fontSize: 16, fill: "#e0e0e0", fontFamily: "monospace" }
                        }}
                        align="center"
                    />
                </g>
            </svg>
        </div>
    ));

const labelValueList = [
    { label: "x", value: "23.4" },
    { label: "y", value: "42.6" },
    { label: "z", value: "12.2" }
];

const labelValueList2 = [
    { label: "x", value: 23.4 },
    { label: "y", value: 42.6 },
    { label: "z", value: 12.2 }
];

const labelValueList3 = [
    { label: "name", value: "Bob" },
    { label: "age", value: "42" },
    { label: "city", value: "Berkeley, CA" }
];

storiesOf("ValueList", module)
    .add("a value list from list", () => (
        <svg width={500} height={500}>
            <ValueList align="left" width={200} height={60} values={labelValueList} />
        </svg>
    ))
    .add("a value list aligned to center", () => (
        <svg width={500} height={500}>
            <ValueList align="center" width={200} height={60} values={labelValueList3} />
        </svg>
    ))
    .add("a value list from list of values", () => (
        <svg width={500} height={500}>
            <ValueList align="left" width={200} height={60} values={labelValueList2} />
        </svg>
    ))
    .add("a value list with styled box", () => (
        <svg width={500} height={500}>
            <g transform="translate(10 10)">
                <ValueList
                    align="left"
                    width={200}
                    height={60}
                    values={labelValueList2}
                    style={{ box: { fill: "#FEFEFE", stroke: "steelblue", strokeWidth: 2 } }}
                />
            </g>
        </svg>
    ))
    .add("a value list with styled box and values", () => (
        <svg width={500} height={500}>
            <g transform="translate(10 10)">
                <ValueList
                    align="left"
                    width={200}
                    height={80}
                    rx={5}
                    values={labelValueList2}
                    style={{
                        box: { fill: "#5f5f5f", stroke: "#232323", strokeWidth: 2 },
                        label: { fontSize: 16, fill: "#e0e0e0", fontFamily: "monospace" }
                    }}
                />
            </g>
        </svg>
    ));

const data = [
    ["2017-01-24T00:00", 0.01],
    ["2017-01-24T01:00", 0.13],
    ["2017-01-24T02:00", 0.07],
    ["2017-01-24T03:00", 0.04],
    ["2017-01-24T04:00", 0.33],
    ["2017-01-24T05:00", 0.41],
    ["2017-01-24T06:00", 0.32],
    ["2017-01-24T07:00", 0.18],
    ["2017-01-24T08:00", 0.95],
    ["2017-01-24T09:00", 1.12],
    ["2017-01-24T10:00", 0.66],
    ["2017-01-24T11:00", 0.06],
    ["2017-01-24T12:00", 0.3],
    ["2017-01-24T13:00", 0.05],
    ["2017-01-24T14:00", 0.5],
    ["2017-01-24T15:00", 0.24],
    ["2017-01-24T16:00", 0.02],
    ["2017-01-24T17:00", 0.98],
    ["2017-01-24T18:00", 0.46],
    ["2017-01-24T19:00", 0.8],
    ["2017-01-24T20:00", 0.39],
    ["2017-01-24T21:00", 0.4],
    ["2017-01-24T22:00", 0.39],
    ["2017-01-24T23:00", 0.28]
];

const series = new TimeSeries({
    name: "data",
    columns: ["index", "value"],
    points: data.map(([d, value]) => [Index.getIndexString("1h", new Date(d)), value])
});

const t = new Date("2017-01-24T08:00");

const style = styler([{ key: "value", color: "#e8edf1" }]);

storiesOf("BarChart", module).add("a simple chart", () => (
    <ChartContainer timeRange={series.timerange()} width={800}>
        <ChartRow height="200">
            <YAxis id="value_axis" label="Value" min={0} max={2} width="60" type="linear" />
            <Charts>
                <BarChart
                    axis="value_axis"
                    style={style}
                    spacing={1}
                    columns={["value"]}
                    series={series}
                    minBarHeight={1}
                />
                <TimeMarker
                    axis="value_axis"
                    time={t}
                    infoStyle={{ line: { strokeWidth: "2px", stroke: "#83C2FC" } }}
                    infoValues="Value"
                    timeFormat="%B %d, %Y"
                />
            </Charts>
        </ChartRow>
    </ChartContainer>
));
