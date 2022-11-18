import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "virtual:windi.css";

import App from "./App";
import { DeskproContextProvider } from "./hooks/deskproContext";
import { queryClient } from "./query";

ReactDOM.render(
  <React.StrictMode>
    <DeskproContextProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<h1></h1>}>
          <App />
        </Suspense>
      </QueryClientProvider>
    </DeskproContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
