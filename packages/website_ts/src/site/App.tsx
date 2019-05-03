/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import "./App.css";
import * as _ from "underscore";
import * as React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

import Guide from "./components/Guide";

import Header from "./Header";
// import Sidebar from "./Sidebar";
// import ScrollToTop from "./ScrollToTop";

// import TsModule from "./api/Module";
// import TsClass from "./api/Class";

// Generated pond.js code and documentation as a JSON file. This is what we are
// parsing here to generate the API documentation
const docsJSON: DocNode = require("../doc.json");

export type DocNode = {
    id: number,
    name: string,
    kind: number,
    kindString: string,
    flags: { [_:string]: boolean },
    children: DocNode[],
    groups: { title: string, kind: number, children: number[] }
    sources: { fileName: string, line: number, character: number }[]
}

export type Docs = {
    modules: { [_:string]: DocNode },
    classes: { [_:string]: DocNode },
    functions: { [_:string]: DocNode },
    methods: { [_:string]: DocNode },
    interfaces: { [_:string]: DocNode },
    enums: { [_:string]: DocNode },
    objects: { [_:string]: DocNode },
    types: { [_:string]: DocNode },
    properties: { [_:string]: DocNode }
}

const docs: Docs = {
    modules: {},
    classes: {},
    functions: {},
    methods: {},
    interfaces: {},
    enums: {},
    objects: {},
    types: {},
    properties: {}
};

function buildTypes(root: any) {
    _.forEach(root, (child: DocNode) => {
        const { name, kindString } = child;
        const n = name.toLowerCase();
        switch (kindString) {
            case "External module":
                docs.modules[n.replace(/['"]+/g, "")] = child;
                break;
            case "Class":
                docs.classes[n] = child;
                break;
            case "Object literal":
                docs.objects[n] = child;
                break;
            case "Function":
                docs.functions[n] = child;
                break;
            case "Interface":
                docs.interfaces[n] = child;
                break;
            case "Type alias":
                docs.types[n] = child;
                break;
            case "Method":
                docs.methods[n] = child;
                break;
            case "Enumeration":
            case "Enumeration member":
                docs.enums[n] = child;
                break;
            case "Property":
                docs.properties[n] = child;
                break;
            default:
        }
        if (_.has(child, "children")) {
            buildTypes(child.children);
        }
    });
}

buildTypes(docsJSON.children);

const bodyStyle: React.CSSProperties = {
    marginTop: 100,
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column"
};

const mainStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    marginLeft: 20,
    marginRight: 40
};

const footerStyle: React.CSSProperties = {
    flex: "none",
    height: 10,
    background: "#DDD"
};

const contentStyle: React.CSSProperties = {
    flex: 1
};

export class App extends React.Component {
    render() {
        return (
            <Router>
                <div style={bodyStyle}>
                    <Header />
                    <div style={mainStyle}>
                        <div style={contentStyle}>
                            {" "}
                            <Switch>
                                <Route exact={true} path="/" component={Guide} />
                            </Switch>
                        </div>
                    </div>
                    <div style={footerStyle}>…</div>
                </div>
            </Router>
        )
    }
}

// export const App: React.SFC = () => (
//     <Router>
//         <div style={bodyStyle}>
//             <Header />
//             <div style={mainStyle}>
//                 <div style={contentStyle}>
//                     {" "}
//                     <Switch>
//                         <Route exact={true} path="/" component={Guide} />
//                         <Route path="/guide/:doc" component={Guide} />
//                     </Switch>
//                 </div>
//             </div>
//             <div style={footerStyle}>…</div>
//         </div>
//     </Router>
// );
