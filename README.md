# React Timeseries Charts [![Build Status](https://travis-ci.org/esnet/react-timeseries-charts.svg)](https://travis-ci.org/esnet/react-timeseries-charts)

![Area chart](https://raw.githubusercontent.com/esnet/react-timeseries-charts/master/screenshots/areachart.png)

This library contains a set of modular charting components used for building flexible interactive charts. It was built for React from the ground up, specifically to visualize timeseries data and network traffic data in particular. Low level elements are constructed using d3, while higher level composability is provided by React. Charts can be stacked as rows, overlaid on top of each other, or any combination, all in a highly declarative manner.

The library is used throughout the public facing [ESnet Portal](http://my.es.net).

Current features of the library include:

 * Declarative layout of charts using JSX
 * Interactivity, including pan and zoom
 * Add new chart types or overlays
 * Multiple axis, multiple rows
 * Line, area, scatter charts
 * Brushing
 * Timeseries tables
 * Legends
 * Baseline and TimeRange markers

Please browse the examples for a feel for the library, or read on to get started.

Getting started
---------------

This charts library is intended to be installed with [npm](https://www.npmjs.com/) and the built into your project with a tool like [Webpack](https://webpack.github.io/). In addition, it currently assumes that [Bootstrap](http://getbootstrap.com/) is present on the page.

    npm install react-timeseries-charts --save

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

At the outer most layer, we add a `<ChartContainer>` which contains our timerange for the x-axis. In this case we get the timerange from the timeseries itself, but you could specify one yourself. You also need to provide a width for the chart, or wrap the chart in a `<Resizable>` component and that will inject a width for you.

For the next layer of the layout we make a `<ChartRow>`. We can have multiple charts stacked on top of each other by using more than one row. In this case we just have one row. Each row has a specific height in the layout, so we specify that as 200px high here.

Next up we want to put something in our row. Rows contain two parts:
1. a central flexible sized area in which charts can be added and 2. axes on either the left or right of the central area.

This central area is surrounded in the JSX by the `<Charts>` tag. Each chart in this area is composited on top of each other. In this case we are adding two `<LineChart>`s, one for each of our timeseries. As a result they will be drawn on top of each other. For scaling each chart will reference an axis that will define the scale as well as display that scale visually as the y-axis.

Finally, we specify the axes that the charts reference. These go either before or after the `<Charts>` group, depending on if you want the axis before (to the left) or after the charts (to the right). You can specify any number of axes on either side. For each `<YAxis>` you specify a `width`, the `id` so that a chart can reference it, the `label` you want displayed alongside the axis and, importantly, the scale using `min` and `max`. You can also specify the `type` of the axis (`linear`, `log`, etc) and the `format`.

For more details, please see the API docs.

Data format
-----------

This charting library is built on the ESnet timeseries library called [pond.js](http://software.es.net/pond). Pond.js was created to provide a common representation for things like time series, time ranges, events and other structures as well as to implement common operations on those structures.

For the purpose of using the charting library, you need to create a TimeSeries() object as your series, which will be rendered by the chart code.

For example:

    import { TimeSeries, TimeRange } from "pondjs";

    const timeseries = new TimeSeries({
        "name": "my series",
        "labels": ["Time", "Currency"],
        "columns": ["time", "value"],
        "points": points
    });

Where `columns` must be 'time' and 'value' to work with much of the charts library (the exception being the AreaChart), and `points` is of the format:

    [[time, value], [time, value], ...]

To specify a chart you also need to tell the chart code what time range to plot on. This is done with a TimeRange. You could either get the timerange from the timeseries:

    var range = timeseries.timerange()

Or construct a new one:

    var range = new TimeRange([begin, end]);

where `begin` and `end` are times (Javascript Dates usually). We often have pages where the current time range begin shown is kept in the state of the component.

Developing
----------

The repo contains the examples website. This is very helpful in developing new functionality. Within a cloned repo, you first need to run:

    npm install

This will install the development dependencies into your node_modules directory.

You can then start up the test server, as well as automatic source building, by doing:

    npm run start-website

Then, point your browser to:

[http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/)

License
-------

This code is distributed under a BSD style license, see the LICENSE file for complete information.

Copyright
---------

ESnet's React Timeseries Charts, Copyright (c) 2015, The Regents of the University of California, through Lawrence Berkeley National Laboratory (subject to receipt of any required approvals from the U.S. Dept. of Energy). All rights reserved.

If you have questions about your rights to use or distribute this software, please contact Berkeley Lab's Technology Transfer Department at TTD@lbl.gov.

NOTICE. This software is owned by the U.S. Department of Energy. As such, the U.S. Government has been granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, and perform publicly and display publicly. Beginning five (5) years after the date permission to assert copyright is obtained from the U.S. Department of Energy, and subject to any subsequent five (5) year renewals, the U.S. Government is granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, distribute copies to the public, perform publicly and display publicly, and to permit others to do so.
