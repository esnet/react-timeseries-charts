
# React Timeseries Charts

---

[![Build Status](https://travis-ci.org/esnet/react-timeseries-charts.svg)](https://travis-ci.org/esnet/react-timeseries-charts) 
[![npm version](https://badge.fury.io/js/react-timeseries-charts.svg)](https://badge.fury.io/js/react-timeseries-charts)

---

### Introduction

This library contains a set of modular charting components used for building flexible interactive charts in React. What does it look like?

    render() {
        ...
        return (
            <ChartContainer timeRange={series1.timerange()} width={800}>
                <ChartRow height="200">
                    <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" />
                    <Charts>
                        <LineChart axis="axis1" series={series1}/>
                        <LineChart axis="axis2" series={series2}/>
                    </Charts>
                    <YAxis id="axis2" label="Euro" min={0.5} max={2.0} width="80"/>
                </ChartRow>
            </ChartContainer>
        );
    }


### Why another chart library?

This charts library was built using React from the ground up, specifically to visualize TimeSeries data and network traffic data in particular. We recognized early that we could combine the composability of React with the drawing primitives of d3, to meet our visualization needs. Other libraries have also come to the same conclusion.

For us, key drivers in the build our own equation were:

 * time series use cases first, not an after thought
 * build on an underlying timeseries abstraction (pond.js)
 * ability to pan and zoom, with enough control to dynamically load in data
 * ability to visualize network data using stacked and up/down area charts

Since then the library has grown to form the basis of visualization throughout the public facing [ESnet Portal](http://my.es.net).

### Features

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

