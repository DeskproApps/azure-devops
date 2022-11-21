import { DeskproAppProvider, Spinner } from "@deskpro/app-sdk";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { QueryClientProvider } from "react-query";
import "virtual:windi.css";

import App from "./App";
import { DeskproContextProvider } from "./hooks/deskproContext";
import { queryClient } from "./utils/query";

ReactDOM.render(
  <React.StrictMode>
    <DeskproContextProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Spinner></Spinner>}>
          <DeskproAppProvider>
            <App />
          </DeskproAppProvider>
        </Suspense>
      </QueryClientProvider>
    </DeskproContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
