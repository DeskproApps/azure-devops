import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner, useDeskproAppEvents } from "@deskpro/app-sdk";
import { useSetTitle, useSetBadgeCount, useRegisterElements } from "../../hooks";
import { useLinkedWorkItems } from "./hooks";
import { Home } from "../../components";
import type { IAzureWorkItem, IAzureProject } from "../../types/azure";

const HomePage = () => {
  const navigate = useNavigate();
  const { workItems, isLoading } = useLinkedWorkItems();

  const onNavigateToWorkItem = useCallback((
    projectId: IAzureProject["id"],
    workItemId: IAzureWorkItem["id"],
  ) => {
    navigate(`/work-items/details?projectId=${projectId}&itemId=${workItemId}`);
  }, [navigate]);

  useSetTitle("Work Items");

  useSetBadgeCount(workItems);

  useRegisterElements(({ registerElement }) => {
    registerElement("azurePlusButton", { type: "plus_button" });
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azurePlusButton":
          navigate("/work-items/link");
          break;
        case "azureHomeButton":
          navigate("/home");
      }
    },
  });

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }
  return (
    <Home
      workItems={workItems}
      onNavigateToWorkItem={onNavigateToWorkItem}
    />
  );
};

export { HomePage };
