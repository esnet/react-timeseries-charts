/** @jsx React.DOM */

var React = require('react');
var _     = require('underscore');

var Charts = require("../../esnet-react-charts");
var Legend = Charts.Legend;

var LegendExamples = React.createClass({

  	render: function() {
	    return (
	        
	    	<div>

	          	<div className="row">
	              	<div className="col-md-12">
	                  	<h3>Horizontal Legend</h3>
	              	</div>
	          	</div>

	          	<div className="row">
	              	<div className="col-md-3">
	                  	Legend with lines
	              	</div>
	              	<div className="col-md-3">
	                  	Legend with swatches
	              	</div>
	              	<div className="col-md-3">
	                  	Legend with dots
	              	</div>
	         	 </div>

	          	<div className="row">
	              	<div className="col-md-3">
	                  	<Legend categories={{"AUD": "aust", "USD": "usa"}} style="line"/>
	              	</div>
	              	<div className="col-md-3">
	                  	<Legend categories={{"Oscars": "oscars", "Total": "total"}} style="swatch" />
	              	</div>
	              	<div className="col-md-3">
	                  	<Legend categories={{"Site": "site", "Router": "router"}} style="dot" />
	              	</div>
	          	</div>

		    </div>
	    );
  	}
});

module.exports = LegendExamples;