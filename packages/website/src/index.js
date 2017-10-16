import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, hashHistory } from 'react-router';
import 'react-select/dist/react-select.css';
import './index.css';
import App from './App';
import Guide from "./components/Guide";
import Example from "./components/Example";
import API from "./components/API";
import registerServiceWorker from './registerServiceWorker';

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
