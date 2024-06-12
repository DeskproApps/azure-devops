import { useMemo } from "react";
import { get, map, find, isEmpty } from "lodash";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getOption, getOptions, QueryKey } from "../../utils";
import {
  getUsersList,
  getProjectList,
  getProcessById,
  getWorkItemTypes,
  getIterationList,
  getTeamFieldValues,
  getWorkItemFieldsData,
  getWorkItemTypeFields,
  getProjectPropertiesById,
} from "../../api/api";
import {
  getAreaOptions,
  getUserOptions,
  getIterationOptions,
} from "./utils";
import type { Option } from "../../types";
import type {
  IAzureUser,
  IAzureState,
  IAzureProject,
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

const useFormDeps: UseFormDeps = (rawProject, workItemTypeId) => {
  const { context } = useDeskproLatestAppContext();
  const settings = useMemo(() => get(context, ["settings"]), [context]);

  const projects = useQueryWithClient(
    [QueryKey.PROJECTS],
    (client) => getProjectList(client, settings || {}),
    { enabled: !isEmpty(settings) },
  );

  const projectId = useMemo(() => {
    const foundProject = find(get(projects.data, ["value"], []), ({ id, name }) => {
      return id === rawProject || name === rawProject;
    });
    return get(foundProject, ["id"]);
  }, [rawProject, projects.data]);

  const project = useQueryWithClient(
    [QueryKey.PROJECT, projectId as IAzureProject["id"]],
    (client) => getProjectPropertiesById(client, settings || {}, projectId as IAzureProject["id"]),
    { enabled: !isEmpty(settings) && Boolean(projectId) },
  );

  const processId = useMemo(() => {
    const process = find(project.data?.value, { name: "System.ProcessTemplateType" });
    return get(process, ["value"]);
  }, [project.data?.value]);

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

  const states = useMemo(() => {
    const stateField = find(get(workItemTypeFields.data, ["value"]), { referenceName: "System.State" });
    return get(stateField, ["allowedValues"], []);
  }, [workItemTypeFields.data]);

  const workItemFieldsMeta = useQueryWithClient(
    [QueryKey.WORK_ITEM_FIELDS_META, projectId as IAzureProject["id"]],
    (client) => getWorkItemFieldsData(client, settings || {}, projectId as IAzureProject["id"]),
    { enabled: !isEmpty(settings) && Boolean(projectId) },
  );

  return {
    isLoading: [
      teams,
      project,
      process,
      projects,
      iterations,
      workItemTypes,
      workItemTypeFields,
      workItemFieldsMeta,
    ].some(({ isLoading }) => isLoading),
    isCloud: useMemo(() => get(settings, ["type"]) === "cloud", [settings]),
    projectOptions: useMemo(() => getOptions(projects.data?.value, "name", "name"), [projects.data?.value]),
    workItemTypeOptions: useMemo(() => getOptions(workItemTypes.data?.value, "name", "name"), [workItemTypes.data?.value]),
    userOptions: useMemo(() => getUserOptions(users.data?.value), [users.data?.value]),
    stateOptions: useMemo(() => map(states, (state) => getOption(state, state)), [states]),
    areaOptions: useMemo(() => getAreaOptions(teams.data?.values), [teams.data?.values]),
    iterationOptions: useMemo(() => getIterationOptions(iterations.data?.value), [iterations.data?.value]),
    workItemTypeFields: get(workItemTypeFields, ["data", "value"]) || [],
    workItemFieldsMeta: get(workItemFieldsMeta, ["data", "value"]) || [],
  };
};

export { useFormDeps };
