This example shows a breakdown of network traffic by router interface. To do this we use an AreaChart to show the overall traffic and use a Horizontal BarChart to visualize the relative contribution to the traffic from each interface.

A horizontal barchart takes a list of TimeSeries objects (in this case `interfaces`) and visualizes them. You specify the columns you want to display and other visual properties such as colors, and this component will build a bar chart showing max, avg and current value.

In addition the bar charts support selection via `selected` and `onSelectionChanged`, and given a `timestamp` prop, will also display a marker.

    <HorizontalBarChart
        display="range"
        seriesList={interfaces}
        columns={["out", "in"]}
        top={5} sortBy="max"
        timestamp={this.state.tracker}
        format={formatter}
        selected={this.state.selected}
        onSelectionChanged={this.handleSelectionChange}
        selectionColor="#37B6D3"
        style={[{fill: "#1F78B4"}, {fill: "#FF7F00"}]} />
