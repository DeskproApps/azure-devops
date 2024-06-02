import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container, Navigation } from "../common";
import { Buttons, Filters, WorkItems } from "./blocks";
import type { FC } from "react";
import type { IAzureProject, IAzureWorkItem } from "../../types/azure";

type Props = {
  onNavigateToCreate: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
  selectedWorkItems: IAzureWorkItem[];
  onLinkContact: () => void;
  isFetching: boolean,
  projects: IAzureProject[],
  onChangeSearchQuery: (search: string) => void,
  onChangeProject: (projectId: IAzureProject["id"]) => void,
  workItems: IAzureWorkItem[];
  onChangeSelectedWorkItem: (workItems: IAzureWorkItem) => void,
};

const LinkWorkItems: FC<Props> = ({
  onCancel,
  projects,
  workItems,
  isFetching,
  isSubmitting,
  onLinkContact,
  onChangeProject,
  selectedWorkItems,
  onNavigateToCreate,
  onChangeSearchQuery,
  onChangeSelectedWorkItem,
}) => {
  return (
    <>
      <Container>
        <Navigation onNavigateToCreate={onNavigateToCreate}/>
        <Filters
          isLoading={isFetching}
          onChangeProject={onChangeProject}
          onChangeSearchQuery={onChangeSearchQuery}
          projects={projects}
        />
        <Buttons
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          selectedWorkItems={selectedWorkItems}
          onLinkContact={onLinkContact}
        />
      </Container>

      <HorizontalDivider/>

      <Container>
        <WorkItems
          workItems={workItems}
          isLoading={isFetching}
          selectedWorkItems={selectedWorkItems}
          onChangeSelectedWorkItems={onChangeSelectedWorkItem}
        />
      </Container>
    </>
  );
};

export { LinkWorkItems };
