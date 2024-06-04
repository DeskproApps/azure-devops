import { DeskproAppProvider } from "@deskpro/app-sdk";
import React from "react";
import ReactDOM from "react-dom";
import { QueryClientProvider } from "react-query";
import "virtual:windi.css";
import "./main.css";

import App from "./App";
import { DeskproContextProvider } from "./hooks/deskproContext";
import { queryClient } from "./utils/query";

ReactDOM.render(
  <React.StrictMode>
    <DeskproContextProvider>
      <QueryClientProvider client={queryClient}>
        <DeskproAppProvider>
          <App />
        </DeskproAppProvider>
      </QueryClientProvider>
    </DeskproContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
