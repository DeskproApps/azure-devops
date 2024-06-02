import { useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { useDeskproElements } from "@deskpro/app-sdk";
import { ErrorFallback } from "./components/ErrorFallback";
import {
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
  AccountNamePatToken,

  HomePage,
  LoadingAppPage,
  LinkWorkItemsPage,
  CreateWorkItemPage,
} from "./pages";
import { AppContainer } from "./components/common";

const App = () => {
  const { pathname } = useLocation();
  const isAdmin = useMemo(() => pathname.includes("/admin/"), [pathname]);

  useDeskproElements(({ registerElement }) => {
    registerElement("azureRefreshButton", { type: "refresh_button" });
  });

  return (
    <AppContainer isAdmin={isAdmin}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
              <Routes>
                <Route path="/admin">
                  <Route path="accountnamepattoken" element={<AccountNamePatToken />}/>
                  <Route path="appid" element={<AppId />} />
                  <Route path="clientSecret" element={<ClientSecret />} />
                  <Route path="instanceurl" element={<InstanceURL />} />
                  <Route path="globalauth" element={<GlobalAuth />} />
                  <Route path="pagetype" element={<PageType />} />
                  <Route path="organization" element={<Organization />} />
                </Route>
                <Route path="/itemdetails" element={<ItemDetails />} />
                <Route path="/redirect" element={<Redirect />} />
                <Route path="/edititem" element={<EditItem />} />
                <Route path="/addcomment" element={<AddComment />} />

                <Route path="/home" element={<HomePage />} />
                <Route path="/work-items/link" element={<LinkWorkItemsPage />} />
                <Route path="/work-items/create" element={<CreateWorkItemPage />} />
                <Route index path="/" element={<LoadingAppPage />} />
              </Routes>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </AppContainer>
  );
}

export { App };
