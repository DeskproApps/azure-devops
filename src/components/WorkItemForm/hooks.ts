import { useMemo } from "react";
import { get, find, isEmpty } from "lodash";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getOptions, QueryKey } from "../../utils";
import {
  getUsersList,
  getProjectList,
  getProcessById,
  getWorkItemTypes,
  getIterationList,
  getTeamFieldValues,
  getWorkItemFieldsData,
  getWorkItemTypeStates,
  getWorkItemTypeFields,
  getProjectPropertiesById,
} from "../../api/api";
import {
  getAreaOptions,
  getUserOptions,
  getStateOptions,
  getIterationOptions,
} from "./utils";
import type { Option } from "../../types";
import type {
  IAzureUser,
  IAzureState,
  IAzureProject,
  IAzureProcess,
  IAzureWorkItem,
  IAzureIteration,
  IAzureFieldValues,
  IAzureWorkItemType,
  IAzureWorkItemTypeFields,
  IAzureWorkItemFieldsData,
} from "../../types/azure";

export type UseFormDeps = (
  projectId?: IAzureProject["id"],
  workItemTypeId?: IAzureWorkItem["id"],
) => {
  isCloud: boolean;
  isLoading: boolean;
  projectOptions: Array<Option<IAzureProject["id"]>>;
  workItemTypeOptions: Array<Option<IAzureWorkItem["id"]>>;
  userOptions: Array<Option<IAzureUser["descriptor"]>>;
  stateOptions: Array<Option<IAzureState["id"]>>;
  areaOptions: Array<Option<IAzureFieldValues["values"][number]["value"]>>;
  iterationOptions: Array<Option<IAzureIteration["id"]>>;
  workItemTypeFields: IAzureWorkItemTypeFields[];
  workItemFieldsMeta: IAzureWorkItemFieldsData[];
};

const useFormDeps: UseFormDeps = (projectId, workItemTypeId) => {
  const { context } = useDeskproLatestAppContext();
  const settings = useMemo(() => get(context, ["settings"]), [context]);

  const projects = useQueryWithClient(
    [QueryKey.PROJECTS],
    (client) => getProjectList(client, settings || {}),
    { enabled: !isEmpty(settings) },
  );

  const project = useQueryWithClient(
    [QueryKey.PROJECT, projectId as IAzureProject["id"]],
    (client) => getProjectPropertiesById(client, settings || {}, projectId as IAzureProject["id"]),
    { enabled: !isEmpty(settings) && Boolean(projectId) },
  );

  const processId = useMemo(() => get(
    find(project.data?.value, { name: "System.ProcessTemplateType" }),
    ["value"],
  ), [project.data?.value]);

  const process = useQueryWithClient(
    [QueryKey.PROCESS, `${processId}`],
    (client) => getProcessById(client, settings || {}, processId as string),
    { enabled: !isEmpty(settings) && Boolean(processId) },
  );
  const typeId = useMemo(() => process.data?.typeId, [process.data?.typeId]);

  const workItemTypes = useQueryWithClient(
    [QueryKey.WORK_ITEM_TYPES, `${typeId}`],
    (client) => getWorkItemTypes(client, settings || {}, typeId as string),
    { enabled: !isEmpty(settings) && Boolean(typeId) }
  );

  const users = useQueryWithClient(
    [QueryKey.USERS],
    (client) => getUsersList(client, settings || {}),
    { enabled: !isEmpty(settings) && get(settings, ["type"]) === "cloud" },
  );

  const states = useQueryWithClient(
    [QueryKey.STATE, `${processId}`, `${workItemTypeId}`],
    (client) => getWorkItemTypeStates(
      client,
      settings || {},
      processId as IAzureProcess["id"],
      workItemTypeId as IAzureWorkItemType["id"],
    ),
    { enabled: !isEmpty(settings) && Boolean(processId) && Boolean(workItemTypeId) },
  );

  const teams = useQueryWithClient(
    [QueryKey.TEAM_VALUES, projectId as IAzureProject["id"]],
    (client) => getTeamFieldValues(client, settings || {}, projectId as IAzureProject["id"]),
    { enabled: !isEmpty(settings) && Boolean(projectId) }
  );

  const iterations = useQueryWithClient(
    [QueryKey.ITERATIONS, projectId as IAzureProject["id"]],
    (client) => getIterationList(client, settings || {}, projectId as IAzureProject["id"]),
    { enabled: !isEmpty(settings) && Boolean(projectId) },
  );

  const workItemTypeFields = useQueryWithClient(
    [QueryKey.WORK_ITEM_TYPE_FIELDS, projectId as IAzureProject["id"], workItemTypeId as IAzureWorkItemType["id"]],
    (client) => getWorkItemTypeFields(
      client,
      settings || {},
      projectId as IAzureProject["id"],
      workItemTypeId as IAzureWorkItemType["id"],
    ),
    { enabled: !isEmpty(settings) && Boolean(projectId) && Boolean(workItemTypeId) },
  );

  const workItemFieldsMeta = useQueryWithClient(
    [QueryKey.WORK_ITEM_FIELDS_META, projectId as IAzureProject["id"]],
    (client) => getWorkItemFieldsData(client, settings || {}, projectId as IAzureProject["id"]),
    { enabled: !isEmpty(settings) && Boolean(projectId) },
  );

  return {
    isLoading: [
      teams,
      states,
      project,
      process,
      projects,
      iterations,
      workItemTypes,
      workItemTypeFields,
      workItemFieldsMeta,
    ].some(({ isLoading }) => isLoading),
    isCloud: useMemo(() => get(settings, ["type"]) === "cloud", [settings]),
    projectOptions: useMemo(() => getOptions(projects.data?.value), [projects.data?.value]),
    workItemTypeOptions: useMemo(() => getOptions(workItemTypes.data?.value), [workItemTypes.data?.value]),
    userOptions: useMemo(() => getUserOptions(users.data?.value), [users.data?.value]),
    stateOptions: useMemo(() => getStateOptions(states.data?.value), [states.data?.value]),
    areaOptions: useMemo(() => getAreaOptions(teams.data?.values), [teams.data?.values]),
    iterationOptions: useMemo(() => getIterationOptions(iterations.data?.value), [iterations.data?.value]),
    workItemTypeFields: get(workItemTypeFields, ["data", "value"]) || [],
    workItemFieldsMeta: get(workItemFieldsMeta, ["data", "value"]) || [],
  };
};

export { useFormDeps };
