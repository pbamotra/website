import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import "./styles/main.scss";

// Your top level component
import App from "./App";

// Export your top level component as JSX (for static rendering)
export default App;

// Render your app
if (typeof document !== "undefined") {
  const target = document.getElementById("root");

  if (target.hasChildNodes()) {
    ReactDOM.hydrate(<App />, target);
  } else {
    const element = (
      <AppContainer>
        <App />
      </AppContainer>
    );

    ReactDOM.render(element, target);

    if (process.env.NODE_ENV === "development") {
      // Hot Module Replacement
      if (module && module.hot) {
        module.hot.accept("./App", () => {
          ReactDOM.hydrate(element, target);
        });
      }
    }
  }
}
