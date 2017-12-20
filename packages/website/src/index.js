import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import './index.css';

import App from './App';
import Guide from "./components/Guide";
import Example from "./components/Example";
import API from "./components/API";

ReactDOM.render((
    <Router>
        <div>
            <Route path="/" component={App} />
            <Switch>
                <Route exact path="/" component={Guide}/>
                <Route path="/guide/:doc" component={Guide} />
                <Route path="/example/:example" component={Example} />
                <Route path="/api/charts/:component" component={API} />
            </Switch>
        </div>
    </Router>
), document.getElementById("root"));