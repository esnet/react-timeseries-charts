"use strict";

var React = require("react/addons");
var Router = require("react-router");
var {RouteHandler,
     Link} = Router;

require("../styles/app.css");

var sidebarStyle = {
    borderRightStyle: "solid",
    borderRightColor: "#F2F1F1",
    borderRightWidth: 1
}

var API = React.createClass({

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-2" style={sidebarStyle}>
                        <div className="docs-sidebar">
                            <ul className="docs-sidenav nav">
                                <li><Link to="api/areachart">AreaChart</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-10" >
                        <RouteHandler />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = API;