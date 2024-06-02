import { QueryClient } from "@tanstack/react-query";
import { useQueryWithClient } from "@deskpro/app-sdk";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 2000,
    },
  },
});

const QueryKey = {
  LINKED_WORK_ITEMS: "linked_work_items",
  WORK_ITEMS: "work_items",
  PROJECTS: "projects",
  PROJECT: "project",
  WORK_ITEM_TYPES: "work_item_types",
  PROCESS: "process",
  STATE: "state",
  TEAM_VALUES: "team_values",
  ITERATIONS: "iterations",
  WORK_ITEM_TYPE_FIELDS: "workItemTypeFields",
  WORK_ITEM_FIELDS_META: "workItemFieldsMeta",
  USERS: "users",
};

export { queryClient, QueryKey, useQueryWithClient };
