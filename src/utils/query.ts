import { IDeskproClient, useDeskproAppClient } from "@deskpro/app-sdk";
import {
  QueryClient,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
    },
  },
});

export function useQueryWithClient<TQueryFnData = unknown>(
  queryKey: string | readonly unknown[],
  queryFn: (client: IDeskproClient) => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<
      TQueryFnData,
      unknown,
      TQueryFnData,
      string | readonly unknown[]
    >,
    "queryKey" | "queryFn"
  >
): UseQueryResult<TQueryFnData> {
  const { client } = useDeskproAppClient();

  const key = Array.isArray(queryKey) ? queryKey : [queryKey];

  return useQuery(
    key,
    () => (client && queryFn(client)) as Promise<TQueryFnData>,
    {
      ...(options ?? {}),
      enabled: options?.enabled ? !!client : !!client && options?.enabled,
      suspense: false,
    } as Omit<
      UseQueryOptions<
        TQueryFnData,
        unknown,
        TQueryFnData,
        string | readonly unknown[]
      >,
      "queryKey" | "queryFn"
    >
  );
}
