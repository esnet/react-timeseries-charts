import React from "react/addons";
import Markdown from "react-markdown-el";

var text = require("raw!../../README.md");

export default React.createClass({

  	render: function() {
	    return (
	    	<div>
	          	<div className="row">
	              	<div className="col-md-12">
	                  	<h2>Introduction</h2>
	              	</div>
	          	</div>

	          	<div className="row">
	              	<div className="col-md-12">
	              		<Markdown text={text}/>
	              	</div>
	          	</div>
		    </div>
	    );
  	}
});
