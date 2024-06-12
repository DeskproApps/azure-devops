import { useMemo } from "react";
import { get, isEmpty } from "lodash";
import { useDeskproLatestAppContext, useQueryWithClient } from "@deskpro/app-sdk";
import { getCommentsByItemId } from "../../api/api";
import { useWorkItem } from "../../hooks";
import { QueryKey } from "../../utils";
import type { Maybe } from "../../types";
import type {
  IAzureProject,
  IAzureComment,
  IAzureWorkItem,
  IAzureWorkItemTypeFields,
  IAzureWorkItemFieldsData
} from "../../types/azure";

type UseWorkItemDetails = (
  projectId: Maybe<IAzureProject["id"]>,
  workItemId: Maybe<IAzureWorkItem["id"]>,
) => {
  isLoading: boolean;
  workItem: IAzureWorkItem;
  fields?: IAzureWorkItemTypeFields[];
  metas?: IAzureWorkItemFieldsData[];
  comments: IAzureComment["comments"];
};

const useWorkItemDetails: UseWorkItemDetails = (projectId, workItemId) => {
  const { context } = useDeskproLatestAppContext();
  const settings = useMemo(() => get(context, ["settings"]), [context]);

  const { isLoading, workItem, meta, fields } = useWorkItem(projectId, workItemId);

  const comments = useQueryWithClient(
    [QueryKey.COMMENTS, projectId as IAzureProject["id"], workItemId as IAzureWorkItem["id"]],
    (client) =>
      getCommentsByItemId(
        client,
        settings || {},
        projectId as IAzureProject["id"],
        workItemId as IAzureWorkItem["id"],
      ),
    { enabled: !isEmpty(settings) && Boolean(projectId) && Boolean(workItemId) },
  );

  return {
    isLoading: isLoading || comments.isLoading,
    metas: meta,
    fields,
    workItem,
    comments: get(comments.data, ["comments"], []),
  }
};

export { useWorkItemDetails };
