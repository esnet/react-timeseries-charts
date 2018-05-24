This example shows multiple `LineCharts` built from multiple columns in a single `TimeSeries`  using the `columns` prop.

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
        timeRange={this.state.timerange}
        trackerTime={this.state.tracker}
        onTrackerChanged={this.handleTrackerChanged}
        onBackgroundClick={() => this.setState({selection: null})}
        enablePanZoom={true}
        onTimeRangeChanged={this.handleTimeRangeChange}
        minDuration={1000 * 60 * 60 * 24 * 30} >
        <ChartRow height="200" debug={false}>
            <YAxis id="y" label="Price ($)" min={0.5} max={1.5} format="$,.2f" />
            <Charts>
                <LineChart
                    axis="y"
                    breakLine={false}
                    series={currencySeries}
                    columns={["aud", "euro"]}
                    style={styler}
                    interpolation="curveBasis"
                    highlight={this.state.highlight}
                    onHighlightChange={highlight => this.setState({highlight})}
                    selection={this.state.selection}
                    onSelectionChange={selection => this.setState({selection})} />
            </Charts>
        </ChartRow>
    </ChartContainer>
