
## 4. Annotations

---

This section describes how you can use different types of annotations to communicate to your users. Annotations in this context are anything you can add on top of your charts to describe or highlight some additional feature. For example, a BaseLine lets you draw a labeled horizontal line that you might use to indicate the average of the charts values, or a threshold that you expect the chart to not cross. We'll talk about the different options below, but this is an evolving list, so more capabilities will likely be added in the future.

### 4.1 Tracker

The charts themselves provide a annotation mechanism in the form of their built-in tracker. A tracker, at its simplest, is a vertical line marking the hovered over time. You can specify this time as a prop on the `ChartContainer`. We use this mechanism a lot, because we tend to use the hovered position to drive display of information elsewhere on the page.

To use the tracker, specify the `trackerPosition` prop in the `ChartContainer`. This prop should be a regular Javascript Date. In the example below we are keeping this time in the component state as `this.state.tracker`.

```jsx
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
```

As a second prop, we add a callback `handleTrackerChanged()` to the `onTrackerChanged` prop. From this we can get the hovered position as a Date. We respond to this callback by setting our state.

```js
handleTrackerChanged(t) {
    this.setState({tracker: t});
},
```

Using this mechanism allows us to display additional data outside of the chart. For instance we can use the Date stored in `this.state.tracker` to lookup the values at that time, to synchronize the trackers of multiple charts, or adjust the tracker time to snap to specific times or events.

The `onTrackerChanged` prop is also called with a second argument: the current time scale of the time axis. This is a function that takes one argument - a Date - and translates it into an x coordinate, which can then be used to horizontally position arbitrary components in sync with the tracker, or any other date. For example:

```js
handleTrackerChanged(t, scale) {
    if (t) {
        // Snap the current time to the nearest day
        const midnight = new Date(t);
        midnight.setHours(0, 0, 0, 0);
        // Get the x coordinate for that date
        const trackerX = scale(midnight);
        this.setState({
            tracker: midnight,
            trackerX
        })
    } else {
        this.setState({tracker: t});
    }
},
```

Then, we can use `this.state.trackerX` to position any component, like a custom time marker, in sync with the current tracker position:

```jsx
<div style={{position: 'relative'}}>
    <div style={{position: 'absolute', left: this.state.trackerX}}>
        { this.state.tracker && this.state.tracker.toLocaleDateString() }
    </div>
</div>
<ChartContainer
    trackerPosition={this.state.tracker}
    onTrackerChanged={this.handleTrackerChanged}
    ...
>
...
</ChartContainer>
```

### 4.2 Advanced tracker

The tracker can also show a value list or label, along with the time, as an overlay next to the tracker line. These are added per-row.

```jsx
<ChartContainer
    trackerPosition={this.state.tracker}
    onTrackerChanged={this.handleTrackerChanged}
    ...
>
    <ChartRow
        height="200"
        trackerInfoValues={trackerInfoValues}
        trackerInfoHeight={50}
    >
```

Where `trackerInfoValues` might be pulled from the TimeSeries being plotted at the current tracker time.

    const trackerInfoValues = [
        {label: "Speed", value: speedValue},
        {label: "HR", value: hrValue}
    ];

### 4.3 TimeMarker

Within the Charts you can also overlay a TimeMarker. This is essentially what is used as the above tracker, only you have control of it. Here is a simple example which overlays a line at a time with a label.

    <Charts>
        ...
        <TimeMarker
            axis="axis1"
            time={powerPeakTime}
            infoStyle={{line: {strokeWidth: "2px", stroke: "#83C2FC"}}}
            infoValues="Peak power" />
        ...
    </Charts>

### 4.4 Event Markers

While the above annotations mark a time on the chart, you can also mark a specific event with the `EventMarker`.

The `EventMarker` can look much the same as a `TimeMarker` (and the Tracker), but with the stem of the marker beging connected to a specific point or event on the chart rather than running the height of the chart. This is helpful in the case of sparse data where you want to highlight particular points as the user hovers over the chart.

These types of markers consist of several pieces which can be selectively disabled. As mentioned the vertical connector is the stem of the marker. The event end may be marked with a dot, which is the marker itself. There may also be an infoBox containing label/value pairs.

Combining these attributes, Event markers fall into two flavors, either you want to omit the infoBox and mark the event with a dot and optionally a simple label, or you want to omit the label (and perhaps marker dot) and show a flag style marker with the infoBox connected to the event with the stem.

See the "climate" example.

### 4.5 Scatter and Barchart

The simple tracker-style markers works well in our experience for `AreaChart`s and `LineChart`s. However, for `BarChart`s and `ScatterChart`s we need to be more precise with the info overlay we provide as the user explores the data with their cursor. For this reason these charts provide their own specialized overlays. For example a ScatterChart:

```jsx
    <ScatterChart
        axis="wind-gust"
        series={series}
        columns={["station1", "station2"]}
        ...
        info={infoValues}
        infoHeight={28}
        infoWidth={110}
        ... />
```
