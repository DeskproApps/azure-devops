import { useMemo, useState, useCallback } from "react";
import { get, isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import {useDeskproAppClient, useDeskproAppEvents, useDeskproLatestAppContext} from "@deskpro/app-sdk";
import { setEntityService } from "../../services/deskpro";
import { postWorkItem } from "../../api/api";
import {
  useSetTitle,
  useAsyncError,
  useRegisterElements,
} from "../../hooks";
import { getError } from "../../utils";
import { CreateWorkItem } from "../../components";
import type { FC } from "react";
import type { Maybe } from "../../types";
import type { Props as FormProps } from "../../components/WorkItemForm";

const CreateWorkItemPage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const { asyncErrorHandler } = useAsyncError();
  const [error, setError] = useState<Maybe<string|string[]>>(null);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);
  const settings = useMemo(() => get(context, ["settings"]), [context]);

  const onNavigateToLink = useCallback(() => navigate("/work-items/link"), [navigate]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onSubmit: FormProps["onSubmit"] = useCallback((projectId, workItemType, values) => {
    if (!client || !ticketId || !projectId || !workItemType || isEmpty(settings) || isEmpty(values)) {
      return Promise.resolve();
    }

    setError(null);

    return postWorkItem(client, settings, projectId, workItemType, values)
      .then((workItem) => setEntityService(client, ticketId, workItem.id))
      .then(() => navigate("/home"))
      .catch((err) => {
        const error = getError(err);
        if (error) {
          setError(error);
        } else {
          asyncErrorHandler(err);
        }
      });
  }, [client, ticketId, settings, navigate, asyncErrorHandler]);

  useSetTitle("Find Items");

  useRegisterElements(({ registerElement }) => {
    registerElement("azureHomeButton", { type: "home_button" });
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azureHomeButton": navigate("/home");
      }
    },
  });

  return (
    <CreateWorkItem
      error={error}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onNavigateToLink={onNavigateToLink}
    />
  );
};

export { CreateWorkItemPage };
