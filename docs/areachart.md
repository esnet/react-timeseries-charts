
The AreaChart widget is able to display single or multiple stacked areas above or below the axis. It used throughout the My ESnet Portal.

The AreaChart should be used within a `<ChartContainer />` structure, as this will construct the horizontal and vertical axis, and manage other elements. Here is an example of an AreaChart with an up and down traffic visualization:

```js
    render() {
        return (
            ...
            <ChartContainer timeRange={trafficSeries.range()} width="1080">
                <ChartRow height="150">
                    <Charts>
                        <AreaChart
                            axis="traffic"
                            series={trafficSeries}
                            columns={{up: ["in"], down: ["out"]}}/>
                    </Charts>
                    <YAxis id="traffic" label="Traffic (bps)" min={-max} max={max} absolute={true} width="60" type="linear"/>
                </ChartRow>
            </ChartContainer>
            ...
        );
    }
```

The `<AreaChart>` takes a single TimeSeries object into its `series` prop. This series can multiple columns and those columns can be referenced using the `columns` prop. The `columns` props allows you to map columns in the series to the chart, letting you specify the stacking and orientation of the data. In the above example we map the "in" column in trafficSeries to the up direction and the "out" column to the down direction. Each direction is specified as an array, so adding multiple columns into a direction is what causes the stacking in that direction.

Note: It is recommended that `<ChartContainer>`s be placed within a `<Resizable>` tag, rather than hard coding the width as in the above example.

### Props

#### axis

Reference to the axis which provides the vertical scale for ## drawing. In the above example, the `axis="traffic"` refers to the YAxis of `id="traffic"`.

#### series

What [Pond TimeSeries](http://software.es.net/pond/#/timeseries) data to visualize.

#### columns

Provides the mapping of the series columns to the stacking order and direction. As an example, say we had network traffic that is either "in" or "out. We'll display the "in" traffic above the axis and the "out" traffic below the axis. Further, we want to break down the "in" and "out" traffic by its type ("oscars", "lhcone", or "other") and then stack those on top of each other. The column mapping would look like this:

```js
const columns = {
    up:   ["oscarsTrafficIn", "lhconeTrafficIn", "otherTrafficIn"],
    down: ["oscarsTrafficOut", "lhconeTrafficOut", "otherTrafficOut"],
}
```

#### style

The style of the area chart, with format:

```js
const style = {
    up: ["#448FDD", "#75ACE6", "#A9CBEF", ...],
    down: ["#FD8D0D", "#FDA949", "#FEC686", ...]
}
```

Where each color in the array corresponds to each area stacked either up or down.

#### interpolate

The style to draw the chart. This is the [d3 interpolation mode](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate)



