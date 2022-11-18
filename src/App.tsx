import { DeskproAppProvider } from "@deskpro/app-sdk";
import "./App.css";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./Components/ErrorFallback";
import { Main } from "./pages/Main";

function App() {
  return (
    <DeskproAppProvider>
      <HashRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route index path="/" element={<Main />} />
          </Routes>
        </ErrorBoundary>
      </HashRouter>
    </DeskproAppProvider>
  );
}

export default App;
