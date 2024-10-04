import { IDeskproClient, V2ProxyRequestInit, proxyFetch } from "@deskpro/app-sdk";
import type { Settings, RequestMethods } from "../types/";
import type {
  IAzureAvatar,
  IAzureArrayResponse,
  IAzureComment,
  IAzureFieldValues,
  IAzureIteration,
  IAzureProcess,
  IAzureProject,
  IAzureState,
  IAzureTeam,
  IAzureUser,
  IAzureWorkItem,
  IAzureWorkItemFieldsData,
  IAzureWorkItemType,
  IAzureWorkItemTypeFields,
  IAzureWorkItemWiql,
  IAzureWorkItemInput,
} from "../types/azure";

const getWorkItemFieldsData = async (
  client: IDeskproClient,
  settings: Settings,
  project: string
): Promise<IAzureArrayResponse<IAzureWorkItemFieldsData[]>> => {
  return defaultRequest(
    client,
    `/${project}/_apis/wit/fields?api-version=7.0`,
    "GET",
    settings
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
    `/_apis/projects/${projectName}?api-version=7.0`,
    "GET",
    settings
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
    `/_apis/wit/fields/${fieldName}?api-version=7.0`,
    "GET",
    settings
  );
};

const getAvatar = async (
  client: IDeskproClient,
  settings: Settings,
  userId: string
): Promise<IAzureAvatar> => {
  return defaultRequest(
    client,
    `/_apis/graph/Subjects/${userId}/avatars?size=small&api-version=7.0`,
    "GET",
    settings
  );
};

const getWorkItemListByIds = async (
  client: IDeskproClient,
  settings: Settings,
  data: number[]
) => {
  return defaultRequest(
    client,
    `/_apis/wit/workitemsbatch?api-version=7.0`,
    "POST",
    settings,
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
): Promise<IAzureArrayResponse<IAzureState[]>> => {
  return defaultRequest(
    client,
    `/_apis/work/processes/${processId}/workItemTypes/${witRefName}/states?api-version=7.0`,
    "GET",
    settings
  );
};

const getWorkItemById = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  id: string,
): Promise<IAzureWorkItem> => {
  return defaultRequest(
    client,
    `/${project}/_apis/wit/workitems/${id}?api-version=7.0`,
    "GET",
    settings
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
    `/${project}/_apis/wit/workitems/${workItemId}?api-version=7.0`,
    "PATCH",
    settings,
    data
  );
};

const postComment = async (
  client: IDeskproClient,
  settings: Settings,
  projectId: string,
  workItemId: string,
  content: string
) => {
  return defaultRequest(
    client,
    `/${projectId}/_apis/wit/workItems/${workItemId}/comments?api-version=7.0-preview.3`,
    "POST",
    settings,
    { text: content }
  );
};

const postWorkItem = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  workItemType: string,
  data: IAzureWorkItemInput[],
): Promise<IAzureWorkItem> => {
  const url = `/${project}/_apis/wit/workitems/$${
    workItemType.split(".").at(-1)
  }?api-version=7.0`;

  return defaultRequest(client, url, "POST", settings, data);
};

const getTeamFieldValues = async (
  client: IDeskproClient,
  settings: Settings,
  project: string
): Promise<IAzureFieldValues> => {
  return defaultRequest(
    client,
    `/${project}/_apis/work/teamsettings/teamfieldvalues?api-version=7.0`,
    "GET",
    settings
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
    `/${project}/_apis/wit/workitemtypes/${workitemtype}/fields?$expand=all&api-version=5.1`,
    "GET",
    settings
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
    `/${project}/_apis/wit/workitemtypes/${workitemtype}/states?api-version=7.0`,
    "GET",
    settings
  );
};

const getProjectPropertiesById = async (
  client: IDeskproClient,
  settings: Settings,
  project: string
): Promise<IAzureArrayResponse<{ name: string; value: string }[]>> => {
  return defaultRequest(
    client,
    `/_apis/projects/${project}/properties?api-version=7.0-preview.1`,
    "GET",
    settings
  );
};

const getCommentsByItemId = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  workItemId: string,
): Promise<IAzureComment> => {
  return defaultRequest(
    client,
    `/${project}/_apis/wit/workItems/${workItemId}/comments?api-version=7.0-preview.3`,
    "GET",
    settings
  );
};

const getWorkItemTypes = async (
  client: IDeskproClient,
  settings: Settings,
  processId: string
): Promise<IAzureArrayResponse<IAzureWorkItemType[]>> => {
  return defaultRequest(
    client,
    `/_apis/work/processdefinitions/${processId}/workitemtypes?api-version=4.1-preview.1`,
    "GET",
    settings
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
    `/${project}/_apis/wit/workitemtypecategories?api-version=7.0`,
    "GET",
    settings
  );
};

const getWorkItemListByWiql = async (
  client: IDeskproClient,
  settings: Settings,
  query: string
): Promise<IAzureWorkItemWiql> => {
  return await defaultRequest(
    client,
    `/_apis/wit/wiql?api-version=7.0`,
    "POST",
    settings,
    {
      query,
    }
  );
};

const getWorkItemListByTitle = async (
  client: IDeskproClient,
  settings: Settings,
  query: string,
  projectName: string
): Promise<IAzureWorkItemWiql> => {
  return await defaultRequest(
    client,
    `/_apis/wit/wiql?api-version=7.0`,
    "POST",
    settings,
    {
      query: `SELECT [System.Title] FROM workitems WHERE [System.Title] CONTAINS "${query}" AND [System.TeamProject] = "${projectName}"`,
    }
  );
};

const getTeamsList = (
  client: IDeskproClient,
  settings: Settings
): Promise<IAzureArrayResponse<IAzureTeam[]>> =>
  defaultRequest(
    client,
    `/_apis/teams?api-version=7.0-preview.3`,
    "GET",
    settings
  );

const getProcessList = (
  client: IDeskproClient,
  settings: Settings
): Promise<IAzureArrayResponse<IAzureProcess[]>> =>
  defaultRequest(
    client,
    `/_apis/process/processes?api-version=7.0`,
    "GET",
    settings
  );

const getProcessById = (
  client: IDeskproClient,
  settings: Settings,
  id: string
): Promise<IAzureProcess> =>
  defaultRequest(
    client,
    `/_apis/work/processes/${id}?api-version=7.0`,
    "GET",
    settings
  );

const getUsersList = (
  client: IDeskproClient,
  settings: Settings
): Promise<IAzureArrayResponse<IAzureUser[]>> =>
  defaultRequest(
    client,
    `/_apis/graph/users?api-version=7.0-preview.1`,
    "GET",
    settings
  );

const getIterationList = (
  client: IDeskproClient,
  settings: Settings,
  project: string
): Promise<IAzureArrayResponse<IAzureIteration[]>> =>
  defaultRequest(
    client,
    `/${project}/_apis/work/teamsettings/iterations?api-version=7.0`,
    "GET",
    settings
  );

const getProjectList = (
  client: IDeskproClient,
  settings: Settings
): Promise<IAzureArrayResponse<IAzureProject[]>> =>
  defaultRequest(client, `/_apis/projects?api-version=7.0`, "GET", settings);

const getWorkItemsByProject = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  continuationToken?: number
): Promise<IAzureArrayResponse<IAzureWorkItem[]>> => {
  return defaultRequest(
    client,
    `/${project}/_apis/wit/workitemsbatch?api-version=5.1&top=10${
      continuationToken ? `&continuationToken=${continuationToken}` : ""
    }`,
    "GET",
    settings
  );
};

const getWorkItemsByIds = async (
  client: IDeskproClient,
  settings: Settings,
  project: string,
  ids: number[]
): Promise<IAzureArrayResponse<IAzureWorkItem[]>> => {
  if (ids.length === 0) return { count: 0, value: [] };
  return (
    defaultRequest(
      client,
      `/${project}/_apis/wit/workitemsbatch?api-version=7.0`,
      "POST",
      settings,
      {
        ids,
      }
    ) ?? []
  );
};

const defaultRequest = async (
  client: IDeskproClient,
  endpoint: string,
  method: RequestMethods,
  settings: Settings,
  data?: unknown
) => {
  const fetch = await proxyFetch(client);

  const initialDomainName =
    endpoint.includes("/users") || endpoint.includes("/avatar") ? "vssps." : "";

  const options: V2ProxyRequestInit = {
    method,
    headers: {
      "Content-Type": endpoint.includes("/_apis/wit/workitems/")
        ? "application/json-patch+json"
        : "application/json",
      Authorization: settings.type === "cloud"
        ? `Bearer [[oauth/global/access_token]]`
        : `Basic __account_name_pat_token__`,
      ...(settings.type === "cloud"
        ? {}
        : { "X-Proxy-SSL-No-Verify": "1" }),
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const url =
    settings.type === "cloud"
      ? `https://${initialDomainName}dev.azure.com/${settings.organization_collection}${endpoint}`
      : `${settings.instance_url}/${settings.organization_collection}${endpoint}`;

  let response = await fetch(url, options);

  if ([401, 403, 203].includes(response.status) && settings.type === "cloud") {
    const refreshRequestOptions: V2ProxyRequestInit = {
      method: "POST",
      body: `client_assertion_type=${encodeURIComponent(
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
      )}&client_assertion=__client_secret__&grant_type=refresh_token&assertion=__global_settings.json("[refresh_token]")__&redirect_uri=${encodeURIComponent(
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
      `https://${initialDomainName}dev.azure.com/${settings.organization_collection}${endpoint}`,
      options
    );
  }

  if (response.status < 200 || response.status >= 400) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        message: await response.text(),
      })
    );
  }

  return await response.json();
};

const checkAuth = getProjectList;

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
  postComment,
  getWorkItemsByProject,
  getWorkItemListByTitle,
  getWorkItemsByIds,
  checkAuth,
};
