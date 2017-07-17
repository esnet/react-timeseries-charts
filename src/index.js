import React from "react";
import ReactDOM from "react-dom";
import { Router, IndexRoute, Route, hashHistory } from "react-router";

import "./website/index.css";
import "react-select/dist/react-select.css";

import App from "./website/App";
import Guide from "./website/components/Guide";
import Example from "./website/components/Example";
import API from "./website/components/API";

import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Guide} />
            <Route path="guide/:doc" component={Guide} />
            <Route path="example/:example" component={Example} />
            <Route path="api/:packages/:component" component={API} />
        </Route>
    </Router>,
    document.getElementById("root")
);

registerServiceWorker();
