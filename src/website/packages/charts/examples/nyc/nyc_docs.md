## Box chart example

A box chart is capable of displaying two ranges and a center marker. The classic example is to use the inner range to display the interquartile range, the outer range to display the min to max extent of the data (though there's other definitions too), and the center marker to show the median.

You can map data to these ranges in two ways, either by passing in a continuous series and letting the chart build up the aggregations necessary (percentiles for example) for a given interval (5 min for example), or, predefining them as an array for the data column under consideration.

In this example we want to do something a little different. We have data that shows the maximum and minimum temperature in New York for each day, along with the historical maximum and minimum temperatures. Our visualization will map the outer range to the historical extremes and the inner range to the actual temperature range for that day.

First we need to import out data, which is in a CSV file that we read in as `weather`. We use Pond to make an array of `IndexedEvents`, one for each day. For the data of each event, we have a single field `temp` that contains an array of our values.

```
    const events = weather.map(item => {
        const timestamp = moment(new Date(item.date));

        const {
            date,
            actual_min_temp,
            actual_max_temp,
            record_min_temp,
            record_max_temp,
        } = item;

        return new IndexedEvent(date, {
            temp: [
                +record_min_temp,
                +actual_min_temp,
                +actual_max_temp,
                +record_max_temp,
            ]
        }, false);
    });

    const series = new TimeSeries({ name, new Collection(events) });
```

We can then render our `series`. Note that this example also demonstrates the ability to pass a function, rather than a d3 format string, as the `YAxis` format property.

```
    render() {
        return (
            ...
                <ChartContainer
                    utc={false}
                    timeRange={this.state.timerange}
                    onTimeRangeChanged={this.handleTimeRangeChange}>
                    <ChartRow height="150">
                        <Charts>
                            <BoxChart
                                axis="temp"
                                style={style}
                                column="temp"
                                series={series} />
                        </Charts>
                        <YAxis
                            id="temp"
                            label="Temperature"
                            min={0} max={120}
                            width="70"
                            format={ n => Number(n).toFixed() + "°F" } />
                    </ChartRow>
                </ChartContainer>
            ...
        );
    }
```
