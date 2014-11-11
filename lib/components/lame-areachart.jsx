/** @jsx React.DOM */

var React = require('react');

var LameAreaChart = React.createClass({
	getDefaultProps: function() {
		return {
			"width": 800,
			"height": 300
		};
	},

	componentDidMount: function() {
		console.log("LAME CHART PROPS", this.props);
	    this.chart = d3.esnet.areachart()
	        .container(this.getDOMNode())
	        .data(this.props.chartData)
	        .size({w:this.props.width, h:this.props.height}).margin({top:10, bottom:25, left:20, right: 40})
	        .Zoom().Tracker(function(ts){
	          var timestamp = d3.time.format("%Y-%m-%d %H:%M")(new Date(ts));
	          d3.select("#total-traffic-timestamp").html(timestamp);
	        })
    },

    shouldComponentUpdate: function(props) {
    	return false;
    },

    render: function() {
    	return (<div></div>);
    }
});

module.exports.LameAreaChart = LameAreaChart;