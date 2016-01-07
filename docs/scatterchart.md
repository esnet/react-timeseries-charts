
The `<ScatterChart >` widget is able to display a single series scattered across a time axis.

The ScatterChart should be used within `<ChartContainer>` etc., as this will construct the horizontal and vertical axis, and manage other elements.


```xml
<ChartContainer timeRange={series.timerange()}>
    <ChartRow height="150">
        <YAxis id="wind" label="Wind gust (mph)" labelOffset={-5}
               min={0} max={series.max()} width="100" type="linear" format=",.1f"/>
        <Charts>
            <ScatterChart axis="wind" series={series} style={{color: "steelblue", opacity: 0.5}} />
        </Charts>
    </ChartRow>
</ChartContainer>
 
```

### Props

#### axis

Reference to the axis which provides the vertical scale for ## drawing. In the above case the `axis="axis1"`, which refers to the YAxis of `id="axis1"`, similarly for "axis2".

#### series

The TimeSeries to draw. This should be a [Pond TimeSeries](http://software.es.net/pond/#/timeseries), and that TimeSeries needs to have a "value" column which is used as the source of data and optionally a "radius" column for the size of the point to plot.

#### radius

The radius of each point if a radius is not present in the series. Default 2.

#### style

The style of the scatter chart drawing (using SVG CSS properties). For example:

```js
const style = {
    color: "steelblue",
    opacity: 0.5
}
```


