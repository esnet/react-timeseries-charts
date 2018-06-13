
In this example we have more than a months's worth of data showing loading times across releases of a hypothetical web application:

```
const data = [
    {
    "date": "2014-08-01",
    "pct05": 5350,
    "pct25": 6756,
    "pct50": 7819,
    "pct75": 9284,
    "pct95": 13835
  },
  {
    "date": "2014-08-02",
    "pct05": 4439,
    "pct25": 5584,
    "pct50": 6554,
    "pct75": 8016,
    "pct95": 12765
  },
  {
    "date": "2014-08-03",
    "pct05": 4247,
    "pct25": 5419,
    "pct50": 6332,
    "pct75": 7754,
    "pct95": 12236
  },
  {
    "date": "2014-08-04",
    "pct05": 3293,
    "pct25": 4414,
    "pct50": 5191,
    "pct75": 6491,
    "pct95": 10325
  },
  ....
];
```

We want to take that data and make a Trend Chart, a mixture of a line chart and area chart from it.

This isn't the exact format we need for our chart. Firstly, like other charts, it needs to be a [Pond TimeSeries](http://software.es.net/pond/#/timeseries). Secondly, the TimeSeries is constructed from points where the first column refers to the index, the second column is an array of values representing the 5th, 25th, 75th and 95th percentile. Finally, the third column represents the median value. 

Note that often you will either pass the indexed data from the server, or a more dense timeseries will be aggregated with Pond to these indexed events (see the realtime example).

```
const series = new TimeSeries({
    name: "series",
    columns: ["index", "t", "median"],
    points: data.map(({ date, pct05, pct25, pct50, pct75, pct95 }) => [
        date,
        [
            pct05 / 1000, 
            pct25 / 1000, 
            pct75 / 1000, 
            pct95 / 1000
        ],
        pct50 / 1000
    ])
});
```

To style the trend chart, we pass in the values to the styler object where the key refers to the column in the series

```
const style = styler([
    { key: "t", color: "steelblue", width: 1, opacity: 1 },
    { key: "median", color: "#333", width: 1 }
]);
```

Now that we have a series and style object, we can render the chart as follows:

```
class trend extends React.Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <b>BarChart</b>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer timeRange={series.range()}>
                                <ChartRow height="500">
                                <YAxis
                                    id="t-axis"
                                    label="time (s)"
                                    min={0}
                                    max={18}
                                    format="d"
                                    width="70"
                                    type="linear"
                                />
                                <Charts>
                                    <BandChart
                                        axis="t-axis"
                                        style={style}
                                        spacing={1}
                                        column="t"
                                        interpolation="curveBasis"
                                        series={series}
                                    />
                                    <LineChart
                                        axis="t-axis"
                                        style={style}
                                        spacing={1}
                                        columns={["median"]}
                                        interpolation="curveBasis"
                                        series={series}
                                    />
                                </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
};
```
