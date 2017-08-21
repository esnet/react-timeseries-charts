This simple example of a bar chart displays a pan and zoom chart that shows traffic levels for each day of October 2014. The original data used here was captured to debug a measurement error (seen clearly in Oct 10th).

To begin with we converted the original data into Pond's TimeSeries data structure as `octoberTraffic`:

    import { TimeSeries } from "pondjs";

    const octoberTraffic = new TimeSeries({
        name: "Traffic",
        utc: false,
        columns: ["time", "in", "out"],
        points: trafficPoints
    });

Points are simply an array of tuples, each of which is `[index, value1, value2, ...]`. In this case this looks like `['2014-10-DD', volIn, volOut]`. An index can be of several forms, but is a string that represents a time range (e.g. 2014-10-08 represents the time range spanning October 8th 2014).

We also set `utc` to false here so that the index time ranges are defined in local time. Visualizations of time series data default to showing local time (though UTC is also possible), while `IndexedEvents` default to being in UTC.

Now we can render a the chart. The `<BarChart>` element does the rendering of the chart itself. As with other chart types, the vertical scale is provided by referencing the `<YAxis>` (`axis='traffic'`).

    <ChartContainer
        utc={false}
        timeRange={this.state.timerange}
        format="day"
        enablePanZoom={true} onTimeRangeChanged={this.handleTimeRangeChange}
        maxTime={maxTimeDate}
        minTime={minTimeDate}
        minDuration={minDurationSeconds * 1000}>
        <ChartRow height="150">
            <YAxis
                id="traffic"
                label="Traffic In (B)"
                min={0} max={max}
                width="70" />
            <Charts>
                <BarChart
                    axis="traffic"
                    style={style}
                    columns={["in"]}
                    series={octoberTrafficSeries}
                    info={infoValues}
                    highlight={this.state.highlight}
                    onHighlightChange={highlight => this.setState({highlight})}
                    selection={this.state.selection}
                    onSelectionChange={selection => this.setState({selection})} />
                <Baseline
                    axis="traffic"
                    value={avgIn}
                    label="Avg"
                    position="right" />
            </Charts>
            <YAxis
                id="traffic-rate"
                label="Avg Traffic Rate In (bps)"
                min={0} max={ max / (24 * 60 * 60) * 8}
                width="70" />
        </ChartRow>
    </ChartContainer>

The style provides the coloring, relating each channel to styles for "normal", "highlight" (hover), "selected" and "muted". Muted is the style shown on bars which are not selected:

    const style = {
        in: {
            normal: {fill: "#A5C8E1"},
            highlighted: {fill: "#bfdff6"},
            selected: {fill: "#5aa2d5"},
            muted: {fill: "#A5C8E1", opacity: 0.4}
        }
    };

Side note: this chart can also be zoomed in and then panned with constraints. This is controlled using the `<ChartContainer>` props. Drag to pan, scroll wheel to zoom.
