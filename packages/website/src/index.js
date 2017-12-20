import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, HashRouter } from 'react-router-dom';

import 'react-select/dist/react-select.css';
import './index.css';
import App from './App';
import Guide from "./components/Guide";
import Example from "./components/Example";
import API from "./components/API";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <HashRouter>
        <Route path="/" component={App}>
            <Route path="/" exact component={Guide} />
            <Route path="guide/:doc" component={Guide} />
            <Route path="example/:example" component={Example} />
            <Route path="api/:packages/:component" component={API} />
        </Route>
    </HashRouter>,
    document.getElementById("root")
);

registerServiceWorker();
