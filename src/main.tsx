import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "react-query";
import { HashRouter } from "react-router-dom";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import { queryClient } from "./utils/query";
import { DeskproContextProvider } from "./hooks/deskproContext";
import { App } from "./App";

import "iframe-resizer/js/iframeResizer.contentWindow.js";
import "virtual:windi.css";
import "./main.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DeskproAppProvider>
        <DeskproContextProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </DeskproContextProvider>
      </DeskproAppProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
