import { useMemo } from "react";
import { get, isEmpty } from "lodash";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getWorkItemById, getWorkItemFieldsData, getWorkItemTypeFields } from "../api/api";
import { QueryKey } from "../utils";
import type { Maybe } from "../types";
import type {
  IAzureWorkItem,
  IAzureProject,
  IAzureWorkItemType,
  IAzureWorkItemTypeFields,
  IAzureWorkItemFieldsData
} from "../types/azure";

type UseWorkItem = (
  projectId: Maybe<IAzureProject["id"]>,
  workItemId: Maybe<IAzureWorkItem["id"]>,
) => {
  isLoading: boolean;
  workItem: IAzureWorkItem;
  fields?: IAzureWorkItemTypeFields[];
  meta?: IAzureWorkItemFieldsData[];
};

const useWorkItem: UseWorkItem = (projectId, workItemId) => {
  const { context } = useDeskproLatestAppContext();
  const settings = useMemo(() => get(context, ["settings"]), [context]);

  const workItem = useQueryWithClient(
    [QueryKey.WORK_ITEMS, projectId as IAzureProject["id"], workItemId as IAzureWorkItem["id"]],
    (client) => getWorkItemById(
      client,
      settings || {},
      projectId as IAzureProject["id"],
      workItemId as IAzureWorkItem["id"],
    ),
    { enabled: !isEmpty(settings) && Boolean(projectId) && Boolean(workItemId) },
  );

  const workItemTypeFields = useQueryWithClient(
    [QueryKey.WORK_ITEM_TYPE_FIELDS, projectId as IAzureProject["id"], workItem.data?.fields["System.WorkItemType"] as IAzureWorkItemType["id"]],
    (client) => getWorkItemTypeFields(
      client,
      settings || {},
      projectId as IAzureProject["id"],
      workItem.data?.fields["System.WorkItemType"] as IAzureWorkItemType["id"],
    ),
    { enabled: !isEmpty(settings) && Boolean(projectId) && Boolean(workItem.data?.fields["System.WorkItemType"]) },
  );

  const workItemFieldsMeta = useQueryWithClient(
    [QueryKey.WORK_ITEM_FIELDS_META, projectId as IAzureProject["id"]],
    (client) => getWorkItemFieldsData(client, settings || {}, projectId as IAzureProject["id"]),
    { enabled: !isEmpty(settings) && Boolean(projectId) },
  );

  return {
    isLoading: [workItem, workItemTypeFields, workItemFieldsMeta].some(({ isLoading }) => isLoading),
    workItem: workItem.data as IAzureWorkItem,
    fields: workItemTypeFields.data?.value,
    meta: workItemFieldsMeta.data?.value,
  };
};

export { useWorkItem };
