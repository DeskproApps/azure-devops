import { Routes, Route, useLocation } from "react-router-dom";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useDeskproElements } from "@deskpro/app-sdk";
import { ErrorFallback } from "./components/ErrorFallback";
import {
  AppId,
  PageType,
  AddComment,
  GlobalAuth,
  InstanceURL,
  ClientSecret,
  Organization,
  AccountNamePatToken,

  HomePage,
  LoadingAppPage,
  EditWorkItemPage,
  LinkWorkItemsPage,
  CreateWorkItemPage,
  WorkItemDetailsPage,
} from "./pages";
import { AppContainer } from "./components/common";
import { ErrorBoundary } from "@sentry/react";

const App = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("/admin/");

  useDeskproElements(({ registerElement }) => {
    registerElement("azureRefreshButton", { type: "refresh_button" });
  });

  return (
    <AppContainer isAdmin={isAdmin}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} fallback={ErrorFallback}>
              <Routes>
                <Route path="/admin">
                  <Route path="pagetype" element={<PageType />} />
                  <Route path="organization" element={<Organization />} />
                  <Route path="appid" element={<AppId />} />
                  <Route path="clientSecret" element={<ClientSecret />} />
                  <Route path="globalauth" element={<GlobalAuth />} />
                  <Route path="instanceurl" element={<InstanceURL />} />
                  <Route path="accountnamepattoken" element={<AccountNamePatToken />}/>
                </Route>

                <Route path="/addcomment" element={<AddComment />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/work-items/link" element={<LinkWorkItemsPage />} />
                <Route path="/work-items/create" element={<CreateWorkItemPage />} />
                <Route path="/work-items/edit" element={<EditWorkItemPage />} />
                <Route path="/work-items/details" element={<WorkItemDetailsPage />} />
                <Route index path="/" element={<LoadingAppPage />} />
              </Routes>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </AppContainer>
  );
}

export { App };
