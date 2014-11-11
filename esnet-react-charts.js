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
    EventRect: require('./lib/components/eventrect.jsx'),
    Legend: require('./lib/components/legend.jsx'),
    LineChart: require('./lib/components/linechart.jsx'),
    TimeAxis: require('./lib/components/timeaxis.jsx'),
    Tracker: require('./lib/components/tracker.jsx'),
    YAxis: require('./lib/components/yaxis.jsx')
}
