
The AreaChart widget is able to display an area above or below the axis, as well as stacking in each direction. It used throughout the My ESnet Portal.

The AreaChart should be used within `<ChartContainer />`, as this will construct the horizontal and vertical axis, and manage other elements. Here is an example of an AreaChart with an up and down traffic visualization:

```js
    <ChartContainer timeRange={timerange}>
        <ChartRow height="150">
            <Charts>
                <AreaChart axis="traffic" series={[[inSeries],[outSeries]]} />
            </Charts>
            <YAxis id="traffic" label="Traffic (bps)" min={-max} max={max} absolute={true} width="60" type="linear"/>
        </ChartRow>
    </ChartContainer>
```

### Props

#### axis

Reference to the axis which provides the vertical scale for ## drawing. In the above case the axis="traffic", which refers to the YAxis of id="traffic".

#### series

What data to draw. The format is an tuple of [up, down], when up and down are the directions to draw in. Both up and down are themselves arrays which specify the stacking of the areas in that direction. Each member of that array needs to be a [Pond TimeSeries](http://software.es.net/pond/#/timeseries), and that TimeSeries needs to have a "value" column which is used as the source of data.

#### interpolate

The style to draw the chart. This is the [d3 interpolation mode](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate)

#### style

The style of the area chart, with format:

```js
const style = {
    up: ["#448FDD", "#75ACE6", "#A9CBEF", ...],
    down: ["#FD8D0D", "#FDA949", "#FEC686", ...]
}
```

Where each color in the array corresponds to each area stacked either up or down.

