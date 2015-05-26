"use strict";

var React = require("react/addons");
var Router = require("react-router");
var Markdown = require("react-markdown-el");

var {RouteHandler, Link} = Router;

var md = require("raw!../../docs/linechart.md");

var Doc = React.createClass({
    render: function() {
        var text = "This is a test";
        return (
            <div>
                <div className="row">
                    <div className="col-md-12" >
                        <Markdown text={text}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Doc;