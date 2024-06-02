import { useMemo } from "react";
import {get, map, isEmpty, size} from "lodash";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import {getProjectList, getWorkItemListByTitle, getWorkItemsByIds} from "../../api/api";
import { QueryKey } from "../../utils";
import type { Maybe } from "../../types";
import type { IAzureProject, IAzureWorkItem } from "../../types/azure";

export type Result = {
  isLoading: boolean;
  isFetching: boolean;
  projects: IAzureProject[];
  workItems: IAzureWorkItem[];
};

type UseSearch = (projectId?: Maybe<IAzureProject["id"]>, q?: string) => Result;

const useSearch: UseSearch = (projectId, q) => {
  const { context } = useDeskproLatestAppContext();
  const settings = useMemo(() => get(context, ["settings"]), [context]);

  const projects = useQueryWithClient(
    [QueryKey.PROJECTS],
    (client) => getProjectList(client, settings || {}),
    { enabled: !isEmpty(settings) },
  );

  const workItemsBatch = useQueryWithClient(
    [QueryKey.WORK_ITEMS, projectId as IAzureProject["id"], q as string],
    (client) => getWorkItemListByTitle(client, settings || {}, q as string, projectId as IAzureProject["id"]),
    { enabled: !isEmpty(settings) && Boolean(projectId) && Boolean(q) },
  );

  const workItemIds = useMemo(() => {
    return map(get(workItemsBatch.data, ["workItems"]), "id");
  }, [workItemsBatch.data]);

  const workItems = useQueryWithClient(
    [QueryKey.WORK_ITEMS,
      projectId as IAzureProject["id"],
      ...(Array.isArray(workItemIds) ? workItemIds : []) as unknown as string,
    ],
    (client) =>
      getWorkItemsByIds(client,
        settings || {},
        projectId as IAzureProject["id"],
        workItemIds as Array<number>,
      ),
    { enabled: !isEmpty(settings) && size(workItemIds) > 0 }
  );

  return {
    isLoading: projects.isLoading,
    isFetching: [
      workItemsBatch.isLoading,
      workItems.isLoading,
      q,
      projectId,
    ].every(Boolean),
    projects: useMemo(() => projects.data?.value, [projects.data?.value]) as IAzureProject[],
    workItems: useMemo(() => get(workItems.data, ["value"]) || [] as IAzureWorkItem[], [workItems.data]),
  };
};

export { useSearch };
