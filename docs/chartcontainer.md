
The `<ChartContainer>` is the outer most element of a chart and is responsible for generating and arranging its sub-elements. Specifically, it is a container for one or more `<ChartRows>` (each of which contains charts, axes etc) and in addition it manages the overall time range of the chart and so also is responsible for the time axis, which is always shared by all the rows.

![ChartContainer](https://raw.githubusercontent.com/esnet/react-timeseries-charts/master/docs/chartcontainer.png "ChartContainer")

Here is an example:

```xml
<ChartContainer timeRange={audSeries.timerange()} width="800">
    <ChartRow>
        ...
    </ChartRow>
    <ChartRow>
        ...
    </ChartRow>
</ChartContainer>
```

