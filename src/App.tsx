import { useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallback";
import {
  Main,
  AppId,
  Redirect,
  PageType,
  EditItem,
  AddComment,
  GlobalAuth,
  InstanceURL,
  ItemDetails,
  ClientSecret,
  Organization,
  FindOrCreateItems,
  AccountNamePatToken,
} from "./pages";
import { AppContainer } from "./components/common";

const App = () => {
  const { pathname } = useLocation();
  const isAdmin = useMemo(() => pathname.includes("/admin/"), [pathname]);

  return (
    <AppContainer isAdmin={isAdmin}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
              <Routes>
                <Route index path="/" element={<Main />} />
                <Route path="/itemdetails" element={<ItemDetails />} />
                <Route path="/redirect" element={<Redirect />} />
                <Route path="/admin">
                  <Route path="accountnamepattoken" element={<AccountNamePatToken />}/>
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
        )}
      </QueryErrorResetBoundary>
    </AppContainer>
  );
}

export { App };
