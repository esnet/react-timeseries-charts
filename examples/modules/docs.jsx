import React from "react";
import _ from "underscore";
import Markdown from "react-markdown";

const docsFile = require("../docs.json");

export default React.createClass({

    renderPropType(type) {
        if (!type) {
            return "unknown type";
        }
        if (type.name === "enum") {
            return "enum (" + _.map(type.value, value => {
                return value.value;
            }).join(", ") + ")";
        } if (type.name === "union") {
            return "one of (" + _.map(type.value, value => {
                return this.renderPropType(value);
            }).join(", ") + ")";
        } if (type.name === "arrayOf") {
            return `array of ${type.value.name}s`;
        } else {
            return `${type.name}`;
        }
    },

    renderProps(props) {
        const propNameStyle = {
            padding: 3,
            marginRight: 5,
            borderRadius: 2,
            fontFamily: "'Fira Mono',Menlo,monospace",
            color: "#c7254e",
            background: "#f9f2f4",
            letterSpacing: -.015
        };

        const infoStyle = {
            color: "#626466",
            fontFamily: "Fira Sans,Helvetica Neue,Helvetica,Arial,sans-serif",
            fontSize: 16,
            lineHeight: 1.625
        };

        const typeStyle = {
            color: "#626466",
            background: "#F5F4F4",
            fontFamily: "Fira Sans,Helvetica Neue,Helvetica,Arial,sans-serif",
            fontSize: 16,
            lineHeight: 1.625
        };

        return _.map(props, (prop, propName) => (
            <div key={propName}>
                <span style={propNameStyle}>{propName}</span>
                <span>{prop.defaultValue ? ` = ${prop.defaultValue.value}` : ""}</span>
                <span className="label label-default">{prop.required ? "Required" : ""}</span>
                <div style={infoStyle} >
                    <Markdown source={prop.description ? prop.description : ""} />
                </div>
                <span style={typeStyle} >
                    {this.renderPropType(prop.type)}
                </span>
                <hr />
            </div>
        ));
    },

    render() {
        const file = this.props.file;
        const docs = docsFile[file];
        return (
            <div>
                <h3>API</h3>
                <Markdown source={docs.description} />
                <hr />
                <h4>Props</h4>
                {this.renderProps(docs.props)}
            </div>
        );
    }
});
