/* eslint-disable @typescript-eslint/ban-ts-comment */
//Added this because the DeskproContextProvider was erroring, had to update react version because generics crashed
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "flatpickr/dist/themes/light.css";

import { HashRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./Components/ErrorFallback";
import { FindOrCreateItems } from "./pages/FindOrCreateItems";
import { ItemDetails } from "./pages/ItemDetails";
import { Main } from "./pages/Main";
import { Redirect } from "./pages/Redirect";
import { EditItem } from "./pages/EditItem";
import { AddComment } from "./pages/AddComment";
import { QueryErrorResetBoundary } from "react-query";
import { Stack } from "@deskpro/app-sdk";
import { PageType } from "./pages/Admin/PageType";
import { GlobalAuth } from "./pages/Admin/GlobalAuth";
import { Organization } from "./pages/Admin/Organization";
import { AccountNamePatToken } from "./pages/Admin/AccountNamePatToken";
import { InstanceURL } from "./pages/Admin/InstanceURL";
import { AppId } from "./pages/Admin/AppId";
import { ClientSecret } from "./pages/Admin/ClientSecret";

function App() {
  return (
    <HashRouter>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <Stack>
            {/* @ts-ignore */}
            <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
              <Routes>
                <Route index path="/" element={<Main />} />
                <Route path="/itemdetails" element={<ItemDetails />} />
                <Route path="/redirect" element={<Redirect />} />
                <Route path="/admin">
                  <Route
                    path="accountnamepattoken"
                    element={<AccountNamePatToken />}
                  />
                  <Route path="appid" element={<AppId />} />
                  <Route path="clientSecret" element={<ClientSecret />} />
                  <Route path="instanceurl" element={<InstanceURL />} />
                  <Route path="globalauth" element={<GlobalAuth />} />
                  <Route path="pagetype" element={<PageType />} />
                  <Route path="organization" element={<Organization />} />
                </Route>
                <Route path="itemmenu" element={<FindOrCreateItems />} />
                <Route path="edititem" element={<EditItem />} />
                <Route path="/addcomment" element={<AddComment />} />
              </Routes>
            </ErrorBoundary>
          </Stack>
        )}
      </QueryErrorResetBoundary>
    </HashRouter>
  );
}

export default App;
