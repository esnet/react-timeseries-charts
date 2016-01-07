
The LineChart widget is able to display a single line chart.

The LineChart should be used within `<ChartContainer>` etc., as this will construct the horizontal and vertical axis, and manage other elements. Here is an example of two LineCharts overlaid on top of each other, along with a `<BaseLine>`:

```xml
<ChartContainer timeRange={audSeries.timerange()}>
    <ChartRow height="200">
        <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
        <Charts>
            <LineChart axis="axis1" series={audSeries} style={audStyle}/>
            <LineChart axis="axis2" series={euroSeries} style={euroStyle}/>
            <Baseline  axis="axis1" value={1.0} label="USD Baseline" position="right"/>
        </Charts>
        <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
    </ChartRow>
</ChartContainer>
```

### Props

#### axis

Reference to the axis which provides the vertical scale for ## drawing. In the above case the `axis="axis1"`, which refers to the YAxis of `id="axis1"`, similarly for "axis2".

#### series

The TimeSeries to draw. This should be a [Pond TimeSeries](http://software.es.net/pond/#/timeseries), and that TimeSeries needs to have a "value" column which is used as the source of data.

#### smooth

Boolean value that will draw the line as either a Bezier (smooth) or as linear segments.

#### breakLine

The determines how to handle bad/missing values in the supplied TimeSeries. A missing value can be `null` or `NaN`. If `breakLine` is set to true then the line will be broken on either side of the bad value(s). If `breakLine` is false (the default) bad values are simply removed and the adjoining points are connected.

#### style

The style of the line chart drawing (using SVG CSS properties). A typical example would look like this:

```js
const style = {
    color: "#9DA3FF",
    width: 2
}
```

