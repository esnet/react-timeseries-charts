import React from "react/addons";
import _ from "underscore";

//Imports from the charts library
import Legend from "../../lib/components/legend";

import Markdown from "react-markdown-el";
const exampleText = `

Legends are simple define:

	<div className="col-md-3">
  	<Legend style="line" categories={[{"key": "aust", "label": "AUD", color: "#1f77b4"},
  						              {"key": "usa", "label": "USD", color: "#aec7e8"}]} />
	</div>
	<div className="col-md-3">
  	<Legend style="swatch" categories={[{"key": "oscars", "label": "Oscars", color: "#ff7f0e"},
  						                {"key": "total", "label": "Total", color: "#ffbb78"}]} />
	</div>
	<div className="col-md-3">
  	<Legend style="dot" categories={[{"key": "site", "label": "Site", color: "#98df8a"},
  						             {"key": "router", "label": "Router", color: "#d62728"}]} />
	</div>

However they currently depend on CSS code for styling:

	.horizontal-legend .legend-swatch.oscars{
    	background-color: #2064AC;
	}
`;

export default React.createClass({

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
	                  	<Legend type="line" categories={[{"key": "aust", "label": "AUD", style={backgroundColor: "#1f77b4"}},
	                  						             {"key": "usa", "label": "USD", style={backgroundColor: "#aec7e8"}}]} />
	              	</div>
	              	<div className="col-md-3">
	                  	<Legend type="swatch" categories={[{"key": "oscars", "label": "Oscars", style={backgroundColor: "#ff7f0e"}},
	                  						               {"key": "total", "label": "Total", style={backgroundColor: "#ffbb78"}}]} />
	              	</div>
	              	<div className="col-md-3">
	                  	<Legend type="dot" categories={[{"key": "site", "label": "Site", style={backgroundColor: "#98df8a"}},
	                  						            {"key": "router", "label": "Router", style={backgroundColor: "#d62728"}}]} />
	              	</div>
	          	</div>

                <hr />

                <div className="row">
                    <div className="col-md-12">
                        <Markdown text={exampleText} />
                    </div>
                </div>
		    </div>
	    );
  	}
});

/*

 */