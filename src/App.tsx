/* eslint-disable @typescript-eslint/ban-ts-comment */
//Added this because the DeskproContextProvider was erroring, had to update react version because generics crashed
import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./Components/ErrorFallback";
import { GlobalAuth } from "./pages/GlobalAuth";
import { FindOrCreateItems } from "./pages/FindOrCreateItems";
import { ItemDetails } from "./pages/ItemDetails";

function App() {
  return (
    <HashRouter>
      {/* 
// @ts-ignore */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route index path="/" element={<FindOrCreateItems />} />
          <Route path="/itemdetails" element={<ItemDetails />} />
          <Route path="/globalauth" element={<GlobalAuth />} />
          <Route path="itemmenu" element={<FindOrCreateItems />} />
        </Routes>
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;
