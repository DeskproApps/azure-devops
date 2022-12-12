import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";

import { Settings, RequestMethods } from "../types/";
import { IAzureAvatar } from "../types/azure/avatar";
import { IAzureArrayResponse } from "../types/azure/azure";
import { IAzureComment } from "../types/azure/comment";
import { IAzureFieldValues } from "../types/azure/fieldValues";
import { IAzureIteration } from "../types/azure/iteration";
import { IAzureProcess } from "../types/azure/process";
import { IAzureProject } from "../types/azure/project";
import { IAzureState } from "../types/azure/state";
import { IAzureTeam } from "../types/azure/team";
import { IAzureUser } from "../types/azure/user";
import {
  IAzureWorkItem,
  IAzureWorkItemFieldsData,
  IAzureWorkItemType,
  IAzureWorkItemTypeFields,
  IAzureWorkItemWiql,
} from "../types/azure/workItem";

const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;

const getWorkItemFieldsData = async (
  client: IDeskproClient,
  settings: Settings,
  project: string
): Promise<IAzureArrayResponse<IAzureWorkItemFieldsData[]>> => {
  return defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/wit/fields?api-version=7.0`,
    "GET"
  );
};

const getProjectByName = async (
  client: IDeskproClient,
  settings: Settings,
  projectName: string
): Promise<IAzureProject> => {
  //not being used
  return defaultRequest(
    client,
    `/${settings.organization}/_apis/projects/${projectName}?api-version=7.0`,
    "GET"
  );
};

const getWorkItemFieldByName = async (
  client: IDeskproClient,
  settings: Settings,
  fieldName: string
): Promise<unknown> => {
  //not being used
  return defaultRequest(
    client,
    `/${settings.organization}/_apis/wit/fields/${fieldName}?api-version=7.0`,
    "GET"
  );
};

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
    `/${settings.organization}/_apis/work/processes/${processId}/workItemTypes/${witRefName}/states?api-version=7.0`,
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

const editWorkItem = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  workItemId: string,
  data: {
    op: string;
    path: string;
    value: string;
    from: string | null;
  }[]
) => {
  return defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/wit/workitems/${workItemId}?api-version=7.0`,
    "PATCH",
    data
  );
};

const postWorkItem = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  workItemType: string,
  data: {
    op: string;
    path: string;
    value: string;
    from: string | null;
  }[]
): Promise<IAzureWorkItem> => {
  return defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/wit/workitems/$${workItemType
      .split(".")
      .at(-1)}?api-version=7.0`,
    "POST",
    data
  );
};

const getTeamFieldValues = async (
  client: IDeskproClient,
  settings: Settings,
  project: string
): Promise<IAzureFieldValues> => {
  return defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/work/teamsettings/teamfieldvalues?api-version=7.0`,
    "GET"
  );
};

const getWorkItemTypeFields = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  workitemtype: string
): Promise<IAzureArrayResponse<IAzureWorkItemTypeFields[]>> => {
  return defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/wit/workitemtypes/${workitemtype}/fields?$expand=all&api-version=5.1`,
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

const getProjectPropertiesById = async (
  client: IDeskproClient,
  settings: Settings,
  project: string
): Promise<IAzureArrayResponse<{ name: string; value: string }[]>> => {
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
): Promise<IAzureWorkItemWiql> => {
  return await defaultRequest(
    client,
    `/${settings.organization}/_apis/wit/wiql?api-version=7.0`,
    "POST",
    {
      query,
    }
  );
};

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

const getProcessById = (
  client: IDeskproClient,
  settings: Settings,
  id: string
): Promise<IAzureProcess> =>
  defaultRequest(
    client,
    `/${settings.organization}/_apis/work/processes/${id}?api-version=7.0`,
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
      "Content-Type": endpoint.includes("/_apis/wit/workitems/")
        ? "application/json-patch+json"
        : "application/json",
      Authorization: `Bearer [[oauth/global/access_token]]`,
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
      "oauth/global/access_token",
      refreshData.access_token,
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
  getProjectPropertiesById,
  getProcessList,
  getTeamFieldValues,
  getWorkItemFieldsData,
  getProcessById,
  getWorkItemFieldByName,
  getWorkItemTypeFields,
  getProjectByName,
  editWorkItem,
};
