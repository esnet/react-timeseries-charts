This example shows a short list of network outages as an `EventChart`. `EventCharts` are currently experimental and don't yet conform to the style guidelines.

Here we build an `EventChart`.

    <ChartContainer
        timeRange={this.state.timerange}
        enablePanZoom={true}
        onTimeRangeChanged={this.handleTimeRangeChange}>
        <ChartRow height="35">
            <Charts>
                <EventChart
                    series={series}
                    style={(outageEventStyleCB)}
                    label={e => e.get("title")} />
            </Charts>
        </ChartRow>
    </ChartContainer>

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
