/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import { Link } from "react-router";
import _ from "underscore";
import { Flexbox, FlexItem } from "flexbox-react";
import Highlighter from "../util/highlighter";
import APIDocs from "./apidocs";
import Meta from "../examples/examples.json";
const docsFile = require("../../docs.json");

const Example = React.createClass({
    render() {
        const style = {
            display: "inline-block",
            margin: 5,
            padding: 20,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#DDD",
            width: 160,
            height: 160
        };
        const { example } = this.props;
        const name = example.key;
        const img = `examples/components/examples/${name}/${name}.png`;
        const link = (
            <Link to={`example/${name}`}>{example.value.title}</Link>
        );
        return (
            <FlexItem minWidth="220px" >
                <div style={style}>
                    <img src={img} />
                </div>
                <div style={{paddingLeft: 5, fontSize: "smaller"}}>
                {link}
                </div>
            </FlexItem>
        );
    }
});

const TaggedExamples = React.createClass({
    render() {
        const exampleList = [];
        _.forEach(Meta, (value, key) => {
            const tags = value.tags;
            if (_.contains(tags, this.props.tag)) {
                exampleList.push({key, value});
            }
        });
        const examples = exampleList.map(example => {
            return (
                <Example example={example} />
            );
        });
        
        if (examples.length > 0) {
            return (
                <div>
                <h3>Examples</h3>
                <Flexbox flexDirection="row" flexWrap="wrap">
                    {examples}
                </Flexbox>
                </div>
            );
        } else {
            return (
                <div />
            );
        }
    }
});

export default React.createClass({

    mixins: [Highlighter],

    render() {
        const component = this.props.params.component;
        const path = `src/${component}.jsx`;
        const title = docsFile[path].displayName;
        return (
            <div>
                <h2>{title}</h2>
                <div className="row">
                    <div className="col-md-12">
                        <TaggedExamples tag={component} />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <APIDocs file={path}/>
                    </div>
                </div>
            </div>
        );
    }
});
