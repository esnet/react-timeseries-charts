
The YAxis widget displays a vertical axis to the left or right of the charts. A YAxis always appears within a `ChartRow`, from which it gets its height and positioning. You can have more than one axis per row.

![YAxis](https://raw.githubusercontent.com/esnet/react-timeseries-charts/master/docs/yaxis.png "YAxis")

Here's a simple YAxis example:

```js
<YAxis id="price-axis" label="Price (USD)" min={0} max={100} width="60" type="linear" format="$,.2f"/>
```

Visually you can control the axis `label`, its size via the `width` prop, its `format`, and `type` of scale (linear).

Each axis also defines a scale through a `min` and `max` prop. Charts may then refer to the axis by by citing the axis `id` in their `axis` prop. Those charts will then use the axis scale for their y-scale.

Here is an example of two line charts that each have their own axis:

```js
<ChartContainer timeRange={audSeries.range()} padding="5">
    <ChartRow height="200">
        <YAxis id="aud" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
        <Charts>
            <LineChart axis="aud" series={audSeries} style={audStyle}/>
            <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
        </Charts>
        <YAxis id="euro" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
    </ChartRow>
</ChartContainer>
```

 Note that there are two `<YAxis>` components defined here, one before the `<Charts>` block and one after. This defines that the first axis will appear to the left of the charts and the second will appear after the charts. Each of the line charts uses its `axis` prop to identify the axis ("aud" or "euro") it will use for its vertical scale.

### Props

#### id

A name for the axis which can be used by a chart to reference the axis.

#### label

The label to be displayed alongside the axis.

#### min and max

Values which define the scale of the axis.

#### width

The width of the axis in pixels.

#### type

Maybe "linear", "log", or "exp"

#### format

A d3 format. More information can be found [here](https://github.com/mbostock/d3/wiki/Formatting#d3_format).

