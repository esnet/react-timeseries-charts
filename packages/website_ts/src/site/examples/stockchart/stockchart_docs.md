In this example, we build a stock chart from the historical data we have with the date, volume, opening price of the stock, closing price, highest value for that day and the lowest value for that day.

```
const data = [
    {
        "date":"2016/06/07",
        "close":99.03,
        "volume":22378380,
        "open":99.25,
        "high":99.87,
        "low":98.96
    },
    {
        "date":"2016/06/06",
        "close":98.63,
        "volume":23265200,
        "open":97.99,
        "high":101.89,
        "low":97.55
    },
    ...
]
```

We want to take that data and make a LineChart as well as a BarChart showing linear to log transitions on the YAxis as well.

First we need to import out data, which is in a JSON file that we read in. We use Pond to make an array of IndexedEvents as well as TimeEvents, one for each day. For the data of each event, we have an object that contains an our values.

```
const columns = ["time", "open", "close", "low", "high"];
const w = Immutable.List(aapl);
const events = w.map(item => {
    const { open, close, low, high } = item;
    return timeEvent(
        time(new Date(item.date)),
        Immutable.Map({
            open: +open,
            close: +close,
            low: +low,
            high: +high
        })
    );
});

const priceCollection = new Collection(events);
const sortedCollection = priceCollection.sortByKey();

const series = new TimeSeries({ 
    name: "AAPL-price", 
    columns, 
    collection: sortedCollection 
});
```

We can then render our series which is cropped based on the timerange. Note that we are also maintaining a state of the YAxis' type i.e. either log or linear.

```
const croppedSeries = series.crop(timerange);
const croppedVolumeSeries = seriesVolume.crop(timerange);

return (
    <ChartContainer
        timeRange={timerange}
        enablePanZoom={true}
        onTimeRangeChanged={this.handleTimeRangeChange}
    >
        <ChartRow height="300">
            <Charts>
                <LineChart
                    axis="y"
                    style={{ close: { normal: { stroke: "steelblue" } } }}
                    columns={["close"]}
                    series={croppedSeries}
                    interpolation="curveBasis"
                />
            </Charts>
            <YAxis
                id="y"
                label="Price ($)"
                min={croppedSeries.min("close")}
                max={croppedSeries.max("close")}
                format=",.0f"
                width="60"
                type={this.state.mode}
            />
        </ChartRow>
        <ChartRow height="200">
            <Charts>
                <BarChart
                    axis="y"
                    style={{ volume: { normal: { stroke: "steelblue" } } }}
                    columns={["volume"]}
                    series={croppedVolumeSeries}
                />
            </Charts>
            <YAxis
                id="y"
                label="Volume"
                min={croppedVolumeSeries.min("volume")}
                max={croppedVolumeSeries.max("volume")}
                width="60"
            />
        </ChartRow>
    </ChartContainer>
);
```