import { useMemo, useCallback } from "react";
import { get } from "lodash";
import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { AZURE_URL } from "../constants";
import type { Maybe } from "../types";
import type { IAzureWorkItem } from "../types/azure/workItem";

export type Result = {
  getItemWorkLink: (item?: IAzureWorkItem) => Maybe<string>,
};

type UseExternalLinks = () => Result;

const useExternalLinks: UseExternalLinks = () => {
  const { context } = useDeskproLatestAppContext();
  const instance_url = useMemo(() => get(context, ["settings", "instance_url"]), [context]);
  const org = useMemo(() => get(context, ["settings", "organization_collection"]), [context]);
  const type = useMemo(() => get(context, ["settings", "type"]), [context]);

  const itemWorkLink = useCallback((item?: IAzureWorkItem) => {
    const itemId = item?.id;
    const project = get(item, ["fields", "System.TeamProject"]);

    if (!org || !type || !itemId || !project) {
      return null;
    }

    return `${type === "cloud" ? AZURE_URL : instance_url}/${org}/${project}/_workitems/edit/${itemId}/`;
  }, [instance_url, org, type]);

  return {
    getItemWorkLink: itemWorkLink,
  };
};

export { useExternalLinks };
