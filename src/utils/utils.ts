import { IDeskproClient, useDeskproAppClient } from "@deskpro/app-sdk";
import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

export const timeSince = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

export function useQueryWithClient<TQueryFnData = unknown>(
  queryKey: QueryKey,
  queryFn: (client: IDeskproClient) => Promise<TQueryFnData>,
  option?: Omit<
    UseQueryOptions<TQueryFnData, unknown, TQueryFnData, QueryKey>,
    "queryKey" | "queryFn" | "initialData"
  >
): UseQueryResult<TQueryFnData> {
  const { client } = useDeskproAppClient();

  const key = Array.isArray(queryKey) ? queryKey : [queryKey];

  return useQuery(
    key,
    () => (client && queryFn(client)) as Promise<TQueryFnData>,
    option
  );
}
