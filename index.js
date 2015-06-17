//
// Entry point, so that you can use it like
// var {LineChart} = require('esnet-react-charts');
// ...
// return (
//  <LineChart ... />
// );

module.exports = {
    AreaChart: require("./build/lib/components/areachart.jsx"),
    BarChart: require("./build/lib/components/barchart.jsx"),
    Baseline: require("./build/lib/components/baseline.jsx"),
    Brush: require("./build/lib/components/brush.jsx"),
    ChartContainer: require("./build/lib/components/chartcontainer.jsx"),
    Charts: require("./build/lib/components/charts.jsx"),
    ChartRow: require("./build/lib/components/chartrow.jsx"),
    EventChart: require("./build/lib/components/eventchart.jsx"),
    EventRect: require("./build/components/eventrect.jsx"),
    LabelAxis: require("./build/components/labelaxis.jsx"),
    Legend: require("./build/components/legend.jsx"),
    LineChart: require("./build/components/linechart.jsx"),
    PointIndicator: require("./build/components/pointindicator.jsx"),
    Resizable: require("./build/components/resizable.jsx"),
    ScatterChart: require("./build/components/scatterchart.jsx"),
    TimeAxis: require("./build/components/timeaxis.jsx"),
    Tracker: require("./build/components/tracker.jsx"),
    ValueAxis: require("./build/components/valueaxis.jsx"),
    YAxis: require("./build/components/yaxis.jsx")
}
