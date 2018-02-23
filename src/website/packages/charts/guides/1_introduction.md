
## 1. Introduction

---

This library contains a set of modular charting components used for building flexible interactive charts in React. What does it look like?

```js
render() {
    ...
    return (
        <ChartContainer timeRange={series1.timerange()} width={800}>
            <ChartRow height="200">
                <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" />
                <Charts>
                    <LineChart axis="axis1" series={series1} column={["aud"]}/>
                    <LineChart axis="axis2" series={series2} column={["euro"]}/>
                </Charts>
                <YAxis id="axis2" label="Euro" min={0.5} max={2.0} width="80"/>
            </ChartRow>
        </ChartContainer>
    );
}
```

### 1.1 Why another chart library?

This charts library was built using React from the ground up, specifically to visualize TimeSeries data and network traffic data in particular. We recognized early that we could combine the composability of React with the drawing primitives of d3, to meet our visualization needs. Other libraries have also come to the same conclusion.

For us, initial key drivers in the build our own equation were:

 * Time series use cases first, not an after thought
 * Built on an underlying timeseries abstraction (pond.js)
 * Pan and zoom, with enough control to dynamically load in data
 * Ability to visualize network traffic data using stacked and up/down area charts

Since then the library has grown to form the basis of visualization throughout the public facing [ESnet Portal](http://my.es.net).

### 1.2 Features

Current features of the library include:

 * Declarative layout of charts using JSX
 * Composition into multiple axis and multiple rows and overlays
 * Interactivity, including pan and zoom, selection and highlighting
 * Easily add your own chart types or overlays
 * Line, area, scatter, bar, boxplot and event charts
 * Brushing for interactive chart region selection
 * Chart pan and zoom constraints
 * Legends
 * Baselines
 * Markers

Please continue to read the documentation to see how to get started, or browse the examples for a feel for the library.

