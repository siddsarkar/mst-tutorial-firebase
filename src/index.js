import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

// project imports
import { getSnapshot } from "mobx-state-tree";
import App from "./components/App";
import "./index.css";
import { Group } from "./models/Group";

let initialState = { users: {} };
let group = (window.group = Group.create(initialState));
let root = ReactDOM.createRoot(document.getElementById("root"));

function renderApp() {
  root.render(
    <React.StrictMode>
      <App group={group} />
    </React.StrictMode>
  );
}

renderApp();

if (module.hot) {
  module.hot.accept(["./components/App"], () => {
    // new components
    renderApp();
  });

  module.hot.accept(["./models/Group"], () => {
    // new model definitions
    const snapshot = getSnapshot(group);
    group = window.group = Group.create(snapshot);
    renderApp();
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
