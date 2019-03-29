import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import {LineChart} from "./LineChart"

// Each logical "route" has two components, one for
// the sidebar and one for the main area. We want to
// render both of them in different places when the
// path matches the current URL.
const routes = [
  {
    path: "/",
    exact: true,
    main: () => <h2>Introduction</h2>
  },
  {
    path: "/linechart",
    main: LineChart
  },
  {
    path: "/areachart",
    main: () => <h2>AreaChart</h2>
  }
];

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div
          style={{
            padding: "10px",
            width: "300px",
            background: "#f0f0f0"
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link to="/">Introduction</Link>
            </li>
            <li>
              <Link to="/linechart">LineChart</Link>
            </li>
            <li>
              <Link to="/areachart">AreaChart</Link>
            </li>
          </ul>
        </div>

        <div style={{ flex: 1, padding: "10px" }}>
          {routes.map((route, index) => (
            // Render more <Route>s with the same paths as
            // above, but different components this time.
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;