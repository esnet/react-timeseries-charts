/** @jsx React.DOM */

//
// Entry point, so that you can use it like
// var LineChart = require('esnet-react-charts').LineChart;
// ...
// return (
//  <LineChart ... />
// );

module.exports = {
    AreaChart: require('./lib/components/areachart.jsx'),
    ChartContainer: require('./lib/components/chartcontainer.jsx'),
    ChartRow: require('./lib/components/chartrow.jsx'),
    EventChart: require('./lib/components/eventchart.jsx'),
    EventRect: require('./lib/components/eventrect.jsx'),
    LabelAxis: require('./lib/components/labelaxis.jsx'),
    Legend: require('./lib/components/legend.jsx'),
    LineChart: require('./lib/components/linechart.jsx'),
    Meter: require('./lib/components/meter.jsx'),
    Resizable: require('./lib/components/resizable.jsx'),
    TimeAxis: require('./lib/components/timeaxis.jsx'),
    Tracker: require('./lib/components/tracker.jsx'),
    ValueAxis: require('./lib/components/valueaxis.jsx'),
    YAxis: require('./lib/components/yaxis.jsx')
}
