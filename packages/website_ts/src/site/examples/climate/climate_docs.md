The data for the following example was taken from NASA's Goddard Institute for Space Studies (GISS) [http://climate.nasa.gov/vital-signs/global-temperature/](http://climate.nasa.gov/vital-signs/global-temperature/)

The climate chart illustrates the change in global surface temperature relative to 1951-1980 average temperatures. Seventeen of the 18 warmest years in the 136-year record all have occurred since 2001, with the exception of 1998. The year 2016 ranks as the warmest on record.

Firstly, we create a `TimeSeries` as follows:

```js
const points = [];
_.each(temperatures, val => {
    const index = `${val.year}`;
    const temperature = val.value;
    const fiveyear = val.fiveyr;
    points.push([index, temperature, fiveyear]);
});

const temperatureSeries = indexedSeries({
    name: "temperature anomoly",
    columns: ["index", "temperature", "five_year"],
    points
});
```

For rendering a time marker, we pass props to an `EventMarker` with either the type as `flag` or `point`.

```js
<EventMarker
    type="flag"
    axis="axis"
    event={this.state.trackerEvent}
    column="temperature"
    info={[{ label: "Anomaly", value: this.state.trackerValue }]}
    infoTimeFormat="%Y"
    infoWidth={120}
    markerRadius={2}
    markerStyle={{ fill: "black" }}
/>
```

Finally, the chart is rendered as follows. The `LineChart` and `ScatterChart` is drawn along with a `Baseline` depicting the average value from 1951-1980.

```js
<ChartContainer
    timeFormat={"decade"}
    timeRange={temperatureSeries.range()}
    timeAxisStyle={axisStyle}
    onTrackerChanged={this.handleTrackerChanged}
>
    <ChartRow height="300">
        <YAxis
            id="axis"
            label="Temperature Anomaly (°C)"
            transition={300}
            style={axisStyle}
            labelOffset={0}
            min={min}
            max={max}
            format=",.1f"
            width="60"
            type="linear"
        />
        <Charts>
            <LineChart
                axis="axis"
                series={temperatureSeries}
                columns={["temperature"]}
                style={style}
            />
            <ScatterChart
                axis="axis"
                series={temperatureSeries}
                columns={["temperature"]}
                style={style}
            />
            <LineChart
                axis="axis"
                series={temperatureSeries}
                columns={["five_year"]}
                style={style}
                interpolation="curveBasis"
            />
            <Baseline
                axis="axis"
                value={0.0}
                label="1951-1980 average"
                style={baselineStyle}
            />
            {this.renderMarker()}
        </Charts>
    </ChartRow>
</ChartContainer>
```