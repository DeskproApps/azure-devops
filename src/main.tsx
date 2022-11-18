import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "virtual:windi.css";
import { DeskproContextProvider } from "./hooks/deskproContext";

ReactDOM.render(
  <React.StrictMode>
    <DeskproContextProvider>
      <App />
    </DeskproContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
