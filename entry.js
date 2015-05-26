//
// Entry point, so that you can use it like
// var LineChart = require('esnet-react-charts').LineChart;
// ...
// return (
//  <LineChart ... />
// );

module.exports = {
    AreaChart: require('./lib/components/areachart.jsx'),
    BarChart: require('./lib/components/barchart.jsx'),
    Baseline: require('./lib/components/baseline.jsx'),
    Brush: require('./lib/components/brush.jsx'),
    ChartContainer: require('./lib/components/chartcontainer.jsx'),
    Charts: require('./lib/components/charts.jsx'),
    ChartRow: require('./lib/components/chartrow.jsx'),
    EventChart: require('./lib/components/eventchart.jsx'),
    EventRect: require('./lib/components/eventrect.jsx'),
    LabelAxis: require('./lib/components/labelaxis.jsx'),
    Legend: require('./lib/components/legend.jsx'),
    LineChart: require('./lib/components/linechart.jsx'),
    PointIndicator: require('./lib/components/pointindicator.jsx'),
    Resizable: require('./lib/components/resizable.jsx'),
    ScatterChart: require('./lib/components/scatterchart.jsx'),
    TimeAxis: require('./lib/components/timeaxis.jsx'),
    Tracker: require('./lib/components/tracker.jsx'),
    ValueAxis: require('./lib/components/valueaxis.jsx'),
    YAxis: require('./lib/components/yaxis.jsx')
}
