
In this example we have a day's worth of rainfall data from Hilo, HI:

```
const data = [
    ["2017-01-24T00:00", 0.01],
    ["2017-01-24T01:00", 0.13],
    ["2017-01-24T02:00", 0.07],
    ["2017-01-24T03:00", 0.04],
    ["2017-01-24T04:00", 0.33],
    ["2017-01-24T05:00", 0.2],
    ["2017-01-24T06:00", 0.08],
    ["2017-01-24T07:00", 0.54],
    ["2017-01-24T08:00", 0.95],
    ["2017-01-24T09:00", 1.12],
    ["2017-01-24T10:00", 0.66],
    ["2017-01-24T11:00", 0.06],
    ["2017-01-24T12:00", 0.3],
    ["2017-01-24T13:00", 0.05],
    ["2017-01-24T14:00", 0.5],
    ["2017-01-24T15:00", 0.24],
    ["2017-01-24T16:00", 0.02],
    ["2017-01-24T17:00", 0.98],
    ["2017-01-24T18:00", 0.46],
    ["2017-01-24T19:00", 0.8],
    ["2017-01-24T20:00", 0.39],
    ["2017-01-24T21:00", 0.4],
    ["2017-01-24T22:00", 0.39],
    ["2017-01-24T23:00", 0.28]
];
```

We want to take that data and make a simple BarChart from it.

This isn't the exact format we need for our chart. Firstly, like other charts, it needs to be a [Pond TimeSeries](http://software.es.net/pond/#/timeseries). Secondly, the TimeSeries is constructed from IndexedEvents. That is, each point in the TimeSeries is referenced not by a timestamp but by an "index". Each index is a string that represents a range of time. In this case each index will represent a specific hour.

Note that often you will either pass the indexed data from the server, or a more dense timeseries will be aggregated with Pond to these indexed events (see the realtime example).

In this case we can use Pond do do a simple transform from dates to index string:

```
const series = new TimeSeries({
    name: "hilo_rainfall",
    columns: ["index", "precip"],
    points: data.map(([d, value]) => [
        Index.getIndexString("1h", new Date(d)),
        value
    ])
});
```

The resulting TimeSeries looks like this:

```
series = {
   "name": "HI_ASOS",
   "utc": true,
   "columns": ["index", "precip"],
   "points": [
      ["1h-412568", 0.01],
      ["1h-412569", 0.13],
      ["1h-412570", 0.07],
      ["1h-412571", 0.04],
      ["1h-412572", 0.33],
      ["1h-412573", 0.2,
      ["1h-412574", 0.08],
      ["1h-412575", 0.54],
      ["1h-412576", 0.95],
      ["1h-412577", 1.12],
      ["1h-412578", 0.66],
      ["1h-412579", 0.06],
      ["1h-412580", 0.3,
      ["1h-412581", 0.05],
      ["1h-412582", 0.5,
      ["1h-412583", 0.24],
      ["1h-412584", 0.02],
      ["1h-412585", 0.98],
      ["1h-412586", 0.46],
      ["1h-412587", 0.8,
      ["1h-412588", 0.39],
      ["1h-412589", 0.4,
      ["1h-412590", 0.39],
      ["1h-412591", 0.28]
   ]
}
```

The index strings you see here, such as "1h-412568", refer to the specific hour in a way that the BarChart will understand. (The string means that this hour is the 412568th hour since the Jan 1, 1970 UTC).

Now that we have a series we can render that:

```
const Example = React.createClass({
    displayName: "BarChartExample",
    render() {
        const style = styler([
            { key: "precip", color: "#A5C8E1"},
        ]);

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
                            <ChartContainer timeRange={series.range()} >
                                <ChartRow height="150">
                                    <YAxis
                                        id="rain"
                                        label="Rainfall (inches/hr)"
                                        min={0}
                                        max={1.5}
                                        format=".2f"
                                        width="70"
                                        type="linear"
                                    />
                                    <Charts>
                                        <BarChart
                                            axis="rain"
                                            style={style}
                                            spacing={1}
                                            columns={["precip"]}
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
});
```
