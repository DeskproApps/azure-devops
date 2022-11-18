import { adminGenericProxyFetch, IDeskproClient } from "@deskpro/app-sdk";

import { Settings, RequestMethods, AuthTokens } from "../types/";

const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;

export const preInstallGetCurrentUser = (
  client: IDeskproClient,
  settings: Settings
) =>
  preInstallDefaultRequest(
    client,
    settings,
    "_apis/graph/users?api-version=7.0-preview.1",
    "GET"
  );

const preInstallDefaultRequest = async (
  client: IDeskproClient,
  settings: Settings,
  endpoint: string,
  method: RequestMethods,
  data?: unknown
) => {
  if (![settings.app_id, settings.client_secret].every((e) => e)) {
    throw new Error(
      "Client key, secret, instance URL and global access tokens are not defined"
    );
  }

  const tokens: AuthTokens = JSON.parse(settings.global_access_token as string);

  const fetch = await adminGenericProxyFetch(client);

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
    `https://vssps.dev.azure.com/${settings.organization}/${endpoint}`,
    options
  );

  // If our access token has expired, attempt to get a new one using the refresh token
  if ([400, 401].includes(response.status)) {
    const params = new URLSearchParams({
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: settings.client_secret as string,
      grant_type: "refresh_token",
      assertion: tokens.refresh_token as string,
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
      new URL("https://app.vssps.visualstudio.com/oauth2/token").toString(),
      refreshRequestOptions
    );
    const refreshData = await refreshRes.json();

    const refreshedTokens = {
      ...tokens,
      accessToken: refreshData.access_token,
    };

    const refreshedTokensEncoded = JSON.stringify(refreshedTokens);

    client?.setAdminSetting(refreshedTokensEncoded);

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${refreshedTokens.access_token}`,
    };

    response = await fetch(
      `https://vssps.dev.azure.com/${settings.organization}/${endpoint}`,
      options
    );
  }

  if (isResponseError(response)) {
    console.error(
      `Request failed: [${response.status}] ${await response.text()}`
    );
  }

  return response.json();
};
