import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container } from "../common";
import { Details, DynamicFields, Comments } from "./blocks";
import type { FC } from "react";
import type {
  IAzureComment,
  IAzureWorkItem,
  IAzureWorkItemFieldsData,
  IAzureWorkItemTypeFields,
} from "../../types/azure";

type Props = {
  workItem: IAzureWorkItem;
  fields?: IAzureWorkItemTypeFields[];
  metas?: IAzureWorkItemFieldsData[];
  comments: IAzureComment["comments"];
  onNavigateToAddComment: () => void;
};

const WorkItemDetails: FC<Props> = ({
  metas,
  fields,
  workItem,
  comments,
  onNavigateToAddComment,
}) => {
  return (
    <>
      <Container>
        <Details workItem={workItem}/>
        <DynamicFields workItem={workItem} metas={metas} fields={fields} />
      </Container>

      <HorizontalDivider/>

      <Container>
        <Comments
          comments={comments}
          onNavigateToAddComment={onNavigateToAddComment}
        />
      </Container>
    </>
  );
};

export { WorkItemDetails };
