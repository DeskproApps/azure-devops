import { Fragment } from "react";
import { size } from "lodash";
import { Checkbox } from "@deskpro/deskpro-ui";
import { LoadingSpinner, HorizontalDivider } from "@deskpro/app-sdk";
import { Card, NoFound } from "../../common";
import { WorkItemItem } from "../../WorkItemItem";
import type { FC } from "react";
import type { IAzureWorkItem } from "../../../types/azure";

type Props = {
  isLoading: boolean,
  selectedWorkItems: IAzureWorkItem[];
  workItems: IAzureWorkItem[];
  onChangeSelectedWorkItems: (workItem: IAzureWorkItem) => void,
};

const WorkItems: FC<Props> = ({
  workItems,
  isLoading,
  selectedWorkItems,
  onChangeSelectedWorkItems,
}) => {
  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <>
      {!Array.isArray(workItems)
        ? <NoFound/>
        : !size(workItems)
          ? <NoFound text="No work items found"/>
          : workItems.map((workItem) => {
            return (
              <Fragment key={workItem.id}>
                <Card>
                  <Card.Media>
                    <Checkbox
                      size={12}
                      containerStyle={{ marginTop: 4 }}
                      onChange={() => onChangeSelectedWorkItems(workItem)}
                      checked={selectedWorkItems.some((selectedWorkItem) => {
                        return workItem.id === selectedWorkItem.id;
                      })}
                    />
                  </Card.Media>
                  <Card.Body>
                    <WorkItemItem
                      workItem={workItem}
                      onClickTitle={() => onChangeSelectedWorkItems(workItem)}
                    />
                  </Card.Body>
                </Card>
                <HorizontalDivider style={{ marginBottom: 6 }} />
              </Fragment>
            )
          })
      }
    </>
  );
};

export { WorkItems };
