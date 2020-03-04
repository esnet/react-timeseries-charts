import { TimeRange } from "pondjs";
import React, { useState } from "react";
import { ChartContainer } from "..";
import ChartRow from "./ChartRow";
import { Charts } from "./Charts";
import { YAxis } from "./YAxis";

export default { title: "ChartContainer" };

export const basic = () => {
    const [tr] = useState(
        new TimeRange(
            new Date("Wed Mar 02 2020 09:30:13 GMT-0800"),
            new Date("Wed Mar 04 2020 09:30:13 GMT-0800")
        )
    );
    return (
        <div style={{ padding: 10 }}>
            <ChartContainer timeRange={tr}>
                <ChartRow height={80}>
                    <YAxis id="a" min={0} max={1} />
                    <YAxis id="b" min={0} max={1} />
                    <Charts />
                    <YAxis id="x" min={0} max={1} />
                    <YAxis id="y" min={0} max={1} />
                    <YAxis id="z" min={0} max={1} />
                </ChartRow>
                <ChartRow height={80}>
                    <YAxis id="c" min={0} max={1} />
                    <Charts />
                    <YAxis id="y" min={0} max={1} />
                    <YAxis id="w" min={0} max={1} />
                </ChartRow>
            </ChartContainer>
        </div>
    );
};
