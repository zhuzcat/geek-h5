import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { unstable_HistoryRouter as Router } from "react-router-dom";
import App from "./App";
import store from "./store";
import "./main.scss";

import { customHistory } from "./utils/history";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <Router history={customHistory}>
      <App />
    </Router>
  </Provider>
);
