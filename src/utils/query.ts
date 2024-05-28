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
};

export { queryClient, QueryKey, useQueryWithClient };
