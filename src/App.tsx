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
import { Main } from "./pages/Main";
import { Redirect } from "./pages/Redirect";
import { EditItem } from "./pages/EditItem";
import { AddComment } from "./pages/AddComment";

function App() {
  return (
    <HashRouter>
      {/* 
      // @ts-ignore */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route index path="/" element={<Main />} />
          <Route path="/itemdetails" element={<ItemDetails />} />
          <Route path="/redirect" element={<Redirect />} />
          <Route path="/globalauth" element={<GlobalAuth />} />
          <Route path="itemmenu" element={<FindOrCreateItems />} />
          <Route path="edititem" element={<EditItem />} />
          <Route path="/addcomment" element={<AddComment />} />
        </Routes>
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;
