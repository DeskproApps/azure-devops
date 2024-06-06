import { Fragment } from "react";
import { size } from "lodash";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container, NoFound } from "../common";
import { WorkItemItem } from "../WorkItemItem";
import type { FC } from "react";
import type {IAzureProject, IAzureWorkItem} from "../../types/azure";

type Props = {
  workItems: IAzureWorkItem[];
  onNavigateToWorkItem: (
    projectId: IAzureProject["id"],
    workItemId: IAzureWorkItem["id"],
  ) => void;
};

const Home: FC<Props> = ({ workItems, onNavigateToWorkItem }) => {
  return (
    <Container>
      {(!Array.isArray(workItems) || !size(workItems))
        ? <NoFound text="No work items found"/>
        : workItems.map((workItem) => (
          <Fragment key={workItem.id}>
            <WorkItemItem
              workItem={workItem}
              onClickTitle={() => onNavigateToWorkItem(workItem.fields["System.TeamProject"], workItem.id)}
            />
            <HorizontalDivider style={{ marginBottom: 6 }} />
          </Fragment>
        ))
      }
    </Container>
  );
};

export { Home };
