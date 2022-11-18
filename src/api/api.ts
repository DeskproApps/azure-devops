import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";

import { Settings, RequestMethods } from "../types/";

const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;

export const test = async (client: IDeskproClient) => {
  const fetch = await proxyFetch(client);

  const params = new URLSearchParams({
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: "__client_secret__",
    grant_type: "refresh_token",
    assertion: '__global_access_token.json("[refresh_token]")__',
    redirect_uri: new URL(
      await client.getStaticOAuth2CallbackUrlValue()
    ).toString(),
  });

  const refreshRequestOptions: RequestInit = {
    method: "POST",
    body: params.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const refreshRes = await fetch(
    "https://bd27-89-114-79-106.eu.ngrok.io",
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
};

export const getWorkItems = (client: IDeskproClient, settings: Settings) =>
  defaultRequest(
    client,
    settings,
    "_apis/graph/users?api-version=7.0-preview.1",
    "GET"
  );

export const getProjectList = (client: IDeskproClient, settings: Settings) =>
  defaultRequest(client, settings, "_apis/projects?api-version=7.0", "GET");

const defaultRequest = async (
  client: IDeskproClient,
  settings: Settings,
  endpoint: string,
  method: RequestMethods,
  data?: unknown
) => {
  const fetch = await proxyFetch(client);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer __global_access_token.json("[access_token]")__`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response = await fetch(
    `https://dev.azure.com/${settings.organization}/${endpoint}`,
    options
  );

  if ([400, 401].includes(response.status)) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer [[oauth/global/access_token]]`,
    };

    response = await fetch(
      `https://dev.azure.com/${settings.organization}/${endpoint}`,
      options
    );

    if ([400, 401].includes(response.status)) {
      const params = new URLSearchParams({
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion: "__client_secret__",
        grant_type: "refresh_token",
        assertion: '__global_access_token.json("[refresh_token]")__',
        redirect_uri: new URL(
          await client.getStaticOAuth2CallbackUrlValue()
        ).toString(),
      });

      const refreshRequestOptions: RequestInit = {
        method: "POST",
        body: params.toString(),
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
        `https://dev.azure.com/${settings.organization}/${endpoint}`,
        options
      );
    }
  }

  if (isResponseError(response)) {
    console.error(
      `Request failed: [${response.status}] ${await response.text()}`
    );
  }

  return response.json();
};
