import * as React from "react";
import { App } from "./site/App";
import { render } from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "./index.css";

const renderApp = (app: JSX.Element) => {
  render(app, document.getElementById("root") as HTMLElement);
};

renderApp(<App />);