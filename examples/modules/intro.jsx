"use strict";

var React = require("react");

var Intro = React.createClass({

  	render: function() {
	    return (
	    	<div>
	          	<div className="row">
	              	<div className="col-md-12">
	                  	<h3>Introduction</h3>
	              	</div>
	          	</div>

	          	<div className="row">
	              	<div className="col-md-12">
	              	A general introduction to the ESnet React Charts library.
	              	</div>
	          	</div>
		    </div>
	    );
  	}
});

module.exports = Intro;