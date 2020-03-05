import { TimeRange } from "pondjs";
import React, { useState } from "react";
import { ChartContainer } from "..";
import ChartRow from "./ChartRow";
import { Baseline } from "./charts/Baseline";
import { Charts } from "./charts/Charts";
import { YAxis } from "./YAxis";

export default { title: "ChartContainer" };

const initialTimerange = new TimeRange(
    new Date("Wed Mar 02 2020 09:30:13 GMT-0800"),
    new Date("Wed Mar 04 2020 09:30:13 GMT-0800")
);

export const basic = () => {
    const [tr] = useState(initialTimerange);
    const [max, setMax] = useState(1);

    setTimeout(() => setMax(max === 1 ? 5 : 1), 5000);

    console.log("max", max);
    return (
        <div style={{ padding: 10 }}>
            <ChartContainer timeRange={tr}>
                <ChartRow height={120}>
                    <YAxis id="a" min={0} max={max} transition={2000} />
                    <YAxis id="b" min={0} max={1} />
                    <Charts>
                        <Baseline axis="a" value={0.25} label="0.25" position="right" />
                        <Baseline axis="a" value={0.75} label="0.75" position="right" />
                    </Charts>
                    <YAxis id="x" min={0} max={1} />
                    <YAxis id="y" min={0} max={1} />
                    <YAxis id="z" min={0} max={1} />
                </ChartRow>
            </ChartContainer>
        </div>
    );
};
