
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
                <DraggableBaseline
                                axis="price"
                                id="foo"
                                style={baselineStyleLite}
                                value={this.state.value}
                                label={this.state.value}
                                position="right"
                                onValueChanged={(id, oldValue, newValue) => this.setState({value: parseFloat(newValue.toFixed(3))})}
                            />
                <DraggableBaseline
                                axis="price"
                                id="bar"
                                style={baselineStyleLite}
                                value={this.state.value1}
                                label={this.state.value1}
                                position="right"
                                onValueChanged={(id, oldValue, newValue) => this.setState({value1: parseFloat(newValue.toFixed(3))})}
                            />
            </Charts>
        </ChartRow>
    </ChartContainer>
```

## Styling

The baseline can also be styled

