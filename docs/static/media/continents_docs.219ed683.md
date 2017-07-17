This example shows a stacked area chart. Stacking can be configured both above and below the axis, but in this example we just stack up.

This example also shows the use of the `Styler` to build the `AreaChart` style given a list of `columnNames` and a `scheme`:

    const styler = Styler(columnNames, scheme);

The `scheme` is a string corresponding to one of the color brewer sets. In this example, it is selected by the user with the pull down.

Alternatively, the styler could be set with a custom list of colors like this:

    const customColorsList = [
        "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c",
        "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5",
        "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f",
        "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
    ];
    const styler = Styler(columnNames.map((c, i) => ({
        key: c,
        color: customColorsList[i]
    })));

This example also shows how to set the interpolation to any of D3's interpolate functions, in this case `curveBasis`.

Here is the chart defined in the component `render()` function:

    <ChartContainer timeRange={series.range()}>
        <ChartRow height="350">
            <YAxis
                id="y"
                min={min}
                max={max}
                width="60"
                type="linear"/>
            <Charts>
                <AreaChart
                    axis="y"
                    style={styler}
                    series={series}
                    columns={columns}
                    fillOpacity={0.4}
                    interpolation="curveBasis" />
            </Charts>
        </ChartRow>
    </ChartContainer>
