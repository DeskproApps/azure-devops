import { useMemo, useState } from "react";
import { get, size } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { checkAuth } from "../../api/api";
import { AUTH_ERROR } from "../../constants";
import type { Maybe } from "../../types";

type UseLoadingApp = () => {
  error: Maybe<string>;
};

const useLoadingApp: UseLoadingApp = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const [error, setError] = useState<Maybe<string>>(null);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);
  const settings = useMemo(() => get(context, ["settings"]), [context]);

  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    }

    setError(null);

    checkAuth(client, settings)
      .then(() => client.getEntityAssociation("linkedAzureItems", ticketId).list())
      .then((entityIds) => navigate(size(entityIds) ? "/home" : "/work-items/link"))
      .catch(() => setError(AUTH_ERROR));
  }, [navigate, ticketId, settings]);

  return { error };
};

export { useLoadingApp };
