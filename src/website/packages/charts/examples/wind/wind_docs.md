The ScatterChart takes a TimeSeries as its `series` prop,
along with a list of `columns` to plot.

Here we style each point with a function passed to the `style` prop,
rather than passing an object, though you can do that too. However,
it is common for a scatter plot to need to style per point, so we
demonstrate that here.

This style function is passed the `column` and `event` to style and returns
an object with the style for each state the point could be in:
normal, highlighted, selected or muted. Be aware that this is called
for every point on every render, so be gentle.

```
    const perEventStyle = (column, event) => {
        const color = heat[
            Math.floor((1 - event.get("station1") / 40) * 11)
        ];
        return {
            normal: {
                fill: color,
                opacity: 1.0
            },
            highlighted: {
                fill: color,
                stroke: "none",
                opacity: 1.0
            },
            selected: {
                fill: "none",
                stroke: "#2CB1CF",
                strokeWidth: 3,
                opacity: 1.0
            },
            muted: {
                stroke: "none",
                opacity: 0.4,
                fill: color
            }
        };
    };
```

Similarly we can control the radius of each point with a function
passed to the `radius` prop:

```
    radius={(event, column) =>
        column === "station1" ? 3 : 2}
```

In this case we just say that if the column we're rendering is
"station1" we render a radius of 3, otherwise a radius of 2. But
alternatively it would be easy to use a value in the event to render
a radius based on magnitude, allowing you to create a bubble plot.

Other parts of this example are similar to other examples, such as the
use of timerange state to control pan and zoom, and handling of selection.
Note the use of `onBackgroundClick` on the ChartContainer to deselect any selection.

We also render a `BandChart` to show the outer range from the 5th percentile to the 95th, 
along with an inner range for the interquantile.

Here is the render code:

```
    <ChartContainer
        timeRange={this.state.timerange}
        enablePanZoom={true}
        onBackgroundClick={() =>
            this.setState({ selection: null })}
        onTimeRangeChanged={timerange =>
            this.setState({ timerange })}
    >
        <ChartRow height="150" debug={false}>
            <YAxis id="wind-gust" label="Wind gust (mph)" min={0} max={max} format=",.1f"
            />
            <Charts>
                <BandChart
                    axis="wind-gust"
                    series={series}
                    column="station1"
                    aggregation={ {
                        size: "30m",
                        reducers: {
                            outer: [percentile(5), percentile(95)],
                            inner: [percentile(25), percentile(75)]
                        }
                    } }
                    interpolation="curveBasis"
                />
                <ScatterChart
                    axis="wind-gust"
                    series={series}
                    columns={["station1", "station2"]}
                    style={perEventStyle}
                    info={infoValues}
                    infoHeight={28}
                    infoWidth={110}
                    infoStyle={{
                        fill: "black",
                        color: "#DDD"
                    }}
                    format=".1f"
                    selected={this.state.selection}
                    onSelectionChange={
                        this.handleSelectionChanged
                    }
                    onMouseNear={this.handleMouseNear}
                    highlight={this.state.highlight}
                    radius={(event, column) =>
                        column === "station1" ? 3 : 2}
                />
            </Charts>
        </ChartRow>
    </ChartContainer>
```
