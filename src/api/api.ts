import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";

import { Settings, RequestMethods } from "../types/";
import { IAzureArrayResponse } from "../types/azure/azure";
import { IProject } from "../types/azure/project";
import { IAzureWorkItemPost } from "../types/azure/workItem";

const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;

export const getWorkItemsByIds = async (
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

export const getWorkItemsByWiql = async (
  client: IDeskproClient,
  settings: Settings,
  project: string
) => {
  const wiqlData = await defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/wit/wiql?api-version=7.0`,
    "POST",
    {
      query: "SELECT [System.Id] FROM workitems",
    }
  );

  return defaultRequest(
    client,
    `/${settings.organization}/${project}/_apis/wit/workitemsbatch?api-version=7.0`,
    "POST",
    {
      ids: wiqlData.workItems.map((wi: { id: number }) => wi.id),
    }
  );
};

export const postWorkItem = (
  client: IDeskproClient,
  settings: Settings,
  data: IAzureWorkItemPost
): Promise<IAzureArrayResponse<IProject>> =>
  defaultRequest(
    client,
    `/${settings.organization}/${data.project}/_apis/wit/workitems/${data.type}?api-version=7.0`,
    "POST",
    data
  );

export const getTeamsList = (
  client: IDeskproClient,
  settings: Settings
): Promise<IAzureArrayResponse<IProject>> =>
  defaultRequest(
    client,
    `/${settings.organization}/_apis/teams?api-version=7.0-preview.3`,
    "GET"
  );

export const getProjectList = (
  client: IDeskproClient,
  settings: Settings
): Promise<IAzureArrayResponse<IProject>> =>
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

  let response = await fetch(`https://dev.azure.com${endpoint}`, options);

  if ([400, 401, 203].includes(response.status)) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer [[oauth/global/access_token]]`,
    };

    response = await fetch(`https://dev.azure.com${endpoint}`, options);

    if ([400, 401, 203].includes(response.status)) {
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

      response = await fetch(`https://dev.azure.com${endpoint}`, options);
    }
  }

  if (isResponseError(response)) {
    throw new Error(
      `Request failed: [${response.status}] ${await response.text()}`
    );
  }

  return response.json();
};
