This example shows a short list of network outages as an `EventChart`. `EventCharts` are currently experimental and don't yet conform to the style guidelines.

Here we build an `EventChart` alongside a `LabelAxis`.

    <ChartContainer
        timeRange={this.state.timerange}
        enablePanZoom={true}
        onTimeRangeChanged={this.handleTimeRangeChange}>
        <ChartRow height="35">
            <LabelAxis
                hideScale={true}
                id="outages"
                label="Outages"
                min={0} max={0}
                width={140}
                type="linear" format=",.1f"/>
            <Charts>
                <EventChart
                    axis="outages"
                    series={series}
                    style={(outageEventStyleCB)}
                    label={e => e.get("title")} />
            </Charts>
        </ChartRow>
    </ChartContainer>

### Labels

Labels for each event are set via a callback function that maps the event to the label. In this case we return the `title` of our event.

### Styling

Styling is currently performed with a callback function. In the above example `outageEventStyleCB` is a function implemented as follows:

    function outageEventStyleCB(event, state) {
        const color = event.get("type") === "Planned" ? "#998ec3" : "#f1a340";
        switch (state) {
            case "normal":
                return {
                    fill: color
                };
            case "hover":
                return {
                    fill: color,
                    opacity: 0.4
                };
            case "selected":
                return {
                    fill: color
                };
        }
    }

The purpose of the function is to set a different color depending on if our event outage was planned or not.

**Note: This form of style setting is similar, but not the same, as the API style guide, so will likely change in the near future.**
