import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { HashRouter } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import { queryClient } from "./utils";
import { DeskproContextProvider } from "./hooks";
import { App } from "./App";
import "iframe-resizer/js/iframeResizer.contentWindow.js";
import "virtual:windi.css";
import "flatpickr/dist/flatpickr.min.css";
import "./main.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";

TimeAgo.addDefaultLocale(en);

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
