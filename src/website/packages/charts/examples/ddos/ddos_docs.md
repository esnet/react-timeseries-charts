This is a relatively simple `LineChart` example, but it does exhibit a few useful techniques:

* How to enable "Drag to zoom" behavior
* Use of the `Styler` to control the legend and `LineChart` styles
* Use of the `Legend` to enable and disable and enable specific charts
* How to have the axis animate its transition to a new range as the charts are hidden and shown
* Styling a `YAxis` and `ChartContainer` background
* Showing a grid and removing the `YAxis` vertical line

### Styling

This example shows a dark style. There are several aspects to this rather than a single control.

1. The background color is set by placing a style on the `ChartContainer`. The style simply defines a background color and
   rounded corners for the SVG region the chart is rendered into.

2. The YAxis is customized my passing it a style. This controls the horizontal grid color, value labels and the axis label itself.

3. The appearance of the `LineChart` is controlled with the `Styler`:

```js
const styler = Styler([
    { key: "connections", color: "#2ca02c", width: 1 },
    { key: "requests", color: "#9467bd", width: 2 }
]);
```

And then applied to each LineChart with the style prop:

```jsx
<LineChart axis="axis2" series={connectionsSeries} style={styler} />
```

### Legend

This example allows you to use the legend to control the display of the charts themselves. Click the legend items to hide and show each of the two channels of data.

The legend component lets you provide a callback to be called when an item is changed. You can use that to control your component state and then re-render with or without a particular chart.

The legend uses categories to define the items. A category is an object with a unique key, the label, if the item is enabled or disabled, and the style of the item.

```javascript
const legend = [
    {
        key: "requests",
        label: "Requests",
        disabled: !this.state.active.requests
    },
    {
        key: "connections",
        label: "Connections",
        disabled: !this.state.active.connections
    }
];
```

And applied to the legend:

```jsx
<Legend
    type="line"
    style={styler}
    categories={legend}
    onSelectionChange={this.handleActiveChange}
/>
```

When the legend changes `handleActiveChange()` will be called with the key (from the legend categories).
We can then the toggle our own state:

```js
    handleActiveChange(key) {
        const active = this.state.active;
        active[key] = !active[key];
        this.setState({active});
    },
```

Later we use this state to control which `LineChart`s to display.

```js
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
            interpolation="curveBasis"
        />
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
            interpolation="curveBasis"
        />
    );
}
const lineCharts = (
    <ChartContainer timeRange={requestsSeries.range()}>
        <ChartRow height="300">
            <YAxis
                id="axis1"
                label="Requests"
                showGrid
                hideAxisLine
                transition={300}
                style={darkAxis}
                labelOffset={-10}
                min={0}
                max={this.state.max}
                format=",.0f"
                width="60"
                type="linear"
            />
            <Charts>{charts}</Charts>
            <YAxis
                id="axis2"
                label="Connections"
                hideAxisLine
                transition={300}
                style={darkAxis}
                labelOffset={12}
                min={0}
                format=",.0f"
                max={this.state.max}
                width="80"
                type="linear"
            />
        </ChartRow>
    </ChartContainer>
);
```

Finally we implement the `render()` method of our component to return our final chart like this:

```jsx
<ChartContainer
    title="DDoS attack - connections vs requests"
    style={{
        background: "#201d1e",
        borderRadius: 8,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#232122"
    }}
    padding={20}
    paddingTop={5}
    paddingBottom={0}
    enableDragZoom
    onTimeRangeChanged={this.handleTimeRangeChange}
    timeRange={this.state.timerange}
    maxTime={requestsSeries.range().end()}
    minTime={requestsSeries.range().begin()}
    timeAxisStyle={axisStyle}
>
    <ChartRow height="300">
        <YAxis
            id="axis1"
            label="Requests"
            style={{ labelColor: scheme.requests }}
            labelOffset={-10}
            min={0}
            max={1000}
            format=",.0f"
            width="60"
            type="linear"
        />
        <Charts>{linecharts}</Charts>
        <YAxis
            id="axis2"
            label="Connections"
            style={{ labelColor: scheme.connections }}
            labelOffset={12}
            min={0}
            format=",.0f"
            max={10000}
            width="80"
            type="linear"
        />
    </ChartRow>
</ChartContainer>
```
