import { useMemo, useState, useCallback } from "react";
import { get, size, cloneDeep } from "lodash";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import {
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityService } from "../../services/deskpro";
import { useSetTitle, useRegisterElements } from "../../hooks";
import { LinkWorkItems } from "../../components";
import { useSearch } from "./hooks";
import type { FC } from "react";
import type { IAzureWorkItem } from "../../types/azure";

const LinkWorkItemsPage: FC = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const [selectedProject, setSelectedProject] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedWorkItems, setSelectedWorkItems] = useState<IAzureWorkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { workItems, projects, isLoading, isFetching } = useSearch(selectedProject, searchQuery);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  const onNavigateToCreate = useCallback(() => navigate("/work-items/create"), [navigate]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onChangeSearchQuery = useDebouncedCallback(setSearchQuery, 700);

  const onChangeSelectedIssue = useCallback((workItem: IAzureWorkItem) => {
    let newSelectedIssues = cloneDeep(selectedWorkItems);

    if (selectedWorkItems.some((selectedWorkItem) => workItem.id === selectedWorkItem.id)) {
      newSelectedIssues = selectedWorkItems.filter((selectedWorkItem) => {
        return selectedWorkItem.id !== workItem.id;
      });
    } else {
      newSelectedIssues.push(workItem);
    }

    setSelectedWorkItems(newSelectedIssues);
  }, [selectedWorkItems]);

  useSetTitle("Find Items");

  useRegisterElements(({ registerElement }) => {
    registerElement("azureHomeButton", { type: "home_button" });
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azureHomeButton":
          navigate("/home");
      }
    },
  });

  const onLinkContact = useCallback(() => {
    if (!client || !ticketId || !size(selectedWorkItems)) {
      return;
    }

    setIsSubmitting(true);

    Promise.all([
      ...selectedWorkItems.map((workItem) => setEntityService(client, ticketId, workItem.id))
    ])
      .then(() => navigate("/home"))
      .finally(() => setIsSubmitting(false));
  }, [client, navigate, ticketId, selectedWorkItems]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <LinkWorkItems
      isSubmitting={isSubmitting}
      isFetching={isFetching}
      onChangeSearchQuery={onChangeSearchQuery}
      selectedWorkItems={selectedWorkItems}
      onLinkContact={onLinkContact}
      projects={projects}
      onCancel={onCancel}
      onChangeProject={setSelectedProject}
      onNavigateToCreate={onNavigateToCreate}
      workItems={workItems}
      onChangeSelectedWorkItem={onChangeSelectedIssue}
    />
  );
};

export { LinkWorkItemsPage };
