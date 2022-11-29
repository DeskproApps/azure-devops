import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";

import { Settings, RequestMethods } from "../types/";
import { IAzureAvatar } from "../types/azure/avatar";
import { IAzureArrayResponse } from "../types/azure/azure";
import { IAzureComment } from "../types/azure/comment";
import { IAzureIteration } from "../types/azure/iteration";
import { IAzureProcess } from "../types/azure/process";
import { IAzureProject } from "../types/azure/project";
import { IAzureState } from "../types/azure/state";
import { IAzureTeam } from "../types/azure/team";
import { IAzureUser } from "../types/azure/user";
import {
  IAzureWorkItem,
  IAzureWorkItemPost,
  IAzureWorkItemType,
} from "../types/azure/workItem";

const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;

const getAvatar = async (
  client: IDeskproClient,
  settings: Settings,
  userId: string
): Promise<IAzureAvatar> => {
  return defaultRequest(
    client,
    `/${settings.organization}/_apis/graph/Subjects/${userId}/avatars?size=small&api-version=7.0`,
    "GET"
  );
};

const getWorkItemListByIds = async (
  client: IDeskproClient,
  settings: Settings,
  data: number[]
) => {
  return defaultRequest(
    client,
    `/${settings.organization}/_apis/wit/workitemsbatch?api-version=7.0`,
    "POST",
    {
      ids: data,
    }
  );
};

// check type for this
const getWorkItemTypeStates = async (
  client: IDeskproClient,
  settings: Settings,
  processId: string,
  witRefName: string
) => {
  return defaultRequest(
    client,
    `/${settings.organization}/_apis/work/processdefinitions/${processId}/workItemTypes/${witRefName}/states?api-version=4.1-preview.1`,
    "GET"
  );
};

const getWorkItemById = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  id: number
): Promise<IAzureWorkItem> => {
  return defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/wit/workitems/${id}?api-version=7.0`,
    "GET"
  );
};

const getStateDefinitionList = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  workitemtype: string
): Promise<IAzureArrayResponse<IAzureState[]>> => {
  return defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/wit/workitemtypes/${workitemtype}/states?api-version=7.0`,
    "GET"
  );
};

const getProjectByName = async (
  client: IDeskproClient,
  settings: Settings,
  project: string
): Promise<IAzureProject> => {
  return defaultRequest(
    client,
    `/${settings.organization}/_apis/projects/${project}/properties?api-version=7.0-preview.1`,
    "GET"
  );
};

const getCommentsByItemId = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  workItemId: number
): Promise<IAzureComment> => {
  return defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/wit/workItems/${workItemId}/comments?api-version=7.0-preview.3`,
    "GET"
  );
};

const getWorkItemTypes = async (
  client: IDeskproClient,
  settings: Settings,
  processId: string
): Promise<IAzureArrayResponse<IAzureWorkItemType[]>> => {
  return defaultRequest(
    client,
    `/${settings.organization}/_apis/work/processdefinitions/${processId}/workitemtypes?api-version=4.1-preview.1`,
    "GET"
  );
};
// check type for this
const getWorkItemTypeCategories = async (
  client: IDeskproClient,
  settings: Settings,
  project: string
) => {
  return defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/wit/workitemtypecategories?api-version=7.0`,
    "GET"
  );
};

const getWorkItemListByWiql = async (
  client: IDeskproClient,
  settings: Settings,
  query: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  return await defaultRequest(
    client,
    `/${settings.organization}/_apis/wit/wiql?api-version=7.0`,
    "POST",
    {
      query,
    }
  );
};

const postWorkItem = (
  client: IDeskproClient,
  settings: Settings,
  data: IAzureWorkItemPost
): Promise<IAzureArrayResponse<IAzureWorkItem>> =>
  defaultRequest(
    client,
    `/${settings.organization}/${data["System.TeamProject"]}/_apis/wit/workitems/${data["System.WorkItemType"]}?api-version=7.0`,
    "POST",
    data
  );

const getTeamsList = (
  client: IDeskproClient,
  settings: Settings
): Promise<IAzureArrayResponse<IAzureTeam[]>> =>
  defaultRequest(
    client,
    `/${settings.organization}/_apis/teams?api-version=7.0-preview.3`,
    "GET"
  );

const getProcessList = (
  client: IDeskproClient,
  settings: Settings
): Promise<IAzureArrayResponse<IAzureProcess[]>> =>
  defaultRequest(
    client,
    `/${settings.organization}/_apis/process/processes?api-version=7.0`,
    "GET"
  );

const getUsersList = (
  client: IDeskproClient,
  settings: Settings
): Promise<IAzureArrayResponse<IAzureUser[]>> =>
  defaultRequest(
    client,
    `/${settings.organization}/_apis/graph/users?api-version=7.0-preview.1`,
    "GET"
  );

const getIterationList = (
  client: IDeskproClient,
  settings: Settings,
  project: string
): Promise<IAzureArrayResponse<IAzureIteration[]>> =>
  defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/work/teamsettings/iterations?api-version=7.0`,
    "GET"
  );

const getProjectList = (
  client: IDeskproClient,
  settings: Settings
): Promise<IAzureArrayResponse<IAzureProject[]>> =>
  defaultRequest(
    client,
    `/${settings.organization}/_apis/projects?api-version=7.0`,
    "GET"
  );

const defaultRequest = async (
  client: IDeskproClient,
  endpoint: string,
  method: RequestMethods,
  data?: unknown
) => {
  const fetch = await proxyFetch(client);

  const initialDomainName =
    endpoint.includes("/users") || endpoint.includes("/avatar") ? "vssps." : "";

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer __global_access_token.json("[access_token]")__`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response = await fetch(
    `https://${initialDomainName}dev.azure.com${endpoint}`,
    options
  );

  if ([400, 401, 203, 500, 403].includes(response.status)) {
    const refreshRequestOptions: RequestInit = {
      method: "POST",
      body: `client_assertion_type=${encodeURIComponent(
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
      )}&client_assertion=__client_secret__&grant_type=refresh_token&assertion=__global_access_token.json("[refresh_token]")__&redirect_uri=${encodeURIComponent(
        new URL(await client.getStaticOAuth2CallbackUrlValue()).toString()
      )}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const refreshRes = await fetch(
      "https://app.vssps.visualstudio.com/oauth2/token",
      refreshRequestOptions
    );
    const refreshData = await refreshRes.json();

    await client.setState<string>(
      "global_access_token",
      JSON.stringify(refreshData),
      {
        backend: true,
      }
    );

    response = await fetch(
      `https://${initialDomainName}dev.azure.com${endpoint}`,
      options
    );
  }

  if (isResponseError(response)) {
    throw new Error(
      `Request failed: [${response.status}] ${await response.text()}`
    );
  }

  return response.json();
};

export {
  defaultRequest,
  getAvatar,
  getStateDefinitionList,
  getWorkItemTypes,
  getCommentsByItemId,
  getWorkItemTypeStates,
  getWorkItemTypeCategories,
  getWorkItemListByWiql,
  postWorkItem,
  getTeamsList,
  getIterationList,
  getProjectList,
  getWorkItemById,
  getWorkItemListByIds,
  getUsersList,
  getProjectByName,
  getProcessList,
};
