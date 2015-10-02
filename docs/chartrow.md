
A ChartRow is a container for a set of Y axes and multiple charts which are overlaid on each other in a central canvas.

![ChartRow](../../docs/chartrows.png "ChartRow")

Here is an example where a single `<ChartRow>` is defined within the `<ChartContainer>`. Of course you can have any number of rows.

For this row we specify the one prop `height` as 200 pixels high.

Within the `<ChartRow>` we add:

* `<YAxis>` elements for axes to the left of the chart
* `<Chart>` block containing our central chart area
* `<YAxis>` elements for our axes to the right of the charts

```xml
<ChartContainer timeRange={audSeries.range()} padding="5">
    <ChartRow height="200">
        <YAxis />
        <YAxis />
        <Charts>
            charts...
        </Charts>
        <YAxis />
    </ChartRow>
</ChartContainer>
```

### Props

#### height

Specify the height of the row.
