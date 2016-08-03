
### Getting started

This charts library is intended to be installed with [npm](https://www.npmjs.com/) and the built into your project with a tool like [Webpack](https://webpack.github.io/). It expects React to be present, as well as our TimeSeries abstraction library, [pond.js](http://software.es.net/pond). More on this below. To install:

    npm install react-timeseries-charts pondjs --save

Once installed, you can import the necessary components from the library:

    import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";

Then we construct our chart in the `render()` function of our component. For a simple example we create a chart with two line charts on it, specified in JSX:

    <ChartContainer timeRange={series1.timerange()} width={800}>
        <ChartRow height="200">
            <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
            <Charts>
                <LineChart axis="axis1" series={series1}/>
                <LineChart axis="axis2" series={series2}/>
            </Charts>
            <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
        </ChartRow>
    </ChartContainer>

At the outer most layer, we add a `<ChartContainer>` which contains our time range for the x-axis. All charts within a ChartContainer share the same x-axis. In this case we get the TimeRange from the TimeSeries itself, but you could specify one yourself. You also need to provide a width for the chart, or wrap the chart in a `<Resizable>` component and that will inject a width for you.

For the next layer of the layout we make a `<ChartRow>`. We can have multiple charts stacked on top of each other by using more than one row. In this case we just have one row. Each row has a specific height in the layout, so we specify that as 200px high here.

Next up we want to put something in our row. Rows contain two parts:
1. a central flexible sized area in which charts can be added and 2. axes on either the left or right of the central area.

This central area is surrounded in the JSX by the `<Charts>` tag. Each chart in this area is composited on top of each other. In this case we are adding two `<LineChart>`s, one for each of our timeseries. As a result they will be drawn on top of each other. (Note that as of v0.9, it is also possible to draw multiple channels of a TimeSeries as multiple line charts). For scaling each chart will reference an axis that will define the scale as well as display that scale visually as the y-axis.

Finally, we specify the axes that the charts reference. These go either before or after the `<Charts>` group, depending on if you want the axis before (to the left) or after the charts (to the right). You can specify any number of axes on either side. For each `<YAxis>` you specify the `id` so that a chart can reference it, the `label` you want displayed alongside the axis and, importantly, the scale using `min` and `max`. You can also specify the `type` of the axis (`linear`, `log`, etc), a non-default `width` and the `format`.

For more details, please see the API docs.
