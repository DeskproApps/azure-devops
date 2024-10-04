import { adminGenericProxyFetch, IDeskproClient, V2ProxyRequestInit } from "@deskpro/app-sdk";

import { RequestMethods, Settings } from "../types/";

export const preInstallGetCurrentUserPremise = (
  client: IDeskproClient,
  settings: Settings
) => preInstallDefaultRequest(client, settings, `/_apis/ConnectionData`, "GET");

export const preInstallGetCurrentUserCloud = (
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
  const globalSettings = JSON.parse(settings.global_settings || "{}");

  const fetch = await adminGenericProxyFetch(client);

  const options: V2ProxyRequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Proxy-SSL-No-Verify": "1",
      Authorization:
        settings.type === "cloud"
          ? `Bearer __global_settings.json("[access_token]")__`
          : `Basic ${settings.account_name_pat_token}`,
    },
  };

  const url =
    settings.type === "cloud"
      ? `https://vssps.dev.azure.com/__organization_collection__/${endpoint}`
      : `${settings.instance_url}/${settings.organization_collection}/${endpoint}`;

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response = await fetch(url, options);

  // If our access token has expired, attempt to get a new one using the refresh token
  if ([400, 401].includes(response.status) && settings.type === "cloud") {
    const params = new URLSearchParams({
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: globalSettings.client_secret as string,
      grant_type: "refresh_token",
      assertion: globalSettings?.refresh_token as string,
      redirect_uri: new URL(
        await client.getStaticOAuth2CallbackUrlValue()
      ).toString(),
    });

    const refreshRequestOptions: V2ProxyRequestInit = {
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
      ...globalSettings,
      accessToken: refreshData.access_token,
    };

    const refreshedTokensEncoded = JSON.stringify(refreshedTokens);

    client?.setAdminSetting(refreshedTokensEncoded);

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${refreshedTokens.access_token}`,
    };

    response = await fetch(
      `https://vssps.dev.azure.com/__organization_collection__/${endpoint}`,
      options
    );
  }

  if (response.status < 200 || response.status >= 400) {
    // eslint-disable-next-line no-console
    console.error(
      `Request failed: [${response.status}] ${await response.text()}`
    );
  }

  return await response.json();
};
