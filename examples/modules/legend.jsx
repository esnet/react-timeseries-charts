import React from "react/addons";
import _ from "underscore";

//Imports from the charts library
import Legend from "../../lib/components/legend";

import Markdown from "react-markdown-el";
const exampleText = `

Legends are simple define:

    <Legend categories={{"AUD": "aust", "USD": "usa"}} style="line"/>
    <Legend categories={{"Oscars": "oscars", "Total": "total"}} style="swatch" />
    <Legend categories={{"Site": "site", "Router": "router"}} style="dot" />

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
	                  	<Legend categories={{"AUD": "aust", "USD": "usa"}} style="line"/>
	              	</div>
	              	<div className="col-md-3">
	                  	<Legend categories={{"Oscars": "oscars", "Total": "total"}} style="swatch" />
	              	</div>
	              	<div className="col-md-3">
	                  	<Legend categories={{"Site": "site", "Router": "router"}} style="dot" />
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
