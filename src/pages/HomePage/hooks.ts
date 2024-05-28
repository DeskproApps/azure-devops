import { useMemo } from "react";
import { get, isEmpty } from "lodash";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getEntityListService } from "../../services/deskpro";
import { getWorkItemListByIds } from "../../api/api";
import { QueryKey } from "../../utils/query";
import type { IAzureWorkItem } from "../../types/azure/workItem";

type UseLinkedWorkItems = () => {
  isLoading: boolean;
  workItems: IAzureWorkItem[];
};

const useLinkedWorkItems: UseLinkedWorkItems = () => {
  const { context } = useDeskproLatestAppContext();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);
  const settings = useMemo(() => get(context, ["settings"]), [context]);

  const linkedIds = useQueryWithClient(
    [QueryKey.LINKED_WORK_ITEMS, ticketId],
    (client) => getEntityListService(client, ticketId),
    { enabled: Boolean(ticketId) },
  );

  const workItemIds = useMemo(() => {
    return Array.isArray(linkedIds.data) ? linkedIds.data : [];
  }, [linkedIds.data]);

  const workItems = useQueryWithClient(
    [QueryKey.WORK_ITEMS, ...workItemIds],
    (client) => getWorkItemListByIds(client, settings || {}, workItemIds as never[]),
    { enabled: !isEmpty(workItemIds) }
  );

  return {
    isLoading: [linkedIds, workItems].some(({ isLoading }) => isLoading),
    workItems: get(workItems, ["data", "value"]) || [],
  };
};

export { useLinkedWorkItems };
