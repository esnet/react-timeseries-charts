
The `<Charts>` element is a grouping for charts within a row. It takes no props. Each chart within the group will be overlaid on top of each other.

![Charts](https://raw.githubusercontent.com/esnet/react-timeseries-charts/master/docs/charts.png "Charts")

Here is an example of two line charts within a `<Charts>` group:

```xml
<ChartContainer timeRange={audSeries.timerange()}>
    <ChartRow height="200">
        <YAxis/>
        <Charts>
            <LineChart axis="aud" series={audSeries} style={audStyle}/>
            <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
        </Charts>
        <YAxis/>
    </ChartRow>
</ChartContainer>
```

Anything within this grouping is considered a chart, meaning it will have certain props injected into it. As a result you can easily implement your own chart by simply expecting to have these props available and rendering as such. See the Making your own chart section below.

Your render() method should return a SVG group `<g>` at the top level, and then your chart rendering within that.

In addition to any props you add to your chart, the following props are passed into each chart automatically:

#### timeScale

A d3 scale for the time axis which you can use to transform your data in the x direction.

#### yScale

A d3 scale for the y-axis which you can use to transform your data in the y direction.

#### clipPathURL

A URL for the clip path applied around this chart area

#### transition

The time in ms it is expected the code will take to move from one state to another.



