This is a relatively simple LineChart example, but it does exhibit a few useful techniques. The first is the use of the Styler to control the legend and LineChart styles. The second is the use of the legend to enable and disable the chart. And finally this example shows how to have the axis transition to its new range as the charts are hidden and shown.

### Styling

This example uses the Styler to control the appearance of the `LineChart`s. The styles themselves are defined like this:

    const styler = Styler([
        {key: "connections", color: "#2ca02c", width: 1},
        {key: "requests", color: "#9467bd", width: 2}
    ]);

And then applied to each LineChart with the style prop:

    <LineChart axis="axis2" series={connectionsSeries} style={styler} />

### Legend

This example allows you to use the legend to control the display of the charts themselves. Click the legend items to hide and show each of the two channels of data.

The legend component lets you provide a callback to be called when an item is changed. You can use that to control your component state and then re-render with or without a particular chart.

The legend uses categories to define the items. A category is an object with a unique key, the label, if the item is enabled or disabled, and the style of the item.

    const legend = [
        {
            key: "requests",
            label: "Requests",
            disabled: !this.state.active.requests,
        },{
            key: "connections",
            label: "Connections",
            disabled: !this.state.active.connections,
        }
    ];
    ...
    <Legend type="line" style={styler} categories={legend} onSelectionChange={this.handleActiveChange} />

When the legend changes `handleActiveChange()` will be called with the key (from the legend categories). We can then the toggle our own state:

    handleActiveChange(key) {
        const active = this.state.active;
        active[key] = !active[key];
        this.setState({active});
    },

Later we use this state to control which `LineChart`s to display.

    let charts = [];
    let max = 100;
    if (this.state.active.requests) {
        const maxRequests = requestsSeries.max("requests");
        if (maxRequests > max) max = maxRequests;
        charts.push(
            <LineChart
                key="requests"
                axis="axis1"
                series={requestsSeries}
                columns={["requests"]}
                style={styler}
                interpolation="curveBasis" />
        );
    }
    if (this.state.active.connections) {
        const maxConnections = connectionsSeries.max("connections");
        if (maxConnections > max) max = maxConnections;
        charts.push(
            <LineChart
                key="connections"
                axis="axis2"
                series={connectionsSeries}
                columns={["connections"]}
                style={styler}
                interpolation="curveBasis" />
        );
    }
    const lineCharts = (
        <ChartContainer timeRange={requestsSeries.range()}>
            <ChartRow height="300">
                <YAxis
                    id="axis1"
                    label="Requests"
                    transition={300}
                    style={styler.axisStyle("requests")}
                    labelOffset={-10}
                    min={0} max={max}
                    format=",.0f"
                    width="60"
                    type="linear" />
                <Charts>
                    {charts}
                </Charts>
                <YAxis
                    id="axis2"
                    label="Connections"
                    transition={300}
                    style={styler.axisStyle("connections")}
                    labelOffset={12}
                    min={0}
                    format=",.0f"
                    max={max}
                    width="80"
                    type="linear" />
            </ChartRow>
        </ChartContainer>
    );

Finally we implement the `render()` method of our component to return our final chart like this:

    <ChartContainer
      enableDragZoom
      onTimeRangeChanged={this.handleTimeRangeChange}
      timeRange={this.state.timerange}
      maxTime={requestsSeries.range().end()}
      minTime={requestsSeries.range().begin()}
      timeAxisStyle={axisStyle}
    >
        <ChartRow height="300">
            <YAxis id="axis1" label="Requests" style={{labelColor: scheme.requests}}
                   labelOffset={-10}  min={0} max={1000} format=",.0f" width="60" type="linear" />
            <Charts>
                {linecharts}
            </Charts>
            <YAxis id="axis2" label="Connections" style={{labelColor: scheme.connections}}
                   labelOffset={12} min={0} format=",.0f" max={10000} width="80" type="linear"/>
        </ChartRow>
    </ChartContainer>
