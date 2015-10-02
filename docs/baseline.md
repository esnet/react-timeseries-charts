
The BaseLine component displays a simple horizontal line at a value.

This example overlays the mean of a series and std dev on top of another chart.

```xml
<ChartContainer timeRange={series.range()} >
    <ChartRow height="150">
        <YAxis id="axis" label="Price ($)" min={series.min()} max={series.max()} width="60" format="$,.2f"/>
        <Charts>
            <LineChart axis="axis" series={series} style={style}/>
            <Baseline axis="axis" value={series.avg()} label="Avg" position="right"/>
            <Baseline axis="price" value={series.avg()-series.stdev()}/>
            <Baseline axis="price" value={series.avg()+series.stdev()}/>
        </Charts>
    </ChartRow>
</ChartContainer>

```

### Props

#### axis

Reference to the axis which provides the vertical scale for ## drawing. In the above case the `axis="price"`, which refers to the YAxis of `id="price"`.

#### value

The y-value to display the line at.

#### label

The label to display with the axis.

#### position

Whether to display the label on the "left" or "right".


