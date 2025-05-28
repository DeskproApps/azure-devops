import * as Sentry from '@sentry/react';
import './instrument';
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
import "virtual:windi.css";
import "flatpickr/dist/flatpickr.min.css";
import "./main.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "simplebar/dist/simplebar.min.css";
import { Scrollbar } from "@deskpro/deskpro-ui";

TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Scrollbar style={{ height: "100%", width: "100%" }}>
      <QueryClientProvider client={queryClient}>
        <DeskproAppProvider>
          <DeskproContextProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </DeskproContextProvider>
        </DeskproAppProvider>
      </QueryClientProvider>
    </Scrollbar>
  </React.StrictMode>,
);
