import { useMemo, useState, useCallback } from "react";
import { get, isEmpty } from "lodash";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { editWorkItem } from "../../api/api";
import { useSetTitle, useAsyncError, useWorkItem } from "../../hooks";
import { EditWorkItem } from "../../components";
import { getError, queryClient } from "../../utils";
import type { FC } from "react";
import type { Maybe } from "../../types";
import type { Props as FormProps } from "../../components/WorkItemForm";

const EditWorkItemPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const { asyncErrorHandler } = useAsyncError();
  const [error, setError] = useState<Maybe<string|string[]>>(null);
  const projectId = searchParams.get("projectId");
  const workItemId = searchParams.get("itemId");
  const { isLoading, workItem, meta, fields } = useWorkItem(projectId, workItemId);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);
  const settings = useMemo(() => get(context, ["settings"]), [context]);

  const onCancel = useCallback(() => {
    navigate(`/itemdetails?itemId=${workItemId}&projectId=${projectId}`);
  }, [navigate, workItemId, projectId]);

  const onSubmit: FormProps["onSubmit"] = useCallback((_, __, values) => {
    if (!client || !ticketId || !projectId || !workItemId || isEmpty(settings) || !workItemId) {
      return Promise.resolve();
    }

    setError(null);

    return editWorkItem(client, settings || {}, projectId, workItemId, values)
      .then(() => navigate(`/itemdetails?itemId=${workItemId}&projectId=${projectId}`))
      .then(() => queryClient.invalidateQueries())
      .catch((err) => {
        const error = getError(err);
        if (error) {
          setError(error);
        } else {
          asyncErrorHandler(err);
        }
      });
  }, [client, ticketId, settings, workItemId, projectId, navigate, asyncErrorHandler]);

  useSetTitle("Edit Work Item");

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("azureEditButton");
    client.deregisterElement("azureMenuButton");
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azureHomeButton":
          navigate(`/redirect`);
          break;
      }
    },
  });

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <EditWorkItem
      error={error}
      onSubmit={onSubmit}
      onCancel={onCancel}
      workItem={workItem}
      fields={fields}
      meta={meta}
    />
  );
};

export { EditWorkItemPage };
