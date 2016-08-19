
## Markers

This section describes how you can use different types of overlay markers to communicate to your users. Markers in this context are anything you can add on top of your charts to describe some additional feature. For example, a BaseLine lets you draw a labeled horizontal line that you might use to indicate the average of the charts values, or a threshold that you expect the chart to not cross. We'll talk about the different options below, but this is an evolving list, so more capabilities will likely be added in the future.

### Tracker

The charts themselves provide a marker mechanism in the form of their tracker. A tracker, at it's simplest, is a vertical line showing the hovered over time. You can specify this time as a prop on the `ChartContainer`. We use this mechanism a lot, because we tend to use the hovered position to drive display of information elsewhere on the page.

To use the tracker, specify the `trackerPosition` prop in the `ChartContainer`. This prop should be a JS Date. In the example below we are keeping this time in the component state as `this.state.tracker`.

    <ChartContainer
        timeRange={this.state.timerange}
        trackerPosition={this.state.tracker}
        onTrackerChanged={this.handleTrackerChanged} >
        <ChartRow height="150">
            <Charts>
                <AreaChart axis="traffic" series={trafficSeries} />
            </Charts>
            <YAxis id="traffic" label="Traffic (bps)" min={0} max={max} />
        </ChartRow>
    </ChartContainer>

As a second prop, we add a callback `handleTrackerChanged()` to the `onTrackerChanged` prop. From this we can get the hovered position as a Date. We respond to this callback by setting our state.

    handleTrackerChanged(t) {
        this.setState({tracker: t});
    },

Using this mechanism allows us to display additional data outside of the chart. For instance we can use the Date stored in `this.state.tracker` to lookup the values at that time, or to synchronize the trackers of multiple charts.

### Advanced tracker

The tracker can also show a value list or label, along with the time, as an overlay next to the tracker line. These are added per-row.

    <ChartContainer
        trackerPosition={this.state.tracker}
        onTrackerChanged={this.handleTrackerChanged}
        ... >
        <ChartRow
            height="200"
            trackerInfoValues={trackerInfoValues}
            trackerInfoHeight={50}>

Where `trackerInfoValues` might be pulled from the TimeSeries being plotted at the current tracker time.

    const trackerInfoValues = [
        {label: "Speed", value: speedValue},
        {label: "HR", value: hrValue}
    ];


### Other types of trackers

This simple tracker works well in our experience for AreaChart and LineCharts. However, for BarCharts and ScatterCharts we need to be more precise with the info overlay we provide as the user explores the data with their cursor.



