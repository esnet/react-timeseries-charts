This example shows multiple `LineCharts` built from multiple columns in a single `TimeSeries` using the `columns` prop.

This example also shows the use of the `Styler` to build the `LineChart` and `Legend` style for the two columns ("aud" and "euro"):

    const styler = Styler([
        {key: "aud", color: "steelblue", width: 1, dashed: true},
        {key: "euro", color: "#F68B24", width: 2}
    ]);

The `Legend` is rendered as follows, supporting highlighting and selection. In this way these states are synchronized between the `Legend` and the `LineChart`:

    <Legend
        type="line"
        align="right"
        style={styler}
        highlight={this.state.highlight}
        onHighlightChange={highlight => this.setState({highlight})}
        selection={this.state.selection}
        onSelectionChange={selection => this.setState({selection})}
        categories={[
            {key: "aud", label: "AUD", value: audValue},
            {key: "euro", label: "Euro", value: euroValue}
        ]} />

The LineChart itself is rendered like this:

    <ChartContainer
        timeRange={range}
        paddingRight={100}
        maxTime={currencySeries.range().end()}
        minTime={currencySeries.range().begin()}
        timeAxisAngledLabels={true}
        timeAxisHeight={65}
        onTrackerChanged={this.handleTrackerChanged}
        onBackgroundClick={() => this.setState({ selection: null })}
        enablePanZoom={true}
        onTimeRangeChanged={this.handleTimeRangeChange}
        onMouseMove={(x, y) => this.handleMouseMove(x, y)}
        minDuration={1000 * 60 * 60 * 24 * 30}
    >
        <ChartRow height="400">
            <YAxis
                id="y"
                label="Price ($)"
                min={0.5}
                max={1.5}
                width="60"
                type="linear"
                format="$,.2f"
            />
            <Charts>
                <LineChart
                    axis="y"
                    breakLine={false}
                    series={currencySeries}
                    columns={["aud", "euro"]}
                    style={style}
                    interpolation="curveBasis"
                    highlight={this.state.highlight}
                    onHighlightChange={highlight =>
                        this.setState({ highlight })
                    }
                    selection={this.state.selection}
                    onSelectionChange={selection =>
                        this.setState({ selection })
                    }
                />
                <CrossHairs x={this.state.x} y={this.state.y} />
                <Baseline
                    axis="y"
                    value={1.0}
                    label="USD Baseline"
                    position="right"
                />
            </Charts>
        </ChartRow>
    </ChartContainer>

The `CrossHairs` component isn't part of react-timeseries-charts. It is defined like this:

```
class CrossHairs extends React.Component {
    render() {
        const { x, y } = this.props;
        const style = { pointerEvents: "none", stroke: "#ccc" };
        if (!_.isNull(x) && !_.isNull(y)) {
            return (
                <g>
                    <line style={style} x1={0} y1={y} x2={this.props.width} y2={y} />
                    <line style={style} x1={x} y1={0} x2={x} y2={this.props.height} />
                </g>
            );
        } else {
            return <g />;
        }
    }
}
```

You can create any chart you want like this. The important thing about this is that a set of props will be supplied to the component when it is rendered. Those include the dimensions of the chart with `width` and `height`, and the scales `yScale` and `timeScale`.
