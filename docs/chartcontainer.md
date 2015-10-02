
The `<ChartContainer>` is the outer most element of a chart and is responsible for generating and arranging its sub-elements. Specifically, it is a container for one or more `<ChartRows>` (each of which contains charts, axes etc) and in addition it manages the overall time range of the chart and so also is responsible for the time axis, which is always shared by all the rows.

![ChartContainer](../../docs/chartcontainer.png "ChartContainer")

Here is an example:

```xml
<ChartContainer timeRange={audSeries.range()} padding="5" width="800">
    <ChartRow>
        ...
    </ChartRow>
    <ChartRow>
        ...
    </ChartRow>
</ChartContainer>
```

**Note**: The ChartContainer assumes the existence of Bootstrap on the page, as each ChartRow and the TimeAxis are rendered separately onto different Bootstrap grid rows. We may revisit this decision in the future, but currently that's how it works.

### Props

#### timeRange

A Pond TimeRange representing the begin and end time of the chart. Required. It is very important that you supply a valid timeRange, or an invalid scale will cause errors deep in the Charts code.

#### width

The width of the chart in pixels. Required. This library also includes a `<Resizable>` component that can be wrapped around a `<ChartContainer>`. The purpose of this is to inject a `width` prop into the `ChartContainer` so that it will fit the surrounding element. This is very handy when you need the chart to resize based on a responsive layout.

#### padding

Padding used in between elements laid out by the `ChartContainer`.

#### enablePanZoom

Boolean to turn on interactive pan and zoom behavior for the chart.

#### maxTime

If the chart can be panned and zoomed, this specifies one end of the timerange through which is can be moved. For example, you might set this to the current time so that the chart can't be panned into the future.

#### minTime

Similar to maxTime, this specifies the begin time of the constraints on the chart pan and zoom behavior. You might use this to limit the chart to the beginning of the data you have.

#### minDuration

The smallest duration you want to user to be able to zoom into. This might be determined by the resolution of your data. Value in ms.

#### trackerPosition

Current position to draw the tracker. Value is a Date object.

#### onTimeRangeChanged

A callback which will be evoked when the time range of the chart is changed by the user (i.e. by pan and zoom). It will be called with a TimeRange object containing the new time range of the chart. Typically the time range would be stored outside the chart and then passed back in as the `timeRange` prop. That way the current time range can be displayed outside of the chart, or modified by another piece of UI (like a "Last 7 days" button, for example).

#### onTrackerChanged

A callback which will be evoked when the user changes the tracker position (i.e. by hovering over the chart). It will be called with a Date object. Typically the code outside of the chart would hold this position in state and then pass the position back down as the `trackerPosition` prop. That way it can use the current tracker position to display other information at that time, like the current values or update some other part of the UI.

#### transition

Experimental support for transitions between different states. The value is in ms. A good example of this is for transitions form one axis type (linear) to another (log). Works less well for data changes.

