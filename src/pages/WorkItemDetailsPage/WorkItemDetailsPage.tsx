import { useMemo, useCallback } from "react";
import { get } from "lodash";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { deleteEntityService } from "../../services/deskpro";
import { useRegisterElements, useSetTitle } from "../../hooks";
import { useWorkItemDetails } from "./hooks";
import { WorkItemDetails } from "../../components";

const WorkItemDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const itemId = searchParams.get("itemId");
  const projectId = searchParams.get("projectId");
  const { isLoading, workItem, metas, fields, comments } = useWorkItemDetails(projectId, itemId);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  const onNavigateToAddComment = useCallback(() => {
    navigate(`/addcomment?itemId=${itemId}&projectId=${projectId}`);
  }, [navigate, projectId, itemId]);

  useSetTitle("Work Item Details");

  useRegisterElements(({ registerElement }) => {
    registerElement("azureHomeButton", {
      type: "home_button",
      payload: { type: "changePage", page: "/" },
    });
    registerElement("azureMenuButton", {
      type: "menu",
      items: [{ title: "Unlink Item" }],
    });
    registerElement("azureEditButton", { type: "edit_button" });
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azureMenuButton":
          if (client && ticketId && itemId) {
            deleteEntityService(client, ticketId, itemId)
              .then(() => navigate("/home"));
          }
          break;
        case "azureHomeButton":
          navigate("/home");
          break;
        case "azureEditButton":
          navigate(`/work-items/edit?itemId=${itemId}&projectId=${projectId}`);
          break;
      }
    },
  }, [client, ticketId, projectId, itemId]);

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <WorkItemDetails
      metas={metas}
      fields={fields}
      comments={comments}
      workItem={workItem}
      onNavigateToAddComment={onNavigateToAddComment}
    />
  )
};

export { WorkItemDetailsPage };
