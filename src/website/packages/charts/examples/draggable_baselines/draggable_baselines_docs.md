
In this simple `BaseLine` example we have a `TimeSeries` that we plot with a `LineChart`. Using pond.js we can easily extract statistic for the plot, such as max, min, avg and stdev. This example then uses the `Baseline` to overlay this information on top of the `LineChart`. This example also shows custom TimeAxis formatting, by passing in a d3 time format string to the `ChartContainer`.

```js
    <ChartContainer timeRange={series.range()} format="%b '%y">
        <ChartRow height="150">
            <YAxis
                id="price"
                label="Price ($)"
                min={series.min()} max={series.max()}
                width="60" format="$,.2f"/>
            <Charts>
                <LineChart axis="price" series={series} style={style}/>
                <Baseline axis="price" style={baselineStyleLite} value={series.max()} label="Max" position="right"/>
                <Baseline axis="price" style={baselineStyleLite} value={series.min()} label="Min" position="right"/>
                <Baseline axis="price" style={baselineStyleLite} value={series.avg() - series.stdev()}/>
                <Baseline axis="price" style={baselineStyleLite} value={series.avg() + series.stdev()}/>
                <Baseline axis="price" style={baselineStyle} value={series.avg()} label="Avg"/>
            </Charts>
        </ChartRow>
    </ChartContainer>
```

## Styling

The baseline can also be styled

